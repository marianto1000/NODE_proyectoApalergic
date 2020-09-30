const mongoose = require('mongoose');

//Mongoose me crea el objeto schema que lo guardamos en la constante schema//
const Schema = mongoose.Schema;

const diarioSchema = new Schema(
  {
      nombreProducto: { type: String, required: true },
      notas: { type: String, required: false },
      fecha: { type: Date, default: Date.now() },
      imagen: { type: String, required: false }
  },
  {
    timestamps: true
  }
);

const Diario = mongoose.model('Diario', diarioSchema);
module.exports = Diario;
