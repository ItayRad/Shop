//jshint esversion:6
var express = require('express');
var router = express.Router();

var Product = require("./models/product.js");
const User = require("./models/user.js");

router.get("/", function(req, res) {
var successMsg = req.flash("success")[0];
var successcart = req.flash("successcart")[0];
var permission = 0;
var foundUser = "";
if (req.user != null) //////////// checks if user is LOGGED IN
{
User.findOne({username:req.user.username}, function(err,foundUser){

  permission = foundUser.admin;
  Product.find({}, function(err,found) {
    if (req.user != null)
    {
        res.render("products", { products: found,successCart:successcart, successMsg:successMsg, user:permission ? permission:0});
      }

    });
});
}
if (req.user == null) /////// checks if user is not logged in
{
  Product.find({}, function(err,found) {
        res.render("products", { products: found,successCart:successcart, successMsg:successMsg, user:0});
    });}


});

module.exports = router;
