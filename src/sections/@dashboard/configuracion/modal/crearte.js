import React, { useState, useEffect } from 'react';
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
  Alert,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

function ConfiFormulario( onClose ) {
  const [rol, setRol] = useState('');
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState({ rol: '', permisos: '' });

  useEffect(() => {
    console.log('entro')
    fetchData();
  }, []);


  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRol('');
    setSelectedPermisos([]);
    setErrorMessages({ rol: '', permisos: '' });
  };

  const validarRolPermiso = () => {
    const errors = {};

    if (!rol.trim()) {
      errors.rol = 'Debes ingresar un rol.';
    }

    if (selectedPermisos.length === 0) {
      errors.permisos = 'Debes seleccionar al menos 1 permiso.';
    }

    if (Object.keys(errors).length === 0) {
      axios
        .post('http://localhost:4000/api/crearRol', { rol, permisos: selectedPermisos })
        .then((res) => {
          if (res.data.Status === 'Success') {
            Swal.fire({
              title: 'Rol y permisos agregados correctamente',
              text: 'El rol y permisos han sido creados exitosamente.',
              icon: 'success',
            }).then(() => {
              onClose();
              handleCloseModal();
         
            });
          } else {
            setErrorMessages({ ...errorMessages, general: 'Error al crear el rol.' });
          }
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          setErrorMessages({ ...errorMessages, general: 'Error en la solicitud.' });
        });
    } else {
      setErrorMessages(errors);
    }
  };
  
  const fetchData = () => {
    axios
      .get('http://localhost:4000/api/admin/listpermisos')
      .then((res) => {
        //setPermisos(res.data);
        console.log(res.data)
        console.log('error')
      })
      .catch((err) => console.log('perro'));
  };

  
  fetchData()

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
          <TextField
            label="Nuevo rol"
            fullWidth
            variant="outlined"
            required
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            error={Boolean(errorMessages.rol)}
            helperText={errorMessages.rol}
          />
          <br /><br />
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
           style={{ marginTop: '8px' }}
           onClick={() => {
             validarRolPermiso();
             handleCloseModal();
             onClose();
           }}
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
      {Boolean(errorMessages.permisos) && (
        <Alert severity="error" style={{ marginTop: '8px' }}>
          {errorMessages.permisos}
        </Alert>
      )}
      {Boolean(errorMessages.general) && (
        <Alert severity="error" style={{ marginTop: '8px' }}>
          {errorMessages.general}
        </Alert>
      )}
    </Container>
  );
}

export { ConfiFormulario };
