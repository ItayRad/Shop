//jshint esversion:6
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  admin: Number
});


userSchema.plugin(passportLocalMongoose, {
  usernameLowerCase: true
});



module.exports = mongoose.model('User', userSchema);
