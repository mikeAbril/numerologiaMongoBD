import express from "express"
import cors from "cors"
import 'dotenv/config'
import { conectarMongo } from "./database/cnx-mongo.js"
import usuariosRouter from "./routes/usuariosRouter.js"
import lecturasRouter from "./routes/lecturasRouter.js"
import pagosRouter from "./routes/pagosRouter.js"
import loginRouter from "./routes/loginRouter.js"
import notificacionesRouter from "./routes/notificacionesRouter.js"
import { configurarTareasProgramadas } from "./helpers/cron.js"

const app =express()
conectarMongo()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/usuario",usuariosRouter)
app.use("/api", loginRouter);
app.use("/api/lectura", lecturasRouter)
app.use("/api/pagos", pagosRouter)
app.use("/api/notificaciones", notificacionesRouter);

// Inicializar tareas programadas (Cron jobs)
configurarTareasProgramadas();

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
    console.log(`👂Servidor escuchando en el puerto ${PORT}`);
})