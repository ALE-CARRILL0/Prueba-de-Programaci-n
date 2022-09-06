const express = require("express");
const { engine } = require("express-handlebars");
const myconnection = require("express-myconnection");
const bodyParser = require("body-parser");
const myslq = require("mysql");

const app = express();
app.set("port", 4000);

app.use(myconnection(myslq, {
    host:"localhost",
    user:"root",
    password:"1108",
    port: 3306,
    database:"CarroDB"
}))

app.listen(app.get("port"),() => {
    console.log("Puerto en ejecución con exito", app.get("port"));
})
