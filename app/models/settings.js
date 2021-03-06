//jshint esversion:6
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
today = mm + '/' + dd + '/' + yyyy;

siteSchema = new Schema({
  logo: { type: String},
  date: { type:String},
  counter: {type:Number, default:0}
});

//siteSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('Site', siteSchema);
