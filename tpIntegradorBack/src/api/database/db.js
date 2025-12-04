// Importamos el modulo mysql2 en modo promesas, para poder hacer peticiones asincronas a la BBDD
import mysql from "mysql2/promise";

// Importamos la informacion de la conexion a la BBDD que trae environments.js
import environments from "../config/environments.js";

// Hacemos destrucutring para guardar en la variable database la info de conexion a la BBDD
const { database } = environments;
//const database = environments.database;


// Creamos la conexion a la BBDD
const connection = mysql.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

export default connection;