const express = require("express");
const config = require("./config");
const morgan = require("morgan");
const error = require("./red/errors")
const clientes = require("./modulos/clientes/rutas")
const app = express();
//Configuración
app.set("port", config.app.port);


//implementa dentro de la app morgan
app.use(morgan("dev"));
//Esta linea permite convertir las peticiones JSON en objetos JavaScript
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(error);
//rutas
app.use("/api/clientes", clientes)
module.exports = app; 