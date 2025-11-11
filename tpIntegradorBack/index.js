//Imports
import express from "express"; //importamos el framework Express
import connection from "./src/api/database/db.js"; //importamos la conexion a la base de datos
import environments from "./src/api/config/environments.js"; //importamos las variables de entorno


const app = express();
const PORT = environments.port;

//Endpoints
app.get("/productos", async (req, res) => {
    try{
        const sql = `SELECT * FROM productos`;
        const [rows] = await connection.query(sql);
        console.log(rows);

        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron productos" : "Productos encontrados"
        });

    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "Error interno al obtener productos"
        })
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})