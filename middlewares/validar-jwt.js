const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "3h"
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject("No se puede generar el token")
            } else {
                resolve(token)
            }
        })
    })
}


const validarJWT = async (req, res, next) =>{
    const token = req.header("x-token");
    if(!token){
        return res.status(401).json({
            msg: "no hay token en la petición"
        })
    }try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        let usuario = await Holder.findById(uid);

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
    generarJWT,
    validarJWT
}