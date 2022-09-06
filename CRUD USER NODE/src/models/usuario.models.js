'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioShema = Schema({
    nombres: String,
    apellidos: String,
    usuario: String,
    email: String,
    telefono: String,
    password: String,
    rol: String,

})

module.exports = mongoose.model("usuario", UsuarioShema);