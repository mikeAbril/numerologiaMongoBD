import {Router} from "express";
import { check } from "express-validator";
import {
    getPagos,
    getPagoUsuario,
    postNuevoPago,
    deletePago,
    getEstadoUsuario,
    createPreference,
    recibirWebhook
}from "../controllers/pagosController.js"

import { validarCampos } from "../middlewares/validarCampos.js";
import {verificarPagoExistentes} from "../middlewares/validarPagoExistente.js"
import {validarIdMongo} from "../middlewares/validarUsuario.js"

const router = Router();
router.get("/", getPagos);
router.get("/usuario/:id", [validarIdMongo, validarCampos], getPagoUsuario);
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

router.post("/create-preference", createPreference);
router.post("/webhook", recibirWebhook);

router.delete(
  "/:id", 
  [validarIdMongo, validarCampos, verificarPagoExistentes], 
  deletePago
);


export default router;