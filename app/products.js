//jshint esversion:6
var express = require('express');
var router = express.Router();

var Product = require("./models/product.js");
const User = require("./models/user.js");

router.get("/", function(req, res) {
var goodMsg = req.flash("goodMsg")[0];
var successcart = req.flash("successcart")[0];
var permission = 0;
if (req.user != null) //////////// checks if user is LOGGED IN
{
User.findOne({username:req.user.username}, function(err,foundUser){

  permission = foundUser.admin;
  Product.find({}, function(err,found) {
    if (req.user != null)
    {
        res.render("products", { products: found,successCart:successcart, goodMsg:goodMsg, user:permission ? permission:0});
      }

    });
});
}
else { /////// checks if user is not logged in

  Product.find({}, function(err,found) {
        res.render("products", { products: found,successCart:successcart, goodMsg:goodMsg, user:0});
    });
  }


});

module.exports = router;
