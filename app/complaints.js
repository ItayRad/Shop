//jshint esversion:6


var express = require('express');
var router = express.Router();
const Message = require("./models/message");
var counter = 0;
router.get("/",  function(req,res) {
      var succesMsg = "";
    res.render("complaints", {succesMsg:succesMsg});
  });
  router.post("/",  function(req,res) {
    var succesMsg = "";
    var title = req.body.title;
    var complaint = req.body.complaint;

    var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  today = mm + '/' + dd + '/' + yyyy;

    var newMsg = new Message( {
      user: req.user.username,
      email: req.user.email,
      title: title,
      message: complaint,
      date:today + " " + time,
      status:0,

    });

newMsg.save();
succesMsg = "Succesfully Sent Message, Thank you";
res.render("complaints", {succesMsg:succesMsg});

    });

module.exports = router;
