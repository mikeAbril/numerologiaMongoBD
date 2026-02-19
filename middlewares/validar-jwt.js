import jwt from "jsonwebtoken";
import Usuario from "../models/usuariosModel.js";

// validar token, esto hace que las rutas se protegan
const validarJWT = async (req, res, next) =>{
    const token = req.header("x-token");
    if(!token){
        return res.status(401).json({
            msg: "no hay token en la petición"
        })
    }
    
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        let usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg : "Token no válido"
            })
        }
        req.usuario=usuario

        next();
    } catch (error) {
        res.status(401).json({
            msg: "Token no válido"
        })
    }
}

export {
    validarJWT
}