// Modelo Usuario para la base de datos

// Mongoose es una libreria de Node que nos permite
// conectarnos a una base de datos MongoDB y modelar un esquema
// para ella.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Campos que vamos a guardar en la base de datos
var DriverSchema = new Schema({
    uuid : { type: String, required: true, unique: true },
    colorId : { type : Number },
    displayName : { type : String },
    customMsg : { type : String },
    location: { type : Object },
	createdAt : {type: Date, default: Date.now} // Fecha de creación
});

// Exportamos el modelo 'Driver' para usarlo en otras
// partes de la aplicación
module.exports = mongoose.model('Driver', DriverSchema)
//var Driver = mongoose.model('Driver', DriverSchema);
