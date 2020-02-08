//jshint esversion:6
var express = require('express');
var router = express.Router();

const Order = require("./models/order.js");
const Cart = require("./models/cart");
const User = require("./models/user.js");

router.get("/", function(req,res) {
  Order.find({}, function(err,orders){
    if (err) {
      return res.write("error finding orders");
    }
    var cart;
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });

      res.render("purchases", {user:req.user, orders:orders, User:User});
    });
});
router.get("/:user", function(req,res) {

Order.find({name:req.params.user}, function(err,orders){
  if (err) {
    return res.write("error finding orders");
  }
  var cart;
  orders.forEach(function(order){
    cart = new Cart(order.cart);
    order.items = cart.generateArray();
  });

  res.render("purchases", {title:"Purchases of",user:req.user, orders:orders, req:req});
  });
});

module.exports = router;
