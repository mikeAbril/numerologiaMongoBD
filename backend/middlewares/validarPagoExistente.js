import pagos from "../models/pagosModel.js";

export const verificarPagoExistentes = async (req, res, next) =>{
    try{
        const pago = await pagos.findById(req.params.id);
        if(!pago){
            return res.status(404).json({error:"El pago no existe"})
        }
        next();
    }catch(error){
        return res.status(500).json({error: "Error al verificar el pago" })
    }
}
