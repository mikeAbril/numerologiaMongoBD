import Usuario from "../models/usuariosModel.js"


export const validarExisteUsuario = async (id) => {
    const existeId = await Usuario.findById(id);
    if (!existeId) {
        throw new Error(`El usuario ${id} no esta registrado`);
    }
}

export const validarEmail = async (email) => {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
}

export const validarUsuarioActivo = async (id) => {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
        throw new Error(`El usuario con ID ${id} no existe`);
    }
    if (usuario.estado === 0) {
        throw new Error(`El usuario ${id} está inactivo`);
    }
}