'use strict'

var express = require("express");
var usuarioControlador = require("../controller/usuario.controller");
var md_autorizacion = require("../middlewares/authenticated");


var api = express.Router();

api.post("/Login", usuarioControlador.Login);
api.post('/NuevoAdmin',md_autorizacion.ensureAuth,usuarioControlador.NuevoAdmin);
api.post('/Registrar', usuarioControlador.Registrar);
api.put('/EditarUser/:id', md_autorizacion.ensureAuth, usuarioControlador.EditarUser);
api.delete('/EliminarUser/:id', md_autorizacion.ensureAuth, usuarioControlador.EliminarUser);
api.get('/AllUser', md_autorizacion.ensureAuth,usuarioControlador.ObtenerUser);
api.get('/UserID/:id', md_autorizacion.ensureAuth,usuarioControlador.obtenerUsuarioID);

module.exports = api;