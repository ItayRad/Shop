//jshint esversion:8
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var db = require("./connection.js");
var User = require("./models/user.js");


router.post("/", function(req, res, next) {
  const deluser = req.body.deluser;
  User.deleteOne({
    _id: deluser
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/allusers");
    }

  });
});

module.exports = router;
