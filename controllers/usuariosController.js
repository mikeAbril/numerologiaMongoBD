import Usuario from "../models/usuariosModel.js"
import bcryptjs from "bcryptjs"
import { sendEmail } from "../helpers/sendEmail.js"

// Obtener todos los usuarios
export const getUsuario = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
    res.json(usuarios)
  } catch (error) {
    res.status(400).json({error})
  }
}

// Obtener usuario por email
export const getUsuarioEmail = async (req, res) => {
  try {
    const { email } = req.query
    const usuarios = await Usuario.findOne({ email })

    if (!usuarios) {
      return res.status(404).json({ msg: "Usuario no encontrado" })
    }
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Crear usuario
export const postUsuario = async (req, res) => {
  try {
    const { nombre, edad, fechanacimiento, email, password,rol} = req.body

    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: "Nombre, email y passoword son obligatorios" })
    }

    const existeUsuario = await Usuario.findOne({ email })
    if (existeUsuario) {
      return res.status(409).json({ msg: "El usuario ya existe" })
    }

    const usuario = new Usuario({
      nombre,
      edad,
      fechanacimiento,
      email,
      password,
      rol,
      estado: 0
    });
  
// Esto es para encriptar 
    const salt = bcryptjs.genSaltSync(10); // esto es la semilla
    usuario.password = bcryptjs.hashSync(password, salt) // esto convierto el texto en hash 

    await usuario.save();

    try {
      await sendEmail(
        email,
        "Bienvenido a Numerologia",`Hola${nombre}, tu cuenta ha sido creada con éxito, !Gracias por unirte¡`
      );
    } catch (mailError) {
      console.log("Error al enviar el correo de bienvenida",mailError);
      
    }

    const usuarioValido = usuario.toObject();
    delete usuarioValido.password;

    res.status(201).json({
      msg: "Usuario creado correctamente",
      usuario
    })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Actualizar nombre
export const putUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre } = req.body

    const usuario = await Usuario.findByIdAndUpdate( id,{ nombre },
      { new: true }
    )

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" })
    }

    res.json({
      msg: "Usuario modificado correctamente",
      usuario
    })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Activar usuario
export const putUsuarioActivar = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { estado: 1 },
      { new: true }
    )

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" })
    }

    res.json({ msg: "Usuario activado correctamente", usuario })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Inactivar usuario
export const putUsuarioInactivar = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { estado: 2 },
      { new: true }
    )

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" })
    }

    res.json({ msg: "Usuario inactivado correctamente", usuario })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByIdAndDelete(id)

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" })
    }

    res.json({ msg: "Usuario eliminado correctamente" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}


