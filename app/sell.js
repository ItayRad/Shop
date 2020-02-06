//jshint esversion:6
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var db = require("./connection.js");
db.con(mongoose);
var Product = require("./models/product.js");

router.post('/', function(req, res) {
  var imgPath = req.body.imgPath;
  var itemTitle = req.body.title;
  var itemDescription = req.body.description;
  var itemPrice = req.body.price;
var newProduct = new Product ( {
  imagePath: imgPath,
  title: itemTitle,
  description: itemDescription,
  price: itemPrice,
});

newProduct.save();
res.redirect("/");
});

module.exports = router;
