import Lectura, { lecturaDiaria } from "../models/lecturasModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { crearNotificacion } from "../controllers/notificacionesController.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function respuestaIA(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Error al consultar Gemini:", error);
    return null;
  }
}

function extraerJSON(texto) {
  if (!texto) throw new Error("No se recibió respuesta de la IA");
  const inicio = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");
  if (inicio === -1 || fin === -1) throw new Error("JSON inválido");
  const jsonLimpio = texto.slice(inicio, fin + 1);
  return JSON.parse(jsonLimpio);
}

export const validarLecturaPrincipal = async (usuarioId) => {
  const existe = await Lectura.findOne({
    usuarioId,
    tipo: "principal"
  });

  if (existe) {
    throw new Error("El usuario ya tiene una lectura principal");
  }
};

export async function procesarGeneracionLecturaDiaria(usuarioId) {
  try {
    const resultado = await lecturaDiaria(usuarioId);

    if (!resultado.usuario) return { error: "Usuario no encontrado", status: 404 };
    
    if (resultado.usuario.estado !== 1) {
      return { error: "Acceso denegado. Suscripción inactiva.", status: 403 };
    }

    const lecturaP = await resultado.obtenerLecturaPrincipal(usuarioId);
    if (!lecturaP) return { error: "Primero genera tu lectura principal gratuita.", status: 400 };

    const lecturaHoy = await resultado.obtenerLecturaDiariaHoy(usuarioId);
    if (lecturaHoy) {
      return { 
        msg: "Tu guía de hoy ya está disponible", 
        id: lecturaHoy.id, 
        contenido: JSON.parse(lecturaHoy.contenido),
        yaExistia: true 
      };
    }

    const prompt = `
      Eres un numerólogo experto. Genera una lectura diaria mística en ESPAÑOL.
      Base de personalidad: ${lecturaP.contenido}.
      Fecha: ${new Date().toLocaleDateString('es-ES')}.
      Instrucciones:
      1. Sé profundo y espiritual.
      2. Devuelve ÚNICAMENTE un JSON válido con este formato:
      { "fecha": "${new Date().toLocaleDateString('es-ES')}", "mensaje": "...", "energiaDelDia": "...", "consejo": "..." }
    `;

    const contenidoIA = await respuestaIA(prompt);
    if (!contenidoIA) return { error: "El oráculo está fuera de línea. Intenta más tarde.", status: 500 };
    
    const contenidoJSON = extraerJSON(contenidoIA);

    const idLectura = await resultado.crear(
      usuarioId,
      "diaria",
      JSON.stringify(contenidoJSON)
    );

    await crearNotificacion(
      usuarioId,
      "Nueva Alineación Cósmica",
      "Tu lectura diaria está lista. Descubre lo que el universo tiene preparado para ti hoy.",
      "lectura"
    );

    return {
      msg: "Lectura diaria generada con éxito",
      id: idLectura,
      contenido: contenidoJSON,
      yaExistia: false
    };
  } catch (error) {
    console.error("Error en procesarGeneracionLecturaDiaria:", error);
    throw error;
  }
}
