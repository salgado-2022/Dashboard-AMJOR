import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
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
  Dialog,
  DialogContent,
  Slide,
} from '@mui/material';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';

const NoNumberArrowsTextField = styled(TextField)(({ theme }) => ({
  '& input[type=number]': {
    MozAppearance: 'textfield',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UsuariosFormulario2({ open, onClose, fetchData }) {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

  const [values, setValues] = useState({
    Documento: '',
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Email: '',
    Password: '',
    rol: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    Documento: null,
    Nombre: null,
    Apellido: null,
    Telefono: null,
    Email: null,
    Password: null,
    rol: null,
  });

  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleCloseModal = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setValues({
      Documento: '',
      Nombre: '',
      Apellido: '',
      Telefono: '',
      Email: '',
      Password: '',
      rol: '',
    });
    setValidationErrors({
      Documento: null,
      Nombre: null,
      Apellido: null,
      Telefono: null,
      Email: null,
      Password: null,
      rol: null,
    });
  };

  const documentoRegex = /^\d{1,10}$/;
  const telefonoRegex = /^\d{5,11}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const textRegex = /^[a-zA-Z0-9ñÑ\s]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/admin/configuracion`)
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => {
        console.error('Error al cargar la lista de roles:', err);
      });
  }, [apiUrl]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (name === 'Documento') {
      if (!value) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Documento: 'Campo obligatorio',
        }));
      } else if (!documentoRegex.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Documento: 'Documento inválido',
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Documento: null,
        }));
        axios.post(`${apiUrl}/api/validate/documento`, values).then((res) => {
          if (res.data.Status === 'Exists') {
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              Documento: 'El documento ya se encuentra registrado',
            }));
          }
        });
      }
    }

    if (name === 'Nombre') {
      if (!value) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Nombre: 'Campo obligatorio',
        }));
      } else if (!textRegex.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Nombre: 'Nombre inválido',
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Nombre: null,
        }));
      }
    }

    if (name === 'Apellido') {
      if (!value) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Apellido: 'Campo obligatorio',
        }));
      } else if (!textRegex.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Apellido: 'Apellido inválido',
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Apellido: null,
        }));
      }
    }

    if (name === 'Telefono') {
      if (!value) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Telefono: 'Campo obligatorio',
        }));
      } else if (!telefonoRegex.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Telefono: 'Teléfono inválido',
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Telefono: null,
        }));
      }
    }

    if (name === 'Email') {
      if (!value) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Email: 'Campo obligatorio',
        }));
      } else if (!emailRegex.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Email: 'Correo inválido',
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Email: null,
        }));
        axios.post(`${apiUrl}/api/validate/email`, values).then((res) => {
          if (res.data.Status === 'Exists') {
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              Email: 'El correo ya está registrado',
            }));
          }
        });
      }
    }

    if (name === 'Password') {
      if (!value) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Password: 'Campo obligatorio',
        }));
      } else if (!passwordRegex.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Password: 'Contraseña inválida',
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Password: null,
        }));
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifica que no haya errores de validación antes de enviar la solicitud
    if (
      Object.values(validationErrors).every((error) => error === null)
    ) {
      try {
        const res = await axios.post(`${apiUrl}/api/crearUsuario`, {
          correo: values.Email,
          contrasena: values.Password,
          documento: values.Documento,
          nombre: values.Nombre,
          apellido: values.Apellido,
          telefono: values.Telefono,
          rol: values.rol,
        });

        if (res.data.Status === 'Success') {
          // Restablece los errores después de un envío exitoso
          setValidationErrors({
            Documento: null,
            Nombre: null,
            Apellido: null,
            Telefono: null,
            Email: null,
            Password: null,
            rol: null,
          });

          Swal.fire({
            title: 'Usuario creado correctamente',
            text: 'El usuario ha sido creado exitosamente.',
            icon: 'success',
          }).then(() => {
            fetchData();
            handleCloseModal();
          });
        } else if (res.data.Error) {
          // Si la API devuelve un mensaje de error, mostrarlo
          Swal.fire({
            title: 'Error',
            text: res.data.Error,
            icon: 'error',
          });
        }
      } catch (error) {
        console.error('Error al crear el usuario:', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} TransitionComponent={Transition}>
      <DialogContent>
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Crear un nuevo usuario</h2>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <NoNumberArrowsTextField
                label="Documento"
                name="Documento"
                type="number"
                margin="dense"
                fullWidth
                required
                color="secondary"
                value={values.Documento}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={validationErrors.Documento !== null}
                helperText={validationErrors.Documento || ''}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                name="Nombre"
                type="text"
                margin="dense"
                color="secondary"
                fullWidth
                required
                value={values.Nombre}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={validationErrors.Nombre !== null}
                helperText={validationErrors.Nombre || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido"
                name="Apellido"
                type="text"
                value={values.Apellido}
                onChange={handleInputChange}
                onBlur={handleBlur}
                margin="dense"
                fullWidth
                required
                error={validationErrors.Apellido !== null}
                helperText={validationErrors.Apellido || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                name="Telefono"
                type="number"
                value={values.Telefono}
                onChange={handleInputChange}
                onBlur={handleBlur}
                margin="dense"
                fullWidth
                required
                error={validationErrors.Telefono !== null}
                helperText={validationErrors.Telefono || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo electrónico"
                type="email"
                name="Email"
                value={values.Email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                margin="dense"
                fullWidth
                required
                error={validationErrors.Email !== null}
                helperText={validationErrors.Email || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                name="Password"
                type={showPassword ? 'text' : 'password'}
                value={values.Password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                margin="dense"
                fullWidth
                required
                error={validationErrors.Password !== null}
                helperText={validationErrors.Password || ''}
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
              <FormControl fullWidth required>
                <InputLabel>Seleccionar rol</InputLabel>
                <Select
                  label="Rol"
                  name="rol"
                  value={values.rol}
                  onChange={handleInputChange}
                  margin="dense"
                  error={validationErrors.rol !== null}
                >
                  {roles.map((rol) => (
                    <MenuItem key={rol.ID_Rol} value={rol.ID_Rol}>
                      {rol.Nombre_Rol}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.rol && (
                  <div style={{ color: 'red', fontSize: '0.75rem' }}>
                    {validationErrors.rol}
                  </div>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ textTransform: 'none', marginTop: '8px' }}
              onClick={(event) => {
                handleSubmit(event);
                resetForm();
                onClose();
              }}
            >
              Crear usuario
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
      </DialogContent>
    </Dialog>
  );
}

export { UsuariosFormulario2 };
