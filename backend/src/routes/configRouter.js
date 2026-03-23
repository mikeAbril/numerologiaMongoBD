import { Router } from "express";
import { getConfig, updateConfig, notifyMaintenance } from "../controllers/configController.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { admiRol } from "../middlewares/validar-rol.js";

const router = Router();

// Solo los administradores pueden ver y cambiar la configuración global
// Cualquier usuario autenticado puede ver la configuración (precios)
router.get("/", [validarJWT], getConfig);
// Solo el administrador puede modificarla
router.put("/", [validarJWT, admiRol], updateConfig);
// Nueva ruta para pre-notificación
router.post("/notify-maintenance", [validarJWT, admiRol], notifyMaintenance);

export default router;