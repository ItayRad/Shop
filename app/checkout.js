//jshint esversion:6
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var Cart = require("./models/cart.js");

  router.get("/", function(req, res) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash("error")[0];
  res.render("checkout", {total:cart.totalPrice, errMsg:errMsg, user:req.user });
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
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
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
            req.session.cart = null;
            res.redirect('/products');
        });
    });
});
module.exports = router;
