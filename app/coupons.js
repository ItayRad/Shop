//jshint esversion:6
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var db = require("./connection.js");
var Coupon = require("./models/coupon.js");
const bodyParser = require("body-parser");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
var helper = require("functions.js");





module.exports = router;
