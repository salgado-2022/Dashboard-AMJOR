function valdesc(values) {
    let error = {}
    const descripcion_pattern = /^[^<>%$!#&/]*$/

    if (values.Descripcion === "") {
        error.Descripcion = "La descripción es obligatoria"
    } else if (!descripcion_pattern.test(values.Descripcion)) {
        error.Descripcion = "Porfavor ingrese una descripción válida"
    } else {
        error.Descripcion = ""
    }
    return error;
}
export {valdesc}