import React, { useState, useEffect } from 'react';
import axios from "axios";
import { filter } from 'lodash';

import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';

import { sentenceCase } from 'change-case';
// import Swal from 'sweetalert2';
import Swal from 'sweetalert2';

import {
    Box,
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Collapse,
    ListItemText,
    CircularProgress,
    Divider,
    Tooltip,
    TextField,
    CardMedia,
    CardHeader,

} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';


import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Label from '../components/label';

import { UserListToolbar } from '../sections/@dashboard/user';
import OrderListHead from '../sections/@dashboard/pedidos/OrderListHead';
import { VerInsumosPedido } from '../sections/@dashboard/pedidos/modal/details';

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
    const apiUrlImage = process.env.REACT_APP_AMJOR_API_URL_NEW;


    const [values, setValues] = useState({
        NombreAncheta: '',
        Descripcion: '',
        PrecioUnitario: '',
        ID_Estado: '',
        image: ''
    });


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

                <form>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={4}>
                            <Card>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ paddingTop: "80px", marginRight: "24px", marginLeft: "24px", marginBottom: "40px" }}>
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
                                                width: "150px"
                                            }}
                                            title={
                                                <div style={{ fontSize: "48px", marginBottom: "21px" }}>
                                                    <input type="file" className="form-control" id="image" name="image" accept=".jpg, .png, .jpeg" style={{ display: "none" }} />
                                                    <Iconify icon="fluent:image-add-20-regular" className="big-icon" />
                                                </div>
                                            }
                                        />
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
                                    <Box p={3}> {/* Agrega espacio interno a la Card */}
                                        <Grid container spacing={3}>
                                            <Grid xs={12} sm={6}>
                                                <NoNumberArrowsTextField
                                                    label="Documento"
                                                    name="Documento"
                                                    type="number"
                                                    margin="dense"
                                                    fullWidth
                                                    color="secondary"
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
                                                    color="secondary"
                                                    fullWidth
                                                />
                                                {/* Mostrar mensaje de error si es necesario */}
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    label="Apellidos"
                                                    name="Apellidos"
                                                    type="text"
                                                    margin="dense"
                                                    color="secondary"
                                                    fullWidth
                                                />
                                                {/* Mostrar mensaje de error si es necesario */}
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <NoNumberArrowsTextField
                                                    label="Telefono"
                                                    name="Telefono"
                                                    type="number"
                                                    margin="dense"
                                                    color="secondary"
                                                    fullWidth
                                                />
                                                {/* Mostrar mensaje de error si es necesario */}
                                            </Grid>
                                            <Grid xs={12}>
                                                <TextField
                                                    label="Correo electrónico"
                                                    type='Email'
                                                    name="Email"
                                                    margin="dense"
                                                    color="secondary"
                                                    fullWidth
                                                />
                                                {/* Mostrar mensaje de error si es necesario */}
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
