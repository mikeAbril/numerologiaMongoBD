import express from "express"
import cors from "cors"
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from "url";

import { conectarMongo } from "./src/database/cnx-mongo.js"
import usuariosRouter from "./src/routes/usuariosRouter.js"
import lecturasRouter from "./src/routes/lecturasRouter.js"
import pagosRouter from "./src/routes/pagosRouter.js"
import loginRouter from "./src/routes/loginRouter.js"
import notificacionesRouter from "./src/routes/notificacionesRouter.js"
import configRouter from "./src/routes/configRouter.js" // <-- Nueva Importación
import { configurarTareasProgramadas } from "./src/helpers/cron.js"
import { verificarMantenimiento } from "./src/middlewares/mantenimiento.js" // <-- Nueva Importación

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
conectarMongo();

app.use(express.static(path.join(__dirname, "public")));

// --- CORRECCIÓN DE CORS ---
const whiteList = [
  process.env.FRONTEND_URL,"" 
].filter(Boolean); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Registro de rutas
app.use("/api/login", loginRouter); // Login siempre accesible
app.use("/api/config", configRouter); // Config siempre accesible (tiene su propio validarJWT)

// Mantenimiento solo afecta a lo que viene después (opcionalmente)
// Pero lo aplicaremos dentro de los routers específicos mejor para control total.

app.use("/api/usuario", verificarMantenimiento, usuariosRouter);
app.use("/api/lectura", verificarMantenimiento, lecturasRouter);
app.use("/api/pagos", verificarMantenimiento, pagosRouter);
app.use("/api/notificaciones", verificarMantenimiento, notificacionesRouter);

app.get("/", (req, res) => {
  res.send("API de Numerología funcionando correctamente.");
});

configurarTareasProgramadas();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`👂 Servidor escuchando en el puerto ${PORT}`);
}); 
