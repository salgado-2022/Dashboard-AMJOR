import React, { useState, useEffect } from "react";
import { Modal, TextField, Button, DialogActions, Grid, Switch, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import axios from "axios";
import "../../../../styles/modal.css";

function EditInsumo(props) {
    const { selectedInsumoID, onHide, show, fetchData } = props;
    const id = selectedInsumoID;

    const [nombreError, setNombreError] = useState('');
    const [descripcionError, setDescripcionError] = useState('');
    const [precioError, setPrecioError] = useState('');

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

    useEffect(() => {
        const initialValues = {
            NombreInsumo: '',
            Descripcion: '',
            PrecioUnitario: ''
        };
        
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
        if (!show) {
            setValues(initialValues);
            setNombreError('');
            setDescripcionError('');
            setPrecioError('');
        }
    }, [id, show]);

    const handleUpdate = (event) => {
        event.preventDefault();
        if ( nombreError === "" && descripcionError === "" && precioError === "") {
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
                props.onHide();
                fetchData();
            })
            .catch(err => console.log(err));
        }
    };

    return (
        <Modal onClose={onHide} open={show}>
            <div className="modal-container">
                <h2 className= "modal-title">Editar Insumo</h2>
                <form onSubmit={handleUpdate} id="editarInsumo">
                    <Grid container spacing={2}>  
                        <Grid item xs={12}>
                            <TextField fullWidth label="Nombre" style={{ marginBottom: '16px' }} variant="outlined" id="NombreInsumo" name="NombreInsumo" value={values.NombreInsumo} onChange={handleInput} error={nombreError !== ''}  helperText={nombreError}/>
                            <TextField fullWidth label="Descripción" style={{ marginBottom: '16px' }} variant="outlined" id="Descripcion" name="Descripcion" value={values.Descripcion} onChange={handleInput} error={descripcionError !== ''}  helperText={descripcionError}/>
                            <TextField fullWidth label="Precio" style={{ marginBottom: '16px' }} variant="outlined" id="PrecioUnitario" name="PrecioUnitario" value={values.PrecioUnitario} onChange={handleInput} error={precioError !== ''}  helperText={precioError}/>
                            <Grid container alignItems="center" spacing={1}>
                                <Switch color="switch" id="ID_Estado" name="ID_Estado" checked={isChecked}onChange={handleInput}/>
                                <Typography>Disponible</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <DialogActions> 
                        <Button type="submit" variant="contained" color="primary" id="modInsumo" fullWidth style={{ marginTop: '8px' }}>Editar Insumo</Button>
                        <Button variant="contained" color="secondary" fullWidth id="cancelarInsumo" onClick={props.onHide} style={{marginTop: '8px'}}>Cancelar</Button>
                    </DialogActions> 
                </form>
            </div>
        </Modal>
    );
}

export { EditInsumo };
