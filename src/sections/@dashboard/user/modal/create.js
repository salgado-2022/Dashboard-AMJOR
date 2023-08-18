import React, { useState, useEffect } from 'react';
import {
  Modal,
  TextField,
  FormControl,
  Button,
  Select,
  MenuItem,
  InputLabel,
  DialogActions,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';
// Importa tus funciones de validación aquí

function UsuariosFormulario2({ open, onClose, fetchData }) {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;
  
  const [values, setValues] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    documento: '',
    apellidos: '',
    telefono: '',
    rol: '',
  });

  const [, setExistingEmailError] = useState('');

  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleCloseModal = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setValues({
      nombre: '',
      correo: '',
      contrasena: '',
      documento: '',
      apellidos: '',
      telefono: '',
      rol: '',
    });
    setExistingEmailError('');
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/admin/configuracion`)
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => {
        console.error('Error al cargar la lista de roles:', err);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(`${apiUrl}/api/crearUsuario`, {
        correo: values.correo,
        contrasena: values.contrasena,
        documento: values.documento,
        nombre: values.nombre,
        apellido: values.apellidos,
        telefono: values.telefono,
        rol: values.rol,
      });

      if (res.data.Status === 'Success') {
        Swal.fire({
          title: 'Usuario creado correctamente',
          text: 'El usuario ha sido creado exitosamente.',
          icon: 'success',
        }).then(() => {
          onClose();
        });
      } else if (res.data.Error === 'El correo ya está registrado.') {
        setExistingEmailError('El correo ya está registrado.');
      } else {
        setExistingEmailError('Hubo un problema al registrar.');
      }
    } catch (err) {
      setExistingEmailError('Hubo un problema al registrar.');
    }
    fetchData();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',  
          borderRadius: '8px',
          width: '100%',
          maxWidth: '800px',
        }} 
      > 
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>
          Crear un nuevo usuario</h2>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Documento"
                name="documento"
                type="number"
                value={values.documento}
                onChange={handleInputChange}
                margin="dense"
                fullWidth
              />
              {/* Mostrar mensaje de error si es necesario */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                name="nombre"
                type="text"
                value={values.nombre}
                onChange={handleInputChange}
                margin="dense"
                fullWidth
              />
              {/* Mostrar mensaje de error si es necesario */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellidos"
                name="apellidos"
                type="text"
                value={values.apellidos}
                onChange={handleInputChange}
                margin="dense"
                fullWidth
              />
              {/* Mostrar mensaje de error si es necesario */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefono"
                name="telefono"
                type="number"
                value={values.telefono}
                onChange={handleInputChange}
                margin="dense"
                fullWidth
              />
              {/* Mostrar mensaje de error si es necesario */}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo electrónico"
                type='Email'
                name="correo"
                value={values.correo}
                onChange={handleInputChange}
                margin="dense"
                fullWidth
              />
              {/* Mostrar mensaje de error si es necesario */}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                name="contrasena"
                type={showPassword ? 'text' : 'password'}
                value={values.contrasena}
                onChange={handleInputChange}
                margin="dense"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* Mostrar mensaje de error si es necesario */}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Seleccionar rol</InputLabel>
                <Select label="Rol" name="rol" value={values.rol} onChange={handleInputChange} margin="dense">
                  {roles.map((rol) => (
                    <MenuItem key={rol.ID_Rol} value={rol.ID_Rol}>
                      {rol.Nombre_Rol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '8px' }}
              onClick={(event) => {
                handleSubmit(event);
              }}
            >
              Crear Usuario
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              style={{ marginTop: '8px' }}
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
          </DialogActions>
        </form>
      </div>
    </Modal>
  );
}

export { UsuariosFormulario2 };
