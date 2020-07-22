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

router.get('/search', function(req, res) {
  Product.find({
      title: {
        $regex: '.*' + req.query.key + '.*'
      }
    },
    function(err, rows, fields) {
      if (err) throw err;
      var data = [];
      for (i = 0; i < rows.length; i++) {
        data.push(rows[i].title);
      }
      res.end(JSON.stringify(data));
    }).limit(5);
});

module.exports = router;
