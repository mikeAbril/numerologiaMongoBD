import { Router } from "express";
import {
  getPago,
  getPagos,
  getPagoEstado,
  postPago,
  putPago
} from "../controllers/pagosController.js";

import { validarCampos } from "../middlewares/validar-campos.js";
import { check } from "express-validator";

const router = Router();

/* ================== GET ================== */

// Estado del pago de un usuario
router.get(
  "/estado/:usuario_id",
  [
    check("usuario_id", "ID de usuario no válido").isMongoId(),
    validarCampos
  ],
  getPagoEstado
);

// Obtener pagos de un usuario
router.get(
  "/usuario/:usuario_id",
  [
    check("usuario_id", "ID de usuario no válido").isMongoId(),
    validarCampos
  ],
  getPago
);

// Obtener todos los pagos
router.get("/", getPagos);

/* ================== POST ================== */

router.post(
  "/",
  [
    check("usuario", "Usuario obligatorio").isMongoId(),
    check("monto", "Monto inválido").isFloat({ min: 1 }),
    check("metodo", "Método obligatorio").notEmpty(),
    validarCampos
  ],
  postPago
);

/* ================== PUT ================== */

router.put(
  "/:id",
  [
    check("id", "ID de pago no válido").isMongoId(),
    check("monto").optional().isFloat({ min: 1 }),
    check("metodo").optional().notEmpty(),
    check("estado").optional().isIn(["activo", "inactivo"]),
    validarCampos
  ],
  putPago
);

export default router;
