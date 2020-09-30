const mongoose = require('mongoose');

//Mongoose me crea el objeto schema que lo guardamos en la constante schema//
const Schema = mongoose.Schema;

// Creamos el esquema de usuarios
const usuariosSchema = new Schema(
  {
    nombreCompleto: { type: String, required: true },
    foto: { type: String, required: false },
    email: { type: String, required: true},
    password: {type: String, required: true},
    contact: {type: String, required: false},
    alimentos: [{type: Schema.Types.ObjectId, ref:"Alergias"}],
    contactoEmergencia: {
        nombreCompleto: {type: String, required:false},
        email: {type: String, required:false},
        movil: {type: String, required:false},
    }

  },
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Usuarios
const Usuarios = mongoose.model('Usuarios', usuariosSchema);
module.exports = Usuarios;
