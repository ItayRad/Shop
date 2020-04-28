//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
let router = express.Router({ mergeParams: true });
var autoIncrement = require('mongoose-auto-increment');

function con(mongoose) {
mongoose.connect("mongodb+srv://admin-itay:Test123@cluster0-k71pt.mongodb.net/shopDB", {
//mongoose.connect("mongodb://localhost:27017/shopDB", {
    useNewUrlParser: true,
  }, function(err) {
    if (!err)
     console.log("Succesfully connected to shopDB");
  });

  mongoose.set("useCreateIndex", true);


}




function query(SCHEMA,filter) {



}

module.exports = {con, query};
