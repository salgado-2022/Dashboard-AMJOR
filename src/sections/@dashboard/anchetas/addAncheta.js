import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { 
    Container, 
    Grid, 
    Button, 
    TextField, 
    Typography, 
    Stack, 
    Card, 
    CardHeader, 
    CardContent, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    IconButton, 
    TablePagination, 
    Paper,
    CardMedia,
    Divider
} from "@mui/material";
import { UserListToolbar } from '../../@dashboard/user';
import { filter } from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Iconify from "../../../components/iconify";
import Swal from 'sweetalert2';
import axios from "axios";


//-----------------------------------------------------------------------------------------------------------
import { Insumoscontext } from './context/Context';

function AddAncheta() {
    const apiUrl = process.env.REACT_APP_AMJOR_API_URL;
    const deployApiUrl = process.env.REACT_APP_AMJOR_DEPLOY_API_URL;

    const navigate = useNavigate();

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

    const Globalstate = useContext(Insumoscontext);
    const state = Globalstate.state;
    const dispatch = Globalstate.dispatch;
    const { state: insumosState } = useContext(Insumoscontext);
    const insumosAgregados = insumosState.map((insumo) => insumo.ID_Insumo);

    const [data, setData] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterName, setFilterName] = useState('');
    
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
        const fetchData = () => {
            axios
                .get(`${apiUrl}/api/admin/insumos`)
                .then((res) => {
                    setData(res.data);
                })
                .catch((err) => console.log(err));
        };
        
        fetchData();
        return () => {
            dispatch({ type: 'ResetInsumos' });
        };   
    }, [dispatch, apiUrl]);
    
    const handleInput = (event) => {
        const { name, value, type } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));

        if (type === 'file') {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setImageUrl(URL.createObjectURL(selectedFile));
                setImageHolder(selectedFile);
                setValues((prev) => ({ ...prev, image: selectedFile }));
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
                    timer: 1500,
                })
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
            axios.post(`${deployApiUrl}/api/crearAncheta`, formdata)
                .then(res => {
                    if (res.data.Status === "Success") {
                        Swal.fire({
                            title: 'Creado Correctamente',
                            text: "Tu ancheta ha sido creada correctamente",
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Hubo un problema al registrar la ancheta.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                    navigate("/dashboard/anchetas");
                })
        }
    };

    const handleReset = () => {
        setValues(initialValues);
        setImageUrl(null);
        setNombreError(''); 
        setDescripcionError(''); 
        dispatch({ type: 'ResetInsumos' });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
      };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
      };

    const emptyRows = page > 0 ? Math.max(0, (page + 1) * rowsPerPage - data.length) : 0;

    const filteredUsers = filter(data, (_nombre) => _nombre.NombreInsumo.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);

    const isNotFound = !filteredUsers.length && !!filterName;

    const dataLength = state ? (data.length - state.length) : (data.length);
    
    return (
    <Container maxWidth={"xl"}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>Crear Ancheta</Typography>
            <Link to="/dashboard/anchetas">
                <Button variant="contained" startIcon={<Iconify icon="ph:arrow-left" />}>
                Volver
                </Button>
            </Link>
            
        </Stack>
        <form onSubmit={handleSubmit} onReset={handleReset} encType="multipart/form-data">
            <Grid container spacing={2}>
                <Grid item md={5} >
                    <TextField fullWidth style={{ marginBottom: '16px' }} label="Nombre" variant="outlined" id="NombreAncheta" name="NombreAncheta" value={values.NombreAncheta} onChange={handleInput} error={nombreError !== ''}  helperText={nombreError} />
                    <TextField multiline rows={4} fullWidth style={{ marginBottom: '16px' }} label="Descripción" variant="outlined" id="Descripcion" name="Descripcion" value={values.Descripcion} onChange={handleInput} error={descripcionError !== ''}  helperText={descripcionError}/>
                    <Card elevation={3} style={{ marginBottom: '16px' }}>
                    {values.image && (
                        <div>
                            <CardMedia component="img" alt="" height="235px" image={imageUrl}/> 
                            <IconButton color="trash" sx={{position: "absolute", top: "8px",right: "8px",}} onClick={() => {
                                setImageUrl(null);
                                setValues((prev) => ({ ...prev, image: null }));
                            }}>
                                <Iconify icon="mingcute:delete-fill" class="big-icon" />
                            </IconButton>
                        </div>    
                    )}
                    {!values.image && (
                        <CardHeader component="label" sx={{backgroundColor: "#f5f5f5", cursor: "pointer", textAlign: "center", padding: "24px", marginBottom: "0px", height: "235px"}}
                            title={
                            <div style={{fontSize: "48px", marginBottom: "21px"}}>
                                <input type="file" className="form-control" id="image" name="image" accept=".jpg, .png" onChange={handleInput} style={{ display: "none" }} />
                                <Iconify icon="fluent:image-add-20-regular" class="big-icon"/>
                            </div>  
                            }
                        />
                    )}
                    {state.length === 0 ? (<CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '235px', color: "#98a4b0" }}><Typography variant="body1">Sin Insumos</Typography></CardContent>
                    ) : (
                        <List sx={{ height: "235px", overflowY: 'auto'}}>
                            {state.map((insumo) => (
                                <ListItem key={insumo.ID_Insumo} secondaryAction={
                                    <div>
                                        <IconButton color="primary" onClick={() => dispatch({ type: 'Decrement', payload: insumo })}>
                                            <RemoveIcon sx={{ fontSize: '16px' }}/>
                                        </IconButton>
                                        <TextField type="number" value={insumo.Cantidad} onChange={(event) => dispatch({ type: "SetCantidad", payload: { idInsumo: insumo.ID_Insumo, cantidad: event.target.value } })} inputProps={{ style: { textAlign: 'center', fontSize: '14px', width: '15px', height: '5px' } }}/>
                                        <IconButton color="primary" onClick={() => dispatch({ type: 'Increment', payload: insumo })}>
                                            <AddIcon sx={{ fontSize: '16px' }}/>
                                        </IconButton>
                                    </div>
                                }>
                                    <ListItemIcon aria-label="delete" onClick={() => dispatch({ type: 'RemoveInsumo', payload: insumo })}>
                                        <IconButton color="primary" sx={{fontSize: "22px"}}>
                                            <Iconify icon="ph:trash" class="big-icon" />
                                        </IconButton>
                                    </ListItemIcon>
                                    <Grid item sm={6} xs={6}>
                                        <ListItemText
                                            primaryTypographyProps={{ style: {fontSize: '14px'} }}
                                            primary={insumo.NombreInsumo}
                                            secondaryTypographyProps={{ style: {fontSize: '14px'} }}
                                            secondary={formatPrice(insumo.Precio * insumo.Cantidad)}
                                        />
                                    </Grid>  
                                </ListItem>
                            ))}
                        </List>   
                        )}
                    </Card>
                    <Typography variant="h5" marginBottom={1}>Total: {formatPrice(Precio)}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>Crear Ancheta</Button>
                        <Button type="reset" variant="contained" color="secondary" fullWidth>Cancelar</Button>
                    </Stack> 
                </Grid>
                <Grid item md={7}>
                    <Card>
                        <UserListToolbar
                            filterName={filterName}
                            onFilterName={handleFilterByName}
                            placeholder="Buscar Insumo..."
                        />
                        <List sx={{ height: '625px', overflowY: 'auto' }}>
                            {filteredUsers.filter(insumo => !insumosAgregados.includes(insumo.ID_Insumo) && insumo.Estado !== 'Agotado').slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((insumo, index) => {

                                insumo.Cantidad = 1;
                                insumo.Precio = insumo.PrecioUnitario;
                                
                                return (
                                    <React.Fragment key={insumo.ID_Insumo}>
                                    <ListItem key={insumo.ID_Insumo} secondaryAction={
                                        <Typography variant="subtitle2">{formatPrice(insumo.Precio)}</Typography>
                                    }>
                                        <ListItemIcon onClick={() => dispatch({ type: 'AddInsumo', payload: insumo })}>
                                            <IconButton color="primary" sx={{fontSize: "32px"}}>
                                                <Iconify icon="typcn:plus" class="big-icon" />
                                            </IconButton>
                                        </ListItemIcon>
                                        <Grid item sm={8} xs={8}>
                                            <ListItemText primary={insumo.NombreInsumo}/>
                                        </Grid>  
                                    </ListItem>
                                    {index < data.length - 1 && <Divider />}
                                    </React.Fragment>
                                );
                            })}
                            {isNotFound && (
                                <Paper sx={{textAlign: 'center'}}>
                                    <Typography variant="h6" paragraph>No encontrado</Typography>
                                    <Typography variant="body2">No se encontraron resultados para
                                        &nbsp;<strong>&quot;{filterName}&quot;</strong>.
                                        <br/> Intente verificar errores tipográficos o usar palabras completas.
                                    </Typography>
                                </Paper>
                            )}
                            {emptyRows > 0 && (<ListItem style={{ height: 73 * emptyRows }}/>)}
                        </List>
                        <TablePagination
                            rowsPerPageOptions={[10, 25]}
                            component="div"
                            count={dataLength}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por pagina:"
                        />
                    </Card>
                </Grid>
                
            </Grid>
        </form>
    </Container>
    );
}

export { AddAncheta };
