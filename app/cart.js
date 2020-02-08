//jshint esversion:6
var express = require('express');
var router = express.Router();

var Product = require("./models/product.js");
const Cart = require("./models/cart");

router.get("/shopping-cart", function(req, res) {
    var successcart = "";
    successcart = req.flash("successcart")[0];
    var cartremoveMsg = req.flash("cartremoveMsg")[0];
  if (!req.session.cart) {
  return res.render("shopping-cart", {products:null,successcart:successcart, cartremoveMsg:cartremoveMsg});
}
var cart = new Cart(req.session.cart);
res.render("shopping-cart", {products:cart.generateArray(), totalPrice: cart.totalPrice, successcart:successcart, cartremoveMsg:cartremoveMsg});
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
Product.findById(productId, function (err, product){
  if (err){
  console.log(err);
}
cart.add(product, product.id);
req.flash('successcart', 'Successfully added to cart');
req.session.cart = cart;

res.redirect(req.get('referer'));
});
});

router.get("/removeOne-from-cart/:id", function(req, res) {
  var cartMsg = req.flash("successcart")[0];
var productId = req.params.id;
var cart = new Cart(req.session.cart ? req.session.cart : {});
Product.findById(productId, function (err, product){
  if (err){
  console.log(err);
}
cartqty = cart.removeOne(product, product.id);
if (cartqty >= 1 ){
req.flash('cartremoveMsg', 'Successfully removed 1 from cart');
}
else{
  req.flash('cartremoveMsg', 'Successfully removed from cart');
  cart.removeItem(productId);
}
req.session.cart = cart;
res.redirect("back");
});
});

router.get("/removeProduct/:id", function(req, res) {
var productId = req.params.id;
var product = new Product(req.session.cart ? req.session.cart: {});

Product.findOneAndRemove({_id:productId},function(err,product)
{
res.redirect("/products");
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
