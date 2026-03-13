import {
  obtenerPagos,
  obtenerPagosUsuario,
  registrarPago,
  eliminarPago,
  verificarEstadoUsuario
} from "../models/pagosModel.js"
import Usuario from "../models/usuariosModel.js"; 
import { crearNotificacion } from "./notificacionesController.js";
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config();

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCES_TOKEN // Se mantiene con una 'S' según el .env del usuario
});

export const getPagos = async (req, res) => {
// ... resto del código igual ...
  try {
    const pagos = await obtenerPagos();
    res.json(pagos);
  }catch(error){
    res.status(400).json({error: "Error al obtener los pagos" });
  }
};

export const getPagoUsuario = async (req, res) => {
  try{
    const pago = await obtenerPagosUsuario(req.params.id);

    if(!pago || pago.length ===0){
      return res.status(404).json({error: "Pago no encontrado" })
    }
    res.json(pago); // Corregido: res.json en lugar de res.status
  }catch (error) {
    res.status(400).json({ error: "Error al obtener el pago" });
  }
}

export const postNuevoPago = async (req, res) => {
  try {
    const nuevoPago = await registrarPago(req.body);
    const {usuarioId} = req.body

    const usuarioActivo = await Usuario.findByIdAndUpdate(
      usuarioId,
      {estado : 1},
      {new: true}
    )

    // Notificar a los administradores sobre el pago
    try {
      const admins = await Usuario.find({ rol: "admin" });
      for (const admin of admins) {
        await crearNotificacion(
          admin._id,
          "Nuevo Intercambio Energético",
          `El alma ${usuarioActivo?.nombre} ha activado su plan Premium ($${req.body.monto}).`,
          "pago"
        );
      }
    } catch (notifError) {
      console.error("Error al notificar pago a admins:", notifError);
    }

   res.status(201).json({
    msg : "Pago registrado correctamente y cuenta activada",
    pago : nuevoPago,
    Usuario : {
      id : usuarioActivo?._id,
      nombre : usuarioActivo?.nombre,
      estado : usuarioActivo?.estado
    }
   });
   
  } catch (error) {
    res.status(400).json({ error: "Error al registrar el pago y activar usuario" });
  }
};

export const createPreference = async (req, res) => {
  try {
    const { usuarioId, monto, description } = req.body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: description || "Plan Premium - Numerología",
            quantity: 1,
            unit_price: Number(monto),
            currency_id: 'COP'
          }
        ],
        back_urls: {
          success: "http://localhost:5173/payment-success", // Ajustar según el frontend
          failure: "http://localhost:5173/payment-failure",
          pending: "http://localhost:5173/payment-pending",
        },
        auto_return: "approved",
        notification_url: "https://tudominio.com/api/pagos/webhook", // IMPORTANTE: Debe ser una URL pública accesible para Mercado Pago
        metadata: {
          usuario_id: usuarioId
        }
      }
    });

    // Guardar registro inicial del pago
    await registrarPago({
      usuarioId,
      monto,
      tipo: "mercadopago",
      preferenceId: result.id,
      status: "pending"
    });

    res.json({
      id: result.id,
      init_point: result.init_point
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la preferencia de pago" });
  }
};

export const recibirWebhook = async (req, res) => {
  const { query } = req;
  const topic = query.topic || query.type;

  try {
    if (topic === 'payment') {
      const paymentId = query.id || query['data.id'];
      
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      if (paymentData.status === 'approved') {
        const usuarioId = paymentData.metadata.usuario_id;

        // 1. Actualizar el estado del pago en nuestra DB
        const PagoModel = (await import("../models/pagosModel.js")).default;
        await PagoModel.findOneAndUpdate(
          { usuarioId, status: "pending" },
          { status: "approved" }
        );

        // 2. Activar al usuario
        const usuarioActivo = await Usuario.findByIdAndUpdate(
          usuarioId,
          { estado: 1 },
          { new: true }
        );

        // 3. Notificar a los administradores
        const admins = await Usuario.find({ rol: "admin" });
        for (const admin of admins) {
          await crearNotificacion(
            admin._id,
            "Pago MercadoPago Aprobado",
            `El alma ${usuarioActivo?.nombre} ha activado su plan Premium ($${paymentData.transaction_amount}).`,
            "pago"
          );
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en Webhook:", error);
    res.sendStatus(500);
  }
};

export const deletePago = async (req, res) => {
  try {
    const pagoEliminado = await eliminarPago(req.params.id);

    if (!pagoEliminado) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    res.json({ eliminado: pagoEliminado });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar el pago" });
  }
};

export const getEstadoUsuario = async (req, res) => {
  try {
    const estado = await verificarEstadoUsuario(req.params.id);
    res.json(estado);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener estado del usuario" });
  }
};