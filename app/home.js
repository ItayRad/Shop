//jshint esversion:6
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var db = require("./connection.js");

const bodyParser = require("body-parser");
var Ip = require("./models/ip.js");

router.get('/', (req, res) => {
  var newIP = new Ip({
    value:req.ip,
  });
  newIP.save();

  res.redirect("/products");
});


module.exports = router;
