// Logica para trabajar con archivos y rutas de proyecto -> Creando a mano con ESM dirname y filename

// Importacion de modulos para trabajar con rutas
import { fileURLToPath } from "url"; // Convierte una URL de archivo file:// a una ruta de sistema de archivos
import { dirname, join } from "path"; // dirname devuelve del directorio de una ruta y join unifica rutas

// Obtener el nombre de archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtener el directorio del archivo actual
const __dirname = join(dirname(__filename), "../../../"); 

// Exportamos el directorio base calculado y la funcion "join" para construir rutas relativas
export {
    __dirname,
    join
}