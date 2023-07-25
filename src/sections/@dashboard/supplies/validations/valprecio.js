function valprecio(values) {
    let error = {}
    const precio_pattern = /^[0-9\s]*$/

    if (values.PrecioUnitario === "") {
        error.PrecioUnitario = "El precio es obligatorio"
    } else if (!precio_pattern.test(values.PrecioUnitario)) {
        error.PrecioUnitario = "Porfavor ingrese un precio válido"
    } else {
        error.PrecioUnitario = ""
    }
    return error;
}

export {valprecio}