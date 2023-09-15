import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  TextField,
  Typography,
  Grid,
  DialogTitle,
  Slide,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EditarConfi(props) {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

  const { selectedConfiguracionID, onHide, show, fetchData } = props;
  const id = selectedConfiguracionID;
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [isRolActivo, setIsRolActivo] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [permissionsMap, setPermissionsMap] = useState({});
  const [values, setValues] = useState({
    Nombre_Rol: '',
    estado: '',
  });
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorPermisos, setErrorPermisos] = useState(false);

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      if (name === 'estado') {
        setIsRolActivo(checked);
        setValues((prev) => ({ ...prev, [name]: checked }));
      } else {
        setSelectedPermisos((prevSelectedPermisos) =>
          checked ? [...prevSelectedPermisos, value] : prevSelectedPermisos.filter((permiso) => permiso !== value)
        );
      }
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }

    // Validar que el campo "Nombre del rol" no esté vacío
    if (name === 'Nombre_Rol' && value.trim() === '') {
      setErrorNombre(true);
    } else {
      setErrorNombre(false);
    }

    // Validar que al menos se haya seleccionado un permiso
    if (name === 'selectedPermisos' && value.length === 0) {
      setErrorPermisos(true);
    } else {
      setErrorPermisos(false);
    }
  };

  const handleSwitchChange = (permisoID) => {
    setSelectedPermisos((prevSelectedPermisos) =>
      prevSelectedPermisos.includes(permisoID)
        ? prevSelectedPermisos.filter((selected) => selected !== permisoID)
        : [...prevSelectedPermisos, permisoID]
    );
  };

  const handleCloseModal = () => {
    onHide();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar nuevamente que los campos no estén vacíos
    if (values.Nombre_Rol.trim() === '') {
      setErrorNombre(true);
    } else {
      setErrorNombre(false);
    }

    // Validar que al menos se haya seleccionado un permiso
    if (selectedPermisos.length === 0) {
      setErrorPermisos(true);
    } else {
      setErrorPermisos(false);
    }

    // Si no hay errores, proceder con el envío de datos
    if (!errorNombre && !errorPermisos) {
      try {
        await handleUpdate();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        Nombre_Rol: values.Nombre_Rol,
        estado: values.estado,
        Permisos: selectedPermisos,
      };

      await axios.put(`${apiUrl}/api/admin/configuracion/confiedit/${id}`, updatedData);
      fetchData();

      // Comprueba si todos los campos están correctamente diligenciados antes de cerrar la modal
      if (!errorNombre && !errorPermisos) {
        handleCloseModal(); // Cierra la modal si los campos están correctos
      }

      Swal.fire({
        title: 'Modificado Correctamente',
        text: 'Tu rol se ha sido modificado correctamente',
        icon: 'success',
        showConfirmButton: true,
      });
    } catch (error) {
      console.error(error);
    }
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
        console.error('Error al cargar la lista de permisos:', err);
      });
  };

  const loadPermissionsForRole = () => {
    axios
      .get(`${apiUrl}/api/admin/configuracion/confillamada/${id}`)
      .then((res) => {
        setValues({
          Nombre_Rol: res.data.Nombre_Rol,
          estado: res.data.estado,
        });
        setIsRolActivo(res.data.estado === 1);
        setSelectedPermisos(res.data.permisos.map((permiso) => permiso.ID_Permiso));

        const permissionsData = {};
        res.data.permisos.forEach((permiso) => {
          permissionsData[permiso.ID_Permiso] = true;
        });
        setPermissionsMap(permissionsData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (show) {
      loadPermissionsForRole();
    }
    loadPermissions();
  }, [id, show]);

  return (
    <Dialog open={show} onClose={onHide} TransitionComponent={Transition}>
      <DialogTitle>
        <Typography variant="h5" align="center" sx={{ mb: 1 }}>
          Editar rol y permisos
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ width: '600px' }}>
        <TextField
          fullWidth
          required
          id="Nombre_Rol"
          name="Nombre_Rol"
          label="Nombre del rol"
          value={values.Nombre_Rol}
          onChange={handleInput}
          error={errorNombre}
          helperText={errorNombre ? 'El campo no puede estar vacío' : ''}
        />
        <br />
        <br />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Permiso</TableCell>
                <TableCell align="center">Seleccionar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permiso) => (
                <TableRow key={permiso.ID_Permiso}>
                  <TableCell>{permiso.NombrePermiso}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={selectedPermisos.includes(permiso.ID_Permiso)}
                      onChange={() => handleSwitchChange(permiso.ID_Permiso)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={-1} style={{ marginTop: '1px' }}>
          <Typography style={{ paddingLeft: '16px' }}>Estado del rol: </Typography>
          <Switch color="switch" id="estado" name="estado" checked={isRolActivo} onChange={handleInput} />
        </Grid>
      </Grid>
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          id="modRol"
          fullWidth
          style={{ textTransform: 'none', marginTop: '8px' }}
          onClick={handleSubmit}
        >
          Guardar cambios
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
  );
}

export { EditarConfi };
