//jshint esversion:6
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

function datenow() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  today = mm + '/' + dd + '/' + yyyy;
return today;
}

var schema = new Schema({
  imagePath: {type: String, required:true},
  title: {type:String, required:true},
  category: {type:String,},
  quantity: {type:Number},
  description: {type:String, required:true},
  price: {type:Number, required:true},
  status: {type:Number, required:true, default:1},
  createdAt: {type: String, },
  lastUpdated: {type: String,},
});

schema.pre('save', function(next){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  today = dd + '/' + mm + '/' + yyyy + " " + time;

    if(!this.createdAt) {
        this.createdAt = today;
    }
    next();
});
//schema.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = mongoose.model('Product', schema);
