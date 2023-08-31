import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
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
  Stack,
  Modal,
  Grid,
} from '@mui/material';

function EditarConfi(props) {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

  const { selectedConfiguracionID, onHide, show, fetchData } = props;
  const id = selectedConfiguracionID;
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [isRolActivo, setIsRolActivo] = useState(false);
  const [permisos, setPermisos] = useState([]);
  const [values, setValues] = useState({
    Nombre_Rol: '',
    estado: '',
    Permisos: [],
  });

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      if (name === 'estado') {
        setIsRolActivo(checked);
      } else {
        if (checked) {
          setSelectedPermisos((prevSelectedPermisos) => [...prevSelectedPermisos, value]);
        } else {
          setSelectedPermisos((prevSelectedPermisos) =>
            prevSelectedPermisos.filter((permiso) => permiso !== value)
          );
        }
      }
    } else if (type === 'select-multiple') {
      const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
      setValues((prev) => ({ ...prev, [name]: selectedOptions }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
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
    onHide(); // Cerrar la modal
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Realizar las operaciones necesarias antes de cerrar la modal
    try {
      await handleUpdate();
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        Nombre_Rol: values.Nombre_Rol,
        estado: values.estado,
        Permisos: selectedPermisos,
      };
      await axios.put(`${apiUrl}/api/admin/configuracion/editarRol/${id}`, updatedData);
      Swal.fire({
        title: 'Modificado Correctamente',
        text: 'Tu rol se ha sido modificado correctamente',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      fetchData();
      setTimeout(() => {
        window.location = 'confi';
      }, 670);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al modificar el rol',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  useEffect(() => {
    if (show) {
      axios
        .get(`${apiUrl}/api/admin/configuracion/confillamada/${id}`)
        .then((res) => {
          console.log(res);
          setValues((prevValues) => ({
            ...prevValues,
            Nombre_Rol: res.data.Nombre_Rol,
            estado: res.data.estado,
          }));
          setIsRolActivo(res.data.estado === 1);
          setPermisos(res.data.permisos.map((permiso) => permiso.ID_Permiso));
          setSelectedPermisos(res.data.permisos.map((permiso) => permiso.ID_Permiso));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, show]);

  return (
    <Modal
      open={show}
      onClose={handleCloseModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ background: '#F8F9FA', padding: '15px', borderRadius: '8px', width: '500px' }}>
        <Typography variant="h5" align="center" sx={{ mb: 4 }}>
          Editar Roles y los permisos
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              id="Nombre_Rol"
              name="Nombre_Rol"
              label="Nombre del Rol"
              value={values.Nombre_Rol}
              onChange={handleInput}
            />
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
            <Grid item xs={12}>
              <Grid container alignItems="center" spacing={1} style={{ marginTop: '16px' }}>
                <Switch
                  color="success"
                  id="estado"
                  name="estado"
                  checked={isRolActivo}
                  onChange={handleInput}
                />
                <Typography>Rol Activo</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Guardar cambios
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" color="secondary" fullWidth onClick={handleCloseModal}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </form>
      </div>
    </Modal>
  );
}

export { EditarConfi };
