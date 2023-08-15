import React, { useState, useEffect, useContext } from "react";
import { Container, Grid, Button, TextField, Typography, Stack } from "@mui/material";
import { Link } from 'react-router-dom';
import Iconify from "../../../../components/iconify";
import Swal from 'sweetalert2';
import axios from "axios";

//-----------------------------------------------------------------------------------------------------------
import { Insumoscontext } from '../context/Context'

function AddAncheta() {

    const [values, setValues] = useState({
        NombreAncheta: '',
        Descripcion: '',
        PrecioUnitario: '',
        ID_Estado: '2',
        image: ''
    });

    const initialValues = {
        NombreAncheta: '',
        Descripcion: '',
        PrecioUnitario: '',
        ID_Estado: '2',
        image: ''
    };

    const [errorname, setErrorname] = useState({});
    const [errordesc, setErrordesc] = useState({});

    const [imageUrl, setImageUrl] = useState(null);
    const [imageHolder, setImageHolder] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    const Globalstate = useContext(Insumoscontext);
    const state = Globalstate.state;
    const dispatch = Globalstate.dispatch;

    const states = state.map(obj => ({ idInsumo: obj.ID_Insumo, cantidad: obj.Cantidad, precio: obj.PrecioUnitario * obj.Cantidad }));

    const Precio = state.reduce((Precio, insumo) => {
        return Precio + insumo.PrecioUnitario * insumo.Cantidad;
    }, 0)

    const formatPrice = (price) => {
        return price.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        });
    };


    useEffect(() => {
        return () => {
            dispatch({ type: 'ResetInsumos' });
        };
    }, [dispatch]);

    const handleInput = (event) => {
        const { name, value, type } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));

        if (type === 'file') {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setImageUrl(URL.createObjectURL(selectedFile));
                setImageHolder(selectedFile);
                setValues((prev) => ({ ...prev, image: selectedFile }));
                setIsImageUploaded(true);
            }

            if (!selectedFile) {
                setValues((prev) => ({ ...prev, image: imageHolder }));
                setImageUrl(URL.createObjectURL(imageHolder));
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (
            errorname.NombreAncheta === "" &&
            errordesc.Descripcion === ""
        ) {
            if (state.length === 0) {
                Swal.fire({
                    title: 'Sin Insumos',
                    text: 'No has agregado insumos a la ancheta',
                    icon: 'warning',
                    showConfirmButton: false,
                    timer: 2000
                });
                return;
            }

            if (!values.image) {
                Swal.fire({
                    title: 'No hay Imagen',
                    text: "Debes subir una imagen de la ancheta",
                    icon: 'warning',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }

            if (
                JSON.stringify(values) === JSON.stringify(initialValues) ||
                !values.NombreAncheta ||
                !values.Descripcion
            ) {
                return;
            }
            const formdata = new FormData();
            formdata.append('NombreAncheta', values.NombreAncheta);
            formdata.append('Descripcion', values.Descripcion);
            formdata.append('PrecioUnitario', Precio.toString());
            formdata.append('Insumos', JSON.stringify(states))
            formdata.append('image', values.image);
            axios.post('http://localhost:4000/api/crearAncheta', formdata)
                .then(res => {
                    if (res.data.Status === "Success") {
                        Swal.fire({
                            title: 'Creado Correctamente',
                            text: "Tu ancheta ha sido creada correctamente",
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                            customClass: {
                                popup: 'custom-swal-alert' // Aquí pasamos la clase personalizada
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Hubo un problema al registrar la ancheta.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                })
                .then(err => console.log(err));
        }
    };

    const handleReset = () => {
        setValues(initialValues);
        setImageUrl(null);
        setIsImageUploaded(false);
        dispatch({ type: 'ResetInsumos' });
    };


    return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Crear Ancheta
          </Typography>
          <Link to="/dashboard/anchetas">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Volver
            </Button>
          </Link>
        </Stack>
                        <form onSubmit={handleSubmit} onReset={handleReset} encType="multipart/form-data">
                            <Grid container spacing={2}>
                                <Grid item md={5}>
                                    <TextField fullWidth style={{ marginBottom: '16px' }} label="Nombre" variant="outlined" id="NombreAncheta" name="NombreAncheta" value={values.NombreAncheta} onChange={handleInput} />
                                    <TextField fullWidth style={{ marginBottom: '16px' }} label="Descripción" variant="outlined" id="Descripcion" name="Descripcion" value={values.Descripcion} onChange={handleInput}/>
                                </Grid>
                                <Grid item md={7}>
                                <div className="card-header d-flex justify-content-center">
                                    {isImageUploaded ? (
                                        <img src={imageUrl} alt="" style={{ marginTop: "10px", maxWidth: "200px", marginBottom: "10px" }} />
                                    ) : (
                                        <div className="card-body d-flex justify-content-center align-items-center"><i className="icon-image" style={{ fontSize: "32px" }}></i>&nbsp;</div>
                                    )}
                                </div>
                                {state.length === 0 ? (
                                    <div className="card">
                                        <div className=" card-body d-flex justify-content-center">Sin Insumos</div>
                                    </div>
                                ) : (
                                    <ul className="list-group">
                                        {state.map((insumo, index) => {
                                            return (
                                                <li key={insumo.ID_Insumo} className="list-group-item">
                                                    <div className="row">
                                                        <div className="col-md-auto d-flex align-items-center">
                                                            <a href="#!" className="icon-trash-o" style={{ fontSize: "18px" }} onClick={() => dispatch({ type: 'RemoveInsumo', payload: insumo })}> </a>
                                                        </div>
                                                        <div className="col-6">
                                                            {insumo.NombreInsumo}
                                                            <div style={{ fontWeight: "600", fontSize: "14px" }}>{formatPrice(insumo.Precio * insumo.Cantidad)}</div>
                                                        </div>
                                                        <div className="col d-flex align-items-center" >
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">
                                                                    <button className="btn btn-outline-primary btn-counter" type="button" onClick={() => dispatch({ type: 'Decrement', payload: insumo })}>&minus;</button>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    className="form-control sm text-center"
                                                                    value={insumo.Cantidad}
                                                                    placeholder=""
                                                                    onChange={(event) =>
                                                                        dispatch({
                                                                            type: "SetCantidad",
                                                                            payload: { idInsumo: insumo.ID_Insumo, cantidad: event.target.value },
                                                                        })
                                                                    }
                                                                />
                                                                <div className="input-group-append">
                                                                    <button className="btn btn-outline-primary btn-counter" type="button" onClick={() => dispatch({ type: 'Increment', payload: insumo })}>&#43;</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                                </Grid>
                            </Grid>
                            
                            <div className="row">
                                <div className="form-group col-4">
                                    <button type="button" className="btn btn-add" id="agregarInsumo">Agregar Insumos</button>
                                </div>&nbsp; &nbsp;&nbsp;
                                <div className="form-group col-6">
                                    <input type="file" className="form-control" id="image" name="image" accept=".jpg, .png" onChange={handleInput} style={{ display: "none" }} />
                                    <label htmlFor="image" className="btn btn-image">
                                        Subir Imagen
                                    </label>
                                </div>
                            </div>
                            <div>
                            </div>
                            <div className="total"><h5 id="totalAncheta">Total: {formatPrice(Precio)}</h5></div>
                            <button type="submit" className="btn btn-primary" id="crearAncheta">Crear</button> &nbsp;
                            <button type="reset" className="btn btn-dark" id="cancelarAncheta">Cancelar</button>
                        </form>
            </Container>
    );
}

export { AddAncheta };
