//jshint esversion:6
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = require("./user.js");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

msgSchema = new Schema({
    user: {type: Schema.Types.Mixed, ref: 'User'},
    email: {type: Schema.Types.Mixed, ref: 'User'},
    title: {type: String, required:true},
  message: {type: String, required:true},
  date: {type:String},
  status: {type:Number}, // 1 is taken care of, 0 is not taken
  answer: {type: String},
  counter: {type:Number},
  closedBy: {type:String},

});



module.exports = mongoose.model('Message', msgSchema);
