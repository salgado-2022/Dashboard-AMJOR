import React, { useState } from 'react';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';

function ConfiFormulario() {
  const [rol, setRol] = useState('');
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const permisos = ['Usuarios', 'Insumos', 'Anchetas', 'Pedidos'];

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRol('');
    setSelectedPermisos([]);
  };

  const validarRolPermiso = () => {
    if (!rol.trim()) {
      Swal.fire({
        title: 'Validación fallida',
        text: 'Debes ingresar un rol.',
        icon: 'error',
      });
    } else if (selectedPermisos.length === 0) {
      Swal.fire({
        title: 'Validación fallida',
        text: 'Debes seleccionar al menos 1 permiso.',
        icon: 'error',
      });
    } else {
      axios
        .post('http://localhost:4000/api/crearRol', { rol, permisos: selectedPermisos })
        .then((res) => {
          if (res.data.Status === 'Success') {
            Swal.fire({
              title: 'Creado Correctamente',
              text: 'El Rol y los permisos se han creado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
            handleCloseModal(); // Cerrar el modal inmediatamente después de crear
            setTimeout(function () {
              window.location = 'confi';
            }, 670);
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Hubo un problema al crear el rol.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            title: 'Error!',
            text: 'Hubo un problema al crear el rol.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    }
  };

  const handleCheckboxChange = (permiso) => {
    if (selectedPermisos.includes(permiso)) {
      setSelectedPermisos(selectedPermisos.filter((item) => item !== permiso));
    } else {
      setSelectedPermisos([...selectedPermisos, permiso]);
    }
  };

  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        style={{ marginBottom: '16px', float: 'right' }}
      >
        Crear Rol y Permisos
      </Button>
      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth>
        <DialogTitle>Crear un nuevo rol y permisos</DialogTitle>
        <DialogContent dividers>
          <TextField                                                                      //CREAR DE CONFIGURACIÓN - ROLES Y PERMISOS 
            label="Nuevo rol"
            fullWidth
            variant="outlined"
            required
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          />
          <br></br><br></br>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Permiso</TableCell>
                  <TableCell align="center">Seleccionar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permisos.map((permiso) => (
                  <TableRow key={permiso}>
                    <TableCell>{permiso}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={selectedPermisos.includes(permiso)}
                        onChange={() => handleCheckboxChange(permiso)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            id="modRol"
            fullWidth
            onClick={validarRolPermiso}
          >
            Crear el rol y permiso
          </Button>
          <Button
            variant="contained"
            color="secondary"
            id="cancelarRol"
            fullWidth
            style={{ marginTop: '8px' }}
            onClick={handleCloseModal}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export { ConfiFormulario };
