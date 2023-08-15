import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
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
  Checkbox,
  TextField,
  Modal,
  Grid,
  MenuItem,
  Typography
} from '@mui/material';

function EditarUsuario(props) {
  const { selectedUsuarioID, onHide, show } = props;
  const id = selectedUsuarioID;
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const permisos = ['Usuarios', 'Insumos', 'Anchetas', 'Pedidos'];
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState('');

  const handleCheckboxChange = (permiso) => {
    setSelectedPermisos((prevSelectedPermisos) =>
      prevSelectedPermisos.includes(permiso)
        ? prevSelectedPermisos.filter((selected) => selected !== permiso)
        : [...prevSelectedPermisos, permiso]
    );
  };

  const [, setIsChecked] = useState(false);
  const [values, setValues] = useState({
    correo: '',
    contrasena: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [correoError, setCorreoError] = useState(false);
  const [contrasenaError, setContrasenaError] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      setIsChecked(checked);
      setValues((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
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
        .get(`http://localhost:4000/api/admin/usuario/usullamada/${id}`)
        .then((res) => {
          setValues((prevValues) => ({
            ...prevValues,
            correo: res.data[0].correo,
          }));
          setSelectedRol(res.data[0].ID_Rol);
          setIsChecked(res.data[0].idUsuario === 1);
        })
        .catch((err) => console.log(err));
    } else {
      setValues({
        correo: '',
        contrasena: '',
      });
      setIsChecked(false);
      setShowPassword(false);
      setCorreoError(false);
      setContrasenaError(false);
      setGuardadoExitoso(false);
    }
  }, [id, show]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/admin/configuracion`)
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
    axios
      .put(`http://localhost:4000/api/admin/usuario/usuariarioedit/${id}`, values)
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', width: '100%', maxWidth: '450px' }}>
          <h2 style={{ textAlign: 'center' }}>Editar datos de Usuario</h2>
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
      {console.table(roles)}
      {roles.map((rol, index) => (
        <MenuItem key={index} value={rol.ID_Rol}>
          <Typography>{rol.Nombre_Rol}</Typography>
        </MenuItem>
      ))}
    </TextField>

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
                    <TableRow key={permiso}>
                      <TableCell>{permiso}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={selectedPermisos.includes(permiso)}
                          onChange={() => handleCheckboxChange(permiso)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
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
