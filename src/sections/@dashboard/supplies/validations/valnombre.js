function valnombre(values) {
    let error = {}
    const nombre_pattern = /^[^<>%$"!#&/=]*$/

    if (values.NombreInsumo === "") {
        error.NombreInsumo = "El nombre es obligatorio"
    } else if (!nombre_pattern.test(values.NombreInsumo)) {
        error.NombreInsumo = "Porfavor ingrese un nombre válido"
    } else {
        error.NombreInsumo = ""
    }
    return error;
}

export {valnombre}