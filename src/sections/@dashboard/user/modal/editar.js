import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
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
    <Modal onHide={onHide} show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" className="text-black">
          Editar datos de Usuario
        </Modal.Title>
        <Button variant="secondary" onClick={props.onHide} className="close">
          <span aria-hidden="true">&times;</span>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div>
          <form onSubmit={handleUpdate} id="editarUsuario">
            <div className="form-group">
              <label htmlFor="correo">Cambia tu correo</label>
              <input
                type="email"
                className={`form-control ${correoError ? 'is-invalid' : ''}`}
                id="correo"
                name="correo"
                value={values.correo}
                onChange={handleInput}
              />
              {correoError && <div className="invalid-feedback">Por favor, ingresa un correo electrónico válido.</div>}
            </div>
            <div className="form-group">
              <label htmlFor="contrasena">Cambia tu Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${contrasenaError ? 'is-invalid' : ''}`}
                  id="contrasena"
                  name="contrasena"
                  value={values.contrasena}
                  onChange={handleInput}
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button" onClick={toggleShowPassword}>
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                {contrasenaError && (
                  <div className="invalid-feedback">
                    La contraseña debe tener al menos 5 caracteres, la primera letra debe ser mayúscula y debe contener
                    al menos 2 números sin espacios.
                  </div>
                )}
              </div>
            </div>
            <div className="form-check" style={{ marginBottom: '7px' }}>
              <input
                type="checkbox"
                className="form-check-input"
                id="ID_Estado"
                name="ID_Estado"
                checked={isChecked}
                onChange={handleInput}
              />
              <label className="form-check-label" htmlFor="estadoUsuarios">
                Disponible
              </label>
            </div>
            <button type="submit" className="btn btn-primary" id="modUsuario">
              Guardar Cambios
            </button>{' '}
            &nbsp;
            <button type="button" className="btn btn-dark" id="cancelarUsuario" onClick={props.onHide}>
              Cancelar
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export { EditarUsuario };
