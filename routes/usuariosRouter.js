import { Router } from "express";
import { check } from "express-validator";
import {
    deleteUsuario,
    getUsuario,
    getUsuarioEmail,
    postUsuario,
    putUsuario,
    putUsuarioActivar,
    putUsuarioInactivar
} from "../controllers/usuariosController.js"

import { validarCampos } from "../middlewares/validarCampos.js"
import { validarUsuarioActivoMiddleware } from "../middlewares/validarUsuario.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

import {
    validarEmail,
    validarExisteUsuario,
    validaRol
} from "../helpers/usuarios.js";

import { admiRol } from "../middlewares/validar-rol.js";

const router = Router();

router.get("/",[validarJWT,admiRol,getUsuario])

router.get("/email",[
  validarJWT,
    check("email","El email es obligatorio").not().isEmpty(),
    check("email", "Formato de email no válido").isEmail(),
    validarCampos,
],
getUsuarioEmail
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio")
      .not()
      .isEmpty()
      .isLength({ min: 3, max: 50 }),

    check("edad", "La edad debe ser numérica")
      .optional()
      .isNumeric(),

    check("fechanacimiento", "La fecha no es válida")
      .optional()
      .isISO8601()
      .toDate(),

    check("email", "Debe ser un email válido").isEmail(),
    check("email").custom(validarEmail),
    
    check("password", "Minimo 8 caracteres").isLength({min: 8}),
    check("rol").custom(validaRol),

    validarCampos,
  ],
  postUsuario
);
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "ID inválido").isMongoId(),
    check("id").custom(validarExisteUsuario),

    check("nombre", "El nombre es obligatorio").not().isEmpty(),

    validarCampos,
    validarUsuarioActivoMiddleware,  
  ],
  putUsuario
);

router.put(
  "/activar/:id",
  [
    validarJWT,
    admiRol,
    check("id", "ID inválido").isMongoId(),
    check("id").custom(validarExisteUsuario),
    validarCampos,
  ],
  putUsuarioActivar
);

router.put(
  "/inactivar/:id",
  [
    validarJWT,
    check("id", "ID inválido").isMongoId(),
    check("id").custom(validarExisteUsuario),
    validarCampos,
  ],
  putUsuarioInactivar
);

router.delete(
  "/:id",
  [
    validarJWT,
    admiRol,
    check("id", "ID inválido").isMongoId(),
    check("id").custom(validarExisteUsuario),
    validarCampos,
  ],
  deleteUsuario
);

export default router;