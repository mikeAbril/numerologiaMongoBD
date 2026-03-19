import Usuario from "../models/usuariosModel.js"
import bcryptjs from "bcryptjs"
import { sendEmail } from "../helpers/sendEmail.js"
import { sendResetCode } from "../helpers/sendEmail.js"
import { crearNotificacion, notificarAdmins } from "./notificacionesController.js"

// Obtener todos los usuarios
export const getUsuario = async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};

    if (email) {
      // Búsqueda parcial e insensible a mayúsculas/minúsculas
      query.email = { $regex: email, $options: "i" };
    }

    const usuarios = await Usuario.find(query);
    res.json(usuarios);
  } catch (error) {
    res.status(400).json({ error });
  }
};

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
    const { nombre, fechanacimiento, email, password, rol } = req.body

    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: "Nombre, email y password son obligatorios" })
    }

    const existeUsuario = await Usuario.findOne({ email })
    if (existeUsuario) {
      return res.status(409).json({ msg: "El usuario ya existe" })
    }

    const usuario = new Usuario({
      nombre,
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
    
    // Notificar a los administradores
    await notificarAdmins(
      "Nueva Alma Registrada",
      `El usuario ${usuario.nombre} (${usuario.email}) se ha unido a Astra AI.`,
      "registro"
    );

    await enviarEmailBienvenida(usuario)

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

// Actualizar usuario
export const putUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, fechanacimiento } = req.body;

    // Si el email viene en la petición, verificar que no lo tenga otro usuario
    if (email) {
      const existeEmail = await Usuario.findOne({ email, _id: { $ne: id } });
      if (existeEmail) {
        return res.status(400).json({ msg: "El email ya está registrado por otro usuario" });
      }
    }

    const usuario = await Usuario.findByIdAndUpdate(
      id, 
      { nombre, email, fechanacimiento },
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({
      msg: "Usuario actualizado correctamente",
      usuario
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });


    if (!usuario) {
      return res.status(404).json({ mensaje: "El correo no está registrado" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    usuario.resetToken = resetCode;
    usuario.resetTokenExpire = Date.now() + 15 * 60 * 1000;
    await usuario.save();

    await sendResetCode(email, resetCode);
    res.json({ mensaje: "Código de recuperación enviado al email" });
  } catch (error) {
    next(error)
  }

}
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const tokenBusqueda = String(token).trim();
    console.log("🔍 Buscando usuario con token:", tokenBusqueda);
    

    const usuario = await Usuario.findOne({
      resetToken: tokenBusqueda,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!usuario) {
      console.log("❌ No se encontró usuario o el token expiró");
      return res.status(400).json({ error: true, mensaje: "Código inválido o expirado" });
    }
    console.log("✅ Usuario encontrado:", usuario.email);

    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(newPassword, salt);

    usuario.resetToken = undefined;
    usuario.resetTokenExpire = undefined;
    await usuario.save();

    res.json({ error: false, mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("🔥 Error en resetPassword:", error);
    next(error);
  }
};

const enviarEmailBienvenida = async (usuario) => {
  try {
    await sendEmail(
      usuario.email,
      "!Bienvenido a Numerologia¡",
      `Hola ${usuario.nombre}, gracias por registrarte`
    )
  } catch (error) {
    console.error('Error al enviar email', error.message);
  }
};

export const cambiarPassword = async (req, res) => {
  try {
    const { id } = req.usuario;
    const { passwordActual, passwordNueva } = req.body;

    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Verificar password actual
    const validPassword = bcryptjs.compareSync(passwordActual, usuario.password);
    if (!validPassword) {
      return res.status(400).json({ msg: "La contraseña actual es incorrecta" });
    }

    // Encriptar nueva password
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(passwordNueva, salt);
    await usuario.save();

    await crearNotificacion(
      usuario._id,
      "Seguridad: Contraseña Cambiada",
      "Has actualizado tu contraseña desde tu perfil.",
      "password"
    );

    res.json({ msg: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al cambiar contraseña" });
  }
}