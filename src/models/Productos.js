const mongoose = require('mongoose');

//Mongoose me crea el objeto schema que lo guardamos en la constante schema//
const Schema = mongoose.Schema;

const productosSchema = new Schema(
  {
    nombre: {type: String, required: true},
    marca: {type: String, required: true},
    ingredientes: {type: String, required: true},
    foto: {type: String, required: true},
    descripcion: {type: String, required: true},
    compatibilidad: [{type: Schema.Types.ObjectId, ref:"Alergias"}]
  },
  {
    timestamps: true,
  }
);

const Productos = mongoose.model('Productos', productosSchema);
module.exports = Productos;