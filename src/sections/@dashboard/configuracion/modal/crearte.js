import React, { useState } from 'react';
import Iconify from "../../../../components/iconify";
import {
  Button,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

function ConfiFormulario({ onClose }) {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;
  
  const [rol, setRol] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState({ rol: '', general: '' });

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRol('');
    setErrorMessages({ rol: '', general: '' });
  };

  const validarRolPermiso = () => {
    const errors = {};

    if (!rol.trim()) {
      errors.rol = 'Debes ingresar un rol.';
    }

    if (Object.keys(errors).length === 0) {
      axios
        .post(`${apiUrl}/api/crearRol`, { rol })
        .then((res) => {
          if (res.data.Status === 'Success') {
            Swal.fire({
              title: 'Rol agregado correctamente',
              text: 'El rol ha sido creado exitosamente.',
              icon: 'success',
            }).then(() => {
              onClose();
              handleCloseModal();
            });
          } else {
            setErrorMessages({ ...errorMessages, general: 'Error al crear el rol.' });
          }
          window.location.reload()
        })
        .catch((err) => {
          console.log(err);
          setErrorMessages({ ...errorMessages, general: 'Error en la solicitud.' });
        });
    } else {
      setErrorMessages(errors);
    }
  };

  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        style={{ marginBottom: '16px', float: 'right' }}
        startIcon={<Iconify icon="eva:plus-fill" />}
      >
        Crear nuevo rol
      </Button>
      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth>
        <DialogTitle>Crear un nuevo rol</DialogTitle>
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
            }}
          >
            Crear el rol
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
      {Boolean(errorMessages.general) && (
        <Alert severity="error" style={{ marginTop: '8px' }}>
          {errorMessages.general}
        </Alert>
      )}
    </Container>
  );
}

export { ConfiFormulario };
