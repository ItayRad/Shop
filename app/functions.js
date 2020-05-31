//jshint esversion:6
const express = require("express");
const app = express();
var router = express.Router();
var User = require("./models/user.js");
var Site = require("./models/settings.js");

function isLogged(req, res, next) {
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


function currentTime()
{
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' + yyyy;
  return today;
}
module.exports = {isLogged, isAdmin, setLogo, currentTime};
