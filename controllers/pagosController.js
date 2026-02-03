import Pago from "../models/pagosModel.js";

// Obtener todos los pagos
export const getPagos = async (req, res) => {
  try {
    const pagos = await Pago.find();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Obtener pagos por usuario
export const getPago = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const pagos = await Pago.find({ usuario_id });

    if (pagos.length === 0) {
      return res.status(404).json({
        msg: "No se encontraron pagos para este usuario",
      });
    }

    res.json(pagos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Crear pago
export const postPago = async (req, res) => {
  try {
    const { usuario_id, monto, metodo, fecha_vencimiento } = req.body;

    if (!usuario_id || !monto || !metodo) {
      return res.status(400).json({
        msg: "usuario_id, monto y método son obligatorios",
      });
    }

    const nuevoPago = new Pago({
      usuario_id,
      monto,
      metodo,
      fecha_vencimiento,
    });

    await nuevoPago.save();

    res.status(201).json({
      msg: "Pago realizado correctamente",
      pago: nuevoPago,
    });
  } catch (error) {
    if (error.message.includes("membresía activa")) {
      return res.status(409).json({ msg: error.message });
    }

    res.status(500).json({ msg: error.message });
  }
};

// Actualizar pago
export const putPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto, metodo, fecha_vencimiento } = req.body;

    const pagoActualizado = await Pago.findByIdAndUpdate(
      id,
      { monto, metodo, fecha_vencimiento },
      { new: true }
    );

    if (!pagoActualizado) {
      return res.status(404).json({ msg: "Pago no encontrado" });
    }

    res.json({
      msg: "Pago actualizado correctamente",
      pago: pagoActualizado,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Estado del pago (activo / inactivo)
export const getPagoEstado = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // Último pago del usuario
    const pago = await Pago.findOne({ usuario_id }).sort({
      fecha_vencimiento: -1,
    });

    if (!pago) {
      return res.json({
        estado: "inactivo",
        msg: "No tiene pagos registrados",
      });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const venc = new Date(pago.fecha_vencimiento);
    venc.setHours(0, 0, 0, 0);

    const estado = venc >= hoy ? "activo" : "inactivo";

    res.json({
      usuario_id,
      fecha_vencimiento: pago.fecha_vencimiento,
      estado,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
