'use strict'

var User = require('../models/usuario.models');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


function ADMIN(req, res) {
    //se crea el administrador predeterminado de la aplicación
    User.findOne({ usuario: "ADMIN" }, (err, buscandoAdmin) => {
        if (err) {
            console.log("Error al verificar ADMIN");
        } else if (buscandoAdmin) {
            console.log("El usuario ADMIN ya existe");
        } else {
            let User1 = new User();
            bcrypt.hash("Flotillas", null, null, (err, passwordEncripado) => {
                if (err) {
                    console.log("Error al encriptar la contraseña");
                } else if (passwordEncripado) {
                    User1.usuario = "ADMIN";
                    User1.email = "admin@gmail.com"
                    User1.password = passwordEncripado;
                    User1.rol = "ROL_ADMINAPP";
                    User1.telefono = null;
                    User1.save((err, usuarioGuardado) => {
                        if (err) {
                            console.log("Error al crear el ADMIN");
                        } else if (usuarioGuardado) {
                            console.log("Usuario ADMIN creado exitosamente");
                        } else {
                            console.log("No se a podido crear el usuario ADMIN");
                        }
                    })
                } else {
                    console.log("No se encriptó correctamente la contraseña");
                }
            })
        }
    })
}

function Login(req, res) {
    //aqui los usuario prodran verificar sus credenciales para loguearse 
    let params = req.body;
    if (params.usuario && params.password) {
        User.findOne({ usuario: params.usuario }, (err, userEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error al intentar llamar las credenciales" });
            if (userEncontrado) {
                bcrypt.compare(params.password, userEncontrado.password, (err, passwordVerificado) => {
                    if (passwordVerificado) {
                        if (params.getToken === 'true') {
                            return res.status(200).send({
                                token: jwt.createToken(userEncontrado)
                            })
                        } else {
                            userEncontrado.password = undefined;
                            return res.status(200).send({ userEncontrado });
                        }
                    } else {
                        return res.status(500).send({ mensaje: "Usuario o Email incorrectas prueve otro vez" });
                    }
                })
            } else {
                return res.status(500).send({ mensaje: "El usuario no esta registrado" });
            }
        })
    }else{
        return res.status(500).send({ mensaje: "Ingrese todos los datos"})
    }
}

function NuevoAdmin(req, res) {
    //aqui el admin general del app podra crear a otro administrador para mejorar la superbición del programa
    let User2 = new User();
    let params = req.body;
    console.log(req.user)
    //se verifica si es rol administrador para que pueda crear otro administrador
    if (req.user.rol != 'ROL_ADMINAPP') {
        return res.status(500).send({ mensaje: "No puede crear un ADMIN" })
    }
    if (params.usuario && params.password) {
        User2.usuario = params.usuario;
        User2.rol = "ROL_ADMINAPP"
        User.find(
            { usuario: User2.usuario }
        ).exec((err, userEncontrados) => {
            //hara una busque de los administradores y verificara si no habrá alguno con las mismas credenciales
            if (err) return res.status(500).send({ mensaje: "Error al intentar llamar a los Administradores" });
            if (userEncontrados && userEncontrados.length >= 1) {
                return res.status(500).send({ mensaje: "Utilize otro nombre de ADMIN, el que ha ingresado ya existe" });
            } else {
                //escriptara la contraseña para seguridad
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                    User2.password = passwordEncriptada;
                    //aqui guardara el nuevo administrador con los datos solicitados previamente 
                    User2.save((err, userGuardado) => {
                        if (err) return res.status(500).send({ mensaje: "Error al ingresar un nuevo ADMIN" });
                        if (userGuardado) {
                            res.status(200).send("Bienvenido se ha registrado exitosamente")
                        } else {
                            res.status(404).send({ mensaje: "No se ha creado con exito el ADMIN" })
                        }
                    })
                })
            }
        })
    }

}

function Registrar(req, res) {
    let User1 = new User();
    let params = req.body;
    //aqui se creara y gusrdara al usuario o cliente 
    if (params.nombres && params.email && params.password && params.apellidos && params.usuario && params.telefonos) {
        User1.nombres = params.nombres;
        User1.apellidos = params.apellidos;
        User1.usuario = params.usuario;
        User1.email = params.email;
        User1.telefono = params.telefono;
        User1.rol = "ROL_USER"
        User.find({
            $or: [{ usuario: User1.usuario }, { email: User1.email },]
        }).exec((err, userEncontrados) => {
            if (err) return res.status(500).send({ mensaje: "Error al intentar llamar a los Usuarios" });
            if (userEncontrados && userEncontrados.length >= 1) {
                return res.status(500).send({ mensaje: "Utilize otro Usuario, el que ha ingresado ya existe" });
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                    User1.password = passwordEncriptada;
                    User1.save((err, userGuardado) => {
                        if (err) return res.status(500).send({ mensaje: "Error al ingresar un nuevo Usuari" });
                        if (userGuardado) {
                            res.status(200).send({ userGuardado })
                        } else {
                            res.status(404).send({ mensaje: "No se ha creado con exito el usuario" })
                        }
                    })
                })
            }
        })
    }else{
        return res.status(500).send({ mensaje: "Ingrese todos los datos"})
    }
}

function EditarUser(req, res) {
    let UserId = req.params.id;
    let params = req.body;
    delete params.password;
    //aqui verificará si tiene rol administrador para poder editar datos del cliente de lo contrario no podra
    if (req.user.sub != UserId) {
        if (req.user.rol != 'ROL_ADMINAPP') { return res.status(500).send({ mensaje: "No posee los permisos para editar el usuario" }) }
    }
    //buscara al usuario que se desea editar
    User.find({
        nombres: params.nombres,
        apellidos: params.apellidos,
        usuario: params.usuario,
        email: params.email,
        telefono: params.telefono,
    }).exec((err, UserEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la solicitud de Usuario" });
        if (UserEncontrado.length >= 1 && !params.rol) {
            return res.status(500).send({ mensaje: "Lo que desea modificar ya lo ha estado" })
        } else {
            //aqui lo buscara por ID
            User.findOne({ _id: UserId }).exec((err, userEncontrado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la solicitud ID de Usuario" });
                if (!userEncontrado) return res.status(500).send({ mensaje: "No se ha encotrado estos datos en la base de datos" });
                User.findByIdAndUpdate(UserId, params, { new: true }, (err, userActualizado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la solicitud" });
                    if (!userActualizado) return res.status(500).send({ mensaje: "No se ha podido editar exitosamente el usuario" });
                    if (userActualizado) return res.status(200).send({ userActualizado })
                })
            })
        }
    })
}

function EliminarUser(req, res) {
    //función para eliminar clientes o usuarios
    let UserId = req.params.id
    //función para que solo el administrador pueda ver todos los usuarios o clientes
    if (req.user.rol != 'ROL_ADMINAPP') {
        return res.status(500).send({ mensaje: "No puede eliminar los usuarios" })
    }
    //aqui los buscara por ID para eliminarlos
    User.findOne({ _id: UserId }).exec((err, userEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la solicitud" });
        if (!userEncontrado) return res.status(500).send({ mensaje: "No se han encontrado los datos" })
        User.findByIdAndDelete(UserId, (err, userEliminado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la solicitud" });
            if (!userEliminado) return res.status(500).send({ mensaje: "No se ha podido eliminar el usuario" });
            if (userEliminado) return res.status(200).send({userEliminado})
        })
    })
}

function ObtenerUser(req, res) {
    //función para que solo el administrador pueda ver TODOS los usuarios o clientes
    if (req.user.rol != 'ROL_ADMINAPP') {
        return res.status(500).send({ mensaje: "No puede ver los usuarios" })
    }
    User.find({}).exec((err, allUser) => {
        return res.status(200).send({ allUser })
    })
}

function obtenerUsuarioID(req, res) {
     //este buscara a los usuarios/clientes por ID/individualmente
    var usuarioId = req.params.id;
    ////función para que solo el administrador pueda ver a los usuarios o clientes individualmente
    if (req.user.rol != 'ROL_ADMINAPP') {
        return res.status(500).send({ mensaje: "No puede ver los usuarios" })
    }
    User.findById(usuarioId, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({ usuarioEncontrado });
    })
}

module.exports = {
    ADMIN,
    Login,
    NuevoAdmin,
    Registrar,
    EditarUser,
    EliminarUser,
    ObtenerUser,
    obtenerUsuarioID
}