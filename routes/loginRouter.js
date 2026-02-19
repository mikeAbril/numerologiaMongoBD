import { Router } from "express";
import { login } from "../controllers/loginControllers.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
const router = Router();

router.post("/",
    [
        check("email", "El fomato del correo es inválido").isEmail().notEmpty(),
        check("password", "La contraseña es obligatoria").notEmpty(),
        check("password", "La contraseña debe tener al menos 7 caracteres").isLength({ min: 6 }),
        validarCampos
    ],
    login)


export default router;