import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
// import Swal from 'sweetalert2';

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
    TableHead,
    Collapse,
    ListItemText,
    CircularProgress,
    Divider,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Label from '../components/label';
import socket from '../socket/config'

import { UserListToolbar } from '../sections/@dashboard/user';
import { EditInsumo } from '../sections/@dashboard/supplies/modal/edit';
import { VerInsumos } from '../sections/@dashboard/anchetas/modal/details';
import OrderListHead from '../sections/@dashboard/pedidos/OrderListHead';

const TABLE_HEAD = [
    { id: '' },
    { id: 'ID_Pedido', label: 'ID', alignRight: false },
    { id: 'NombreAncheta', label: 'Cliente', alignRight: false },
    { id: 'Descripcion', label: 'Dirección', alignRight: false },
    { id: 'as', label: 'Fecha de entrega', alignRight: false },
    { id: 'Precio_Total', label: 'Total', alignRight: false },
    { id: 'Estado', label: 'Estado', alignRight: false },
    { id: 'blanck' },
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

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_nombre) => _nombre.NombreAncheta.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function OrderPage() {
    const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

    const [open, setOpen] = useState({});

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

    const [modalShow, setModalShow] = useState(false);



    /* The above code is a useEffect hook in JavaScript. It is used to handle side effects in functional
    components in React. */
    useEffect(() => {
        /* El código anterior está escuchando un evento 'Pedidos' en una conexión de socket. 
        Cuando se activa el evento, recibe datos actualizados y los establece mediante la función `setData`. */
        socket.on('Pedidos', datosActualizados => {
            setData(datosActualizados)
        });

    }, [data]);


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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };
    
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

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
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeholder="Buscar pedido..." />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 1000 }}>
                            <Table>
                                <OrderListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={data.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { ID_Pedido, ID_Cliente, Nombre_Cliente, Direccion_Entrega, Fecha_Entrega, Precio_Total, correo, image } = row;
                                        const selectedUser = selected.indexOf(ID_Pedido) !== -1;

                                        return (
                                            <React.Fragment key={ID_Pedido}>
                                                <TableRow hover tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                    <TableCell padding="checkbox">
                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography variant="body1" fontSize={16} noWrap>
                                                            #{ID_Pedido}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell >

                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Avatar alt='' src={`${apiUrl}/anchetas/` + image} />
                                                            <ListItemText
                                                                style={{ marginTop: '0.4rem' }}
                                                                primaryTypographyProps={{ style: { fontSize: 14 } }}
                                                                secondaryTypographyProps={{ style: { fontSize: 14 } }}
                                                                primary={Nombre_Cliente}
                                                                secondary={correo}
                                                            />
                                                        </Stack>

                                                    </TableCell>

                                                    <TableCell align="left">{Direccion_Entrega}</TableCell>

                                                    <TableCell align="left">{formatDate(Fecha_Entrega)}</TableCell>

                                                    <TableCell align="left">{formatPrice(Precio_Total)}</TableCell>
                                                    <TableCell align="left">
                                                        {/* <Label color={(Estado === 'Agotado' && 'error') || 'success'}>{sentenceCase(Estado)}</Label> */}
                                                    </TableCell>

                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={() => handleOpenMenu(ID_Pedido)}>
                                                            {open[ID_Pedido] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Detalles desplegables */}
                                                <TableRow>
                                                    <TableCell style={{ padding: 0, backgroundColor: "#F4F6F8" }} colSpan={8} size='medium'>
                                                        <Collapse in={open[ID_Pedido]} timeout="auto" unmountOnExit >
                                                            {anchetas[ID_Pedido] ? (
                                                                <Card sx={{ margin: 1.5 }}>
                                                                    <Box sx={{ padding: 2 }}>
                                                                        {anchetas[ID_Pedido].map((ancheta, index) => (
                                                                            <React.Fragment key={index}>
                                                                                <Stack direction="row" alignItems="center" spacing={2}>

                                                                                    <Avatar
                                                                                        alt=''
                                                                                        src={`http://localhost:4000/anchetas/` + ancheta.image}
                                                                                        variant="rounded"
                                                                                        sx={{ width: 52, height: 52, borderRadius: "10px" }}
                                                                                    />
                                                                                    <ListItemText
                                                                                        primaryTypographyProps={{ style: { fontSize: 14 } }}
                                                                                        secondaryTypographyProps={{ style: { fontSize: 14 } }}
                                                                                        primary={ancheta.NombreAncheta}
                                                                                        secondary='asdaslkdjlaksdjlaksdjlkajsd'
                                                                                    />

                                                                                    <Box >
                                                                                        x1
                                                                                    </Box>

                                                                                    <Box sx={{ width: 110, height: 22, textAlign: 'right' }}  >
                                                                                        $400.000
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
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por pagina:"
                    />
                </Card>
            </Container>

        </>
    );
}
