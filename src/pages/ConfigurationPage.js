import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { ConfiFormulario } from '../sections/@dashboard/configuracion/modal/crearte';

// @mui
import {
  Card,
  Table,
  Stack,
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
  TableContainer,
  Skeleton,
} from '@mui/material';

// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Label from '../components/label';
import { EditarConfi } from '../sections/@dashboard/configuracion/modal/edita';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Rol', label: 'ID', alignRight: false },
  { id: 'Nombre_Rol', label: 'Rol', alignRight: false },
  { id: 'estado', label: 'Estado del Rol', alignRight: false },
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
    return filter(array, (_Rol) => _Rol.Nombre_Rol.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ListaConfiguracion() {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

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
  const [loading, setLoading] = useState(true);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${apiUrl}/api/admin/configuracion`)
      .then((res) => {
        setData(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`${apiUrl}/api/admin/configuracion/Confidel/${id}`)
      .then((res) => {
        console.log(res);
        fetchData();
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
    setShowDeleteMenu(true);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setSelectedConfiguracionID(null);
    setShowDeleteMenu(false);
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
    setModalShow(false);
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

  const handleEditar = (ID_Rol) => {
    setSelectedConfiguracionID(ID_Rol);
    setModalShow(true);
    setOpen(null);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const filteredRol = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredRol.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Configuración | AMJOR</title>
      </Helmet>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Configuración
          </Typography>
          <ConfiFormulario open={modalShow} onClose={handleCloseModal} />
        </Stack>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Buscar rol..."
          />

          <Scrollbar>
            {loading ? (
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
                    {Array.from({ length: rowsPerPage }).map((_, index) => (
                      <TableRow key={index} hover role="checkbox">
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Typography variant="subtitle2" noWrap>
                              <Skeleton variant="rounded" width={23} height={10} />
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left" width={310}>
                          <Skeleton variant="rounded" width={170} height={22} />
                        </TableCell>
                        <TableCell align="left" width={266}>
                          <Label>
                            <Skeleton variant="rounded" width={100} height={22} />
                          </Label>
                        </TableCell>
                        <TableCell align="left" width={295}>
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
                  {filteredRol.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { ID_Rol, Nombre_Rol, estado } = row;
                    const selectedConfiguracionID = selected.indexOf(ID_Rol) !== -1;
                    const estadoText = estado === 1 ? 'Activo' : 'Inactivo';
                    return (
                      <TableRow
                        hover
                        key={ID_Rol}
                        tabIndex={-1}
                        role="checkbox"
                        selected={selected.indexOf(ID_Rol) !== -1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.indexOf(ID_Rol) !== -1}
                            onClick={(event) => handleClick(event, ID_Rol)}
                          />
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
                        <TableCell align="left">
                          <Label color={(estadoText === 'Activo' && 'success') || 'error'}>
                            {sentenceCase(estadoText)}
                          </Label>
                        </TableCell>
                        <TableCell align="left">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenu(event, ID_Rol)}
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
                            <MenuItem sx={{ color: 'warning.main' }} onClick={() => handleEditar(ID_Rol)}>
                                <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                                Editar
                              </MenuItem>
                              <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete(ID_Rol)}>
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
          />
        </Card>
      </Container>
      <EditarConfi
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedConfiguracionID={selectedConfiguracionID}
        onEditSuccess={() => {
          setModalShow(false);
          fetchData();
        }}
      />
    </>
  );
}
