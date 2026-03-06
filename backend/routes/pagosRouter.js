import {Router} from "express";
import { check } from "express-validator";
import {
    getPagos,
    getPagoUsuario,
    postNuevoPago,
    deletePago,
    getEstadoUsuario,
}from "../controllers/pagosController.js"

import { validarCampos } from "../middlewares/validarCampos.js";
import {verificarPagoExistentes} from "../middlewares/validarPagoExistente.js"
import {validarIdMongo} from "../middlewares/validarUsuario.js"

const router = Router();
router.get("/", getPagos);
router.get("/:id", [validarIdMongo, validarCampos], getPagoUsuario);
router.get("/estado/:id", [validarIdMongo, validarCampos], getEstadoUsuario);

router.post(
  "/",
  [
    check("usuarioId", "El ID del usuario es obligatorio").isMongoId(),
    check("monto", "El monto debe ser un número positivo").isNumeric(),
    validarCampos,
  ],
  postNuevoPago
);

router.delete(
  "/:id", 
  [validarIdMongo, validarCampos, verificarPagoExistentes], 
  deletePago
);


export default router;