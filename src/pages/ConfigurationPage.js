import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { ConfiFormulario } from '../sections/@dashboard/configuracion/modal/crearte';
import {
  Card,
  Table,
  Stack,
  Button,
  Paper,
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
  TablePagination,
} from '@mui/material';

import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { EditarConfi } from '../sections/@dashboard/configuracion/modal/edita';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';


const TABLE_HEAD = [
  { id: 'ID_Rol', label: 'ID', alignRight: false },
  { id: 'Nombre_Rol', label: 'Rol', alignRight: false },
  { id: 'estado', label: 'Estado', alignRight: false },
  { id: 'Acciones', label: 'Acciones', alignRight: false },
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
    return filter(array, (_Rol) => _Rol._Rol.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ListaConfiguracion() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('ID_Rol');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [selectedConfiguracionID, setSelectedConfiguracionID] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get('http://localhost:4000/api/admin/configuracion')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/api/admin/configuracion/Confidel/${id}`)
      .then((res) => {
        console.log(res);
        fetchData(); // Actualiza los datos después de la eliminación
        Swal.fire({
          title: 'Eliminado Correctamente',
          text: 'El rol se ha sido eliminado correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleOpenMenu = (event, ID_Rol) => {
    setOpen(event.currentTarget);
    setSelectedConfiguracionID(ID_Rol);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.ID_Rol);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  
  const handleClick = (event, ID_Rol) => {
    const selectedIndex = selected.indexOf(ID_Rol);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, ID_Rol);
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
    setSelectedConfiguracionID(idSelectedUser);
    setModalShow(true);
    setOpen(null);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Configuración | AMJOR</title>
      </Helmet>
      <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Configuración
          </Typography>
          <Button variant="contained" onClick={handleOpenModal}>
        Crear Rol y Permisos
      </Button>
      <ConfiFormulario open={openModal} onClose={handleCloseModal} />
        </Stack>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Buscar Rol..." 
          />

          <Scrollbar>
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
                {filteredUsers.map((row) => {
                  const { ID_Rol, Nombre_Rol, estado } = row;
                  const estadoText = estado === 1 ? 'Activo' : 'Inactivo';

                  return (
                    <TableRow hover key={ID_Rol} tabIndex={-1} role="checkbox" selected={selected.indexOf(ID_Rol) !== -1}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selected.indexOf(ID_Rol) !== -1} onClick={(event) => handleClick(event, ID_Rol)} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt="" src="" />
                          <Typography variant="subtitle2" noWrap>
                            {ID_Rol}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{Nombre_Rol}</TableCell>
                      <TableCell align="left">{estadoText}</TableCell>
                      <TableCell align="left">
                        <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, ID_Rol)}>
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                        <Popover
                          open={Boolean(open) && selectedConfiguracionID === ID_Rol}
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
                          <MenuItem onClick={() => handleEditar(selectedConfiguracionID)}>
                            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                            Editar
                          </MenuItem>
                          <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete(selectedConfiguracionID)}>
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
                    <TableCell colSpan={5} />
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
      {/* Ventana modal */}
      <EditarConfi
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedConfiguracionID={selectedConfiguracionID}
      />
    </>
  );
}
