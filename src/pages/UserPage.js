import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UsuariosFormulario2 } from '../sections/@dashboard/user/modal/create';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
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
import { EditarUsuario } from '../sections/@dashboard/user/modal/editar';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import OrderListHead from '../sections/@dashboard/pedidos/OrderListHead';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'w', label: '', alignRight: false },
  { id: 'idUsuario', label: 'ID', alignRight: false },
  { id: 'documento', label: 'Documento', alignRight: false },
  { id: 'nombre', label: 'Nombres Completos ', alignRight: false },
  { id: 'correo', label: 'Correo', alignRight: false },
  { id: 'rol', label: 'Rol', alignRight: false },
  { id: 'estado', label: 'Estado', alignRight: false },
  { id: '', label: '', alignRight: false },
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
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_correo) => _correo.correo.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('idUsuario');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [selectedUser1, setSelectedUser] = useState(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  //Modal Editar Usuario
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  const fetchData = () => {
    axios
      .get(`${apiUrl}/api/admin/usuario`)
      .then((res) => {
        setData(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  };
  const handleDelete = () => {
    if (!selectedUser1) {
      return;
    }
    axios
      .delete(`${apiUrl}/api/admin/usuarios/Usuariodel/` + selectedUser1)
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Eliminado correctamente',
          text: 'El usuario ha sido eliminado correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        fetchData();
        setShowDeleteMenu(false);
      })
      .catch((err) => console.log(err));
  };

  const handleOpenMenu = (event, idUsuario) => {
    setOpen(event.currentTarget);
    setSelectedUser(idUsuario);
    setShowDeleteMenu(true);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setSelectedUser(null);
    setShowDeleteMenu(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.idUsuario);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, idUsuario) => {
    const selectedIndex = selected.indexOf(idUsuario);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, idUsuario);
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
    setSelectedUser(idSelectedUser);
    setModalShow(true);
    setOpen(null);
    fetchData();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Usuarios | AMJOR </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Usuarios
          </Typography>
          <Button variant="contained" style={{ textTransform: 'none' }} onClick={handleOpenModal} startIcon={<Iconify icon="eva:plus-fill" />}>
            Crear nuevo usuario
          </Button>
          <UsuariosFormulario2 open={openModal} onClose={handleCloseModal} fetchData={fetchData} />
        </Stack>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Buscar usuario..."
          />

          <Scrollbar>
            {loading ? (
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
                      <TableRow key={index} hover role="checkbox">
                        <TableCell width={38}></TableCell>
                        <TableCell component="th" scope="row" padding="none" width={87}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Typography variant="subtitle2" noWrap>
                              <Skeleton variant="rounded" width={13} height={10} />
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left" width={141}>
                          <Skeleton variant="rounded" width={100} height={22} />
                        </TableCell>

                        <TableCell align="left" width={340}>
                          <Skeleton variant="rounded" width={250} height={22} />
                        </TableCell>

                        <TableCell align="left" width={362}>
                          <Skeleton variant="rounded" width={250} height={22} />
                        </TableCell>

                        <TableCell align="left" width={160}>
                          <Skeleton variant="rounded" width={113} height={22} />
                        </TableCell>

                        <TableCell align="left" width={113}>
                          <Label>
                            <Skeleton variant="rounded" width={50} height={22} />
                          </Label>
                        </TableCell>

                        <TableCell align="left" width={92}>
                          <IconButton size="large" color="inherit">
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer sx={{ minWidth: 1200 }}>
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
                      const { idUsuario, Documento, Nombre, Apellido, correo, Nombre_Rol, Estado, foto } = row;
                      const selectedUser = selected.indexOf(idUsuario) !== -1;
                      const estadoText = Estado === 1 ? 'Activo' : 'Inactivo';
                      return (
                        <TableRow key={row.idUsuario} hover tabIndex={-1} role="checkbox" selected={selectedUser} className="custom-table-row">
                          <TableCell>

                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar alt="" src={`${apiUrl}/anchetas/` + foto} />
                              <Typography variant="subtitle2" noWrap>
                                {idUsuario}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell key={Documento}>{Documento}</TableCell>
                          <TableCell key={Nombre}>
                            {Nombre} {Apellido}
                          </TableCell>
                          <TableCell key={correo}>{correo}</TableCell>
                          <TableCell key={Nombre_Rol}>{row.Nombre_Rol}</TableCell>
                          <TableCell>
                            <Label color={(estadoText === 'Activo' && 'success') || 'error'}>
                              {sentenceCase(estadoText)}
                            </Label>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={(event) => handleOpenMenu(event, idUsuario)}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                          <Popover
                            open={Boolean(open) && showDeleteMenu}
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
                            <MenuItem sx={{ color: 'warning.main' }} onClick={() => handleEditar(selectedUser1)}>
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                              Editar
                            </MenuItem>
                            <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete(selectedUser1)}>
                              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                              Eliminar
                            </MenuItem>
                          </Popover>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={8} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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
      <EditarUsuario show={modalShow} onHide={() => setModalShow(false)} fetchData={fetchData} selectedUsuarioID={selectedUser1} />
    </>
  );
}