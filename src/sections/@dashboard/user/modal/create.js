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
import Swal from 'sweetalert2';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function UsuariosFormulario2({ open, onClose, refreshList }) {
  const [values, setValues] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    documento: '',
    apellidos: '',
    telefono: '',
    rol: '',
  });

  const [existingEmailError, setExistingEmailError] = useState('');
  const [documentoError, setDocumentoError] = useState('');
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleCloseModal = () => {
    onClose(); // Cerrar la modal
  };

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/admin/configuracion')
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => {
        console.error('Error al cargar la lista de roles:', err);
      });
  }, []);

  const checkExistingEmail = (email) => {
    axios
      .get(`http://localhost:4000/api/checkEmail/${email}`)
      .then((res) => {
        if (res.data.exists) {
          setExistingEmailError('El correo ya está registrado.');
        }
      })
      .catch((err) => {
        console.error('Error al verificar el correo electrónico:', err);
      });
  };

  const checkExistingDocumento = (documento) => {
    if (/^\d{10}$/.test(documento)) {
      axios
        .get(`http://localhost:4000/api/checkDocumento/${documento}`)
        .then((res) => {
          if (res.data.exists) {
            setDocumentoError('El documento ya existe.');
          } else {
            setDocumentoError(''); // No hay error
          }
        })
        .catch((err) => {
          console.error('Error al verificar el documento:', err);
        });
    } else {
      setDocumentoError('El documento debe tener 10 dígitos numéricos.');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === 'correo') {
      setExistingEmailError('');
      checkExistingEmail(value);
    }
    if (name === 'documento') {
      setDocumentoError('');
      if (/^\d*$/.test(value)) {
        checkExistingDocumento(value);
      } else {
        setDocumentoError('Solo se permiten números.');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post('http://localhost:4000/api/crearUsuario', {
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
          title: 'Creado Correctamente',
          text: 'Tu usuario ha sido creado correctamente',
          icon: 'success',
        }).then((result) => {
          window.location.reload();
        });
      } else if (res.data.Error === 'El correo ya está registrado.') {
        setExistingEmailError('El correo ya está registrado.');
      } else {
        setExistingEmailError('Hubo un problema al registrar.');
      }
    } catch (err) {
      setExistingEmailError('Hubo un problema al registrar.');
    }
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          width: '90%', // Ajusta el ancho de acuerdo a tus necesidades
          maxWidth: '800px', // Establece un ancho máximo si es necesario
        }}
      >
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Crear un nuevo usuario</h2>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Documento"
                name="documento"
                type="text"
                value={values.documento}
                onChange={handleInputChange}
                margin="dense"
                fullWidth
                error={documentoError !== ''}
                helperText={documentoError}
              />
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefono"
                name="telefono"
                type="text"
                value={values.telefono}
                onChange={handleInputChange}
                margin="dense"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo electrónico"
                name="correo"
                value={values.correo}
                onChange={handleInputChange}
                margin="dense"
                error={existingEmailError !== ''}
                helperText={existingEmailError}
                fullWidth
              />
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
                onClose();
              }}
            >
              Guardar Cambios
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
