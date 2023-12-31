import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Avatar,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Skeleton,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Label from '../components/label';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { VerInsumos } from '../sections/@dashboard/anchetas/modal/details';
import OrderListHead from '../sections/@dashboard/pedidos/OrderListHead';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '' },
  { id: '2' },
  { id: 'ID_Ancheta', label: 'ID', alignRight: false },
  { id: 'NombreAncheta', label: 'Nombre', alignRight: false },
  { id: 'Descripcion', label: 'Descripción', alignRight: false },
  { id: 'PrecioUnitario', label: 'Precio', alignRight: false },
  { id: 'Estado', label: 'Estado', alignRight: false },
  { id: '#' },
];

// ----------------------------------------------------------------------

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
  // Verificar si 'array' es una matriz
  if (!Array.isArray(array)) {
    console.error("No se pudo obtener la información de las anchetas.");
    return [];
  }
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

export default function AnchetasPage() {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;
  const deployApiUrl = process.env.REACT_APP_AMJOR_DEPLOY_API_URL;

  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('desc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('ID_Ancheta');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([]);

  const [selectedAncheta, setSelectedAncheta] = useState(null);

  //Modal Ver Detalle
  const [modalShowDetalle, setModalShowDetalle] = useState(false);

  //Skeleton
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    axios
      .get(`${apiUrl}/api/admin/anchetas`)
      .then((res) => {
        setData(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000)
      })
      .catch((err) => console.log(err));
  }, [apiUrl]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const handleOpenMenu = (event, ID_Ancheta) => {
    setOpen(event.currentTarget);
    setSelectedAncheta(ID_Ancheta); // Agregar este estado para almacenar el idUsuario seleccionado
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setSelectedAncheta(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.ID_Ancheta);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, ID_Ancheta) => {
    const selectedIndex = selected.indexOf(ID_Ancheta);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, ID_Ancheta);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
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

  const handleEditar = (idSelectedUser) => {
    setSelectedAncheta(idSelectedUser);
    navigate("/dashboard/anchetas/editarancheta", { state: { idAncheta: selectedAncheta } });
  };


  const handleDetalle = (idSelectedUser) => {
    setSelectedAncheta(idSelectedUser);
    setModalShowDetalle(true);
    setOpen(null);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    });
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Anchetas | AMJOR </title>
      </Helmet>

      <Container maxWidth={"xl"}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Anchetas
          </Typography>
          <Link to="/dashboard/anchetas/crearancheta">
            <Button style={{ textTransform: 'none' }} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Crear ancheta
            </Button>
          </Link>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Buscar ancheta..."
          />

          <Scrollbar>

            {loading ? ( // Mostrar un mensaje de carga si los datos aún están cargando
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <OrderListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={data.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>

                    {Array.from({ length: rowsPerPage }).map((_, index) => (

                      <TableRow key={index} hover role="checkbox" >
                        <TableCell padding="checkbox">
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Skeleton variant="circular" width={40} height={40} />
                          </Stack>
                        </TableCell>

                        <TableCell width={72}>
                          <Typography variant="subtitle2" noWrap>
                            <Skeleton variant="rounded" width={23} height={10} />
                          </Typography>
                        </TableCell>

                        <TableCell align="left" width={132}><Skeleton variant="rounded" width={100} height={22} /></TableCell>
                        <TableCell align="left" width={591}><Skeleton variant="rounded" width={480} height={22} /></TableCell>
                        <TableCell align="left"><Skeleton variant="rounded" width={40} height={22} /></TableCell>

                        <TableCell align="left" width={108}>
                          <Label ><Skeleton variant="rounded" width={40} height={22} /></Label>
                        </TableCell>

                        <TableCell align="left" width={76} >
                          <IconButton
                            size="large"
                            color="inherit"

                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                  </TableBody>
                </Table>
              </TableContainer>
            ) : (

              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <OrderListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={data.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { ID_Ancheta, NombreAncheta, Descripcion, PrecioUnitario, Estado, image } = row;
                      const selectedUser = selected.indexOf(ID_Ancheta) !== -1;

                      return (
                        <TableRow hover key={ID_Ancheta} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt="" src={`${deployApiUrl}/anchetas/` + image} />
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              #{ID_Ancheta}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">{NombreAncheta}</TableCell>
                          <TableCell align="left">{Descripcion}</TableCell>
                          <TableCell align="left">{formatPrice(PrecioUnitario)}</TableCell>
                          <TableCell align="left">
                            <Label color={(Estado === 'Agotado' && 'error') || 'success'}>{sentenceCase(Estado)}</Label>
                          </TableCell>

                          <TableCell align="left">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={(event) => handleOpenMenu(event, ID_Ancheta)}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                          <Popover
                            open={Boolean(open)}
                            anchorEl={open}
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
                            <MenuItem sx={{ color: 'primary.main' }} onClick={() => handleDetalle(selectedAncheta)}>
                              <Iconify icon={'carbon:view'} sx={{ mr: 2 }} />
                              Detalle
                            </MenuItem>

                            <MenuItem sx={{ color: 'warning.main' }} onClick={() => handleEditar(selectedAncheta)}>
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                              Editar
                            </MenuItem>
                          </Popover>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
            )}

          </Scrollbar>

          <TablePagination
            style={{ marginBottom: '' }}
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

      <VerInsumos show={modalShowDetalle} onHide={() => setModalShowDetalle(false)} selectedAnchetaID={selectedAncheta} />
    </>
  );
}
