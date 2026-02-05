import {
  lecturaPrincipal,
  lecturaDiaria,
  lecturasdeUnUsuario,
  lecturaPorId,
} from "../models/lecturasModel.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function respuestaIA(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Error al consultar Gemini:", error);
    return "Ocurrió un error al interpretar el texto.";
  }
}

function extraerJSON(texto) {
  const inicio = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");
  if (inicio === -1 || fin === -1) throw new Error("JSON inválido");
  const jsonLimpio = texto.slice(inicio, fin + 1);
  return JSON.parse(jsonLimpio);
}

// Calcula número de camino de vida
function calcularCaminoDeVida(fecha_nacimiento) {
  const fecha = new Date(fecha_nacimiento);
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const año = fecha.getFullYear();

  const reducir = (num) => {
    if ([11, 22, 33].includes(num)) return num;
    while (num > 9) {
      num = num
        .toString()
        .split("")
        .reduce((a, b) => a + parseInt(b), 0);
    }
    return num;
  };

  const diaReducido = reducir(dia);
  const mesReducido = reducir(mes);
  const añoReducido = reducir(
    año
      .toString()
      .split("")
      .reduce((a, b) => a + parseInt(b), 0),
  );

  const suma = diaReducido + mesReducido + añoReducido;
  return reducir(suma);
}






export async function generarlecturaPrincipal(req, res) {
  try {
    const { usuarioId } = req.params;
    const resultado = await lecturaPrincipal(usuarioId);

    if (!resultado.usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    if (resultado.usuario.estado !== 1) {
      return res.status(403).json({
        msg: "Usuario no activo. No puede generar lectura.",
      });
    }
    if (resultado.lecturaExistente) {
      return res.status(200).json({
        msg: "Lectura principal ya generada",
        id: resultado.lecturaExistente.Id,
        contenido: JSON.parse(resultado.lecturaExistente.contenido),
      });
    }

    const numeroCamino = calcularCaminoDeVida(
      resultado.usuario.fechanacimiento,
    );

    const prompt = `
Eres un numerólogo profesional experto en numerología pitagórica. 
Usa este número de Camino de Vida ya calculado: ${numeroCamino}.
Devuelve ÚNICAMENTE un JSON válido con nombre, numeroCamino, descripcion, talentos, desafios, mensajeEspiritual.
`;

    const contenidoIA = await respuestaIA(prompt);
    const contenidoJSON = extraerJSON(contenidoIA);

    const idLectura = await resultado.crear(
      usuarioId,
      "principal",
      JSON.stringify(contenidoJSON),
    );

    res.status(201).json({
      msg: "Lectura principal generada",
      id: idLectura,
      contenido: contenidoJSON,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno" });
  }
}

export async function generarlecturadiaria(req, res) {
  try {
    const { usuarioId } = req.params;
    const resultado = await lecturaDiaria(usuarioId);

    if (!resultado.usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }
    if (resultado.usuario.estado !== 1) {
      return res.status(403).json({ msg: "Usuario no activo." });
    }

    const lecturaPrincipal =
      await resultado.obtenerLecturaPrincipal(usuarioId);
    if (!lecturaPrincipal) {
      return res.status(400).json({ msg: "Primero genera lectura principal." });
    }

    const lecturaHoy = await resultado.obtenerLecturaDiariaHoy(usuarioId);
    if (lecturaHoy) {
      return res.status(200).json({
        msg: "Lectura diaria ya generada hoy",
        id: lecturaHoy.Id,
        contenido: JSON.parse(lecturaHoy.contenido),
      });
    }

    const fechaHoy = new Date().toISOString().split("T")[0];

    const prompt = `
Genera lectura diaria basada en esta lectura principal:
${lecturaPrincipal.contenido}
Devuelve SOLO un JSON válido con fecha, mensaje, energiaDelDia, consejo
`;

    const contenidoIA = await respuestaIA(prompt);
    const contenidoJSON = extraerJSON(contenidoIA);

    const idLectura = await resultado.crear(
      usuarioId,
      "diaria",
      JSON.stringify(contenidoJSON),
    );

    res.status(201).json({
      msg: "Lectura diaria generada",
      id: idLectura,
      contenido: contenidoJSON,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno" });
  }
}

export async function obtenerlecturasdeunusuario(req, res) {
  try {
    const { usuarioId } = req.params;
    const lecturas = await lecturasdeUnUsuario(usuarioId);

    if (!lecturas.length)
      return res.status(404).json({ msg: "No hay lecturas" });

    res.status(200).json({
      msg: "Lecturas del usuario",
      lecturas,
      numeroLecturas: lecturas.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno" });
  }
}

export async function obtenerlecturaporid(req, res) {
  try {
    const { id } = req.params;
    const lectura = await lecturaPorId(id);

    if (!lectura) return res.status(404).json({ msg: "Lectura no encontrada" });

    let contenidoParseado = lectura.contenido;
    try {
      contenidoParseado =
        typeof lectura.contenido === "string"
          ? JSON.parse(lectura.contenido)
          : lectura.contenido;
    } catch {}

    res.status(200).json({
      msg: "Lectura encontrada",
      lectura: { ...lectura.toObject(), contenido: contenidoParseado },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno" });
  }
}