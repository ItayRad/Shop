//jshint esversion:6
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var db = require("./connection.js");
var User = require("./models/user.js");
const bodyParser = require("body-parser");


router.get('/', (req, res) => {
  res.redirect("/products");
});


module.exports = router;
