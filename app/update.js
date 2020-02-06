//jshint esversion:6
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var db = require("./connection.js");
var User = require("./models/user.js");

router.post('/', function(req, res) {
  const oldName = req.body.oldName;
  const name = req.body.newName;
  //const newName = name.charAt(0).toUpperCase() + name.slice(1); // in register it saves only NOT capitalized
  const newName = name.toLowerCase();
  const newPassword = req.body.newPassword;
  const newPermission = req.body.newPermission;
if (req.body.newPassword == "")
{
  User.findOneAndUpdate({
    username: oldName
  }, {
    username: newName,
      //  password: newPassword, need to find way to modify password and encrypt it
    admin:newPermission
  }, function(err) {
    if (err) {
      res.render("failed.ejs", {
        error: "Username is Taken, Please choose Another Name"
      });
    } else {
      res.redirect("/");
    }
  });
}
else{
  User.findOneAndUpdate({
    username: oldName
  }, {
    username: newName,
    //  password: newPassword, need to find way to modify password and encrypt it
    admin:newPermission
  }, function(err) {
    if (err) {
      res.render("failed.ejs", {
        error: "Username is Taken, Please choose Another Name"
      });
    } else {
      res.redirect("/");
    }
  });
}
});

module.exports = router;
