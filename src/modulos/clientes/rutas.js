const express = require("express");

const respuesta = require("../../red/respuestas");
const controlador = require("./controlador")

const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const items = await controlador.todos();
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
});
router.get("/:id", async function (req, res, next) {
  try {
    const items = await controlador.uno(req.params.id);
    if(items && (!Array.isArray(items) || items.length > 0)){
      respuesta.success(req, res, items, 200);
    }else{
      respuesta.error(req,res,"El usuario no se encuentra en la base de datos", 404);
    }
  } catch (err) {
    next(err)
  }
});
router.post("/", async function (req, res, next) {
  try {
    const result = await controlador.agregar(req.body);

    if (result.affectedRows > 0) {
      return respuesta.success(req, res, { id: result.insertId, ...req.body }, 201);
    } else {
      return respuesta.error(req, res, "El usuario no pudo ser guardado en la base de datos", 409);
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return respuesta.error(req, res, "El correo ya se encuentra registrado", 409);
    }
    next(err);
  }
});
router.delete("/:id", async function (req, res, next) {
  try {
    const result = await controlador.eliminar(req.params.id);
    if (result.affectedRows === 0) {
      return respuesta.error(req, res, "El usuario no se encuentra en la base de datos", 404);
    }
    // Si se eliminó, respondemos con éxito
    respuesta.success(req, res, "Usuario eliminado con éxito", 200);
  } catch (err) {
    next(err)
  }
});

module.exports = router;