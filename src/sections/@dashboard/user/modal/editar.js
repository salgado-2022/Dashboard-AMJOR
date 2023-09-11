import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Button, TextField, Slide, Grid, MenuItem, Typography, Switch, Dialog, DialogContent } from '@mui/material';

// Función para validar un correo electrónico
function validateEmail(email) {
  // Utiliza una expresión regular para validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar una contraseña (puedes personalizar esta función según tus requisitos)
function validatePassword(password) {
  // Por ejemplo, puedes verificar que la contraseña tenga al menos 8 caracteres
  return password.length >= 8;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EditarUsuario(props) {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

  const { selectedUsuarioID, onHide, show } = props;
  const id = selectedUsuarioID;
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState('');
  const [values, setValues] = useState({
    Documento: '',
    Nombre: '',
    Apellido: '',
    Correo: '',
    Telefono: '',
    Contrasena: '',
    ID_Rol: '',
    Estado: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [correoError, setCorreoError] = useState('');
  const [documentoError, setDocumentoError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [nombreError, setNombreError] = useState('');
  const [contrasenaError, setContrasenaError] = useState('');
  const [telefonoError, setTelefonoError] = useState('');
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [isUsuarioActivo, setIsUsuarioActivo] = useState(false);
  const [rolError, setRolError] = useState('');

  const [validationErrors, setValidationErrors] = useState({
    Documento: null,
    Nombre: null,
    Apellido: null,
    Telefono: null,
    Email: null,
    Password: null,
    rol: null,
  });

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

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      if (name === 'estado') {
        setIsUsuarioActivo(checked);
        setValues((prev) => ({ ...prev, [name]: checked }));
      } else {
        setValues((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (name === 'documento') {
      if (!value) {
        setDocumentoError('Campo obligatorio');
      } else if (!/^[0-9]+$/.test(value) || value.length < 8 || value.length > 10) {
        setDocumentoError('Documento inválido, solo números y de 8 a 10 caracteres');
      } else {
        setDocumentoError('');
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

    if (name === 'nombre') {
      if (!value) {
        setNombreError('Campo obligatorio');
      } else if (!/^[a-zA-ZñÑ\s]+$/.test(value) || value.length < 4) {
        setNombreError('Nombre inválido');
      } else {
        setNombreError('');
      }
    }

    if (name === 'apellido') {
      if (!value) {
        setApellidoError('Campo obligatorio');
      } else if (value.length < 5) {
        setApellidoError('Debe tener al menos 5 letras');
      } else {
        setApellidoError('');
      }
    }

    if (name === 'telefono') {
      if (!value) {
        setTelefonoError('Campo obligatorio');
      } else if (!/^[0-9]+$/.test(value) || value.length < 7 || value.length > 11) {
        setTelefonoError('Teléfono inválido');
      } else {
        setTelefonoError('');
      }
    }

    if (name === 'correo') {
      if (!value) {
        setCorreoError('Campo obligatorio');
      } else if (!validateEmail(value)) {
        setCorreoError('Correo inválido');
      } else {
        setCorreoError('');
        axios.post(`${apiUrl}/api/validate/email`, { Email: value }).then((res) => {
          if (res.data.Status === 'Exists') {
            setCorreoError('El correo ya está registrado');
          }
        });
      }
    }

    if (name === 'contrasena') {
      if (!value) {
        setContrasenaError('Campo obligatorio');
      } else if (!validatePassword(value)) {
        setContrasenaError('Contraseña inválida');
      } else {
        setContrasenaError('');
      }
    }

    if (name === 'ID_Rol') {
      if (!value) {
        setRolError('Campo obligatorio');
      } else {
        setRolError('');
      }
    }
  };

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (show) {
      axios
        .get(`${apiUrl}/api/admin/usuario/usullamada/${id}`)
        .then((res) => {
          const userData = res.data;
          if (userData) {
            // Actualiza las variables de estado con los datos del usuario
            setValues({
              ...values,
              documento: userData.Documento_Cliente,
              nombre: userData.Nombre_Cliente,
              apellido: userData.Apellido_Cliente,
              correo: userData.correo,
              telefono: userData.Telefono_Cliente,
              estado: userData.Estado,
            });
            setSelectedRol(userData.ID_Rol);
            setIsUsuarioActivo(userData.Estado === 1);
            setDataLoaded(true); // Marcar los datos como cargados
          } else {
            setDataLoaded(false); // Marcar los datos como no cargados si falta userData
          }
        })
        .catch((err) => {
          console.log(err);
          setDataLoaded(false); // Marcar los datos como no cargados en caso de error
        });
    } else {
      resetFields();
      setShowPassword(false);
      setCorreoError('');
      setContrasenaError('');
      setGuardadoExitoso(false);
      setIsUsuarioActivo(false);
      setDataLoaded(true); // Marcar los datos como cargados cuando se oculta el componente
    }
  }, [id, show]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/admin/configuracion`)
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => console.log(err));
  }, [apiUrl]);

  const handleUpdate = (event) => {
    event.preventDefault();

    const documentoValido = /^[0-9]{1,11}$/.test(values.documento);
    console.log(documentoValido)
    console.log(values.documento)
    setDocumentoError(!documentoValido);

    const nombreValido = /^[a-zA-ZñÑ\s]+$/.test(values.nombre) && values.nombre.length >= 4;
    setNombreError(!nombreValido);

    const apellidoValido = /^[a-zA-ZñÑ\s]+$/.test(values.apellido) && values.apellido.length >= 5;
    setApellidoError(!apellidoValido);

    const telefonoValido = /^[0-9]+$/.test(values.telefono) && values.telefono.length >= 7 && values.telefono.length <= 11;
    setTelefonoError(!telefonoValido);

    const correoValido = validateEmail(values.correo);
    setCorreoError(!correoValido);

    if (values.contrasena) {
      const contrasenaValida = validatePassword(values.contrasena);
      setContrasenaError(!contrasenaValida);

      if (!contrasenaValida) {
        return;
      }
    }

    if (!documentoValido || !nombreValido || !apellidoValido || !telefonoValido || !correoValido) {
      return;
    }

    const selectedRole = roles.find((rol) => rol.ID_Rol === selectedRol);
    const nuevoID_Rol = selectedRole.ID_Rol;

    setValues((prevValues) => ({
      ...prevValues,
      ID_Rol: nuevoID_Rol,
    }));
    axios
      .put(`${apiUrl}/api/admin/usuario/usuariarioedit/${id}`, values)
      .then((res) => {
        setGuardadoExitoso(true);
        Swal.fire({
          title: 'Modificado correctamente',
          text: 'El usuario ha sido modificado correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 2600,
        });
        setTimeout(() => {
          props.fetchData();
          resetFields(); // Limpiar los campos
          onHide(); // Cerrar la modal
        }, 50);
      })
      .catch((err) => console.log(err));
  };

  const resetFields = () => {
    setValues({
      documento: '',
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      contrasena: '',
      ID_Rol: '',
      estado: '',
    });
    setDocumentoError('');
    setNombreError('');
    setApellidoError('');
    setCorreoError('');
    setTelefonoError('');
    setContrasenaError('');
    setRolError('');
  };

  const handleCancelClick = () => {
    resetFields();
    onHide();
  };

  return (
    <Dialog open={show} onClose={onHide} TransitionComponent={Transition}>
      <DialogContent>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Editar datos de usuario</h2>
        <form onSubmit={handleUpdate} id="editarUsuario">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Documento"
                variant="outlined"
                type="number"
                name="documento"
                value={values.documento}
                onChange={handleInput}
                onBlur={handleBlur}
                error={!!documentoError}
                helperText={documentoError}
                style={{ marginTop: '16px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nombre"
                variant="outlined"
                type="text"
                name="nombre"
                value={values.nombre}
                onChange={handleInput}
                onBlur={handleBlur}
                error={!!nombreError}
                helperText={nombreError}
                style={{ marginTop: '16px' }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Apellido"
                variant="outlined"
                type="text"
                name="apellido"
                value={values.apellido}
                onChange={handleInput}
                onBlur={handleBlur}
                error={!!apellidoError}
                helperText={apellidoError}
                style={{ marginTop: '16px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Correo"
                variant="outlined"
                type="email"
                name="correo"
                value={values.correo}
                onChange={handleInput}
                onBlur={handleBlur}
                error={!!correoError}
                helperText={correoError}
                style={{ marginTop: '16px' }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Telefono"
                variant="outlined"
                type="number"
                name="telefono"
                value={values.telefono}
                onChange={handleInput}
                onBlur={handleBlur}
                error={!!telefonoError}
                helperText={telefonoError}
                style={{ marginTop: '16px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contraseña"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                name="contrasena"
                value={values.contrasena}
                onChange={handleInput}
                onBlur={handleBlur}
                error={!!contrasenaError}
                helperText={contrasenaError}
                style={{ marginTop: '16px' }}
                InputProps={{
                  endAdornment: (
                    <Button onClick={toggleShowPassword}>
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </Button>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <TextField
            select
            fullWidth
            required
            label="Rol"
            variant="outlined"
            name="ID_Rol"
            value={selectedRol}
            onChange={(event) => setSelectedRol(event.target.value)}
            error={!!rolError}
            helperText={rolError}
            style={{ marginTop: '16px' }}
          >
            {roles.map((rol, index) => (
              <MenuItem key={index} value={rol.ID_Rol}>
                <Typography>{rol.Nombre_Rol || 'Nombre no disponible'}</Typography>
              </MenuItem>
            ))}
          </TextField>
          <Grid container alignItems="center" spacing={1} style={{ marginTop: '16px' }}>
            <Typography style={{ paddingLeft: '15px' }}>Estado del usuario:</Typography>
            <Switch color="switch" id="estado" name="estado" checked={isUsuarioActivo} onChange={handleInput} />
          </Grid>
          <Grid container spacing={2} style={{ marginTop: '16px' }}>
            <Grid item xs={12} sm={6}>
              <Button type="submit" style={{ textTransform: 'none' }} variant="contained" color="primary" fullWidth>
                Guardar cambios
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" color="secondary" fullWidth onClick={handleCancelClick}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { EditarUsuario };
