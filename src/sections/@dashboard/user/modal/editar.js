import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Button, TextField, Modal, Grid, MenuItem, Typography, Switch } from '@mui/material';

function EditarUsuario(props) {
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

  const { selectedUsuarioID, onHide, show } = props;
  const id = selectedUsuarioID;
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState('');
  const [values, setValues] = useState({
    correo: '',
    contrasena: '',
    ID_Rol: '',
    estado: false, // Cambio en el estado
  });
  const [showPassword, setShowPassword] = useState(false);
  const [correoError, setCorreoError] = useState(false);
  const [contrasenaError, setContrasenaError] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [isUsuarioActivo, setIsUsuarioActivo] = useState(false);

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

  useEffect(() => {
    if (show) {
      axios
        .get(`${apiUrl}/api/admin/usuario/usullamada/${id}`)
        .then((res) => {
          setValues((prevValues) => ({
            ...prevValues,
            correo: res.data[0].correo,
          }));
          setSelectedRol(res.data[0].ID_Rol);
          setIsUsuarioActivo(res.data[0].Estado === 1);
        })
        .catch((err) => console.log(err));
    } else {
      setValues({
        correo: '',
        contrasena: '',
        ID_Rol: '',
        estado: false,
      });
      setShowPassword(false);
      setCorreoError(false);
      setContrasenaError(false);
      setGuardadoExitoso(false);
      setIsUsuarioActivo(false);
    }
  }, [id, show]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/admin/configuracion`)
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleUpdate = (event) => {
    event.preventDefault();
    const correoValido = validateEmail(values.correo);
    setCorreoError(!correoValido);
  
    if (values.contrasena) {
      const contrasenaValida = validatePassword(values.contrasena);
      setContrasenaError(!contrasenaValida);
  
      if (!contrasenaValida) {
        return;
      }
    }
    if (!correoValido) {
      return;
    }
  
    // Obtenemos el ID_Rol y el Nombre_Rol del rol seleccionado
    const selectedRole = roles.find((rol) => rol.ID_Rol === selectedRol);
    const nuevoID_Rol = selectedRole.ID_Rol;
    // No es necesario agregar el Nombre_Rol aquí, ya que no se usa en la actualización
  
    // Actualizamos los valores en el objeto "values" antes de la solicitud
    setValues((prevValues) => ({
      ...prevValues,
      ID_Rol: nuevoID_Rol,
    }));
  
    axios
      .put(`${apiUrl}/api/admin/usuario/usuariarioedit/${id}`, values)
      .then((res) => {
        setGuardadoExitoso(true);
        Swal.fire({
          title: 'Modificado Correctamente',
          text: 'Tu Usuario se ha sido modificado correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location = 'user';
        }, 670);
      })
      .catch((err) => console.log(err));
  };
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d{2})(?!.*\s).{5,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    if (guardadoExitoso && show) {
      onHide();
    }
  });

  return (
    <Modal onClose={onHide} open={show} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', width: '100%', maxWidth: '600px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Editar datos de Usuario</h2>
          <form onSubmit={handleUpdate} id="editarUsuario">
            <TextField
              fullWidth
              label="Cambia tu correo"
              variant="outlined"
              name="correo"
              value={values.correo}
              onChange={handleInput}
              error={correoError}
              helperText={correoError ? 'Por favor, ingresa un correo electrónico válido.' : ''}
              style={{ marginBottom: '16px', borderRadius: '8px' }}
            />
            <TextField
              fullWidth
              label="Cambia tu Contraseña"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              name="contrasena"
              value={values.contrasena}
              onChange={handleInput}
              error={contrasenaError}
              helperText={
                contrasenaError
                  ? 'La contraseña debe tener al menos 5 caracteres, la primera letra debe ser mayúscula y debe contener al menos 2 números sin espacios.'
                  : ''
              }
              style={{ marginBottom: '10px', borderRadius: '8px' }}
              InputProps={{
                endAdornment: (
                  <Button onClick={toggleShowPassword}>
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </Button>
                ),
              }}
            />
            <TextField
  select
  fullWidth
  label="Seleccionar Rol"
  variant="outlined"
  name="ID_Rol"
  value={selectedRol}
  onChange={(event) => setSelectedRol(event.target.value)}
  style={{ marginBottom: '16px', borderRadius: '8px' }}
>
  {roles.map((rol, index) => (
    <MenuItem key={index} value={rol.ID_Rol}>
      <Typography>{rol.Nombre_Rol || 'Nombre no disponible'}</Typography>
    </MenuItem>
  ))}
</TextField>
            <Grid item xs={12}>
              <Grid container alignItems="center" spacing={1}>
                <Switch color="switch" id="estado" name="estado" checked={isUsuarioActivo} onChange={handleInput} />
                <Typography>Disponible</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Guardar cambios
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="contained" color="secondary" fullWidth onClick={onHide}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export { EditarUsuario };
