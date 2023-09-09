import React, { useState, useEffect } from 'react';
import Iconify from '../../../../components/iconify';
import {
  Button,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Slide,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfiFormulario({ onClose }) {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

  const [modalOpen, setModalOpen] = useState(false);
  const [rol, setRol] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [permissionsMap, setPermissionsMap] = useState({});
  const [errorMessages, setErrorMessages] = useState({ rol: '', permissions: '', general: '' });

  const handleOpenModal = () => {
    loadPermissions();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetModalState();
  };

  const resetModalState = () => {
    setRol('');
    setPermissionsMap({});
    setErrorMessages({ rol: '', permissions: '', general: '' });
  };

  const loadPermissions = () => {
    axios
      .get(`${apiUrl}/api/admin/listpermisos`)
      .then((res) => {
        const permissionsData = {};
        res.data.forEach((permission) => {
          permissionsData[permission.ID_Permiso] = false;
        });
        setPermissionsMap(permissionsData);
        setPermissions(res.data);
      })
      .catch((err) => {
        console.table('Error al cargar la lista de permisos:', err);
      });
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const handlePermissionToggle = (permissionId) => {
    setPermissionsMap((prevPermissions) => ({
      ...prevPermissions,
      [permissionId]: !prevPermissions[permissionId],
    }));
  };

  const validarRolPermiso = () => {
    const errors = {};

    if (!rol.trim()) {
      errors.rol = 'Debes ingresar un rol.';
    }

    const selectedPermissions = Object.keys(permissionsMap).filter((permissionId) => permissionsMap[permissionId]);

    if (selectedPermissions.length === 0) {
      errors.permissions = 'Debes seleccionar al menos un permiso.';
    }

    if (Object.keys(errors).length === 0) {
      axios
        .post(`${apiUrl}/api/crearRol`, { rol, permisos: selectedPermissions })
        .then((res) => {
          if (res.data.status === 'Success') {
            Swal.fire({
              title: 'Rol agregado correctamente',
              text: 'El rol ha sido creado exitosamente.',
              icon: 'success',
            }).then(() => {
              onClose();
            });
          } else {
            setErrorMessages({ ...errorMessages, general: 'Error al crear el rol.' });
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorMessages({ ...errorMessages, general: 'Error en la solicitud.' });
        })
        .finally(() => {
          handleCloseModal(); // Asegúrate de que se cierre el modal sin importar si la solicitud tuvo éxito o no
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
      <Dialog open={modalOpen} onClose={handleCloseModal} TransitionComponent={Transition} fullWidth>
        <DialogTitle variant="h5" align="center" sx={{ mb: 1 }}>Crear un nuevo rol</DialogTitle>
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
          <br />
          <br />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Permiso</TableCell>
                  <TableCell align="right">Habilitar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.ID_Permiso}>
                    <TableCell>{permission.NombrePermiso}</TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={permissionsMap[permission.ID_Permiso] || false}
                        onChange={() => handlePermissionToggle(permission.ID_Permiso)}
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
              validarRolPermiso()
                .then(() => {
                  // Cerrar el modal solo si el rol se creó correctamente
                  onClose();
                })
                .catch((errors) => {
                  // Manejar errores si es necesario
                });
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
            onClick={() => {
              handleCloseModal();
              resetModalState();
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      {errorMessages.permissions && (
        <Alert severity="error" style={{ marginTop: '8px' }}>
          {errorMessages.permissions}
        </Alert>
      )}
      {errorMessages.general && (
        <Alert severity="error" style={{ marginTop: '8px' }}>
          {errorMessages.general}
        </Alert>
      )}
    </Container>
  );
}

export { ConfiFormulario };
