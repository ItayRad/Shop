//jshint esversion:6
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

schema = new Schema({
couponid:Number,
name:String,
discount:Number,
validatetill:String,
status: {type:Boolean, default:true},
createdAt: {type: String },
});



schema.plugin(AutoIncrement, {inc_field: 'couponid'});

module.exports = mongoose.model('Coupon', schema);
