import express from "express"
import cors from "cors"
import 'dotenv/config'
import { conectarMongo } from "./src/database/cnx-mongo.js"
import usuariosRouter from "./src/routes/usuariosRouter.js"
import lecturasRouter from "./src/routes/lecturasRouter.js"
import pagosRouter from "./src/routes/pagosRouter.js"
import loginRouter from "./src/routes/loginRouter.js"
import notificacionesRouter from "./src/routes/notificacionesRouter.js"
import { configurarTareasProgramadas } from "./src/helpers/cron.js"

const app =express()
conectarMongo()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/api/usuario",usuariosRouter)
app.use("/api/login", loginRouter);
app.use("/api/lectura", lecturasRouter)
app.use("/api/pagos", pagosRouter)
app.use("/api/notificaciones", notificacionesRouter);

// Inicializar tareas programadas (Cron jobs)
configurarTareasProgramadas();

app.listen(process.env.PORT,()=>{
    console.log(`👂Servidor escuchando en el puerto ${process.env.PORT}`);
})