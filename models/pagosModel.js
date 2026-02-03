import mongoose from "mongoose";

const pago = new mongoose.Schema({
    usuario:{type:String, required:true},
    monto: {type:Number, required:true},
    metodo: {type:String, required: true, enum: ["efectivo", "tarjeta", "transferencia",]},
    fecha_vencimiento: {type: Date, required: true},
    estado: {type:String, default: 1}
})

export default mongoose.model("Pago", pago)