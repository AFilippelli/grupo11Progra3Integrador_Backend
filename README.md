# grupo11Progra3Integrador_Backend
Backend de la aplicación desarrollada para el Proyecto Integrador de Programación III.
Este repositorio contiene la API y lógica de negocio del sistema, encargada de gestionar los datos, las operaciones del servidor y la comunicación con el frontend.

El sistema está dividido en dos partes:

Backend: API, lógica de negocio y acceso a datos.

Frontend: interfaz de usuario que consume esta API.

🚀 Tecnologías utilizadas

Node.js

Express.js

JavaScript

MySQL / Base de datos relacional

REST API

Git / GitHub

📂 Estructura del proyecto
backend/
│
├── controllers/     # Controladores que manejan la lógica de cada endpoint
├── models/          # Modelos de datos y acceso a base de datos
├── routes/          # Definición de rutas de la API
├── middlewares/     # Middlewares de autenticación o validación
├── config/          # Configuración de la base de datos
├── app.js           # Configuración principal de Express
└── server.js        # Punto de entrada del servidor
⚙️ Instalación y ejecución
1️⃣ Clonar el repositorio
git clone https://github.com/AFilippelli/grupo11Progra3Integrador_Backend.git
2️⃣ Entrar al proyecto
cd grupo11Progra3Integrador_Backend
3️⃣ Instalar dependencias
npm install
4️⃣ Configurar variables de entorno

Crear un archivo .env con las variables necesarias:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=nombre_base_de_datos
5️⃣ Ejecutar el servidor
npm start

o en modo desarrollo:

npm run dev
🔗 Endpoints principales

Ejemplos de endpoints que expone la API.

Usuarios
Método	Endpoint	Descripción
GET	/api/users	Obtener todos los usuarios
GET	/api/users/:id	Obtener usuario por ID
POST	/api/users	Crear usuario
PUT	/api/users/:id	Actualizar usuario
DELETE	/api/users/:id	Eliminar usuario
Autenticación
Método	Endpoint	Descripción
POST	/api/auth/login	Iniciar sesión
POST	/api/auth/register	Registrar usuario
🔄 Comunicación con el Frontend

El frontend consume esta API mediante peticiones HTTP (Fetch o Axios).
El backend responde con datos en formato JSON, que luego son procesados y renderizados por la interfaz.


