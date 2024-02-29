import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import signale from "signale"
import "dotenv/config"
import connection from "./rabbitMQ/consume"

const app = express()
const port = process.env.PORT
const subscribeUrl = process.env.SUBSCRIBE_URL?.toString()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())

async function execute() {
    await connection();
}

try{

    execute();

    app.listen(port, ():void => {
        signale.success(`Servidor corriendo en el puerto ${port}`);
    });
    

} catch (error: any) {
    signale.fatal(new Error(error.message));
}

export default app;