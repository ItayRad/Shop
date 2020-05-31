//jshint esversion:6
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


var schema = new Schema({

    user: {type: Schema.Types.Mixed, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true},
    date: {type: String}
  }
);
//schema.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = mongoose.model('Order', schema);
