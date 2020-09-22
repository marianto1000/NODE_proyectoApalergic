const mongoose = require('mongoose');

//Mongoose me crea el objeto schema que lo guardamos en la constante schema//
const Schema = mongoose.Schema;

const diarioSchema = new Schema(
  {
    comentarios: {type: String, required: true},
    productos: {type: Array, required: true},
   
  },
  {
    timestamps: true,
  }
);

const Diario = mongoose.model('Diario', diarioSchema);
module.exports = Diario;