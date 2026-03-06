import Notificacion from "../models/notificacionesModel.js";
import Usuario from "../models/usuariosModel.js";

export const obtenerNotificaciones = async (req, res) => {
    try {
        const { id } = req.usuario; 
        const notificaciones = await Notificacion.find({ usuario: id }).sort({ fecha: -1 });

        res.json({
            ok: true,
            notificaciones
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
};

export const marcarComoLeida = async (req, res) => {
    try {
        const { id } = req.params;
        await Notificacion.findByIdAndUpdate(id, { leida: true });

        res.json({
            ok: true,
            msg: "Notificación marcada como leída"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al actualizar notificación"
        });
    }
};

export const crearNotificacion = async (usuarioId, titulo, mensaje, tipo = "sistema") => {
    try {
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) return;

        // Verificar si el usuario tiene desactivado este tipo de notificación
        if (usuario.prefsNotif && usuario.prefsNotif[tipo] === false) {
            console.log(`Notificación de tipo ${tipo} omitida por preferencia del usuario.`);
            return;
        }

        const nuevaNotificacion = new Notificacion({
            usuario: usuarioId,
            titulo,
            mensaje,
            tipo
        });
        await nuevaNotificacion.save();
    } catch (error) {
        console.error("Error al crear notificación:", error);
    }
};
