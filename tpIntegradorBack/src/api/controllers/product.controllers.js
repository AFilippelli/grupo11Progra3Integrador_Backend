/*================================
    Controladores de producto
================================*/

// Traemos el modelo de productos con un nombre
import ProductModel from "../models/product.models.js"; 

// GET all products -> Traer todos los productos
export const getAllProducts = async (req, res) => {
    try {
        // la conexion devuelve dos campos, rows con el resultado de la consulta, fields la informacion de la tabla products
        const [rows, fields] = await ProductModel.selectAllProducts();

        // Tipo de respuesta en JSON
        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron productos" : "Productos encontrados"
        });
        // Optimizacion 2: Devolver un mensaje haya o no haya productos

        /* El término "payload" en el contexto de bases de datos se refiere 
        a la parte de los datos transmitidos que constituye el mensaje real 
        o la información útil, excluyendo los encabezados, metadatos o información de control necesaria para la entrega del mensaje*/

    } catch (error) {
        console.error("Error obteniendo productos", error.message);

        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
}


// GET product by id -> Consultar producto por id
export const getProductById = async (req, res) => { 
    // en el parametro tenemos los objetos Request (req) y Response (res)
    try {
        // Optimizacion 1: Validar el datos de id (ya se hace en el middleware)

        // Extraemos el valor id de la url
        // let id = req.params.id; // extraemos el 2 de /products/2
        let { id } = req.params;
        
        const [rows] = await ProductModel.selectProductById(id);

        // Optimizacion 3: Comprobamos que exista el producto con ese id
        if(rows.length === 0) {
            // Este console se muestra en la consola de nuestro servidor
            console.log(`Error!! No existe producto con el id ${id}`);

            // return es CLAVE, porque aca, se termina la ejecucion del codigo
            return res.status(404).json({
                message: `No se encontro producto con id ${id}`
            });
        }

        res.status(200).json({
            payload: rows
        });


    } catch (error) {
        console.log("Error obteniendo producto por id: ", error);

        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        })
    }
}


// POST -> Crear nuevo producto
export const createProduct = async (req, res) => {

    try {
        // Extraemos e imprimimos los datos del body para ver si llegan correctamente
        let { nombre, img_url, tipo, precio } = req.body;
        console.log(req.body);
        console.log(`Nombre producto: ${nombre}`);


        // Optimizacion 1: Validamos de datos de entrada
        if(!tipo || !img_url || !nombre || !precio) {
            return res.status(400).json({
                message: "Datos invalidos, asegurate de enviar todos los campos"
            });
        }

        let [rows] = await ProductModel.insertProduct(nombre, img_url, tipo, precio);


        // Devolvemos una repuesta con codigo 201 Created
        res.status(201).json({
            message: "Producto creado con exito!",
        });

    } catch (error) {
        console.log("Error al crear producto: ", error);

        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        })
    }
}



// PUT-> Actualizar producto
export const modifyProduct = async (req, res) => {
    try {

        // Gracias al middleware express.json() convertimos el JSON previo en un objeto JS al que podemos hacer destructuring y almacenar en variables sus valores
        let { id, nombre, img_url, tipo, precio, activo } = req.body;


        // Optimizacion 1: Validacion basica de todos los campos recibidos en el body
        if(!id || !nombre || !img_url || !tipo || !precio || !activo) {
            return res.status(400).json({
                message: "Faltan campos requeridos"
            });
        }

        let [result] = await ProductModel.updateProduct(nombre, img_url, tipo, precio, activo, id);

        console.log(result);


        // Optimizacion 2: Comprobamos que haya filas afectas -> testeamos que se actualizara
        if (result.affectedRows === 0) { // Si no se actualizo nada
            return res.status(400).json({
                message: "No se actualizo el producto"
            })
        }


        res.status(200).json({
            message: `Producto con id: ${id} actualizado correctamente`
        });

    } catch(error) {
        // Vemos el error en la consola del servidor
        console.error("Error al actualizar producto: ", error);

        // Le respondemos al cliente con un codigo 500 y un mensaje de error
        res.status(500).json({
            message: `Error interno del servidor: ${error}`
        });
    }
}



// DELETE-> Eliminar producto
export const removeProduct = async (req, res) => {
    try {
        let { id } = req.params;

        let [result] = await ProductModel.deleteProduct(id);

        // Comprobamos si realmente se elimino un producto
        if(result.affectedRows === 0) {
            return res.status(400).json({
                message: `No se elimino el producto con id: ${id}`
            });
        }

        return res.status(200).json({
            message: `Producto con id ${id} eliminado correctamente`
        });

    } catch (error) {
        console.error("Error al eliminar un producto por su id: ", error);

        res.status(500).json({
            message: `Error al eliminar producto con id: ${id}`,
            error: error.message
        });
    }
}