//Imports
import express from "express"; //importamos el framework Express
import connection from "./src/api/database/db.js"; //importamos la conexion a la base de datos
import environments from "./src/api/config/environments.js"; //importamos las variables de entorno
import cors from "cors"; //importamos el modulo CORS
import { loggerUrl, validateId } from "./src/api/middlewares/middlewares.js";

const app = express();
const PORT = environments.port;

/*
===================
    Middlewares
===================
Son basicamente funciones que se ejecutan entre la peticion req y la respuesta res
-la idea de los middlewares es no repetir instrucciones por cada endpoint
*/


app.use(cors()); //middleware CORS basico que permite todas las solicitudes

app.use(express.json()); //Middleware para parsear JSON en el body a objetos

//Middleware logger
app.use(loggerUrl); //Aplicamos el middleware loggerUrl

//Middlewares de ruta


//Endpoints

/*CRUD (Create Read Update Delete)

    - CREATE -> POST
    - READ -> GET
    - UPDATE -> PUT
    - DELETE -> DELETE
    
*/

//Get products -> Traer todos los productos
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

//Get product by id -> Consultar productos por su id
app.get("/productos/:id", validateId, async (req, res) => {
    try{
        //obtenemos el valor numerico despues de products: /products/2
        let { id } = req.params;

        //los ? representan los placeholder que utilizamos para evitar las inyecciones SQL
        let sql = `SELECT * FROM productos where id = ?`;
        const [rows] = await connection.query(sql, [id]); //el id reemplaza el ?

        //hacemos la consulta y tenemos el resultado en la variable rows
        //Optimizacion 2: comprobamos que existe el producto con ese id
        if(rows.length === 0) {
            console.log("Error, no existe producto con ese id");

            return res.status(404).json({
                message: `No se encontro producto con id: ${id}`
            });  
        }

        res.status(200).json({
            payload: rows
        });

    } catch(error){
        console.error("Error obteniendo producto con id", error.message);

        res.status(500).json({
            error:"Error interno al obtener un producto con id"
        })
    }
})

//Crear producto
app.post("/productos", async (req, res) => {
    try{
        const { nombre, precio, tipo, img_url } = req.body;
        console.log(req.body);
        
        //Optimizacion de validacion de datos de entrada
        if(!nombre || !precio || !tipo || !img_url){
            //el return hace que el endpoint termine aca
            return res.status(400).json({
                message: "Datos invalidos, completa todos los campos del formulario"
            });
        }

        //los placeholders (?) evitan inyecciones SQL
        let sql = "INSERT INTO productos (nombre, precio, tipo, img_url) VALUES (?, ?, ?, ?)"

        //Enviamos estos valores a la base de datos
        let [rows] = await connection.query(sql, [nombre, precio, tipo, img_url]);
        console.log(rows);

        //Devolvemos una respuesta 201 "Created"
        res.status(201).json({
            message: "Producto creado con exito",
            productId: rows.insertId
        });

    } catch(error){
        console.error("Error interno del servidor");

        res.status(500).json({
            message:"Error interno del servidor",
            error: error.message
        });
    }
});


//Actualizar un producto
app.put("/productos", async (req, res) => {
    try{
        let { id, nombre, precio, tipo, img_url, activo} = req.body;

        //Optimizacion 1: validacion basica de datos
        if(!id || !nombre || !tipo || !precio || !activo){
            return res.status(400).json({
                message: "Faltan campos requeridos"
            })
        }

        let sql = `
            UPDATE productos
            SET nombre = ?, precio = ?, tipo = ?, img_url = ?
            WHERE id = ?
        `;

        let [result] = await connection.query(sql, [nombre, precio, tipo, img_url, id])
        console.log(result);

        //Optimizacion 2: testeamos que se actualizara este producto
        if(result.affectedRows === 0){
            return res.status(400).json({
                message:"No se actualizo el producto"
            })
        }

        res.status(200).json({
            message: "Producto actualizado correctamente"
        })

    }catch(error){
        console.error("Error al actualizar el producto: ", error);

        res.status(500).json({
            message:"Error interno del servidor",
            error: error.message
        })
    }
});

//Eliminar producto
app.delete("/productos/:id",validateId, async(req,res) => {
    try{
        let { id } = req.params;

        let sql = "DELETE FROM productos WHERE id = ?";

        let [result] = await connection.query(sql, [id]);
        console.log(result);

        if(result.affectedRows === 0){ //quiere decir que no afectamos ninguna fila
            return res.status(404).json({
                message: `No se encontro un producto con id ${id}`
            })
        }

        return res.status(200).json({
            message:`Producto con id ${id} eliminado correctamente`
        });

    }catch (error){
        console.log(`Error al eliminar un producto con id ${id}: `, error);

        res.status(500).json({
            message: `Error al eliminar un producto con id ${id}`,
            error: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});