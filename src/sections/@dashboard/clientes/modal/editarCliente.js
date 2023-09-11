import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
  Button,
  TextField,
  Modal,
  Grid,
  MenuItem,
  Typography,
  Switch,
  Paper,
} from '@mui/material';

// Función para validar correo electrónico
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

function EditarCliente(props) {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

  const { selectedUsuarioID, onHide, show } = props;
  const id = selectedUsuarioID;
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState('');
  const [values, setValues] = useState({
    documento: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    ID_Rol: 'Cliente',
    estado: '',
  });
  const [correoError, setCorreoError] = useState('');
  const [documentoError, setDocumentoError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [nombreError, setNombreError] = useState('');
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
    rol: null,
  });

  const resetForm = () => {
    setValues({
      Documento: '',
      Nombre: '',
      Apellido: '',
      Telefono: '',
      Email: '',
      rol: 'Cliente',
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
  };

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (show) {
      axios
        .get(`${apiUrl}/api/admin/usuario/usullamada/${id}`)
        .then((res) => {
          const userData = res.data;

          // Verifica si userData tiene los campos esperados antes de asignarlos
          if (
            userData &&
            userData.correo &&
            userData.Documento_Cliente &&
            userData.Nombre_Cliente &&
            userData.Apellido_Cliente &&
            userData.Telefono_Cliente &&
            userData.Estado !== undefined
          ) {
            setValues((prevValues) => ({
              ...prevValues,
              correo: userData.correo,
              documento: userData.Documento_Cliente,
              nombre: userData.Nombre_Cliente,
              apellido: userData.Apellido_Cliente,
              telefono: userData.Telefono_Cliente,
              estado: userData.Estado,
            }));
            setSelectedRol(userData.ID_Rol);
            setIsUsuarioActivo(userData.Estado === 1);
          } else {
            // Si los datos no son los esperados, marca que la carga falló
            setDataLoaded(false);
          }
        })
        .catch((err) => {
          console.log(err);
          // Marca que la carga falló en caso de error
          setDataLoaded(false);
        });
    } else {
      setValues({
        documento: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        ID_Rol: 'Cliente',
        estado: '',
      });
      setCorreoError('');
      setGuardadoExitoso(false);
      setIsUsuarioActivo(false);
      // Marca que la carga fue exitosa al ocultar el componente
      setDataLoaded(true);
    }
  }, [id, show]);

  const handleUpdate = (event) => {
    event.preventDefault();

    const documentoValido = /^[0-9]+$/.test(values.documento) && values.documento.length >= 8 && values.documento.length <= 10;
    setDocumentoError(!documentoValido);
  
    const nombreValido = /^[a-zA-ZñÑ\s]+$/.test(values.nombre) && values.nombre.length >= 4;
    setNombreError(!nombreValido);
  
    const apellidoValido = /^[a-zA-ZñÑ\s]+$/.test(values.apellido) && values.apellido.length >= 5;
    setApellidoError(!apellidoValido);
  
    const telefonoValido = /^[0-9]+$/.test(values.telefono) && values.telefono.length >= 7 && values.telefono.length <= 11;
    setTelefonoError(!telefonoValido);
  
    const correoValido = validateEmail(values.correo);
    setCorreoError(!correoValido);
  

    if (!documentoValido || !nombreValido || !apellidoValido || !telefonoValido || !correoValido) {
      return;
    }
    setValues((prevValues) => ({
      ...prevValues,
      ID_Rol: 2,
    }));
  
    axios
      .put(`${apiUrl}/api/admin/cliente/clienteedit/${id}`, values)
      .then((res) => {
        setGuardadoExitoso(true);
        Swal.fire({
          title: 'Modificado Correctamente',
          text: 'El cliente ha sido modificado correctamente',
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
      ID_Rol: 'Cliente',
      estado: '',
    });
    setDocumentoError('');
    setNombreError('');
    setApellidoError('');
    setCorreoError('');
    setTelefonoError('');
    setRolError('');
  };

  const handleCancelClick = () => {
    resetFields();
    onHide();
  };

  return (
    <Modal onClose={onHide} open={show}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px', width: '100%', maxWidth: '600px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Editar datos del Cliente</h2>
          <form onSubmit={handleUpdate} id="editarUsuario">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
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
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
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
            </Grid>
            <TextField
              fullWidth
              label="Rol"
              variant="outlined"
              type="text"
              name="ID_Rol"
              value="Cliente" // Valor fijo "Cliente"
              InputProps={{
                readOnly: true, // Hace que el campo sea de solo lectura
              }}
              style={{ marginTop: '16px' }}
            >
            </TextField>
            <Grid container alignItems="center" spacing={1} style={{ marginTop: '16px' }}>
              <Switch color="switch" id="estado" name="estado" checked={isUsuarioActivo} onChange={handleInput} />
              <Typography>Usuario Activo</Typography>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '16px' }}>
              <Grid item xs={12} sm={6}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
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
        </Paper>
      </div>
    </Modal>
  );
}

export { EditarCliente };
