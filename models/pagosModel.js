import mongoose from "mongoose";

const pago = new mongoose.Schema({
    usuarioId:{
        type: String,
        require: true
    },

    monto: {
        type: Number,
        require: true
    },

    fecha:{
        type: Date,
        default: Date.now
    },
    descripcio: {
        type: String,
        default: ""
    }
});

const pagos = mongoose.model("pagos",pago);

export default pagos;

export const obtenerPagos = async ()=> {
    return await pagos.find();
};


export const obtenerPagosUsuario = async (idUsuario) => {
  return await pagos.find({ usuarioId: idUsuario });
};

export const registrarPago = async (data) => {
  const pago = new pagos(data);
  return await pagos.save();
};

export const eliminarPago = async (id) => {
  return await pagos.findByIdAndDelete(id);
};

export const verificarEstadoUsuario = async (idUsuario) => {
  const tienePagos = await pagos.exists({ usuarioId: idUsuario });
  return {
    usuarioId: idUsuario,
    estado: tienePagos ? "Activo" : "Sin pagos"
  };
}