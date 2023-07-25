import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";
import Swal from 'sweetalert2';
import axios from "axios";

//------------------------------------------------------------------------------------------------

import {valnombre} from '../validations/valnombre'
import {valdesc} from '../validations/valdesc'
import {valprecio} from '../validations/valprecio'



function AddInsumo(props) {
    const { onHide, show } = props;

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

    /* `valoresiniciales` es una constante que contiene un objeto con los valores iniciales para los campos de entrada en
    la forma. Estos valores son cadenas vacías para `NombreInsumo`, `Descripcion` y `PrecioUnitario`,
    y la cadena `'2'` para `ID_Estado`. Esta constante se utiliza para comprobar si el formulario ha sido modificado.
    por el usuario antes de enviarlo, y restablecer el formulario a sus valores iniciales cuando el usuario hace clic
    el botón "Reiniciar".*/
    const initialValues = {
        NombreInsumo: '',
        Descripcion: '',
        PrecioUnitario: '',
        ID_Estado: '2'
    };

    /* Estas líneas de código definen variables de estado y una referencia para el componente `CrearInsumo`. */
    const [errorname, setErrorname] = useState({});
    const [errordesc, setErrordesc] = useState({});
    const [errorprice, setErrorprice] = useState({});

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
    };

    /**
    * La función `handleBlurname` establece un mensaje de error para un campo de entrada de nombre en función de su valor.
      * @param event: el parámetro de evento es un objeto que contiene información sobre el evento que
      * activó la función.
     */
    const handleBlurname = (event) => {
        setErrorname(valnombre(values));
    };

    /**
* La función maneja el evento de desenfoque y establece un mensaje de error basado en el valor de entrada.
  * @param event: el parámetro de evento es un objeto que contiene información sobre el evento que
  * activó la función.
 */
    const handleBlurdesc = (event) => {
        setErrordesc(valdesc(values));
    };

    /**
    * La función `handleBlurprice` establece un mensaje de error basado en el valor de `valprecio(values)` cuando
      * un campo de entrada pierde el foco.
      * @param event: el parámetro de evento es un objeto que contiene información sobre el evento que
      * activó la función.
     */
    const handleBlurprice = (event) => {
        setErrorprice(valprecio(values));
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
        if (
            errorname.NombreInsumo === "" &&
            errordesc.Descripcion === "" &&
            errorprice.PrecioUnitario === ""
        ) {
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
                        setTimeout(function () { window.location = "supplies"; }, 670);
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

    /**
  * La función `handleReset` establece los valores de una variable de estado a sus valores iniciales.
  */
    const handleReset = () => {
        setValues(initialValues);
    };

    return (
        <Modal
            onHide={onHide}
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter" className="text-black">
                    Agregar Insumo
                </Modal.Title>
                <Button variant="secondary" onClick={props.onHide} className="close">
                    <span aria-hidden="true">&times;</span>
                </Button>
            </Modal.Header>
            <Modal.Body>

                <div>
                    <form onSubmit={handleSubmit} onReset={handleReset}>
                        &nbsp;
                        <h2 className="text-black" id="title">Crear Insumo</h2>
                        <div className="form-group">
                            <label htmlFor="NombreInsumo">Nombre</label>
                            <input type="text" className="form-control" id="NombreInsumo" name="NombreInsumo" value={values.NombreInsumo} onChange={handleInput} onBlur={handleBlurname} />
                            {errorname.NombreInsumo && <span className="text-danger"> {errorname.NombreInsumo}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="Descripcion">Descripción</label>
                            <input type="text" className="form-control" id="Descripcion" name="Descripcion" value={values.Descripcion} onChange={handleInput} onBlur={handleBlurdesc} />
                            {errordesc.Descripcion && <span className="text-danger"> {errordesc.Descripcion}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="PrecioUnitario">Precio</label>
                            <input type="text" className="form-control" id="PrecioUnitario" name="PrecioUnitario" value={values.PrecioUnitario} onChange={handleInput} onBlur={handleBlurprice} />
                            {errorprice.PrecioUnitario && <span className="text-danger"> {errorprice.PrecioUnitario}</span>}
                        </div>
                        <button type="submit" className="btn btn-primary" id="crearInsumo">Crear</button> &nbsp;
                        <button type="reset" className="btn btn-dark" id="cancelarInsumo" >Cancelar</button>
                    </form>
                </div>

            </Modal.Body>
        </Modal>
    );
}

export { AddInsumo };
