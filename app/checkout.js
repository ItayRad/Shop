//jshint esversion:6
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var Cart = require("./models/cart.js");
var Product = require("./models/product.js");
var Order = require("./models/order.js");
router.get("/", function(req, res) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash("error")[0];
  if (validateqty(cart)) {
    res.render("checkout", {
      total: cart.totalPrice,
      errMsg: errMsg,
      user: req.user
    });
  } else {
    req.flash('badMsg', 'we dont have enough quantity as you chosen, try reducing');
    res.redirect("/shopping-cart");
  }
});

const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
router.post('/', function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")(
    "sk_test_VldL2vkrI1yOcLqKM0HAahWE00DpJHF0Dm"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var time = (today.getHours() < 10 ? "0" : "") + today.getHours() + ":" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes() + ":" + (today.getSeconds() < 10 ? "0" : "") + today.getSeconds();
    today = mm + '/' + dd + '/' + yyyy;
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id,
      date: today + " " + time
    });
    order.save(function(err, result) {
      req.flash('success', 'Successfully bought product!');
      reduceqty(cart); //reduce qty from bought items
      req.session.cart = null;
      res.redirect('/profile');
    });
  });
});

function validateqty(cart) {
  var truetest = 0;
  newcart = cart.generateArray();
  if (newcart != null) {
    newcart.forEach(function(cartproduct) {
      //  console.log(cartproduct.qty); // cart product qty
      //  console.log(cartproduct.item.quantity); // db product qty
      if (cartproduct.qty <= cartproduct.item.quantity && (cartproduct.item.status == 1)) {
        truetest++;
      }
    });
  }
  if (truetest == newcart.length) {
    return true;
  }
  return false;
}

function reduceqty(cart) {
  newcart = cart.generateArray();
  newcart.forEach(function(cartproduct) {
    Product.findById(cartproduct.item._id, function(err, dbproduct) {
      dbproduct.quantity = Number(dbproduct.quantity - cartproduct.qty);
      if (dbproduct.quantity == 0)
      {
        dbproduct.status = 0;
      }
      dbproduct.save();
    });
  });
}

module.exports = router;
