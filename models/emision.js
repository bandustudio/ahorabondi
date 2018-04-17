var mongoose = require('mongoose')
var EmisionSchema = new mongoose.Schema({
    uuid : { type: String, required: true, unique: true },
    colorId : { type : Number },
    displayName : { type : String },
    customMsg : { type : String }
});

module.exports = mongoose.model('Emision', EmisionSchema)
//var Emision = mongoose.model('Emision', EmisionSchema)