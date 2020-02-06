//jshint esversion:6


var express = require('express');
var router = express.Router();


router.post('/:user', function(req, res){
  const moduser = req.body.modifyuser;
console.log(moduser);
  User.find({_id:moduser}, function(err,user){
    if (err){console.log(err);}
    else{
console.log(user);
        res.render("modifyusers", {allusers:user,
      });
      }
  });

});

module.exports = router;
