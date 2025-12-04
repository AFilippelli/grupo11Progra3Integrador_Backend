let getProducts_form = document.getElementById("getProducts-form");
let listado_productos = document.getElementById("listado-productos");
let contenedor_formulario = document.getElementById("contenedor-formulario");


getProducts_form.addEventListener("submit", async (event) => {
    
    event.preventDefault(); // Prevenimos el envio por defecto del formulario

    // event.target -> trae todo el formulario HTML al que se le asigno el evento
    //console.log(event.target)

    // Primer paso: Extraer toda la informacion del formulario en un objeto FormData (en event.target -> le pasamos todo el formulario a FormData)
    let formData = new FormData(event.target); // FormData { id → "2" }
    console.log(formData);

    // Segundo paso: Convertimos el objeto FormData en un objeto normal JS para poder extraer la informacion comodamente
    let data = Object.fromEntries(formData.entries()); // Object { id: "2" }
    console.log(data);

    let idProducto = data.id;
    console.log(idProducto); // Ya extrajimos el valor del campo

    try {
        // Hago el fetch a la url personalizada
        let response = await fetch(`http://localhost:3000/api/productos/${idProducto}`);
        console.log(response);

        // Proceso los datos que me devuelve el servidor
        let datos = await response.json();
        console.log(datos);

        // Extraigo el producto que devuelve payload
        let producto = datos.payload[0]; // Apuntamos a la respuesta, vamos a payload que trae el array con el objeto y extraemos el primer y unico elemento

        // Le pasamos el producto a una funcion que lo renderice en la pantalla
        mostrarProducto(producto); 

    } catch (error) {
        console.error("Error: ", error);
    }

    /* Que es FormData?

    En JavaScript, FormData es un objeto que permite crear un conjunto de pares clave-valor que representan los campos de un formulario HTML y sus valores, facilitando su envío a un servidor mediante métodos como fetch o XMLHttpRequest.
    Este objeto replica la funcionalidad de un formulario HTML y se utiliza comúnmente para enviar datos de formularios, incluyendo archivos, de manera dinámica sin recargar la página

    Este objeto es especialmente útil en aplicaciones modernas que requieren enviar datos de forma asincrónica, ya que simplifica el manejo de formularios, incluyendo campos de texto, casillas de verificación, botones de radio y campos de carga de archivos*/
});

function mostrarProducto(producto) {
    // console.table(producto); // El producto se recibe correctamente

    let htmlProducto = `
        <li class="li-listados">
            <img src="${producto.img_url}" alt="${producto.nombre}" class="img-listados">
            <p>Id: ${producto.id}/ Nombre: ${producto.nombre}/ <strong>Precio: $${producto.precio}</strong></p>
        </li>
        <li class="li-botonera">
            <input type="button" id="updateProduct_button" value="Actualizar producto">
        </li>
        `;

    listado_productos.innerHTML = htmlProducto;

    let updateProduct_button = document.getElementById("updateProduct_button");

    updateProduct_button.addEventListener("click", event => {
        crearFormularioPut(event, producto);
    });
}


function crearFormularioPut(event, producto) {

    event.stopPropagation(); // Evitamos la propagacion de eventos
    console.table(producto); // Recibimos el producto para llenar los valores del formulario

    let formularioPutHtml = `
        <form id="updateProducts-form" class="products-form-amplio">

            <input type="hidden" name="id" value="${producto.id}">

            <label for="nameProd">Nombre</label>
            <input type="text" name="nombre" id="nameProd" value="${producto.nombre}" required>
            <br>

            <label for="imageProd">Imagen</label>
            <input type="text" name="img_url" id="imageProd" value="${producto.img_url}" required>
            <br>

            <label for="categoryProd">Categoria</label>
            <select name="tipo" id="categoryProd" required>
                <option value="food">comida</option>
                <option value="drink">bebida</option>
            </select>
            <br>

            <label for="priceProd">Precio</label>
            <input type="number" name="precio" id="priceProd" value="${producto.precio}" required>
            <br>

            <input type="hidden" name="active" value="${producto.active}">

            <input type="submit" value="Actualizar producto">
        </form>
    `;

    contenedor_formulario.innerHTML = formularioPutHtml;

    let updateProducts_form = document.getElementById("updateProducts-form");

    updateProducts_form.addEventListener("submit", event => {
        actualizarProducto(event)
    });
}


async function actualizarProducto(event) {
    event.preventDefault();

    let url = "http://localhost:3000/api/productos";
    // console.log(event.target); // event.target se refiere al formulario que activo el evento
    
    let formData = new FormData(event.target); // Guardamos los datos en un objeto FormData
    console.log(formData);

    let data = Object.fromEntries(formData.entries()); // Transformamos el objeto FormData en un objeto JS
    console.log(data);

    try {
        let response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(response);

        let result = await response.json(); 

        // Si la response que hacemos, devuelve OK, quiere decir que la peticion fue exitosa y pasaremos a hacer lo siguiente
        if(response.ok) { 
            console.log(result.message);
            alert(result.message);

            // Vaciamos el formulario y el listado
            listado_productos.innerHTML = "";
            contenedor_formulario.innerHTML = "";

        } else {
            console.error("Error: ", error.message);
            alert(error.message);
        }

    } catch (error) {
        console.error("Error al enviar los datos: ", error);
        alert("Error al procesar la solicitud");
    }


}