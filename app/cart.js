//jshint esversion:6
var express = require('express');
var router = express.Router();

const Product = require("./models/product.js");
const Cart = require("./models/cart");

router.get("/shopping-cart", function(req, res) {
var goodMsg = "";
    goodMsg = req.flash("goodMsg")[0];
    var badMsg = req.flash("badMsg")[0];
  if (!req.session.cart) {
  return res.render("shopping-cart", {products:null,goodMsg:goodMsg, badMsg:badMsg});
}
var cart = new Cart(req.session.cart);
res.render("shopping-cart", {products:cart.generateArray(), totalPrice: cart.totalPrice, goodMsg:goodMsg, badMsg:badMsg});
});

router.get("/remove-from-cart/:id", function(req, res) {
var productId = req.params.id;
var cart = new Cart(req.session.cart ? req.session.cart: {});

cart.removeItem(productId);
req.session.cart = cart;
res.redirect("/shopping-cart");

});


router.get("/add-to-cart/:id", function(req, res) {
var productId = req.params.id;
var cart = new Cart(req.session.cart ? req.session.cart : {});
Product.findById(productId, function (err, dbproduct){
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
Product.findById(productId, function (err, product){
  if (err){
  console.log(err);
}
cartqty = cart.removeOne(product, product.id);
if (cartqty >= 1 ){
req.flash('goodMsg', 'Successfully removed 1 from cart');
}
else{
  req.flash('goodMsg', 'Successfully removed from cart');
  cart.removeItem(productId);
}
req.session.cart = cart;
res.redirect("back");
});
});



router.get("/removeAll", function(req, res) {
var productId = req.params.id;
var cart = new Cart(req.session.cart ? req.session.cart: {});

cart.removeAll();
req.session.cart = cart;
res.redirect("/shopping-cart");

});




module.exports = router;
