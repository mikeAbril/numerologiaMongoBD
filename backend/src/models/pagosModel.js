import mongoose from "mongoose";

const pagoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
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
    enum: ["efectivo", "transferencia", "tarjeta", "mercadopago"],
    required: true
  },
  preferenceId: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending"
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
