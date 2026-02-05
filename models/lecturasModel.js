 import mongoose from "mongoose";
 import Usuario from "./usuariosModel.js"

const Lecturas = new mongoose.Schema(
  {
    usuarioId: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["principal", "diaria"],
      required: true,
    },
    contenido: {
      type: String,
      required: true,
    },
    fechaLectura: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const Lectura = mongoose.model("Lectura", Lecturas);

export default Lectura;

export const lecturaPrincipal = async (idUsuario) => {
  const lecturaExistente = await Lectura.findOne({
    usuarioId: idUsuario,
    tipo: "principal",
  });

  const usuario = await Usuario.findById(idUsuario);

  return {
    usuario,
    lecturaExistente,
    crear: async (usuarioId, tipo, contenido) => {
      const nueva = await Lectura.create({ usuarioId, tipo, contenido });
      return nueva._id;
    },
    obtenerLecturaPrincipal: async (usuarioId) => {
      return await Lectura.findOne({ usuarioId, tipo: "principal" });
    },
    obtenerLecturaDiariaHoy: async (usuarioId) => {
      const hoy = new Date();
      const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
      const finDia = new Date(hoy.setHours(23, 59, 59, 999));

      return await Lectura.findOne({
        usuarioId,
        tipo: "diaria",
        fechaLectura: { $gte: inicioDia, $lte: finDia },
      });
    },
  };
};

export const lecturaDiaria = lecturaPrincipal;

export const lecturasdeUnUsuario = async (usuarioId) => {
  return await Lectura.find({ usuarioId }).sort({ fechaLectura: -1 });
};

export const lecturaPorId = async (id) => {
  return await Lectura.findById(id);
};
