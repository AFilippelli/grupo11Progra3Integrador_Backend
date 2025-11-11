//improtamos el modulo dotenv
import dotenv from "dotenv";

//Cargamos las variables del entorno desde el archivo .env
dotenv.config(); 

//vamos a exportar esta informacion del .env
export default{
    port: process.env.PORT || 3500,
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
}