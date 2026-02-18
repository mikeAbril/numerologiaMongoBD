import mongoose from "mongoose";

export const conectarMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Mongo conectado");
  } catch (error) {
    console.error("❌ Error Mongo:", error);
  }
};