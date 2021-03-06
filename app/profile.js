//jshint esversion:6
var express = require('express');
var router = express.Router();


const Order = require("./models/order.js");
const Cart = require("./models/cart.js");
router.get("/", function(req,res) {
Order.find({user:req.user}, function(err,orders){
  if (err) {
    return res.write("Error finding orders");
  }
  var cart;

  orders.forEach(function(order){
    cart = new Cart(order.cart);
    order.items = cart.generateArray();    // change cart information into array
    order.coupons = cart.generateCouponArray(); // change coupon cart information into array
  });

  res.render("profile", {title:"My Profile", user:req.user, orders:orders, req:req});
  });
});

module.exports = router;
