import Configuracion from "../models/configModel.js";
import Usuario from "../models/usuariosModel.js";
import { crearNotificacion, notificarAdmins } from "./notificacionesController.js";

// Obtener la configuración actual (o crearla si no existe)
export const getConfig = async (req, res) => {
  try {
    let config = await Configuracion.findOne();
    if (!config) {
      config = new Configuracion();
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener la configuración" });
  }
};

// Actualizar los parámetros globales
export const updateConfig = async (req, res) => {
  try {
    const { 
      precioSuscripcion, // Se puede seguir usando como alias del mensual o base
      precioMensual,
      precioTrimestral,
      precioAnual,
      moneda, 
      modoMantenimiento,
      mensajeMantenimiento,
      mantenimientoFecha,
      mantenimientoHora,
      aiCreativity 
    } = req.body;
    
    let config = await Configuracion.findOne();
    if (!config) config = new Configuracion();

    // Notificar mantenimiento si se activa (bloqueo real)
    if (modoMantenimiento === true && config.modoMantenimiento === false) {
      const usuarios = await Usuario.find();
      const finalMsg = mensajeMantenimiento || "El sistema entrará en mantenimiento pronto para mejorar tu experiencia mística.";
      for (const user of usuarios) {
        await crearNotificacion(
          user._id,
          "🛠️ Inicio de Mantenimiento",
          finalMsg,
          "sistema"
        );
      }
    }

    config.precioSuscripcion = precioSuscripcion ?? config.precioSuscripcion;
    config.precioMensual = precioMensual ?? config.precioMensual;
    config.precioTrimestral = precioTrimestral ?? config.precioTrimestral;
    config.precioAnual = precioAnual ?? config.precioAnual;
    config.moneda = moneda ?? config.moneda;
    config.modoMantenimiento = modoMantenimiento ?? config.modoMantenimiento;
    config.mensajeMantenimiento = mensajeMantenimiento ?? config.mensajeMantenimiento;
    config.mantenimientoFecha = mantenimientoFecha ?? config.mantenimientoFecha;
    config.mantenimientoHora = mantenimientoHora ?? config.mantenimientoHora;
    config.aiCreativity = aiCreativity ?? config.aiCreativity;

    await config.save();

    // Notificar a los administradores del cambio
    await notificarAdmins(
      "Configuración Actualizada",
      "Se han aplicado nuevos cambios en el protocolo global (precios o parámetros de IA).",
      "sistema"
    );

    res.json({ msg: "Sistemas actualizados correctamente", config });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar los protocolos" });
  }
};

// Nueva función para notificar con antelación
export const notifyMaintenance = async (req, res) => {
  try {
    const { fecha, hora, mensaje } = req.body;
    const usuarios = await Usuario.find();
    
    const msgFinal = mensaje || `Aviso: Se ha programado un mantenimiento para el día ${fecha} a las ${hora}. Los sistemas estarán en pausa temporalmente.`;

    for (const user of usuarios) {
      await crearNotificacion(
        user._id,
        "📅 Mantenimiento Programado",
        msgFinal,
        "sistema"
      );
    }

    res.json({ msg: "Notificación anticipada enviada a todos los usuarios" });
  } catch (error) {
    res.status(500).json({ msg: "Error al enviar la pre-notificación" });
  }
};