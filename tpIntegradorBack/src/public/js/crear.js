let altaProducts_form = document.getElementById("altaProducts-form");
let url = "http://localhost:3000/api/productos";

altaProducts_form.addEventListener("submit", event => {

    event.preventDefault(); // Evitamos el envio por defecto del formulario

    let formData = new FormData(event.target); // Obtenemos la data del formulario en un FormData
    console.log(formData);


    let data = Object.fromEntries(formData.entries()); // Parseamos esta data del form data en un objeto JS
    console.log(data);


    // Los datos se enviaran asi, como JSON, parseando nuestros valores de objeto JS
    console.log(JSON.stringify(data));

    // Le enviamos el objeto del formulario a una funcion que se encargara de hacer la peticion fetch
    enviarProducto(data);
});


async function enviarProducto(data) {
    console.table(data); // Recibimos correctamente los datos del formulario

    try {
        // let url = "http://localhost:3000/api/products"
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(response);

        // Procesamos la respuesta que nos devuelve
        let result = await response.json();
        console.log(result);

        // Vamos a verificar si la conexion fue exitosa con un "200" OK o "201" Created
        if(response.ok) {
            console.log(result.message);
            alert(result.message);

        } else { // En caso de que haya otra respuesta distinta de ok
            console.error(result.message);
            alert(result.message);
        }

    } catch (error) {
        console.error("Error al enviar los datos: ", error);
        alert("Error al procesar la solicitud");
    }
}