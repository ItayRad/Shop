//jshint esversion:6
require('dotenv').config();
var flash = require('connect-flash');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose').set('debug', true);
const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('express-validator');
const MongoStore = require("connect-mongo")(session);
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

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
const Site = require("./app/models/settings");
const Message = require("./app/models/message");

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



var functions = require('./app/functions.js');

app.locals.siteLogo = "/images/siteLogo.jpg";



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

var sellRouter = require('./app/sell.js');
app.use('/sell', sellRouter);

var checkoutRouter = require('./app/checkout.js');
app.use('/checkout', checkoutRouter);

var productRouter = require('./app/products.js');
app.use('/products', productRouter);

var addtocartRouter = require('./app/cart.js');
app.use('/', addtocartRouter);

var profileRouter = require('./app/profile.js');
app.use('/profile', profileRouter);

var purchasesRouter = require('./app/purchases.js');
app.use('/purchases', purchasesRouter);


app.get("/admin", functions.isAdmin,  function(req,res) {
  res.render("./partials/admin", {isAdmin:isAdmin});
});

app.get("/admin/site-settings", functions.isAdmin,  function(req,res) {
  var errorMsg = "";

  res.render("./site-settings", {
    errorMsg: errorMsg
  });
});

var path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});


var upload = multer({ storage: storage });



app.post("/admin/site-settings", upload.single('avatar'), functions.isAdmin,  function(req,res) {

  var newLogo = req.body.sitelogo;
  var errorMsg = "";


  if (req.file) {
      console.log('Uploading file...');
       errorMsg += req.file.originalname;
       errorMsg += ' File Uploaded Successfully';
  } else {
      console.log('No File Uploaded');
       errorMsg += 'FILE NOT UPLOADED';
      errorMsg += 'File Upload Failed';

  }
  var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
today = mm + '/' + dd + '/' + yyyy;

var logo1 = new Site ({logo:newLogo, date:today + " " + time});


    Site.collection.drop();
if (newLogo.length > 0) {
   logo1.save();
   app.locals.siteLogo = logo1.logo;
 }
 else{
        var fullPath = "/uploads/"+req.file.filename;
     var logo2 = new Site ({logo:fullPath, date:today + " " + time});

   app.locals.siteLogo = logo2.logo;
  logo2.save();
}
    res.render("./site-settings", {errorMsg: errorMsg});

});

app.get("/admin/messages",  function(req,res) {
  var succesMsg = "";
  Message.find({}, function(err,foundMsgs){
    res.render("messages", {foundMsgs: foundMsgs,succesMsg:succesMsg});
  });

});

app.get("/complaints",  function(req,res) {
      var succesMsg = "";
    res.render("complaints", {succesMsg:succesMsg});
  });
  app.post("/complaints",  function(req,res) {
    var succesMsg = "";
    var title = req.body.title;
    var complaint = req.body.complaint;

    var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  today = mm + '/' + dd + '/' + yyyy;

    var newMsg = new Message( {
      user: req.user.username,
      email: req.user.email,
      title: title,
      message: complaint,
      date:today + " " + time
    });
newMsg.save();
succesMsg = "Succesfully Sent Message, Thank you";
res.render("complaints", {succesMsg:succesMsg});

    });

    app.get("/msg-del/:id",  function(req,res) {
          var succesMsg = "Succesfully Deleted ";
          Message.findOneAndDelete({_id:req.params.id}, function(err){
            Message.find({}, function(err,foundMsgs){
              res.render("messages", {foundMsgs: foundMsgs,succesMsg:succesMsg});
            });
          });

      });

// app.get("*",  function(req,res) {
//   res.redirect("/");
// });


function isAdmin(req, res, next) {
  if (req.user) {
    User.findOne({
      username: req.user.username
    }, function(err, foundUser) {
      if (foundUser.admin == 1) {
        return next();
      } else {
        res.redirect("/login");
      }
    });
  } else {
    res.redirect("/");
  }
}


// var server = app.listen(process.env.PORT || 3000, function () {
var server = app.listen(process.env.PORT, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});
