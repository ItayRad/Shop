//jshint esversion:6
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

userSchema = new Schema({
  _id: Number,
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
},
{
  _id:false });


userSchema.plugin(passportLocalMongoose, {
  usernameLowerCase: true
});

userSchema.plugin(AutoIncrement);

module.exports = mongoose.model('User', userSchema);
