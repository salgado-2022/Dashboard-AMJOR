import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  Button,
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
import Label from '../components/label';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

import { AddInsumo } from '../sections/@dashboard/supplies/modal/add';
import { EditInsumo } from '../sections/@dashboard/supplies/modal/edit';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Insumo', label: 'ID', alignRight: false },
  { id: 'NombreInsumo', label: 'Nombre', alignRight: false },
  { id: 'Descripcion', label: 'Descripcion', alignRight: false },
  { id: 'PrecioUnitario', label: 'Precio', alignRight: false },
  { id: 'Estado', label: 'Estado', alignRight: false },
  { id: '' },
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
    return filter(array, (_nombre) => _nombre.NombreInsumo.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SuppliesPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('desc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('ID_Insumo');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([]);

  const [selectedInsumo, setSelectedInsumo] = useState(null);

  //Modal Editar Usuario
  const [modalShow, setModalShow] = useState(false);

  //Modal Crear Usuario
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchData = () => {
    axios
      .get('http://localhost:4000/api/admin/insumos')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete('http://localhost:4000/api/admin/insumos/insumodel/' + id)
      .then((res) => {
        console.log(res);
        fetchData();
        Swal.fire({
          title: 'Eliminado Correctamente',
          text: 'Tu insumo ha sido eliminado correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleOpenMenu = (event, ID_Insumo) => {
    setOpen(event.currentTarget);
    setSelectedInsumo(ID_Insumo); // Agregar este estado para almacenar el idUsuario seleccionado
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setSelectedInsumo(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.ID_Insumo);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, ID_Insumo) => {
    const selectedIndex = selected.indexOf(ID_Insumo);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, ID_Insumo);
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
    setSelectedInsumo(idSelectedUser); // Asignar el idUsuario seleccionado al estado
    setModalShow(true);
    setOpen(null);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Insumos | AMJOR </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Insumos
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
            Crear Insumo
          </Button>
          <AddInsumo open={openModal} onClose={handleCloseModal} />
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Buscar Insumo..."
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
                    const { ID_Insumo, NombreInsumo, Descripcion, PrecioUnitario, Estado } = row;
                    const selectedUser = selected.indexOf(ID_Insumo) !== -1;

                    return (
                      <TableRow hover key={ID_Insumo} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, ID_Insumo)} />
                        </TableCell>

                        <TableCell key={ID_Insumo}>
                          <Typography variant="subtitle2" noWrap>
                            #{ID_Insumo}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">{NombreInsumo}</TableCell>
                        <TableCell align="left">{Descripcion}</TableCell>
                        <TableCell align="left">{PrecioUnitario}</TableCell>
                        <TableCell align="left">
                          <Label color={(Estado === 'Agotado' && 'error') || 'success'}>{sentenceCase(Estado)}</Label>
                        </TableCell>

                        <TableCell align="left">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenu(event, ID_Insumo)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                        <Popover
                          open={Boolean(open) && selectedInsumo === ID_Insumo}
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
                          <MenuItem sx={{ color: 'warning.main' }} onClick={() => handleEditar(selectedInsumo)}>
                            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                            Editar
                          </MenuItem>

                          <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete(selectedInsumo)}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                            Eliminar
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
      <EditInsumo show={modalShow} onHide={() => setModalShow(false)} selectedInsumoID={selectedInsumo} />
    </>
  );
}
