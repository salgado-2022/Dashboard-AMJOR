import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link, useLocation } from 'react-router-dom';
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
    DialogActions, 
    TablePagination, 
    Paper,
    Switch,
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

function EditAncheta() {
    const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

    const location = useLocation();
    const id = location.state?.idAncheta;

    const [values, setValues] = useState({
        NombreAncheta: '',
        Descripcion: '',
        PrecioUnitario: '',
        ID_Estado: '',
        image: ''
    });

    const [nombreError, setNombreError] = useState('');
    const [descripcionError, setDescripcionError] = useState('');

    const [isChecked, setIsChecked] = useState(false);
    const [imageUrlEdit, setImageUrlEdit] = useState(null);
    const [oldImage, setOldImage] = useState('');
    const [isImageUploaded, setIsImageUploaded] = useState(true);

    const Globalstate = useContext(Insumoscontext);
    const state = Globalstate.state;
    const dispatch = Globalstate.dispatch;
    const { state: insumosState } = useContext(Insumoscontext);
    const insumosAgregados = insumosState.map((insumo) => insumo.ID_Insumo);

    const [data, setData] = useState([]);
    const [dataInsumo, setDataInsumo] = useState([]);
    const [InitialInsumos, setInitialInsumos] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterName, setFilterName] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/admin/anchetas/insancheta/` + id);
            setDataInsumo(res.data);
        } catch (err) {
            console.log(err);
        }
        axios.get(`${apiUrl}/api/admin/anchetas/anchellamada/` + id)
            .then(res => {
                console.log(res);
                setValues(prevValues => ({
                    ...prevValues,
                    NombreAncheta: res.data[0].NombreAncheta,
                    Descripcion: res.data[0].Descripcion,
                    PrecioUnitario: res.data[0].PrecioUnitario,
                    ID_Estado: res.data[0].ID_Estado,
                    image: res.data[0].image
                }));
                setOldImage(res.data[0].image);
                setIsChecked(res.data[0].ID_Estado === 1);
                setImageUrlEdit(null);
            })
            .catch(err => console.log(err));

        axios.get(`${apiUrl}/api/admin/insumos`)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => console.log(err));
    }, [apiUrl, id]);

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
    }, [dispatch, fetchData]);

   const handleInput = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === 'checkbox') {
            setIsChecked(checked);
            setValues(prev => ({ ...prev, [name]: checked ? 1 : 2 }));
        } else {
            setValues(prev => ({ ...prev, [name]: value }));
        }

        if (type === 'file') {
            const selectedFileEdit = event.target.files[0];
            if (selectedFileEdit) {
                setImageUrlEdit(URL.createObjectURL(selectedFileEdit));
                setValues((prev) => ({ ...prev, image: selectedFileEdit }));
                setIsImageUploaded(true);
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

    const handleUpdate = (event) => {
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

            const formdata = new FormData();
            formdata.append('NombreAncheta', values.NombreAncheta);
            formdata.append('Descripcion', values.Descripcion);
            formdata.append('PrecioUnitario', Precio.toString());
            formdata.append('ID_Estado', values.ID_Estado);
            formdata.append('Insumos', JSON.stringify(states));
            axios.put(`${apiUrl}/api/admin/anchetas/anchetaedit/` + id, formdata)
            .then(res => {
                console.log(res);
                Swal.fire({
                    title: 'Modificado Correctamente',
                    text: "Tu ancheta ha sido modificada correctamente",
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                if (values.image) {
                    const formdata = new FormData();
                    formdata.append('image', values.image);
                    formdata.append('oldImage', oldImage);
                    axios.put(`${apiUrl}/api/admin/anchetas/anchetaedit/` + id, formdata)
                    .then(res => {
                        console.log(res);
                        setTimeout(function () { window.location = '/dashboard/anchetas'; }, 670);
                    })
                    .catch(err => console.log(err));
                } else {
                    setTimeout(function () { window.location = '/dashboard/anchetas'; }, 670);
                }
            })
            .catch(error => {
                console.log('Error al actualizar la ancheta:', error);
              });
        }
      };

    const handleReset = () => {
        dispatch({ type: 'ResetInsumos' });
        fetchData();  
        setIsImageUploaded(true);
        setInitialInsumos(true); 
        setNombreError(''); 
        setDescripcionError('');
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

    console.log(state)

    if (InitialInsumos) {
        data.forEach((insumo) => {
            const dataInsumoItem = dataInsumo.find(item => item.ID_Insumo === insumo.ID_Insumo);
            if (dataInsumoItem) {
                dispatch({ type: 'AddInsumo', payload: { ...insumo, Cantidad: dataInsumoItem.Cantidad, Precio: insumo.PrecioUnitario } });
                setInitialInsumos(false);
            }
        });
    }

    return (
    <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>Editar Ancheta</Typography>
            <Link to="/dashboard/anchetas">
                <Button variant="contained" startIcon={<Iconify icon="ph:arrow-left" />}>
                Volver
                </Button>
            </Link>
        </Stack>
        <form onSubmit={handleUpdate} onReset={handleReset} encType="multipart/form-data">
            <Grid container spacing={2}>
                <Grid item md={5}>
                    <TextField fullWidth style={{ marginBottom: '16px' }} label="Nombre" variant="outlined" id="NombreAncheta" name="NombreAncheta" value={values.NombreAncheta} onChange={handleInput} error={nombreError !== ''}  helperText={nombreError} />
                    <TextField fullWidth style={{ marginBottom: '16px' }} label="Descripción" variant="outlined" id="Descripcion" name="Descripcion" value={values.Descripcion} onChange={handleInput} error={descripcionError !== ''}  helperText={descripcionError}/>
                    <Card elevation={3} style={{ marginBottom: '16px' }}>
                        <CardHeader component={isImageUploaded ? "div" : "label"} sx={{backgroundColor: "#f5f5f5", cursor: isImageUploaded ? "auto" : "pointer", textAlign: "center", padding: "24px", marginBottom: "0px"}}
                            title={isImageUploaded ? (
                            <div>
                                <IconButton color="error" sx={{position: "absolute", top: "8px",right: "8px",}} onClick={() => {
                                    setIsImageUploaded(false);
                                    setImageUrlEdit(null);
                                    setValues((prev) => ({ ...prev, image: null }));
                                }}>
                                    <Iconify icon="material-symbols:cancel" class="big-icon" />
                                </IconButton>
                                <img src={imageUrlEdit || `http://localhost:4000/anchetas/` + values.image} alt="" style={{maxWidth: "300px", margin: "0 auto"}} />
                            </div>
                            ) : (
                            <div style={{fontSize: "62px", marginBottom: "21px"}}>
                                <input type="file" className="form-control" id="image" name="image" accept=".jpg, .png" onChange={handleInput} style={{ display: "none" }} />
                                <Iconify icon="fluent:image-add-20-regular" class="big-icon" />
                            </div>  
                            )}
                        />
                        {state.length === 0 ? (<CardContent sx={{textAlign: "center", color: "#98a4b0"}}><Typography variant="body1">Sin Insumos</Typography></CardContent>
                        ) : (
                        <List sx={{ maxHeight: '300px', overflowY: 'auto'}}>
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
                    <Grid container alignItems="center" spacing={1}>
                        <Switch color="switch" id="ID_Estado" name="ID_Estado" checked={isChecked} onChange={handleInput}/>
                        <Typography>Disponible</Typography>   
                        <div style={{ flex: 1 }}/> 
                        <Typography variant="h5">Total: {formatPrice(Precio)}</Typography>                     
                    </Grid>
                    <DialogActions> 
                        <Button type="submit" variant="contained" color="primary" fullWidth>Editar Ancheta</Button>
                        <Button type="reset" variant="contained" color="secondary" fullWidth>Cancelar</Button>
                    </DialogActions> 
                </Grid>
                <Grid item md={7}>
                    <Card>
                        <UserListToolbar
                            filterName={filterName}
                            onFilterName={handleFilterByName}
                            placeholder="Buscar Insumo..."
                        />
                        <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                            rowsPerPageOptions={[5, 10, 25]}
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

export { EditAncheta };
