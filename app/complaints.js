//jshint esversion:6


const express = require('express');
const router = express.Router();
const Message = require("./models/message");
const User = require("./models/user");
const nodemailer = require('nodemailer');





router.get("/", function(req, res) {
  var succesMsg = "";
  res.render("complaints", {
    succesMsg: succesMsg
  });
});


router.post("/", function(req, res) {
      var succesMsg = "";
      var title = req.body.title;
      var complaint = req.body.complaint;

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var time = (today.getHours() < 10 ? "0" : "") + today.getHours() + ":" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes() + ":" + (today.getSeconds() < 10 ? "0" : "") + today.getSeconds();
      today = mm + '/' + dd + '/' + yyyy;
if (req.user)
{User.findOne({username:req.user.username}, function(err,foundUser){
      var newMsg = new Message({
        user: req.user.username,
        email: foundUser.email,
        title: title,
        message: complaint,
        date: today + " " + time,
        status: 0,

      });

   newMsg.save();
      succesMsg = "Succesfully Sent Message, Thank you";
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing


  nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,

      auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
      }
});
let from = '"Shop Site noreply" <noreply@ShopSite.com>';
let subject = "ShopSite - Message Received From " + foundUser.username + "";
let message = "Complaint received from user: " + req.user.username + "\nEmail: " +foundUser.email + "\nContent: " + complaint + "\n *This is an automated message, please do not reply to this email";
        let mailOptions = transporter.sendMail({
   from: from, // sender address
             to: "nienarada@gmail.com", // list of receivers
          subject: subject, // Subject line
          text: message, // plain text body

        });

        // send mail with defined transport object
        console.log(mailOptions);
     transporter.sendMail(mailOptions, function(err) {
        console.log('email sent');
        if (err){
        console.log(err);
        }
      });

        res.render("complaints", {
          succesMsg: succesMsg
        });

});
});
}
});


      module.exports = router;
