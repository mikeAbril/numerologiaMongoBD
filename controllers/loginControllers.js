import Usuario from "../models/usuariosModel.js";
import bcryptjs from "bcryptjs";
import generarJWT from "../helpers/generar-jwt.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    
    try {
        const usuario = await Usuario.findOne({ email });
    
        if (!usuario) {
            return res.status(400).json({
                msg: "email no encontrado (Email)"
            });
        }
   
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        
        if (!validPassword) {
            return res.status(400).json({
                msg: "contraseña incorrectos (Password)"
            });
        }

        const token = await generarJWT(usuario.id);
   
        res.json({
            msg: "Login exitoso",
            usuario,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al iniciar sesion"
        });
    }
};

export default login