import mongoose from "mongoose";

const usuario = new mongoose.Schema({
    nombre:{type:String,required:true},
    edad:{type:Number},
    fechanacimiento:{type:Date, default:Date.now},
    email:{type:String,unique:true, required: true},
    estado:{type:Number,default:1},
    password:{type: String, required: true, minlenght:8, maxlenght:20},
    rol: {type:String, emun:["admin","usuario"], default:"usuario"} 
});

export default mongoose.model("Usuario",usuario)