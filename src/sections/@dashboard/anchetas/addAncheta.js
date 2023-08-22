import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { Container, Grid, Button, TextField, Typography, Stack, Card, CardHeader, CardContent, List, ListItem, ListItemIcon, ListItemText, IconButton, DialogActions} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Iconify from "../../../components/iconify";
import Swal from 'sweetalert2';
import axios from "axios";

//-----------------------------------------------------------------------------------------------------------
import { Insumoscontext } from './context/Context'

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

    const [nombreError, setNombreError] = useState('');
    const [descripcionError, setDescripcionError] = useState('');

    const [imageUrl, setImageUrl] = useState(null);
    const [imageHolder, setImageHolder] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    const Globalstate = useContext(Insumoscontext);
    const state = Globalstate.state;
    const dispatch = Globalstate.dispatch;
    const { state: insumosState } = useContext(Insumoscontext);
    const insumosAgregados = insumosState.map((insumo) => insumo.ID_Insumo);

    const [data, setData] = useState([]);

    const fetchData = () => {
        axios
            .get("http://localhost:4000/api/admin/insumos")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => console.log(err));
    };

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
        fetchData();
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
                window.location("/dashboard/anchetas");
            }

            if (!selectedFile) {
                setValues((prev) => ({ ...prev, image: imageHolder }));
                setImageUrl(URL.createObjectURL(imageHolder));
            }
        }

        if (name === 'NombreAncheta') {
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
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (nombreError === "" && descripcionError === "") {
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
                            timer: 1500
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
        setNombreError(''); 
        setDescripcionError(''); 
        dispatch({ type: 'ResetInsumos' });
    };

    return (
    <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>Crear ancheta </Typography>
            <Link to="/dashboard/anchetas">
                <Button variant="contained" startIcon={<Iconify icon="ph:arrow-left" />}>
                Volver
                </Button>
            </Link>
        </Stack>
        <form onSubmit={handleSubmit} onReset={handleReset} encType="multipart/form-data">
            <Grid container spacing={2}>
                <Grid item md={5}>
                    <TextField fullWidth style={{ marginBottom: '16px' }} label="Nombre" variant="outlined" id="NombreAncheta" name="NombreAncheta" value={values.NombreAncheta} onChange={handleInput} error={nombreError !== ''}  helperText={nombreError} />
                    <TextField fullWidth style={{ marginBottom: '16px' }} label="Descripción" variant="outlined" id="Descripcion" name="Descripcion" value={values.Descripcion} onChange={handleInput} error={descripcionError !== ''}  helperText={descripcionError}/>
                    <Card elevation={3} style={{ marginBottom: '16px' }}>
                        <CardHeader component="label" sx={{backgroundColor: isImageUploaded ? "#f5f5f5" : "#f5f5f5", cursor: isImageUploaded ? "auto" : "pointer", textAlign: "center", padding: "24px", marginBottom: "0px"}}
                            title={isImageUploaded ? (<img src={imageUrl} alt="" style={{ maxWidth: "300px", margin: "0 auto" }}/>
                            ) : (
                            <div style={{fontSize: "62px", marginBottom: "21px"}}>
                                <input type="file" className="form-control" id="image" name="image" accept=".jpg, .png" onChange={handleInput} style={{ display: "none" }} />
                                <Iconify icon="fluent:image-add-20-regular" class="big-icon" />
                            </div>  
                            )}
                        />
                        {state.length === 0 ? (<CardContent sx={{textAlign: "center", color: "#aab4be"}}><Typography variant="body1">Sin Insumos</Typography></CardContent>
                        ) : (
                        <List sx={{ maxHeight: state.length >= 4 ? "300px" : "none", overflowY: "auto" }}>
                            {state.map((insumo) => (
                                <ListItem key={insumo.ID_Insumo} secondaryAction={
                                    <div>
                                        <IconButton color="primary" onClick={() => dispatch({ type: 'Decrement', payload: insumo })}>
                                            <RemoveIcon />
                                        </IconButton>
                                        <TextField type="number" value={insumo.Cantidad} onChange={(event) => dispatch({ type: "SetCantidad", payload: { idInsumo: insumo.ID_Insumo, cantidad: event.target.value } })} inputProps={{ style: { textAlign: 'center', width: '25px', height: '10px' } }}/>
                                        <IconButton color="primary" onClick={() => dispatch({ type: 'Increment', payload: insumo })}>
                                            <AddIcon />
                                        </IconButton>
                                    </div>
                                }>
                                    <ListItemIcon aria-label="delete" onClick={() => dispatch({ type: 'RemoveInsumo', payload: insumo })}>
                                        <IconButton color="primary" sx={{fontSize: "24px"}}>
                                            <Iconify icon="ph:trash" class="big-icon" />
                                        </IconButton>
                                    </ListItemIcon>
                                    <Grid item sm={6} xs={5}>
                                        <ListItemText
                                            primary={insumo.NombreInsumo}
                                            secondary={formatPrice(insumo.Precio * insumo.Cantidad)}
                                        />
                                    </Grid>  
                                </ListItem>
                            ))}
                        </List>   
                        )}
                    </Card>
                    <Typography variant="h5">Total: {formatPrice(Precio)}</Typography>
                    <DialogActions> 
                        <Button type="submit" variant="contained" color="primary" fullWidth>Crear Ancheta</Button>
                        <Button type="reset" variant="contained" color="secondary" fullWidth>Cancelar</Button>
                    </DialogActions> 
                </Grid>
                <Grid item md={7}>
                    <List sx={{ maxHeight: data.length >= 10 ? "550px" : "none", overflowY: "auto", backgroundColor: '#ffffff'}}>
                        {data && data.map((insumo) => {
                            if (insumosAgregados.includes(insumo.ID_Insumo)) {
                                return null;
                            }

                            if (insumo.Estado === 'Agotado') {
                                return null;
                            }

                            insumo.Cantidad = 1;
                            insumo.Precio = insumo.PrecioUnitario;

                            return (
                                <ListItem key={insumo.ID_Insumo} secondaryAction={
                                    <Typography variant="subtitle2">{formatPrice(insumo.Precio)}</Typography>
                                }>
                                    <ListItemIcon onClick={() => dispatch({ type: 'AddInsumo', payload: insumo })}>
                                        <IconButton color="primary" sx={{fontSize: "32px"}}>
                                            <Iconify icon="typcn:plus" class="big-icon" />
                                        </IconButton>
                                    </ListItemIcon>
                                    <Grid item sm={8} xs={8}>
                                        <ListItemText 
                                            primary={insumo.NombreInsumo}/>
                                    </Grid>  
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </Grid>
        </form>
    </Container>
    );
}

export { AddAncheta };
