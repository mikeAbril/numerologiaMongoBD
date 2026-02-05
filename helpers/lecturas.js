import Lectura from "../models/lecturasModel.js";

export const validarLecturaPrincipal = async (usuarioId) => {
  const existe = await Lectura.findOne({
    usuarioId,
    tipo: "principal"
  });

  if (existe) {
    throw new Error("El usuario ya tiene una lectura principal");
  }
};