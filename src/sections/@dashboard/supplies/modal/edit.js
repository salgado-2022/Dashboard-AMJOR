import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";
import Swal from 'sweetalert2';
import axios from "axios";

function EditInsumo(props) {
    const { selectedInsumoID, onHide, show } = props;
    const id = selectedInsumoID;

    const [isChecked, setIsChecked] = useState(false); // false = 0

    const [values, setValues] = useState({
        NombreInsumo: '',
        Descripcion: '',
        PrecioUnitario: '',
        ID_Estado: ''
    });

    const handleInput = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === 'checkbox') {
            setIsChecked(checked);
            setValues(prev => ({ ...prev, [name]: checked ? 1 : 2 }));
        } else {
            setValues(prev => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        if (show) {
            axios.get('http://localhost:4000/api/admin/insumos/insullamada/' + id)
                .then(res => {
                    console.log(res);
                    setValues(prevValues => ({
                        ...prevValues,
                        NombreInsumo: res.data[0].NombreInsumo,
                        Descripcion: res.data[0].Descripcion,
                        PrecioUnitario: res.data[0].PrecioUnitario,
                        ID_Estado: res.data[0].ID_Estado
                    }));
                    setIsChecked(res.data[0].ID_Estado === 1);
                })
                .catch(err => console.log(err));
        }
    }, [id, show]);

    const handleUpdate = (event) => {
        event.preventDefault();
        axios.put('http://localhost:4000/api/admin/insumos/insumoedit/' + id, values)
            .then(res => {
                console.log(res);
                Swal.fire({
                    title: 'Modificado Correctamente',
                    text: "Tu insumo ha sido modificado correctamente",
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(function () { window.location = "supplies"; }, 670);
            })
            .catch(err => console.log(err));
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
                    Editar insumo
                </Modal.Title>
                <Button variant="secondary" onClick={props.onHide} className="close">
                    <span aria-hidden="true">&times;</span>
                </Button>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <form onSubmit={handleUpdate} id="editarInsumo">
                        <div className="form-group">
                            <label htmlFor="NombreInsumo">Nombre</label>
                            <input type="text" className="form-control" id="NombreInsumo" name="NombreInsumo" value={values.NombreInsumo} onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Descripcion">Descripción</label>
                            <input type="text" className="form-control" id="Descripcion" name="Descripcion" value={values.Descripcion} onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="PrecioUnitario">Precio</label>
                            <input type="text" className="form-control" id="PrecioUnitario" name="PrecioUnitario" value={values.PrecioUnitario} onChange={handleInput} />
                        </div>
                        <div className="form-check" style={{ marginBottom: '7px' }}>
                            <input type="checkbox" className="form-check-input" id="ID_Estado" name="ID_Estado" checked={isChecked} onChange={handleInput} />
                            <label className="form-check-label" htmlFor="estadoInsumo">Disponible</label>
                        </div>
                        <button type="submit" className="btn btn-primary" id="modInsumo">Modificar</button> &nbsp;
                        <button type="reset" className="btn btn-dark" id="cancelarInsumo" onClick={props.onHide}>Cancelar</button>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export { EditInsumo };
