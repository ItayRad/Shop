//jshint esversion:6
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');


router.get('/', function(req, res) {
  req.logout();
  isLogged = false;
  res.redirect('/');
});

module.exports = router;
