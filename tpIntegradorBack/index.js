/*===================
    Importaciones
===================*/
import express from "express";
const app = express(); // app es la instancia de la aplicacion Express y contiene todos sus metodos

import environments from "./src/api/config/environments.js"; // Traemos las variables de entorno para extraer el puerto
const PORT = environments.port;

import cors from "cors"; // Importamos cors para poder usar sus metodos y permitir solicitudes de otras aplicaciones

// Importamos los middlewares
import { loggerUrl, requireLogin } from "./src/api/middlewares/middlewares.js";

// Importamos las rutas de producto
import { productRoutes } from "./src/api/routes/index.js";

// Importamos la configuracion para trabajar con rutas y archivos estaticos
import { join, __dirname } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";

import session from "express-session";
const SESSION_KEY = environments.session_key;
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

// Middleware para parsear la info de <form>
app.use(express.urlencoded({ extended: true })); // Gracias a este middleware podemos leer la info que nos envia por POST los <form> de HTML (sin fetch y sin JSON)

//Middleware para servir archivos estaticos, utilizaremos la carpeta public (img,css,js)
app.use(express.static(join(__dirname, "src/public")));


// Middleware de sesion, cada vez que un usuario hace una solicitud HTTP, se gestionara su sesion mediante el middleware
app.use(session({
    secret: SESSION_KEY, // Firma las cookies para evitar manipulacion por el cliente, clave para la seguridad de la aplicaciones, este valor se usa para FIRMAR las cookies de sesion para que el servidor verifique que los datos no fueron alterados por el cliente
    resave: false, // Evita guardar la sesion si no hubo cambios
    saveUninitialized: true // No guarda sesiones vacias
}));

//Configuramos EJS como motor de plantillas
app.set("view engine", "ejs");
//Nuestras vistas se serviran desde la carpeta public
app.set("views", join(__dirname, "src/views"));


/*===================
Endpoints
===================*/

// Ahora las rutas las gestiona el middleware Router
app.use("/api/productos", productRoutes);

// Devolveremos vistas
app.get("/", requireLogin, async (req, res) => {

    /* Logica pasada al middleware requireLogin
    if(!req.session.user) {
        return res.redirect("/login");
    }
    */

    try {
        const [rows] = await connection.query("SELECT * FROM productos");
        
        // Le devolvemos la pagina index.ejs
        res.render("index", {
            title: "Indice",
            about: "Lista de productos",
            products: rows
        }); 

    } catch (error) {
        console.log(error);
    }
});

app.get("/consultar", requireLogin, (req, res) => {
    res.render("consultar", {
        title: "Consultar",
        about: "Consultar producto por id:"
    });
});

app.get("/crear", requireLogin, (req, res) => {
    res.render("crear", {
        title: "Crear",
        about: "Crear producto"
    });
});

app.get("/modificar", requireLogin, (req, res) => {
    res.render("modificar", {
        title: "Modificar",
        about: "Actualizar producto"
    });
})

app.get("/eliminar", requireLogin, (req, res) => {
    res.render("eliminar", {
        title: "Eliminar",
        about: "Eliminar producto"
    });
})

// Vista de login
app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Login dashboard"
    });
});


// Endpoint para iniciar sesion
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validacion 1: Evitamos consulta innecesaria
        if(!email || !password) {
            return res.render("login", {
                title: "Login",
                about: "Login dashboard",
                error: "Todos los campos son obligatorios"
            });
        }

        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        const [rows] = await connection.query(sql, [email, password]);

        // Validacion 2: Verificamos si existe este email y password
        if(rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Login dashboard",
                error: "Credenciales incorrectas"
            })
        }

        // console.log(rows);
        const user = rows[0];
        console.table(user);

        // Con el email y el password validos, guardamos la sesion
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }

        res.redirect("/"); // Redirigimos a la pagina principal
        

    } catch (error) {
        console.error("Error en el login", error);
    }
});


// Creamos el endpoint para destruir la sesion y redireccionar
app.post("/logout", (req, res) => {

    // 1. Destruimos la sesion
    req.session.destroy((err) => {
        if(err) { // Si existiera algun error destruyendo la sesion
            console.log("Error al destruir la sesion", err);
            return res.status(500).json({
                error: "Error al cerrar la sesion"
            });
        }

        // 2. Redirigimos a login luego de cerrar la sesion
        res.redirect("/login");
    });
});


// TO DO, incorporar vista <form> para crear usuarios y el endpoint para interactuar con esta vista

// TO DO, incorporar bcrypt para hashear las contraseñas https://www.npmjs.com/package/bcrypt


// Endpoint para crear ventas
app.post("/api/sales", async (req, res) => {
    try {
        // Recibimos los datos del cuerpo de la peticion HTTP
        let { date, total_price, user_name, products } = req.body;

        // Validacion de datos obligatorios
        if(!date || !total_price || !user_name || !Array.isArray(products)) {
            return res.status(400).json({
                message: "Datos invalidos, debes enviar date, total_price, user_name y products (array)"
            });
        }

        // 1. Insertar la venta en la tabla "sales"
        const sqlSale = "INSERT INTO sales (date, total_price, user_name) VALUES (?, ?, ?)";
        const [saleResult] = await connection.query(sqlSale, [date, total_price, user_name]);

        // 2. Obtenemos el id de la venta recien creada
        const saleId = saleResult.insertId;

        // 3. Insertamos los productos en "product_sales"
        const sqlProductSale = "INSERT INTO product_sales (product_id, sale_id) VALUES (?, ?)";

        // Como tenemos una relacion N a N, debemos insertar una fila por cada producto vendido
        for (const productId of products) {
            await connection.query(sqlProductSale, [productId, saleId]);
        }

        // Respuesta de exito
        res.status(201).json({
            message: "Venta registrada con exito!"
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        })
    }
})


app.listen(PORT, () => {
    console.log(`Servidor corriendo desde el puerto ${PORT}`)
});