//jshint esversion:6
const express = require("express");
const app = express();
var router = express.Router();
var User = require("./models/user.js");
var Site = require("./models/settings.js");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() != null) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/login');
}

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
    res.redirect("/login");
  }
}

function setLogo() {
  Site.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, siteLogo) {
    return siteLogo;
});
}
module.exports = {isLoggedIn, isAdmin, setLogo};
