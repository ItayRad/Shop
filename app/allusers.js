//jshint esversion:6
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var db = require("./connection.js");
var User = require("./models/user.js");

router.get('/', function(req, res) {
  User.find({}, function(err, FoundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (FoundUsers) {
        res.render("allusers", {
          allusers: FoundUsers,
        });
      }
    }
  });

});

router.post('/:user', function(req, res) {
  const moduser = req.body.modifyuser;
  console.log(moduser);
  User.find({
    _id: moduser
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
    
      res.render("modifyusers", {
        allusers: user,
      });
    }
  });

});

module.exports = router;
