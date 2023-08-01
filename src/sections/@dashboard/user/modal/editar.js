import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import { Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import axios from 'axios';

function EditarUsuario(props) {
  const { selectedUsuarioID, onHide, show } = props;
  const id = selectedUsuarioID;

  const [isChecked, setIsChecked] = useState(false);
  const [values, setValues] = useState({
    correo: '',
    contrasena: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [correoError, setCorreoError] = useState(false);
  const [contrasenaError, setContrasenaError] = useState(false);

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
          console.log('Valores', res);
          setValues((prevValues) => ({
            ...prevValues,
            correo: res.data[0].correo,
          }));
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
    }
  }, [id, show]);

  const handleUpdate = (event) => {
    event.preventDefault();

    // Validar correo electrónico
    const correoValido = validateEmail(values.correo);
    setCorreoError(!correoValido);

    // Validar contraseña solo si se ha ingresado una nueva
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
        console.log(res);
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

  return (
    <Modal onClose={onHide} open={show} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
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
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={handleInput}
                name="ID_Estado"
                color="primary"
              />
            }
            label="Disponible"
            style={{ marginBottom: '16px' }}
          />
          <Button type="submit" variant="contained" color="primary" id="modUsuario" fullWidth>
            Guardar Cambios
          </Button>
          <Button variant="contained" color="secondary" id="cancelarUsuario" fullWidth style={{ marginTop: '8px' }} onClick={onHide}>
            Cancelar
          </Button>
        </form>
      </div>
    </Modal>
  );
}

export { EditarUsuario };
