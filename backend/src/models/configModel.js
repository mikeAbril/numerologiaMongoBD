import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
   precioSuscripcion: { type: Number, default: 49.99 }, // Obsoleto o usado como base
  precioMensual: { type: Number, default: 15000 },
  precioTrimestral: { type: Number, default: 40000 },
  precioAnual: { type: Number, default: 140000 },
  moneda: { type: String, default: "COP" },
  modoMantenimiento: { type: Boolean, default: false },
  mensajeMantenimiento: { type: String, default: "" },
  mantenimientoFecha: { type: String, default: "" },
  mantenimientoHora: { type: String, default: "" },
  aiCreativity: { type: Number, default: 0.7 }, // Temperatura de la IA
  lastBackup: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Configuracion", configSchema);