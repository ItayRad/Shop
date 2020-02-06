//jshint esversion:6
require('dotenv').config();
var flash = require('connect-flash');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose').set('debug', false);
const app = express();
//const encrypt = require("mongoose-encryption");
//const md5 = require("m5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('express-validator');
const MongoStore = require("connect-mongo")(session);


let router = express.Router({
  mergeParams: true
});


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
var db = require("./app/connection.js");
app.use(express.static("public"));
app.use(session({
  secret: 'Our little secret.',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection }),
  cookie: { maxAge:180*60*1000}

}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


db.con(mongoose);


const User = require("./app/models/user.js");
const Product = require("./app/models/product.js");
const Order = require("./app/models/order.js");
const Cart = require("./app/models/cart");

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();

  res.locals.session = req.session;
  next();
});

app.locals.isAdmin = isAdmin;

var homeRouter = require('./app/home.js');
app.use('/', homeRouter);

var regRouter = require('./app/register.js');
app.use('/register', regRouter);


var loginRouter = require('./app/login.js');
app.use('/login', loginRouter);

var logoutRouter = require('./app/logout.js');
app.use('/logout', logoutRouter);

var allusersRouter = require('./app/allusers.js');
app.use('/allusers', allusersRouter);

var postRouter = require('./app/update.js');
app.use('/update', postRouter);

var deluserRouter = require('./app/deluser.js');
app.use('/deluser', deluserRouter);

app.get("/sell", function(req, res) {
  res.render("sell");
});
var sellRouter = require('./app/sell.js');
app.use('/sell', sellRouter);



app.get("/products", function(req, res) {
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




app.get("/add-to-cart/:id", function(req, res) {
var productId = req.params.id;
var cart = new Cart(req.session.cart ? req.session.cart : {});
Product.findById(productId, function (err, product){
  if (err){
  console.log(err);
}

cart.add(product, product.id);
req.flash('successcart', 'Successfully added to cart');
req.session.cart = cart;

res.redirect("back");
});
});


app.get("/removeOne-from-cart/:id", function(req, res) {
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



app.get("/shopping-cart", function(req, res) {
    var successcart = "";
    successcart = req.flash("successcart")[0];
    var cartremoveMsg = req.flash("cartremoveMsg")[0];
  if (!req.session.cart) {
  return res.render("shopping-cart", {products:null,successcart:successcart, cartremoveMsg:cartremoveMsg});
}
var cart = new Cart(req.session.cart);
res.render("shopping-cart", {products:cart.generateArray(), totalPrice: cart.totalPrice, successcart:successcart, cartremoveMsg:cartremoveMsg});
});

app.get("/remove-from-cart/:id", function(req, res) {
var productId = req.params.id;
var cart = new Cart(req.session.cart ? req.session.cart: {});

cart.removeItem(productId);
req.session.cart = cart;
res.redirect("/shopping-cart");

});

app.get("/removeProduct/:id", isAdmin, function(req, res) {
var productId = req.params.id;
var product = new Product(req.session.cart ? req.session.cart: {});

Product.findOneAndRemove({_id:productId},function(err,product)
{
res.redirect("/products");
});



});

app.get("/removeAll", function(req, res) {
var productId = req.params.id;
var cart = new Cart(req.session.cart ? req.session.cart: {});

cart.removeAll();
req.session.cart = cart;
res.redirect("/shopping-cart");

});


app.get("/checkout", isLoggedIn, function(req, res) {
if (!req.session.cart) {
  return res.redirect("/shopping-cart");
}
var cart = new Cart(req.session.cart);
var errMsg = req.flash("error")[0];
res.render("checkout", {total:cart.totalPrice, errMsg:errMsg, user:req.user });

});

const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
app.post('/checkout', isLoggedIn, function(req, res, next) {
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

app.get("/profile", isLoggedIn, function(req,res) {
Order.find({user:req.user}, function(err,orders){
  if (err) {
    return res.write("error finding orders");
  }
  var cart;
  orders.forEach(function(order){
    cart = new Cart(order.cart);
    order.items = cart.generateArray();
  });

  res.render("profile", {title:"My Profile", user:req.user, orders:orders, req:req});
  });
});

app.get("/admin", isAdmin, function(req,res) {
  Order.find({}, function(err,orders){
    if (err) {
      return res.write("error finding orders");
    }
    var cart;
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });

      res.render("admin", {user:req.user, orders:orders, User:User});
    });
});
app.get("/purchases/:user", isAdmin, function(req,res) {
  console.log(req.params.user);
Order.find({name:req.params.user}, function(err,orders){
  if (err) {
    return res.write("error finding orders");
  }
  var cart;
  orders.forEach(function(order){
    cart = new Cart(order.cart);
    order.items = cart.generateArray();
  });

  res.render("profile", {title:"Purchases of",user:req.user, orders:orders, req:req});
  });
});
app.get("*",  function(req,res) {
  res.redirect("/");
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/login');
}
function isAdmin(req, res, next) {
  if (req.isAuthenticated())
  {
  User.findOne({username:req.user.username}, function(err,foundUser){
    if (foundUser.admin == 1) {
        return next();
    }
    else{
      res.redirect("/login");
    }
  });
}
else{
  res.redirect("/");
}
}




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
