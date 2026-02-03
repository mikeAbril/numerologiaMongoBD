import mongoose from "mongoose";

export const conectarMongo = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/numerologia");
    console.log("✅ Mongo conectado");
  } catch (error) {
    console.error("❌ Error Mongo:", error);
  }
};