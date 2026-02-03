import { Router } from "express";
import {
  postLecturaPrincipal,
  postLecturaDiaria,
  getLecturasUsuario
} from "../controllers/lecturasController.js";

import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
  "/principal/:usuario_id",
  [check("usuario_id").isMongoId(), validarCampos],
  postLecturaPrincipal
);

router.post(
  "/diaria/:usuario_id",
  [check("usuario_id").isMongoId(), validarCampos],
  postLecturaDiaria
);

router.get(
  "/usuario/:usuario_id",
  [check("usuario_id").isMongoId(), validarCampos],
  getLecturasUsuario
);

export default router;
