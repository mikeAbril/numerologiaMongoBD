import {
  obtenerPagos,
  obtenerPagosUsuario,
  registrarPago,
  eliminarPago,
  verificarEstadoUsuario
} from "../models/pagosModel.js"

export const getPagos = async (req, res) => {
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
    res.status(pago);
  }catch (error) {
    res.status(400).json({ error: "Error al obtener el pago" });
  }
}

export const postNuevoPago = async (req, res) => {
  try {
    const nuevoPago = await registrarPago(req.body);
    res.status(201).json(nuevoPago);
  } catch (error) {
    res.status(400).json({ error: "Error al registrar el pago" });
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