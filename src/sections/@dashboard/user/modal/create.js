import React, { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import Swal from 'sweetalert2';
import axios from 'axios';
import { InputAdornment, TextField, FormControl } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

function UsuariosFormulario2() {
  const [values, setValues] = useState({
    correo: '',
    contrasena: '',
  });

  const [errors, setErrors] = useState({
    correo: '',
    contrasena: '',
  });

  const [existingEmailError, setExistingEmailError] = useState('');

  const handleCorreoChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      correo: !validateEmail(value) ? 'Ingrese un correo electrónico válido.' : '',
    }));
    setExistingEmailError(''); // Limpiamos el mensaje de error al cambiar el correo
    checkExistingEmail(value);
  };

  const handleContrasenaChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      contrasena: !validatePassword(value)
        ? 'La contraseña debe tener al menos 8 caracteres y empezar con mayúscula.'
        : '',
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (values.correo === '' || values.contrasena === '') {
      return;
    }

    if (!validateEmail(values.correo)) {
      setExistingEmailError(''); // Limpiamos el mensaje de error antes de mostrar el nuevo error
      setErrors({
        ...errors,
        correo: 'Ingrese un correo electrónico válido.',
      });
      return;
    }

    if (selectedRoles.length === 0) {
      setRolesError('Debe seleccionar al menos un rol.');
      return;
    }

    axios
      .post('http://localhost:4000/api/crearUsuario', values)
      .then((res) => {
        if (res.data.Status === 'Success') {
          Swal.fire({
            title: 'Creado Correctamente',
            text: 'Tu usuario ha sido creado correctamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(function () {
            window.location = 'user';
          }, 670);
        } else if (res.data.Error === 'El correo ya está registrado.') {
          setExistingEmailError('El correo ya está registrado.');
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Hubo un problema al registrar: ' + res.data.Error,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error!',
          text: 'Hubo un problema al registrar.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  const isCorreoValid = values.correo !== "" && validateEmail(values.correo);
  const isContrasenaValid = values.contrasena !== "" && validatePassword(values.contrasena);

  const roles = ["Administrador", "Cliente", "Empleado"];
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [rolesError, setRolesError] = useState('');

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

  const handleRoleCheckboxChange = (role) => {
    if (selectedRoles.includes(role)) {
      return;
    }
    setSelectedRoles([role]);
    setRolesError('');
  };

  return (
    <>
      <div className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1 className="h3 mb-3 text-black">Crear nuevo Usuario</h1>
              <form onSubmit={handleSubmit}>
                <div className="p-3 p-lg-12 border rounded">
                  <div className="form-group row">
                    <div className="col-md-12">
                      <label htmlFor="correo" className="text-black custom-font">
                        CORREO ELECTRÓNICO <span className="text-danger">*</span>
                      </label>
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="correo"
                          id="correo"
                          placeholder="juan@gmail.com"
                          value={values.correo}
                          onChange={handleCorreoChange}
                          error={!!errors.correo || !!existingEmailError}
                          helperText={errors.correo || existingEmailError}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {isCorreoValid && !existingEmailError && (
                                  <span className="input-group-append">
                                    <span className="input-group-text bg-success border-0">
                                      <AiOutlineCheckCircle size={20} color="white" />
                                    </span>
                                  </span>
                                )}
                              </InputAdornment>
                            ),
                          }}
                          style={{ borderRadius: '8px' }}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <br />
                  <div className="form-group row">
                    <div className="col-md-12">
                      <label htmlFor="contraseña" className="text-black">
                        CONTRASEÑA <span className="text-danger">*</span>
                      </label>
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="password"
                          name="contrasena"
                          id="contraseña"
                          value={values.contrasena}
                          onChange={handleContrasenaChange}
                          error={!!errors.contrasena}
                          helperText={errors.contrasena}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {isContrasenaValid && (
                                  <span className="input-group-append">
                                    <span className="input-group-text bg-success border-0">
                                      <AiOutlineCheckCircle size={20} color="white" />
                                    </span>
                                  </span>
                                )}
                              </InputAdornment>
                            ),
                          }}
                          style={{ borderRadius: '8px' }}
                        />
                      </FormControl>
                      {values.contrasena.length > 0 && (
                        <div>
                          <h6>Contraseña: {values.contrasena}</h6>
                          <br />
                        </div>
                      )}
                    </div>
                  </div>
                  &nbsp;
                  <div className="row">
                    <div className="col-md-12 d-flex justify-content-start">
                      <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        id="UsuariosFormulario2"
                      >
                        Guardar el nuevo Usuario
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-md-6">
              <h2 className="h3 mb-3 text-black">Roles</h2>
              {rolesError && (
                <p style={{ color: 'red', backgroundColor: 'rgba(255, 0, 0, 0.2)', padding: '8px', marginBottom: '8px' }}>
                  {rolesError}
                </p>
              )}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rol</TableCell>
                      <TableCell align="center">Seleccionar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role}>
                        <TableCell>{role}</TableCell>
                        <TableCell align="center">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedRoles.includes(role)}
                                onChange={() => handleRoleCheckboxChange(role)}
                              />
                            }
                            label=""
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { UsuariosFormulario2 };
