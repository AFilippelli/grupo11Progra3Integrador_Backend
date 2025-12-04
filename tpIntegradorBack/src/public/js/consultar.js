let getProducts_form = document.getElementById("getProducts-form");
let listado_productos = document.getElementById("listado-productos");
let url = "http://localhost:3000/api/productos";


getProducts_form.addEventListener("submit", async (event) => {
    
    event.preventDefault(); // Prevenimos el envio por defecto del formulario

    // Optimizacion, validar con un REGEX y limpiar informacion
    
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

        console.log(`Realizamos una peticion GET a ${url}/${idProducto}`);
        
        // Hago el fetch a la url personalizada
        let response = await fetch(`http://localhost:3000/api/productos/${idProducto}`);
        console.log(response);

        // Proceso los datos que me devuelve el servidor
        let result = await response.json();
        console.log(result);

        if(response.ok) {
            // Extraigo el producto que devuelve payload
            let producto = result.payload[0]; // Apuntamos a la respuesta, vamos a payload que trae el array con el objeto y extraemos el primer y unico elemento

            // Le pasamos el producto a una funcion que lo renderice en la pantalla
            mostrarProducto(producto); 

        } else {
            // alert(result.message);
            console.error(result.message)

            // Llamamos a la funcion que imprime un mensaje de error
            mostrarError(result.message);
        }


    } catch (error) {
        console.error("Error: ", error);
    }

    /* Que es FormData?

    En JavaScript, FormData es un objeto que permite crear un conjunto de pares clave-valor que representan los campos de un formulario HTML y sus valores, facilitando su envío a un servidor mediante métodos como fetch o XMLHttpRequest.
    Este objeto replica la funcionalidad de un formulario HTML y se utiliza comúnmente para enviar datos de formularios, incluyendo archivos, de manera dinámica sin recargar la página

    Este objeto es especialmente útil en aplicaciones modernas que requieren enviar datos de forma asincrónica, ya que simplifica el manejo de formularios, incluyendo campos de texto, casillas de verificación, botones de radio y campos de carga de archivos*/
});

function mostrarProducto(producto) {
    console.table(producto); // El producto se recibe correctamente

    let htmlProducto = `
        <li class="li-listados">
            <img src="${producto.img_url}" alt="${producto.nombre}" class="img-listados">
            <p>Id: ${producto.id}/ Nombre: ${producto.nombre}/ <strong>Precio: $${producto.precio}</strong></p>
        </li>
        `;

    listado_productos.innerHTML = htmlProducto;
}


function mostrarError(message) {
    listado_productos.innerHTML = `
        <li class="mensaje-error">
            <p>
                <strong>Error:</strong>
                <span>${message}</span>
            </p>
        </li>
    `;
}