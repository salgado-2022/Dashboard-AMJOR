import React, { useState, useEffect } from 'react';
import axios from "axios";
import { filter } from 'lodash';

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
    Tooltip,

} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Label from '../components/label';

import { UserListToolbar } from '../sections/@dashboard/user';
import OrderListHead from '../sections/@dashboard/pedidos/OrderListHead';
import { VerInsumosPedido } from '../sections/@dashboard/pedidos/modal/details';

const TABLE_HEAD = [
    { id: '' },
    { id: 'ID_Pedido', label: 'ID', alignRight: false },
    { id: 'NombreAncheta', label: 'Cliente', alignRight: false },
    { id: 'Descripcion', label: 'Dirección', alignRight: false },
    { id: 'Fecha_Entrega', label: 'Fecha de entrega', alignRight: false },
    { id: 'Precio_Total', label: 'Total', alignRight: false },
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

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_nombre) => _nombre.Nombre_Cliente.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}


export default function SalesPage() {
    const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

    const apiUrlImage = process.env.REACT_APP_AMJOR_API_URL_NEW;

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

    const [openModal, setOpenModal] = useState(false)

    const [selectedAnchetaID, setSelectedAnchetaID] = useState(null)



    useEffect(() => {
        axiosData();
    })

    const axiosData = () => {
        axios.get(`${apiUrl}/api/admin/listar/ventas`)
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => { console.log(err) })
    }

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

    const handleClickOpen = (id) => {
        setOpenModal(true)
        setSelectedAnchetaID(id)
    };

    const handleCloseModal = () => {
        setOpenModal(true);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    return (
        <>
            <Helmet>
                <title>Ventas | AMJOR</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Ventas
                    </Typography>

                </Stack>
                <Card >
                    <Divider />
                    <Box sx={{ overflowX: 'auto' }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeholder="Buscar venta..." />
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
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { ID_Pedido, ID_Cliente, Nombre_Cliente, Direccion_Entrega, Fecha_Entrega, Precio_Total, correo, image, Estado, Municipio, Barrio, fecha_creacion, Telefono, Status_Pedido } = row;
                                        const selectedUser = selected.indexOf(ID_Pedido) !== -1;

                                        return (
                                            <React.Fragment key={ID_Pedido}>
                                                <TableRow hover tabIndex={-1} role="checkbox" selected={selectedUser}  >
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
                                                    <TableCell sx={{ paddingRight: 0 }}>
                                                        <Tooltip title="Ver detalle" arrow placement="top">
                                                            <IconButton
                                                                size="large"
                                                                onClick={() => handleOpenMenu(row.ID_Pedido)}
                                                            >
                                                                {open[ID_Pedido] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell sx={{ padding: 0, paddingRight: 0.8 }} width={55} ></TableCell>

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
                                                                                        src={`${apiUrlImage}/anchetas/` + ancheta.image}
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
                                                                                            onClick={() => { handleClickOpen(ancheta.ID_PedidoAnch) }}
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
                                                        No encontrado
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No se encontraron resultados para &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br /> Intente verificar errores tipográficos o usar palabras completas.
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
            <VerInsumosPedido show={openModal} onHide={() => setOpenModal(false)} selectedAnchetaID={selectedAnchetaID} />
        </>
    );
}
