import React, { useState, useEffect } from 'react';
import { Modal, TextField, FormControl, Button, Select, MenuItem, InputLabel } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

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
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/listarConfiguracion')
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
    if (name === 'correo') {
      setExistingEmailError('');
      checkExistingEmail(value);
    }
  };

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
        onClose(); // Cerrar la modal después de crear el usuario
        refreshList(); // Recargar la lista de usuarios
        Swal.fire({
          title: 'Creado Correctamente',
          text: 'Tu usuario ha sido creado correctamente',
          icon: 'success',
          confirmButtonText: 'OK',
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
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          width: '800px',
        }}
      >
        <h2 style={{ marginBottom: '16px' }}>Crear un nuevo usuario</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '16px' }}>
            <TextField
              label="Documento"
              name="documento"
              type="text"
              value={values.documento}
              onChange={handleInputChange}
              margin="normal"
              style={{ width: '48%' }}
            />
            <TextField
              label="Nombre"
              name="nombre"
              type="text"
              value={values.nombre}
              onChange={handleInputChange}
              margin="normal"
              style={{ width: '48%' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '16px' }}>
            <TextField
              label="Apellidos"
              name="apellidos"
              type="text"
              value={values.apellidos}
              onChange={handleInputChange}
              margin="normal"
              style={{ width: '48%' }}
            />
            <TextField
              label="Telefono"
              name="telefono"
              type="text"
              value={values.telefono}
              onChange={handleInputChange}
              margin="normal"
              style={{ width: '48%' }}
            />
          </div>
          <TextField
            label="Correo electrónico"
            name="correo"
            value={values.correo}
            onChange={handleInputChange}
            margin="normal"
            error={existingEmailError !== ''}
            helperText={existingEmailError}
            style={{ width: '100%' }}
          />
          <TextField
            label="Contraseña"
            name="contrasena"
            type="password"
            value={values.contrasena}
            onChange={handleInputChange}
            margin="normal"
            style={{ width: '100%' }}
          />
          <FormControl style={{ marginTop: '16px', width: '100%' }}>
            <InputLabel>Rol</InputLabel>
            <Select
              label="Rol"
              name="rol"
              value={values.rol}
              onChange={handleInputChange}
              margin="normal"
            >
              {roles.map((rol) => (
                <MenuItem key={rol.ID_Rol} value={rol.ID_Rol}>
                  {rol.Nombre_Rol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
            Crear Usuario
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            style={{ marginTop: '8px' }}
            onClick={onClose}
          >
            Cancelar
          </Button>
        </form>
      </div>
    </Modal>
  );
}

export { UsuariosFormulario2 };
