//jshint esversion:6
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

msgSchema = new Schema({
    user: {type: Schema.Types.Mixed, ref: 'User'},
    email: {type: Schema.Types.Mixed, ref: 'User'},
    title: {type: String, required:true},
  message: {type: String, required:true},
  date: {type:String},
});



module.exports = mongoose.model('Message', msgSchema);
