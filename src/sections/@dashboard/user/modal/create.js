import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
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

//----------------------------------------------------------------

const NoNumberArrowsTextField = styled(TextField)(({ theme }) => ({
  '& input[type=number]': {
      MozAppearance: 'textfield', // Firefox
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
      },
  },
}));

//----------------------------------------------------------------


function UsuariosFormulario2({ open, onClose, fetchData }) {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

  const [values, setValues] = useState({
    Documento: '',
        Nombre: '',
        Apellidos: '',
        Telefono: '',
        Email: '',
        Password: '',
    rol: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    Documento: false,
        Nombre: false,
        Apellidos: false,
        Telefono: false,
        Email: false,
        Password: false,
    rol: false,
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
        Apellidos: '',
        Telefono: '',
        Email: '',
        Password: '',
    rol: '',
    });
    setValidationErrors({
      Documento: false,
        Nombre: false,
        Apellidos: false,
        Telefono: false,
        Email: false,
        Password: false,
    rol: false,
    });
  };

    const [documentoInput, setDocumentoInput] = useState(null);

    const [nameInput, setNameInput] = useState(null)

    const [lastName, setLastName] = useState(null)

    const [telInput, setTelInput] = useState(null)

    const [emailInput, setEmailInput] = useState(null);

    const [passwordInput, setPasswordInput] = useState(null);

    const documentoRegex = /^\d{1,10}$/;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    //Validacion para que acepte ñ y espacios en blanco
    const textRegex = /^[a-zA-Z0-9ñÑ\s]+$/;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

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
    const { name, value } = event.target

    if (name === 'Documento') {
        if (!value) {
            setDocumentoInput('Campo obligatorio')
        } else if (!documentoRegex.test(value)) {
            setDocumentoInput('Documento invalido')
        } else {
            setDocumentoInput(null);
            axios.post(`${apiUrl}/api/validate/documento`, values)
                .then(res => {
                    if (res.data.Status === "Success") {
                        setDocumentoInput(null)
                    } else if (res.data.Status === "Exists") {
                        setDocumentoInput('El documento ya se encuentra registrado')
                    }
                })
        }
    }
    if (name === 'Email') {
        if (!value) {
            setEmailInput('Campo obligatorio')
        } else if (!emailRegex.test(value)) {
            setEmailInput('Correo invalido')
        } else {
            setEmailInput(null);

            axios.post(`${apiUrl}/api/validate/email`, values)
                .then(res => {
                    if (res.data.Status === "Success") {
                        setEmailInput(null)
                    } else if (res.data.Status === "Exists") {
                        setEmailInput('El correo ya esta registrado')
                    }
                })
        }
    }
    if (name === 'Telefono') {
        if (!value) {
            setTelInput('Campo obligatorio')
        } else if (!documentoRegex.test(value)) {
            setTelInput('Telefono invalido')
        } else {
            setTelInput(null)
        }
    }
    if (name === 'Nombre') {
        if (!value) {
            setNameInput('Campo obligatorio')
        } else if (!textRegex.test(value)) {
            setNameInput('Nombre invalido')
        } else {
            setNameInput(null)
        }
    }
    if (name === 'Apellidos') {
        if (!value) {
            setLastName('Campo obligatorio')
        } else if (!textRegex.test(value)) {
            setLastName('Apellido invalido')
        } else {
            setLastName(null)
        }
    }
    if (name === 'Password') {
        if (!value) {
            setPasswordInput('Campo obligatorio')
        } else if (!passwordRegex.test(value)) {
            setPasswordInput('Contraseña invalida')
        } else {
            setPasswordInput(null)
        }
    }
};


  const handleSubmit = async (event) => {
    event.preventDefault();

    // Realizar validaciones aquí según las expresiones regulares y reglas
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const telefonoRegex = /^\d{5,11}$/;

    setValidationErrors({
      documento: !documentoRegex.test(values.Documento),
      correo: !emailRegex.test(values.correo),
      contrasena: !passwordRegex.test(values.contrasena),
      nombre: values.Nombre === '',
      telefono: !telefonoRegex.test(values.Telefono),
      apellidos: values.Apellidos === '',
      rol: values.rol === '',
    });

    try {
      const res = await axios.post(`${apiUrl}/api/crearUsuario`, {
        correo: values.correo,
        contrasena: values.contrasena,
        documento: values.Documento,
        nombre: values.Nombre,
        apellido: values.Apellidos,
        telefono: values.Telefono,
        rol: values.rol,
      });

      if (res.data.Status === 'Success') {
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
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Crear un nuevo usuario</h2>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <NoNumberArrowsTextField
                                    label="Documento"
                                    name="documento"
                                    type="number"
                                    margin="dense"
                                    fullWidth
                                    color="secondary"
                                    value={values.documento}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                     error={documentoInput !== null}
                                    helperText={documentoInput}
                                    inputProps={{
                                        inputMode: 'numeric',
                                        pattern: '[0-9]*',
                                    }}
                                />
                          
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nombre"
                                    name="nombre"
                                    type="text"
                                    margin="dense"
                                    color="secondary"
                                    fullWidth
                                    value={values.nombre}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={nameInput !== null}
                                    helperText={nameInput}
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
                error={lastName !== null}
                helperText={lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                name="telefono"
                type="number"
                value={values.telefono}
                onChange={handleInputChange}
                margin="dense"
                fullWidth
                error={telInput !== null}
                                    helperText={telInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo electrónico"
                type="email"
                name="correo"
                value={values.correo}
                onChange={handleInputChange}
                onBlur={handleBlur}
                margin="dense"
                fullWidth
                error={emailInput !== null}
                helperText={emailInput}
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
                error={passwordInput !== null}
                helperText={passwordInput}
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
                <Select
                  label="Rol"
                  name="rol"
                  value={values.rol}
                  onChange={handleInputChange}
                  margin="dense"
                  error={validationErrors.rol}
                  helperText={validationErrors.rol && 'Rol inválido.'}
                >
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
