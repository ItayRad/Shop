//jshint esversion:6
var express = require('express');
var router = express.Router();

const Product = require("./models/product.js");
const Cart = require("./models/cart");
const Coupon = require("./models/coupon");

router.get("/shopping-cart", function(req, res) {
  var goodMsg = "";
  goodMsg = req.flash("goodMsg")[0];
  var badMsg = req.flash("badMsg")[0];
  if (!req.session.cart) {
    return res.render("shopping-cart", {
      products: null,
      goodMsg: goodMsg,
      badMsg: badMsg
    });
  }
  var cart = new Cart(req.session.cart);
  console.log(cart);

  res.render("shopping-cart", {
    products: cart.generateArray(),
    coupons: cart.generateCouponArray(),
    subTotalPrice: cart.subTotalPrice,
    totalPrice: cart.totalPrice,
    goodMsg: goodMsg,
    badMsg: badMsg
  });
});

router.get("/remove-from-cart/:id", function(req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");

});


router.get("/add-to-cart/:id", function(req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, dbproduct) {

    cart.add(dbproduct, dbproduct.id);
    req.flash('goodMsg', 'Successfully added to cart');
    req.session.cart = cart;

    res.redirect('../shopping-cart');
  });
});




router.get("/removeOne-from-cart/:id", function(req, res) {
  var cartMsg = req.flash("goodMsg")[0];
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product) {
    if (err) {
      console.log(err);
    }
    cartqty = cart.removeOne(product, product.id);
    if (cartqty >= 1) {
      req.flash('goodMsg', 'Successfully removed 1 from cart');
    } else {
      req.flash('goodMsg', 'Successfully removed from cart');
      cart.removeItem(productId);
    }
    req.session.cart = cart;
    res.redirect("back");
  });
});



router.get("/removeAll", function(req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeAll();
  req.session.cart = cart;
  res.redirect("/shopping-cart");

});

router.post("/shopping-cart/coupon", function(req, res) {

  var couponName = req.body.coupon;
  var couponExists = false;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Coupon.findOne({
    name: couponName
  }, function(err, found) {
    if (!found) { // if coupon does not exists
      req.flash('badMsg', 'Coupon Does not Exists');
      res.redirect('../shopping-cart');
    } else {

      if (found.status) // if coupon is ENABLED
      {
        if (getCurrentDate() < found.validatetill) // validate coupon with date
        {
          //this.totalPrice = this.subTotalPrice * (storedItem.coupon.discount / 100);
          cart.couponAdd(found, found.id);

          req.session.cart = cart;
          req.flash('goodMsg', 'Coupon Succesfully Added');
          res.redirect('../shopping-cart');
        } else { //error DATE validaty
          req.flash('badMsg', 'Coupon Expired!');
          res.redirect('../shopping-cart');
        }
      } if (!found.status) {
        req.flash('badMsg', 'Coupon is not Active');
        res.redirect('../shopping-cart');

      } else { // error DISABLED coupon


      }

    }
  });

});

router.get("/shopping-cart/remove-coupon-from-cart/", function(req, res) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.couponRemove();
  req.session.cart = cart;
  res.redirect('/shopping-cart');

});

function getCurrentDate() {

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '/' + mm + '/' + dd;
  return today;
}
module.exports = router;
