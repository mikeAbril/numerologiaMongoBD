import Lectura from "../models/lecturasModel.js";

export const verificarLecturaPrincipal = async (req, res, next) => {
  const { usuarioId } = req.params;

  try {
    const lectura = await Lectura.findOne({
      usuarioId: usuarioId,
      tipo: "principal",
    });

    if (lectura) {
      return res.status(400).json({
        msg: "El usuario ya tiene una lectura principal",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: "Error al verificar la lectura principal" });
  }
};