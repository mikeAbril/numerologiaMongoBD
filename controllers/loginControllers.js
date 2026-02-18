import Usuario from "../models/usuariosModel.js";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../middlewares/validar-jwt.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log("pass "+password);
    
    try {
        const usuario = await Usuario.findOne({ email });
    
        if (!usuario) {
            return res.status(400).json({
                msg: "Correo o contraseña incorrectos (Email)"
            });
        }
   
        
       
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        
        if (!validPassword) {
            return res.status(400).json({
                msg: "Correo o contraseña incorrectos (Password)"
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
            msg: "Error en el servidor, hable con el administrador"
        });
    }
};