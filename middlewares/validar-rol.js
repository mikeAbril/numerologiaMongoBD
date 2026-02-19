export const admiRol = (req, res, next) =>{
    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se requiere validar el token primero'
        });
    }

    const { rol, nombre} =req.usuario;

    if(rol !== 'admin'){
        return res.status(401).json({
            msg : `${nombre} no es administrador, no puede acceder`
        })
    }
    next();
}

export const tieneRol = (...roles) =>{
    return(req, res, next) =>{
        if(!req.usuario){
            return res. status(500).json({
                msg: 'Se requiere validar el token primero'
            });
        }
        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles :${roles}`
            });
        }
        next();
    }
}