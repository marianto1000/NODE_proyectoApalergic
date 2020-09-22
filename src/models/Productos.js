const mongoose = require('mongoose');

//Mongoose me crea el objeto schema que lo guardamos en la constante schema//
const Schema = mongoose.Schema;

const productosSchema = new Schema(
  {
    nombre: {type: String, required: true},
    marca: {type: String, required: true},
    ingredientes: {type: Array, required: true},
    foto: {type: String, required: true},
    descripcion: {type: String, required: true},
    //qr: {type: String, required: true},
  },
  {
    timestamps: true,
  }
);

const Productos = mongoose.model('Productos', productosSchema);
module.exports = Productos;