//jshint esversion:6
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


var schema = new Schema({
    ipid:{type: Number,},
    value: {type: String,},

  });
schema.plugin(AutoIncrement, {inc_field: 'ipid'});
module.exports = mongoose.model('Ip', schema);
