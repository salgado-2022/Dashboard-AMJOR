function valnomanch(values) {
    let error = {}
    const nombre_pattern = /^[^<>%$"!#&/=]*$/

    if (values.NombreAncheta === "") {
        error.NombreAncheta = "El nombre es obligatorio"
    } else if (!nombre_pattern.test(values.NombreAncheta)) {
        error.NombreAncheta = "Porfavor ingrese un nombre válido"
    } else {
        error.NombreAncheta = ""
    }
    return error;
}

export {valnomanch}