import mongoose from "mongoose";

const usuario = new mongoose.Schema({
    nombre: { type: String, required: true },
    fechanacimiento: { type: Date, default: Date.now },
    email: { type: String, unique: true, required: true },
    estado: { type: Number, default: 0 },
    password: { type: String, required: true, minlength: 8, maxlength: 100 },
    rol: { type: String, required: true, default: 'user', enum: ['admin', 'user'] },
    resetToken: { type: String, default: null },
    resetTokenExpire: { type: Date, default: null },
    suscripcionExpira: { type: Date, default: null },
    prefsNotif: {
        lectura: { type: Boolean, default: true },
        password: { type: Boolean, default: true },
        sistema: { type: Boolean, default: true }
    }
}, { timestamps: true });

export default mongoose.model("Usuario", usuario)