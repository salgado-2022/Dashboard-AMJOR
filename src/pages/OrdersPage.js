import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Helmet } from 'react-helmet-async';
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
    Popover,
    Tabs,
    Tab,
    Dialog,
    DialogActions,
    Button,
    DialogContent,
    DialogTitle,
    DialogContentText,
    FormControl,
    InputLabel,
    Select,
    Grid,

} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Label from '../components/label';
import socket from '../socket/config'

import { UserListToolbar } from '../sections/@dashboard/user';
import OrderListHead from '../sections/@dashboard/pedidos/OrderListHead';

const TABLE_HEAD = [
    { id: '' },
    { id: 'ID_Pedido', label: 'ID', alignRight: false },
    { id: 'NombreAncheta', label: 'Cliente', alignRight: false },
    { id: 'Descripcion', label: 'Dirección', alignRight: false },
    { id: 'Fecha_Entrega', label: 'Fecha de entrega', alignRight: false },
    { id: 'Precio_Total', label: 'Total', alignRight: false },
    { id: 'Estado', label: 'Estado', alignRight: false },
    { id: 'blanck' },
    { id: 'blanck2' },
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, filters) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    if (filters && filters.length > 0) {
        return stabilizedThis.filter(([_item]) => {
            return filters.some(filterFn => {
                return filterFn(_item);
            });
        }).map(([_filteredItem]) => _filteredItem);
    }

    return stabilizedThis.map(([_item]) => _item);
}

export default function OrderPage() {
    const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

    const [open, setOpen] = useState({});

    const [openMenu, setOpenMenu] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('desc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('ID_Pedido');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [data, setData] = useState([]);

    const [anchetas, setAnchetas] = useState([])

    const [selectedAncheta, setSelectedAncheta] = useState(null);

    const [totalPrecio, setTotalPrecio] = useState(0);

    const [selectedTab, setSelectedTab] = useState(0);

    const [selectedMenuID, setSelectedMenuID] = useState(null);

    const [selectedMenuIdCliente, setSelectedMenuIdCliente] = useState(null);

    const [openModal, setOpenModal] = useState(false)

    const [semaforo, setSemaforo] = useState(1)

    const [loadingAceptados, setLoadingAceptados] = useState(false)




    /* The above code is a useEffect hook in JavaScript. It is used to handle side effects in functional
    components in React. */
    useEffect(() => {
        /* El código anterior está escuchando un evento 'Pedidos' en una conexión de socket. 
        Cuando se activa el evento, recibe datos actualizados y los establece mediante la función `setData`. */
        socket.on('Pedidos', datosActualizados => {
            setData(datosActualizados)
        });

        if (selectedTab === 1) {
            setLoadingAceptados(true);
            setOrder("asc")
            setOrderBy("Fecha_Entrega")
        } else {
            setLoadingAceptados(false);
            setOrder("desc")
            setOrderBy("ID_Pedido")
        }
    }, [data, selectedTab]);

    const rojo = (dateString) => {
        const currentDate = new Date();
        const deliveryDate = new Date(dateString);
        const timeDifferenceInDays = (deliveryDate - currentDate) / (1000 * 60 * 60 * 24);
        return timeDifferenceInDays >= 0 && timeDifferenceInDays <= 3;
    };

    const amarillo = (dateString) => {
        const currentDate = new Date();
        const deliveryDate = new Date(dateString);
        const timeDifferenceInDays = (deliveryDate - currentDate) / (1000 * 60 * 60 * 24);
        return timeDifferenceInDays > 3 && timeDifferenceInDays <= 7;
    };
    const verde = (dateString) => {
        const currentDate = new Date();
        const deliveryDate = new Date(dateString);
        const timeDifferenceInDays = (deliveryDate - currentDate) / (1000 * 60 * 60 * 24);
        return timeDifferenceInDays > 7;
    };

    const handleChange = (event) => {
        setSemaforo(event.target.value);
    };


    const handleOpenMenu = async (ID_Ancheta) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [ID_Ancheta]: !prevOpen[ID_Ancheta],
        }));

        setSelectedAncheta((prevSelected) => (prevSelected === ID_Ancheta ? null : ID_Ancheta));

        if (!anchetas[ID_Ancheta]) {
            try {
                const res = await axios.get(`${apiUrl}/api/admin/pedidos/detalle/` + ID_Ancheta);
                setAnchetas((prevAnchetas) => ({
                    ...prevAnchetas,
                    [ID_Ancheta]: res.data,
                }));
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleOpenMenu2 = (event, ID_Pedido, ID_Cliente) => {
        setOpenMenu(event.currentTarget);
        setSelectedMenuID(ID_Pedido);
        setSelectedMenuIdCliente(ID_Cliente)
    };

    const handleNextState = (idPedido, statusPedido) => {

        if (statusPedido === 0) {
            Swal.fire({
                title: '¿Estas seguro?',
                text: "El estado del pedido cambiara a EN PREPARACIÓN",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`${apiUrl}/api/admin/pedido/status/preparacion/` + idPedido)
                        .then(res => {
                            Swal.fire(
                                'Se cambio el estado',
                                'Your file has been deleted.',
                                'success'
                            )
                        })
                        .catch(err => {
                            Swal.fire(
                                'Error en el servidor',
                                'Comunicarse con soporte.',
                                'error'
                            )
                        })
                }
            })
        }
        else if (statusPedido === 1) {

            Swal.fire({
                title: '¿Estas seguro?',
                text: "El estado del pedido cambiara a PREPRADADO",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`${apiUrl}/api/admin/pedido/status/preparado/` + idPedido)
                        .then(res => {
                            Swal.fire(
                                'Se cambio el estado',
                                'El estado se cambio correctamente.',
                                'success'
                            )
                        })
                        .catch(err => {
                            Swal.fire(
                                'Error en el servidor',
                                'Comunicarse con soporte.',
                                'error'
                            )
                        })
                }
            })
        } else if (statusPedido === 2) {
            Swal.fire({
                title: '¿Estas seguro?',
                text: "El estado del pedido cambiara a DESPACHADO",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`${apiUrl}/api/admin/pedido/status/despachado/` + idPedido)
                        .then(res => {
                            Swal.fire(
                                'Se cambio el estado',
                                'El estado se cambio correctamente.',
                                'success'
                            )
                        })
                        .catch(err => {
                            Swal.fire(
                                'Error en el servidor',
                                'Comunicarse con soporte.',
                                'error'
                            )
                        })
                }
            })
        }
    };

    const handleSuccessOrder = (pedido, cliente) => {
        setOpenMenu(null);
        const data = {
            pedido: pedido,
            cliente: cliente
        }

        axios.get(`${apiUrl}/api/admin/pedidos/success`, { params: data })
            .then(res => {
                if (res.data.Success === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Pedido aceptado correctamente',
                        confirmButtonText: 'OK'
                    })
                }
            })
            .catch(err => {
                Swal.fire({ // Muestra la alerta de SweetAlert2
                    title: 'Error!',
                    text: err,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            })
    }

    const handleRefusedOrder = (pedido, cliente) => {
        setOpenMenu(null);
        const data = {
            pedido: pedido,
            cliente: cliente
        }

        axios.get(`${apiUrl}/api/admin/pedidos/refused`, { params: data })
            .then(res => {
                if (res.data.Success === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Pedido rechazado correctamente',
                        confirmButtonText: 'OK'
                    })
                }
            })
            .catch(err => {
                Swal.fire({ // Muestra la alerta de SweetAlert2
                    title: 'Error!',
                    text: err,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            })
    }


    const handleCloseMenu = () => {
        setOpenMenu(null);
    };

    const handleChangeTab = (event, newValue) => {
        setSelectedTab(newValue);
        setPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
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

    const formatPrice = (price) => {
        return price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        });
    };

    const handleClickOpen = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    /**
      * La función `formatDate` toma una cadena de fecha como entrada y devuelve una cadena de fecha formateada en el
      * formato "Mes día, año".
      * @param dateString - El parámetro `dateString` es una cadena que representa una fecha. puede estar en cualquier
      * formato de fecha válido, como "2021-01-01" o "1 de enero de 2021".
      * @returns La función `formatDate` devuelve una cadena de fecha formateada en el formato "día, Mes, año".
    */
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    const formatPhoneNumber = (phoneNumber) => {
        const cleanedNumber = phoneNumber.replace(/\D/g, ''); // Elimina todos los caracteres que no sean dígitos
        const formattedNumber = cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3'); // Separa en grupos de 3-3-4 con espacios
        return formattedNumber;
    };



    // Aquí calcula la cantidad de pedidos en cada estado
    const countPendientes = data.filter(item => item.Estado === 3).length;
    const countAceptados = data.filter(item => item.Estado === 4).length;
    const countRechazados = data.filter(item => item.Estado !== 3 && item.Estado !== 4).length;

    const filters = [
        (_item) => _item.ID_Pedido === parseInt(filterName), // Convertimos a string antes de comparar
        (_item) => _item.Nombre_Cliente.toLowerCase().includes(filterName.toLowerCase()),
        (_item) => _item.Direccion_Entrega.toLowerCase().includes(filterName.toLowerCase()),
        // Agrega más funciones de filtro para otras propiedades si es necesario
    ];

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const applyFilterBasedOnPriority = (item) => {
        if (semaforo === 1) {
            return rojo(item.Fecha_Entrega); // Filtro para 3 días
        } else if (semaforo === 2) {
            return amarillo(item.Fecha_Entrega); // Filtro para 1 semana
        } else if (semaforo === 3) {
            return verde(item.Fecha_Entrega);
        }
        return true; // No se aplican filtros
    };

    const filteredUsers = applySortFilter(
        data.filter(item => {
            if (selectedTab === 0) {
                return item.Estado === 3; // Pendientes
            } else if (selectedTab === 1) {
                return item.Estado === 4 && applyFilterBasedOnPriority(item); // Filtro en función de la prioridad seleccionada
            } else if (selectedTab === 2) {
                return item.Estado !== 3 && item.Estado !== 4; // Rechazados
            }
            return true; // Mostrar todos si no se ajusta a los casos anteriores
        }),
        getComparator(order, orderBy),
        filters
    );


    const isNotFound = !filteredUsers.length && !!filterName;

    return (
        <>
            <Helmet>
                <title>Pedidos | AMJOR</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Pedidos
                    </Typography>
                </Stack>
                <Card >
                    <Tabs
                        value={selectedTab}
                        onChange={handleChangeTab}
                        variant="scrollable"
                        textColor="secondary"
                        aria-label="Order Tabs"
                    >
                        <Tab
                            value={0}
                            iconPosition="end"
                            label="Pendientes"
                            icon={
                                <Label color={'warning'}>
                                    {countPendientes}
                                </Label>}
                            sx={{ paddingBottom: 0, paddingTop: 0 }}
                        />
                        <Tab
                            value={1}
                            iconPosition='end'
                            label="Aceptados"
                            icon={
                                <Label color={'success'}>
                                    {countAceptados}
                                </Label>
                                // <Badge badgeContent={countAceptados} color="success" sx={{paddingLeft:1.3}}  />
                            }
                        />
                        <Tab
                            value={2}
                            iconPosition='end'
                            label="Rechazados"
                            icon={
                                <Label color={'error'}>
                                    {countRechazados}
                                </Label>
                                // <Badge badgeContent={countAceptados} color="success" sx={{paddingLeft:1.3}}  />
                            }
                        />
                    </Tabs>
                    <Divider />

                    <Box sx={{ overflowX: 'auto' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeholder="Buscar pedido..." />

                            {loadingAceptados && (
                                <FormControl sx={{ m: 1, minWidth: 210, paddingRight: '24px' }}>
                                    <InputLabel id="demo-simple-select-label">Prioridad</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={semaforo}
                                        onChange={handleChange}
                                        autoWidth
                                        label="Prioridad"
                                    >
                                        <MenuItem value={1}>Entrega inmediata</MenuItem>
                                        <MenuItem value={2}>Entrega proxima</MenuItem>
                                        <MenuItem value={3}>Entrega a tiempo</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                    </Box>
                    <Scrollbar>

                        <TableContainer sx={{ minWidth: 1000 }}>
                            <Table>
                                <OrderListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={data.length}
                                    numSelected={selected.length}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { ID_Pedido, ID_Cliente, Nombre_Cliente, Direccion_Entrega, Fecha_Entrega, Precio_Total, correo, image, Estado, Municipio, Barrio, fecha_creacion, Telefono, Status_Pedido } = row;
                                        const selectedUser = selected.indexOf(ID_Pedido) !== -1;
                                        const estadoText = Estado === 3 ? 'Pendiente' : Estado === 4 ? 'Aceptado' : 'Rechazado'
                                        const statusText = Status_Pedido === 1 ? 'En preparación' : Status_Pedido === 2 ? 'Preparado' : 'Despachado'
                                        return (
                                            <React.Fragment key={ID_Pedido}>
                                                <TableRow hover tabIndex={-1} role="checkbox" >
                                                    <TableCell>

                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography variant="body1" fontSize={16} noWrap>
                                                            # {ID_Pedido}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Avatar alt='' src={`${apiUrl}/anchetas/` + image} />
                                                            <Typography hidden={true}>
                                                                {ID_Cliente}
                                                            </Typography>
                                                            <ListItemText
                                                                style={{ marginTop: '0.4rem' }}
                                                                primaryTypographyProps={{ style: { fontSize: 14 } }}
                                                                secondaryTypographyProps={{ style: { fontSize: 14 } }}
                                                                primary={Nombre_Cliente}
                                                                secondary={
                                                                    <>
                                                                        {correo}
                                                                        <br />
                                                                        {formatPhoneNumber(Telefono)}
                                                                    </>
                                                                }
                                                            />
                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={2}>

                                                            <ListItemText
                                                                style={{ marginTop: '0.4rem' }}
                                                                primaryTypographyProps={{ style: { fontSize: 14 } }}
                                                                secondaryTypographyProps={{ style: { fontSize: 14 } }}
                                                                primary={Direccion_Entrega}
                                                                secondary={Municipio + " - " + Barrio}

                                                            />

                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell align="left">{formatDate(Fecha_Entrega)}</TableCell>

                                                    <TableCell align="left">{formatPrice(Precio_Total)}</TableCell>

                                                    {Status_Pedido === 0 ? (

                                                        <TableCell align="left">
                                                            <Label color={
                                                                estadoText === 'Pendiente' ? 'warning' :
                                                                    estadoText === 'Aceptado' ? 'success' :
                                                                        'error'
                                                            }>
                                                                {sentenceCase(estadoText)}
                                                            </Label>
                                                        </TableCell>

                                                    ) : (

                                                        <TableCell align="left">
                                                            <Label color={
                                                                statusText === 'En preparación' ? 'warning' :
                                                                    statusText === 'Preparado' ? 'warning' :
                                                                        'error'
                                                            }>
                                                                {sentenceCase(statusText)}
                                                            </Label>
                                                        </TableCell>
                                                    )}

                                                    <TableCell sx={{ paddingRight: 0 }}>
                                                        <IconButton
                                                            size="large"
                                                            onClick={() => handleOpenMenu(row.ID_Pedido)}
                                                        >
                                                            {open[ID_Pedido] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>

                                                    {Estado === 3 ? (
                                                        <TableCell sx={{ padding: 0, paddingRight: 0.8 }}>
                                                            <IconButton
                                                                size="large"
                                                                color="inherit"
                                                                onClick={(event) => handleOpenMenu2(event, ID_Pedido, ID_Cliente)}
                                                            >
                                                                <Iconify icon={'eva:more-vertical-fill'} />
                                                            </IconButton>
                                                            <Popover
                                                                open={Boolean(openMenu)}
                                                                anchorEl={openMenu}
                                                                onClose={handleCloseMenu}
                                                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                                PaperProps={{
                                                                    sx: {
                                                                        p: 1,
                                                                        width: 140,
                                                                        '& .MuiMenuItem-root': {
                                                                            px: 1,
                                                                            typography: 'body2',
                                                                            borderRadius: 0.75,
                                                                        },
                                                                    },
                                                                }}
                                                            >
                                                                <MenuItem
                                                                    sx={{ color: 'success.main' }}
                                                                    onClick={() => handleSuccessOrder(selectedMenuID, selectedMenuIdCliente)}
                                                                >
                                                                    <Iconify icon={'fluent:checkmark-12-filled'} sx={{ mr: 2 }} />
                                                                    Aceptar
                                                                </MenuItem>

                                                                <MenuItem
                                                                    sx={{ color: 'error.main' }}
                                                                    onClick={() => handleRefusedOrder(selectedMenuID, selectedMenuIdCliente)}
                                                                >
                                                                    <Iconify icon={'ph:x-bold'} sx={{ mr: 2 }} />
                                                                    Rechazar
                                                                </MenuItem>


                                                            </Popover>
                                                        </TableCell>
                                                    ) : Estado === 4 ? (
                                                        <TableCell sx={{ padding: 0, paddingRight: 0.8 }} width={55} >
                                                            <IconButton
                                                                size="large"
                                                                onClick={() => handleNextState(ID_Pedido, Status_Pedido)}
                                                            >
                                                                <Iconify icon={'ooui:double-chevron-start-rtl'} />
                                                            </IconButton>


                                                        </TableCell>
                                                    ) : (
                                                        <TableCell sx={{ padding: 0, paddingRight: 0.8 }} width={55} ></TableCell>
                                                    )}
                                                </TableRow>

                                                {/* Detalles desplegables */}
                                                <TableRow>
                                                    <TableCell style={{ padding: 0, backgroundColor: "#F4F6F8" }} colSpan={10} size='medium'>
                                                        <Collapse in={open[ID_Pedido]} timeout="auto" unmountOnExit >
                                                            {anchetas[ID_Pedido] ? (
                                                                <Card sx={{ margin: 1.5 }}>
                                                                    <Box sx={{ padding: 2 }}>
                                                                        {anchetas[ID_Pedido].map((ancheta, index) => (
                                                                            <React.Fragment key={index}>
                                                                                <Stack direction="row" alignItems="center" spacing={2}>

                                                                                    <Avatar
                                                                                        alt=''
                                                                                        src={`${apiUrl}/anchetas/` + ancheta.image}
                                                                                        variant="rounded"
                                                                                        sx={{ width: 52, height: 52, borderRadius: "10px" }}
                                                                                    />
                                                                                    <ListItemText
                                                                                        primaryTypographyProps={{ style: { fontSize: 14 } }}
                                                                                        secondaryTypographyProps={{ style: { fontSize: 14 } }}
                                                                                        primary={ancheta.NombreAncheta}
                                                                                        secondary={ancheta.Descripcion}
                                                                                    />

                                                                                    <Box>
                                                                                        <IconButton
                                                                                            color="primary"
                                                                                            sx={{ fontSize: "24px" }}
                                                                                            onClick={handleClickOpen}
                                                                                        >
                                                                                            <Iconify icon="grommet-icons:view" className="big-icon" />
                                                                                        </IconButton>
                                                                                    </Box>

                                                                                    <Box >
                                                                                        x{ancheta.Cantidad}
                                                                                    </Box>

                                                                                    <Box sx={{ width: 110, height: 22, textAlign: 'right' }}  >
                                                                                        {formatPrice(ancheta.Total)}
                                                                                    </Box>
                                                                                </Stack>
                                                                                {index !== anchetas[ID_Pedido].length - 1 && <Divider sx={{ my: 2 }} />}
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </Box>
                                                                </Card>

                                                            ) : (
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center', // Centrar horizontalmente
                                                                        alignItems: 'center', // Centrar verticalmente
                                                                        height: '26vh', // Puedes ajustar la altura según tus necesidades
                                                                    }}
                                                                >
                                                                    <CircularProgress />
                                                                </Box>

                                                            )}
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>

                                            </React.Fragment>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={7} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br /> Try checking for typos or using complete words.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination style={{ marginBottom: '' }}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por pagina:"
                    />
                </Card>
            </Container>

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openModal}
                onClose={handleCloseModal}
            >
                <DialogTitle>Insumos</DialogTitle>
                <DialogContent>

                    <React.Fragment >
                        <Stack direction="row" alignItems="center" spacing={2}>

                            <ListItemText
                                primaryTypographyProps={{ style: { fontSize: 14 } }}
                                secondaryTypographyProps={{ style: { fontSize: 14 } }}
                                primary="Cerveza Aguila light"
                                secondary="cerveza 200ml"
                            />

                            <Box >
                                x1
                            </Box>

                            <Box sx={{ width: 110, height: 22, textAlign: 'right' }}  >
                                $200.000
                            </Box>
                        </Stack>
                    </React.Fragment>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
