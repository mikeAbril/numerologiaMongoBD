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
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending"
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true // Permite que otros tipos de pago no tengan este ID
  }
});

const Pago = mongoose.model("pagos", pagoSchema);

export default Pago;


export const obtenerPagos = async () => {

  return await Pago.find().populate("usuarioId", "nombre email");
};

export const obtenerPagosUsuario = async (idUsuario) => {
  return await Pago.find({ usuarioId: idUsuario }).populate("usuarioId", "nombre email");
};

export const registrarPago = async (data) => {
  // Si viene con transactionId, verificar si ya existe
  if (data.transactionId) {
    const pagoExistente = await Pago.findOne({ transactionId: data.transactionId });
    if (pagoExistente) return pagoExistente;
  }

  const nuevoPago = new Pago(data);
  const pagoGuardado = await nuevoPago.save();

  return await Pago.findById(pagoGuardado._id).populate("usuarioId", "nombre email");
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