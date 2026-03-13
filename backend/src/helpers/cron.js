import cron from "node-cron";
import Usuario from "../models/usuariosModel.js";
import { procesarGeneracionLecturaDiaria } from "./lecturas.js";

/**
 * Configura las tareas programadas del sistema.
 */
export const configurarTareasProgramadas = () => {
  // Programado para ejecutarse todos los días a las 06:00 AM
  // Formato: (minuto hora día_mes mes día_semana)
  cron.schedule("0 6 * * *", async () => {
    console.log("[Cron] Iniciando generación automática de lecturas diarias...");
    
    try {
      // 1. Buscar solo usuarios con cuenta activa (estado: 1)
      const usuariosActivos = await Usuario.find({ estado: 1 });
      console.log(`[Cron] Se encontraron ${usuariosActivos.length} usuarios activos.`);

      // 2. Procesar cada usuario
      for (const usuario of usuariosActivos) {
        try {
          const resultado = await procesarGeneracionLecturaDiaria(usuario._id);
          
          if (resultado.error) {
            console.warn(`[Cron] No se pudo generar lectura para ${usuario.email}: ${resultado.error}`);
          } else if (resultado.yaExistia) {
            console.log(`[Cron] El usuario ${usuario.email} ya tenía lectura hoy.`);
          } else {
            console.log(`[Cron] ✅ Lectura generada exitosamente para ${usuario.email}`);
          }
        } catch (error) {
          console.error(`[Cron] ❌ Error procesando usuario ${usuario.email}:`, error.message);
        }
      }
      
      console.log("[Cron] Proceso de generación diaria completado.");
    } catch (error) {
      console.error("[Cron] ❌ Error crítico en la tarea programada:", error);
    }
  }, {
    scheduled: true,
    timezone: "America/Bogota" // Ajusta esto a tu zona horaria
  });

  console.log("⏰ Tareas programadas inicializadas (Lectura diaria: 06:00 AM)");
};
