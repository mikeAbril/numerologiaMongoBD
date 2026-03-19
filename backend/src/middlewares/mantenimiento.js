import Configuracion from "../models/configModel.js";
import jwt from "jsonwebtoken";

export const verificarMantenimiento = async (req, res, next) => {
  try {
    const config = await Configuracion.findOne();
    
    // Si no hay config o el modo mantenimiento está apagado, pasamos directo
    if (!config || !config.modoMantenimiento) {
      return next();
    }

    // Comprobar si es ADMIN interceptando el token suelto
    const token = req.header("x-token");
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        if (decoded.rol === "ADMIN" || decoded.rol === "admin") return next(); // Pase VIP
      } catch (e) {
        // Token inválido (ignorar y bloquear)
      }
    }

    if (req.path.includes('/login')) return next();

    return res.status(503).json({
      msg: "EL COSMOS ESTÁ EN MANTENIMIENTO: Por favor, vuelve más tarde.",
      mantenimiento: true
    });
  } catch (error) {
    next();
  }
};