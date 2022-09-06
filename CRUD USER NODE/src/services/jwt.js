"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "FLOTILLAS";

exports.createToken = function(usuario){
    var payload = {
        sub: usuario._id,
        nombre: usuario.nombres,
        apellidos: usuario.apellidos,
        username: usuario.usuario,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().day(10, "days").unix()
    }

    return jwt.encode(payload, secret);    
}