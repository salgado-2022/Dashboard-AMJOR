import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import { Modal, TextField, Button, DialogActions, Grid } from '@mui/material';
import "../../../../styles/modal.css";

function AddInsumo({ open, onClose, fetchData }) {
    const [nombreError, setNombreError] = useState('');
    const [descripcionError, setDescripcionError] = useState('');
    const [precioError, setPrecioError] = useState('');


    /* Definición de una variable de estado llamada `values` y una función para actualizarla llamada `setValues`. El
    valor inicial de `valores` es un objeto con cuatro propiedades: `NombreInsumo`, `Descripcion`,
    `Precio Unitario`, y `ID_Estado`. Estas propiedades se establecen inicialmente en cadenas vacías para
    `NombreInsumo` y `Descripcion`, ya la cadena `'2'` para `ID_Estado`. */
    const [values, setValues] = useState({
        NombreInsumo: '',
        Descripcion: '',
        PrecioUnitario: '',
        ID_Estado: '2'
    });

    const initialValues = {
        NombreInsumo: '',
        Descripcion: '',
        PrecioUnitario: '',
        ID_Estado: '2'
    };

    const handleCloseModal = () => {
        onClose(); // Cerrar la modal
        setValues(initialValues); //Establece los valores de los input a sus valores iniciales
        setNombreError(''); // Elimina la validación al cerrar el modal
        setDescripcionError(''); // Elimina la validación al cerrar el modal
        setPrecioError(''); // Elimina la validación al cerrar el modal
      };
      
    /* `valoresiniciales` es una constante que contiene un objeto con los valores iniciales para los campos de entrada en
    la forma. Estos valores son cadenas vacías para `NombreInsumo`, `Descripcion` y `PrecioUnitario`,
    y la cadena `'2'` para `ID_Estado`. Esta constante se utiliza para comprobar si el formulario ha sido modificado.
    por el usuario antes de enviarlo, y restablecer el formulario a sus valores iniciales cuando el usuario hace clic
    el botón "Reiniciar".*/


    /* Este bloque de código utiliza el enlace `useEffect` para actualizar el estado de la variable `isChecked` según
    sobre el valor de `valores.ID_Estado`. Se activa cada vez que cambia el estado de los `valores`. El propósito
    de este código es para asegurarse de que la casilla de verificación esté marcada o desmarcada según el valor inicial de
    `ID_Estado` cuando el componente se renderiza por primera vez. */
    useEffect(() => {
    }, [values]);

    /**
    * La función maneja los cambios de entrada y actualiza el estado en consecuencia, incluida la casilla de verificación de manejo
      * entradas.
      * @param event: el parámetro de evento es un objeto que contiene información sobre el evento que
      * activó la función.
     */
    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
        if (name === 'NombreInsumo') {
            if (!value) {
                setNombreError('El nombre es requerido');
            } else if (!/^[^<>%$"!#&/=]*$/.test(value)) {
                setNombreError('Por favor ingrese un nombre válido');
            } else {
                setNombreError('');
            }
        } else if (name === 'Descripcion') {
            if (!value) {
                setDescripcionError('La descripción es requerida');
            } else if (!/^[^<>%$!#&/]*$/.test(value)) {
                setDescripcionError('Por favor ingrese una descripción válida');
            } else {
                setDescripcionError('');
            }
        } else if (name === 'PrecioUnitario') {
            if (!value) {
                setPrecioError('El precio es requerido');
            } else if (!/^[0-9\s]*$/.test(value)) {
                setPrecioError('Ingrese un precio válido');
            } else {
                setPrecioError('');
            }
        }
    };

    /**
* Esta función maneja el envío de un formulario para crear un nuevo "insumo" (entrada) y envía un post
  * request a un servidor usando axios.
  * @param event: el parámetro event es un objeto que representa el evento que activó el
  * función. En este caso, es el evento de envío del formulario. La función está usando preventDefault()
  * método para evitar el comportamiento predeterminado de envío de formularios.
  * @returns Si se cumplen las condiciones de la instrucción if, no se devuelve nada. Si las condiciones son
  * no se cumple, se llama a la función axios.post() y se devuelve una promesa. Dependiendo del resultado de
  * la promesa, ya sea un mensaje de éxito o de error, se muestra usando la función Swal.fire().
 */
    const handleSubmit = (event) => {
        event.preventDefault();
        if ( nombreError === "" && descripcionError === "" && precioError === "") {
            if (
                JSON.stringify(values) === JSON.stringify(initialValues) ||
                !values.NombreInsumo ||
                !values.Descripcion ||
                !values.PrecioUnitario
            ) {
                return;
            }

            axios.post('http://localhost:4000/api/crearInsumo', values)
                .then(res => {
                    if (res.data.Status === "Success") {
                        Swal.fire({
                            title: 'Creado Correctamente',
                            text: "Tu insumo ha sido creado correctamente",
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        onClose();
                        fetchData();
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Hubo un problema al registrar el insumo.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                })
                .then(err => console.log(err));
        }
    };

    return (
        <Modal open={open} onClose={handleCloseModal}>
            <div className="modal-container">
                <h2 className="modal-title">Crear Insumo</h2>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth style={{ marginBottom: '16px' }} label="Nombre" variant="outlined" id="NombreInsumo" name="NombreInsumo" value={values.NombreInsumo} onChange={handleInput} error={nombreError !== ''}  helperText={nombreError}/>
                            <TextField fullWidth style={{ marginBottom: '16px' }} label="Descripción" variant="outlined" id="Descripcion" name="Descripcion" value={values.Descripcion} onChange={handleInput} error={descripcionError !== ''}  helperText={descripcionError}/>
                            <TextField fullWidth style={{ marginBottom: '16px' }} label="Precio" variant="outlined" id="PrecioUnitario" name="PrecioUnitario" value={values.PrecioUnitario} onChange={handleInput} error={precioError !== ''}  helperText={precioError}/>
                        </Grid>
                    </Grid>
                    <DialogActions> 
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '8px' }}>Crear Insumo</Button>
                        <Button variant="contained" color="secondary" fullWidth onClick={handleCloseModal} style={{marginTop: '8px'}}>Cancelar</Button>
                    </DialogActions> 
                </form>           
            </div>        
        </Modal>
    );   
}

export { AddInsumo };
