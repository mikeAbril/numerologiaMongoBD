import { Router } from "express";
import { obtenerNotificaciones, marcarComoLeida } from "../controllers/notificacionesController.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", validarJWT, obtenerNotificaciones);
router.put("/:id", validarJWT, marcarComoLeida);

export default router;
