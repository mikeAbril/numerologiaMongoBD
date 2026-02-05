export const validarPago = (data) => {
  const errores = [];

  if (!data.usuarioId || data.usuarioId.trim() === "") {
    errores.push("El usuarioId es obligatorio");
  }

  if (data.monto === undefined || data.monto === null) {
    errores.push("El monto es obligatorio");
  }

  if (Number(data.monto) <= 0) {
    errores.push("El monto debe ser mayor a 0");
  }

  return errores;
};


export const manejarError = (res, mensaje, error = null) => {
  console.error(mensaje, error);

  return res.status(500).json({
    ok: false,
    message: mensaje,
  });
};