import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { EditarUsuario } from '../sections/@dashboard/user/modal/editar';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'idUsuario', label: 'ID', alignRight: false },
  { id: 'correo', label: 'Correo', alignRight: false },
  { id: 'estado', label: 'Estado', alignRight: false }, // Nuevo campo para el estado
  { id: 'Acciones', label: 'Acciones', alignRight: false },
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
  
  //Modal Editar Usuario
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    axios
      .get('http://localhost:4000/api/admin/usuario')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };
  const handleDelete = () => {
    if (!selectedUser1) {
      return;
    }
    axios
      .delete('http://localhost:4000/api/admin/usuarios/Usuariodel/' + selectedUser1)
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Eliminado Correctamente',
          text: 'Tu usuario ha sido eliminado correctamente',
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
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;
  return (
    <>
      <Helmet>
        <title> Usuarios | AMJOR </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Usuarios
          </Typography>
          <Link to="/dashboard/create">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Crear Usuario
            </Button>
          </Link>
        </Stack>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Buscar Usuario..."
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
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
                    const { idUsuario, correo, estado } = row;
                    const selectedUser = selected.indexOf(idUsuario) !== -1;
                    const estadoText = estado === 1 ? 'Activo' : 'Inactivo'; // Texto del estado según el valor
                    return (
                      <TableRow hover key={idUsuario} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, idUsuario)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt="" src="" />
                            <Typography variant="subtitle2" noWrap>
                              {idUsuario}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell key={correo} align="left">
                          {correo}
                        </TableCell>
                        <TableCell align="left">{estadoText}</TableCell> {/* Campo de estado */}
                        <TableCell align="left">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenu(event, idUsuario)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
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
                            <MenuItem onClick={() => handleEditar(selectedUser1)}>
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                              Editar
                            </MenuItem>
                            <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete(selectedUser1)}>
                              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                              Eliminar
                            </MenuItem>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={5} />{' '} 
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <EditarUsuario show={modalShow} onHide={() => setModalShow(false)} selectedUsuarioID={selectedUser1} />
    </>
  );
}
