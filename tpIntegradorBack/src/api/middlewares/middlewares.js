//Middleware (de aplicacion) logger -> registramos por console cada peticion que se produce
const loggerUrl = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}]   ${req.method} ${req.url}`);
    //si no llamamos a next, la coneccion se queda aca, next permite seguir procesando la operacion
    next();
};

//Middleware (de ruta) validador de Id -> Se aplican a ciertas urls
const validateId = (req, res, next) => {
    const { id } = req.params;

    //Validamos que el id no sea un numero (para que la consulta no falle)
    if(!id || isNaN(Number(id))){
        return res.status(400).json({
            message: "El id del producto debe ser un numero valido"
        });
    }

    //convertimos el parametro id a un numero entero (porque la url viene como string)
    req.id = parseInt(id, 10);

    console.log("Id validado: ", req.id);

    next();
}

export{
    loggerUrl,
    validateId
}
