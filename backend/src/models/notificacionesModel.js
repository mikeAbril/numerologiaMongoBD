import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ["lectura", "password", "sistema", "registro", "pago"],
        default: "sistema"
    },
    leida: {
        type: Boolean,
        default: false
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Notificacion", notificacionSchema);
