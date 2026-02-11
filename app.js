import express from "express"
import cors from "cors"
import 'dotenv/config'
import { conectarMongo } from "./database/cnx-mongo.js"
import usuariosRoute from "./routes/usuariosRouter.js"
import lecturasRoute from "./routes/lecturasRouter.js"
import pagosRoute from "./routes/pagosRouter.js"
import loginRouter from "./routes/loginRouter.js"



const app =express()
conectarMongo()

app.use(cors())
app.use(express.json())

app.use("/api/usuario",usuariosRoute)
app.use("/api/lectura", lecturasRoute)
app.use("/api/pagos", pagosRoute)
app.use("/api/login", loginRouter);

app.listen(process.env.PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
})