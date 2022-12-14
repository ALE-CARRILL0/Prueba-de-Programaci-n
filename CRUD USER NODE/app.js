'use strict'


const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

var usuario_ruta = require("./src/ruote/usuario.ruta");
//var equipo_ruta = require("./src/rutas/equipo.ruta")


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cors());

app.use('/api', usuario_ruta);


module.exports = app