const mongoose = require('mongoose');

//Mongoose me crea el objeto schema que lo guardamos en la constante schema//
const Schema = mongoose.Schema;

const alergiasSchema = new Schema(
  {
    nombre: {type: String, required: true},
  },
  {
    timestamps: true,
  }
);

const Alergias = mongoose.model('Alergias', alergiasSchema);
module.exports = Alergias;