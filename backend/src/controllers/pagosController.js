import {
  obtenerPagos,
  obtenerPagosUsuario,
  registrarPago,
  eliminarPago,
  verificarEstadoUsuario
} from "../models/pagosModel.js";

import Configuracion from "../models/configModel.js";
import Usuario from "../models/usuariosModel.js";
import { crearNotificacion, notificarAdmins } from "./notificacionesController.js";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

export const getPagos = async (req, res) => {
  try {
    const { email } = req.query;
    let pagos = await obtenerPagos();

    if (email) {
      const queryLower = email.toLowerCase();
      pagos = pagos.filter(p => 
        p.usuarioId?.email?.toLowerCase().includes(queryLower)
      );
    }

    res.json(pagos);
  } catch (error) {
    console.error("Error en getPagos:", error);
    res.status(400).json({ error: "Error al obtener los pagos" });
  }
};

const calculateExpirationDate = async (monto, currentExpiry) => {
  let daysToAdd = 0;
  
  // Obtener precios configurados desde el panel de admin
  let config = await Configuracion.findOne();
  if (!config) config = { precioMensual: 15000, precioTrimestral: 40000, precioAnual: 140000 };

  if (monto >= config.precioAnual) daysToAdd = 365;
  else if (monto >= config.precioTrimestral) daysToAdd = 90;
  else if (monto >= config.precioMensual) daysToAdd = 30;
  else if (monto >= 14000) daysToAdd = 30; // Margen de seguridad para precios antiguos

  const baseDate = (currentExpiry && new Date(currentExpiry) > new Date()) 
    ? new Date(currentExpiry) 
    : new Date();
  
  baseDate.setDate(baseDate.getDate() + daysToAdd);
  return baseDate;
};

export const getPagoUsuario = async (req, res) => {
  try {
    const pago = await obtenerPagosUsuario(req.params.id);
    if (!pago || pago.length === 0) return res.status(404).json({ error: "Pago no encontrado" });
    res.json(pago);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener el pago" });
  }
};

export const postNuevoPago = async (req, res) => {
  try {
    const nuevoPago = await registrarPago(req.body);
    const { usuarioId, monto } = req.body;
    
    const user = await Usuario.findById(usuarioId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
 
    const newExpiry = await calculateExpirationDate(monto, user.suscripcionExpira);
    const usuarioActivo = await Usuario.findByIdAndUpdate(usuarioId, { 
      estado: 1, 
      suscripcionExpira: newExpiry 
    }, { new: true });

    // Notificar al usuario
    await crearNotificacion(
      usuarioId,
      "¡Pago Exitoso!",
      "Tu suscripción Premium ha sido activada. ¡Bienvenido al cosmos!",
      "pago"
    );

    // Notificar a los administradores
    await notificarAdmins(
      "Nuevo Pago Recibido",
      `El usuario ${usuarioActivo.nombre} ha realizado un pago de $${nuevoPago.monto}.`,
      "pago"
    );

    res.status(201).json({ msg: "Pago registrado y usuario activado", pago: nuevoPago, usuario: usuarioActivo });
  } catch (error) {
    console.error("Error en postNuevoPago:", error);
    res.status(400).json({ error: "Error al registrar el pago" });
  }
};

export const createPreference = async (req, res) => {
  try {
    const { usuarioId, monto, description } = req.body;
    const preference = new Preference(client);

    // Definir la URL base del backend para el webhook
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/api";

    const result = await preference.create({
      body: {
        items: [{
          title: description || "Plan Premium Astra AI",
          quantity: 1,
          unit_price: Number(monto),
          currency_id: "COP"
        }],
        back_urls: {
          success: `${process.env.FRONTEND_URL || "http://localhost:5173"}#/user`,
          failure: `${process.env.FRONTEND_URL || "http://localhost:5173"}#/user`,
          pending: `${process.env.FRONTEND_URL || "http://localhost:5173"}#/user`
        },
        auto_return: "approved",
        notification_url: `${BACKEND_URL}/pagos/webhook`, // URL corregida
        metadata: { user_id: usuarioId }
      }
    });

    res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error("❌ ERROR MERCADO PAGO:", error);
    res.status(500).json({ error: "Error al crear preferencia", details: error.message });
  }
};

export const recibirWebhook = async (req, res) => {
  try {
    const topic = req.query.type || req.query.topic;
    
    // Mercado Pago envía notificaciones de varios tipos, nos interesa 'payment'
    if (topic === "payment") {
      const paymentId = req.query["data.id"] || req.query.id;
      const payment = new Payment(client);
      
      // En la v2 del SDK, el resultado de get es directamente el objeto de pago
      const paymentData = await payment.get({ id: paymentId });
      const data = paymentData;

      if (data.status === "approved") {
        const usuarioId = data.metadata.user_id;
        
        // Evitar registros duplicados si el pago ya existe
        await registrarPago({ 
          usuarioId, 
          monto: data.transaction_amount, 
          tipo: "mercadopago", 
          status: "approved",
          transactionId: String(data.id) // Guardamos el ID único de la transacción
        });
        
        const user = await Usuario.findById(usuarioId);
        const newExpiry = await calculateExpirationDate(data.transaction_amount, user?.suscripcionExpira);
 
        const usuarioActivo = await Usuario.findByIdAndUpdate(usuarioId, { 
          estado: 1, 
          suscripcionExpira: newExpiry 
        }, { new: true });

        // Notificar al usuario
        await crearNotificacion(
          usuarioId,
          "¡Suscripción Activada!",
          "Hemos recibido tu pago a través de Mercado Pago. ¡Ya eres Premium!",
          "pago"
        );

        // Notificar a los administradores
        if (usuarioActivo) {
          await notificarAdmins(
            "Nuevo Pago (Mercado Pago)",
            `El usuario ${usuarioActivo.nombre} ha activado su suscripción por $${data.transaction_amount}.`,
            "pago"
          );
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
};

export const deletePago = async (req, res) => {
  try {
    const pagoEliminado = await eliminarPago(req.params.id);
    res.json({ eliminado: pagoEliminado });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar pago" });
  }
};

export const getEstadoUsuario = async (req, res) => {
  try {
    const estado = await verificarEstadoUsuario(req.params.id);
    res.json(estado);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener estado" });
  }
};