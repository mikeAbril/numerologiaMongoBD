import {
  obtenerPagos,
  obtenerPagosUsuario,
  registrarPago,
  eliminarPago,
  verificarEstadoUsuario
} from "../models/pagosModel.js";

import Usuario from "../models/usuariosModel.js";
import { crearNotificacion } from "./notificacionesController.js";

import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

// 🔐 CONFIGURACIÓN MERCADO PAGO
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

export const getPagos = async (req, res) => {
  try {
    const pagos = await obtenerPagos();
    res.json(pagos);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener los pagos" });
  }
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
    const { usuarioId } = req.body;
    const usuarioActivo = await Usuario.findByIdAndUpdate(usuarioId, { estado: 1 }, { new: true });
    res.status(201).json({ msg: "Pago registrado y usuario activado", pago: nuevoPago, usuario: usuarioActivo });
  } catch (error) {
    res.status(400).json({ error: "Error al registrar el pago" });
  }
};

// ===============================
// 💳 CREAR PREFERENCIA (VERSION DEFINITIVA)
// ===============================
export const createPreference = async (req, res) => {
  try {
    const { usuarioId, monto, description } = req.body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: description || "Plan Premium Astra AI",
            quantity: 1,
            unit_price: Number(monto),
            currency_id: "COP"
          }
        ],
        back_urls: {
          success: process.env.FRONTEND_URL || "http://localhost:5173",
          failure: process.env.FRONTEND_URL || "http://localhost:5173",
          pending: process.env.FRONTEND_URL || "http://localhost:5173"
        },
        metadata: {
          user_id: usuarioId
        }
      }
    });

    res.json({
      id: result.id,
      init_point: result.init_point
    });

  } catch (error) {
    console.error("❌ ERROR MERCADO PAGO:", error);
    res.status(500).json({ error: "Error al crear preferencia", details: error.message });
  }
};

export const recibirWebhook = async (req, res) => {
  try {
    const topic = req.query.type || req.query.topic;
    if (topic === "payment") {
      const paymentId = req.query["data.id"] || req.query.id;
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });
      const data = paymentData.body;

      if (data.status === "approved") {
        const usuarioId = data.metadata.user_id;
        await registrarPago({ usuarioId, monto: data.transaction_amount, tipo: "mercadopago", status: "approved" });
        await Usuario.findByIdAndUpdate(usuarioId, { estado: 1 });
      }
    }
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

// ESTA ERA LA QUE FALTABA
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
