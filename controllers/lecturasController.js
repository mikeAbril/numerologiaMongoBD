import Lectura from "../models/lecturasModel.js";
import Usuario from "../models/usuariosModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";


// ================= IA =================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generarLecturaIA(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ================= NUMEROLOGÍA =================
function reducirNumero(num) {
  if (num === 11 || num === 22) return num;
  return num
    .toString()
    .split("")
    .map(Number)
    .reduce((a, b) => a + b, 0);
}

function calcularCaminoVida(fechaNacimiento) {
  const fecha = new Date(fechaNacimiento);
  const total =
    reducirNumero(fecha.getFullYear()) +
    reducirNumero(fecha.getMonth() + 1) +
    reducirNumero(fecha.getDate());

  return reducirNumero(total);
}

 
// Lectura principal
export const postLecturaPrincipal = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    const existe = await Lectura.findOne({
      usuario: usuario_id,
      tipo: "principal"
    });

    if (existe) {
      return res.json({ msg: "El usuario ya tiene lectura principal", lectura: existe });
    }

    const caminoVida = calcularCaminoVida(usuario.fechanacimiento);

    const prompt = `
Actúa como experto en numerología pitagórica.
Número: ${caminoVida}
Genera una lectura profunda, clara y profesional.
    `;

    const resultado = await generarLecturaIA(prompt);

    const lectura = await Lectura.create({
      usuario: usuario_id,
      tipo: "principal",
      caminoVida,
      nombre: usuario.nombre,
      prompt,
      resultado
    });

    res.json(lectura);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const postLecturaDiaria = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const caminoVida = calcularCaminoVida(usuario.fechanacimiento);

    const prompt = `
Genera una lectura diaria breve basada en el número ${caminoVida}.
Incluye enfoque, acción concreta y 5 palabras clave.
    `;

    const resultado = await generarLecturaIA(prompt);

    const lectura = await Lectura.create({
      usuario: usuario_id,
      tipo: "diaria",
      caminoVida,
      nombre: usuario.nombre,
      prompt,
      resultado
    });

    res.json(lectura);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



// Obtener lecturas de un usuario
export const getLecturasUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const lecturas = await Lectura.find({ usuario: usuario_id })
      .sort({ createdAt: -1 });

    res.json(lecturas);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

  