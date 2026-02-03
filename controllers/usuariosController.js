import Usuario from "../models/usuariosModel.js"

// Obtener todos los usuarios
const getUsuario = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Obtener usuario por email
const getUsuarioEmail = async (req, res) => {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ msg: "El email es obligatorio" })
    }

    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" })
    }

    res.json(usuario)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Crear usuario
const postUsuario = async (req, res) => {
  try {
    const { nombre, edad, fechanacimiento, email } = req.body

    if (!nombre || !email) {
      return res.status(400).json({ msg: "Nombre y email son obligatorios" })
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
      estado: true
    })

    await usuario.save()

    res.status(201).json({
      msg: "Usuario creado correctamente",
      usuario
    })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Actualizar nombre
const putUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre } = req.body

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { nombre },
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
const putUsuarioActivar = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { estado: true },
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
const putUsuarioInactivar = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { estado: false },
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
const deleteUsuario = async (req, res) => {
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

export {
  getUsuario,
  getUsuarioEmail,
  postUsuario,
  putUsuario,
  putUsuarioActivar,
  putUsuarioInactivar,
  deleteUsuario
}
