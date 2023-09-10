import React, { useState, useEffect } from 'react';
import axios from "axios";

import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';

// import Swal from 'sweetalert2';
import Swal from 'sweetalert2';

// Cookies
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

import {
    Box,
    Card,
    Stack,
    Container,
    Typography,
    TextField,
    CardHeader,
    Button,
    CardMedia,
    IconButton

} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import Iconify from '../components/iconify';

// CSS
import '../utils/style.css'


const NoNumberArrowsTextField = styled(TextField)(({ theme }) => ({
    '& input[type=number]': {
        MozAppearance: 'textfield', // Firefox
        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
        },
    },
}));

export default function Profile() {
    const apiUrl = process.env.REACT_APP_AMJOR_API_URL;
    const deployApiUrl = process.env.REACT_APP_AMJOR_DEPLOY_API_URL;

    const [imageUrlEdit, setImageUrlEdit] = useState(null);
    const [oldImage, setOldImage] = useState('');
    const [values, setValues] = useState({
        Documento: '',
        Nombre: '',
        Apellido: '',
        Telefono: '',
        correo: '',
        img: ''
    });

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        const token = Cookies.get('token');
        if (token) {
            const decodedToken = jwt_decode(token);
            axios.get(`${apiUrl}/api/perfil/user/${decodedToken.userId}`)
                .then((res) => {
                    setValues(prevValues => ({
                        ...prevValues,
                        Documento: res.data[0].Documento,
                        Nombre: res.data[0].Nombre,
                        Apellido: res.data[0].Apellido,
                        Telefono: res.data[0].Telefono,
                        correo: res.data[0].correo,
                        img: res.data[0].img
                    }));
                    setOldImage(res.data[0].img);
                    setImageUrlEdit(null);
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const handleReset = () => {
        fetchData();
    }

    const handleInput = (event) => {
        const { name, value, type } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));

        if (type === 'file') {
            const selectedFileEdit = event.target.files[0];
            if (selectedFileEdit) {
                setImageUrlEdit(URL.createObjectURL(selectedFileEdit));
                setValues((prev) => ({ ...prev, image: selectedFileEdit }));
            }
        }

    }

    return (
        <>
            <Helmet>
                <title>Mi Perfil | AMJOR</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Mi Perfil
                    </Typography>
                </Stack>

                <form onReset={handleReset} encType="multipart/form-data">
                    <Grid container spacing={3}>
                        <Grid xs={12} md={4}>
                            <Card>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ paddingTop: "80px", marginRight: "24px", marginLeft: "24px", marginBottom: "40px" }}>

                                        {values.img && (
                                            <div>
                                                <CardMedia className="hover-card-header" component="img" alt="" height="235px" image={imageUrlEdit || `${deployApiUrl}/usuario/` + values.img} />
                                                <IconButton color="trash" sx={{ position: "absolute", top: "0px", right: "8px" }} onClick={() => {
                                                    setImageUrlEdit(null);
                                                    setValues((prev) => ({ ...prev, img: null }));
                                                }}>
                                                    <Iconify icon="mingcute:delete-fill" class="big-icon" />
                                                </IconButton>
                                            </div>
                                        )}
                                        {!values.img && (
                                            <CardHeader
                                                component="label"
                                                className="hover-card-header"
                                                sx={{
                                                    backgroundColor: "#f5f5f5",
                                                    cursor: "pointer",
                                                    textAlign: "center",
                                                    padding: "24px",
                                                    marginBottom: "0px",
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    height: "150px",
                                                    width: "150px",
                                                    backgroundImage: `https://api.amjor.shop/usuario/${values.img}`
                                                }}
                                                title={
                                                    <div style={{ fontSize: "48px", marginBottom: "21px" }}>
                                                        <input type="file" className="form-control" id="image" name="image" accept=".jpg, .png, .jpeg" style={{ display: "none" }} />
                                                        <Iconify icon="fluent:image-add-20-regular" className="big-icon" />
                                                    </div>
                                                }
                                            />
                                        )}
                                    </div>
                                    <Typography align="center" style={{ paddingBottom: '30px' }}>
                                        Permitido *.jpeg, *.jpg, *.png
                                        <br />
                                        tamaño máximo de 3,1 MB
                                    </Typography>
                                </div>
                            </Card>
                        </Grid>

                        <Grid xs={12} md={8}>
                            <Box display="flex" justifyContent="center">
                                {/* Inicio de la Card */}
                                <Card>
                                    <CardHeader title={"Información personal"} />
                                    <Box p={3}> {/* Agrega espacio interno a la Card */}
                                        <Grid container spacing={3}>
                                            <Grid xs={12} sm={6}>
                                                <NoNumberArrowsTextField
                                                    label="Documento"
                                                    name="Documento"
                                                    type="number"
                                                    margin="dense"
                                                    fullWidth
                                                    value={values.Documento}
                                                    onChange={handleInput}
                                                    color="primary"
                                                    inputProps={{
                                                        inputMode: 'numeric',
                                                        pattern: '[0-9]*',
                                                    }}
                                                />
                                                {/* Mostrar mensaje de error si es necesario */}
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    label="Nombre"
                                                    name="Nombre"
                                                    type="text"
                                                    margin="dense"
                                                    color="primary"
                                                    fullWidth
                                                    value={values.Nombre}
                                                    onChange={handleInput}

                                                />
                                                {/* Mostrar mensaje de error si es necesario */}
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    label="Apellidos"
                                                    name="Apellido"
                                                    type="text"
                                                    margin="dense"
                                                    color="primary"
                                                    fullWidth
                                                    value={values.Apellido}
                                                    onChange={handleInput}
                                                />
                                                {/* Mostrar mensaje de error si es necesario */}
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <NoNumberArrowsTextField
                                                    label="Teléfono"
                                                    name="Telefono"
                                                    type="number"
                                                    margin="dense"
                                                    color="primary"
                                                    fullWidth
                                                    value={values.Telefono}
                                                    onChange={handleInput}
                                                />
                                                {/* Mostrar mensaje de error si es necesario */}
                                            </Grid>
                                            <Grid xs={12}>
                                                <TextField
                                                    label="Correo electrónico"
                                                    type='Email'
                                                    name="correo"
                                                    margin="dense"
                                                    color="primary"
                                                    fullWidth
                                                    value={values.correo}
                                                    onChange={handleInput}
                                                />
                                                {/* Mostrar mensaje de error si es necesario */}
                                                <Box mt={2} display="flex" justifyContent="flex-start">
                                                    <Button type="submit" variant="contained" color="primary">Actualizar</Button>
                                                    <Button type="reset" variant="contained" color="secondary" style={{ marginLeft: '16px' }}>Cancelar</Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Card>
                                {/* Fin de la Card */}
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </>
    );
}
