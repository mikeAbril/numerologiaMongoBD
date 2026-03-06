import mongoose from "mongoose";

const pagoSchema = new mongoose.Schema({
  monto: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  tipo: {
    type: String,
    enum: ["efectivo", "transferencia", "tarjeta"],
    required: true
  }
});

const Pago = mongoose.model("pagos", pagoSchema);

export default Pago;


export const obtenerPagos = async () => {
  return await Pago.find();
};

export const obtenerPagosUsuario = async (idUsuario) => {
  return await Pago.find({ usuarioId: idUsuario });
};

export const registrarPago = async (data) => {
  const nuevoPago = new Pago(data);
  return await nuevoPago.save();
};

export const eliminarPago = async (id) => {
  return await Pago.findByIdAndDelete(id);
};

export const verificarEstadoUsuario = async (idUsuario) => {
  const tienePagos = await Pago.exists({ usuarioId: idUsuario });
  return {
    usuarioId: idUsuario,
    estado: tienePagos ? "Activo" : "Sin pagos"
  };
};
