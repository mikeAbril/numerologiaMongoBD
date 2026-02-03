 import mongoose from "mongoose";

 const lectura = new mongoose.Schema({
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: "Usuario",required: true },
    tipo: {type: String, enum: ["principal", "diaria"],required: true},
    caminoVida:{type: Number, required: true},
    nombre:{type:String,require:true},
    prompt:{type:String,require:true}
 },
  {
    timestamps: true
  })

 export default mongoose.model("lectura",lectura)