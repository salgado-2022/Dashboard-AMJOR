import React, { useState, useEffect } from 'react';
import { Button, Checkbox, TextField, Typography, Stack } from '@mui/material';
import Modal from '@mui/material/Modal';
import Swal from 'sweetalert2';
import axios from 'axios';


function EditarConfi(props) {
  const { selectedConfiguracionID, onHide, show } = props;
  const id = selectedConfiguracionID;

  const [isChecked, setIsChecked] = useState(false);
  const [values, setValues] = useState({
    Nombre_Rol: ''
  });

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      setIsChecked(checked);
      setValues((prev) => ({ ...prev, [name]: checked ? 1 : 2 }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (show) {
      axios
        .get('http://localhost:4000/api/admin/configuracion/confillamada/' + id)
        .then((res) => {
          console.log(res);
          setValues((prevValues) => ({
            ...prevValues,
            Nombre_Rol: res.data[0].Nombre_Rol
          }));
          setIsChecked(res.data[0].ID_Estado === 1);
        })
        .catch((err) => console.log(err));
    }
  }, [id, show]);

  const handleUpdate = (event) => {
    event.preventDefault();

    // Validar campos
    if (!values.Nombre_Rol) {
      Swal.fire({
        title: 'Error',
        text: 'Debes ingresar el nombre del rol',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    axios
      .put('http://localhost:4000/api/admin/configuracion/confiedit/' + id, values)
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Modificado Correctamente',
          text: 'Tu rol se ha sido modificado correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(function () {
          window.location = 'confi';
        }, 670);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal
      onHide={onHide}
      open={show}
      onClose={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ zIndex: '2000', boxShadow: '0 0 10px MediumSlateBlue' }}
    >
      <div style={{ background: 'white', padding: '20px' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Editar Roles y los permisos
        </Typography>
        <Button variant="outlined" color="secondary" onClick={onHide} sx={{ float: 'right' }}>
          Cerrar
        </Button>
        <form onSubmit={handleUpdate}>
          <Stack spacing={3}>
            <div className="border p-4 rounded" role="alert">
              Aqui puedes hacer los cambios de un rol y permiso, debes escribir el Rol a modificar y elegir sus permisos.
            </div>
            <Typography variant="h6" gutterBottom>
              Nuevo rol
            </Typography>
            <TextField
              fullWidth
              id="rol"
              name="Nombre_Rol"
              label="Nombre del Rol"
              value={values.Nombre_Rol}
              onChange={handleInput}
            />
            <Typography variant="body2" color="text.secondary">
              Recuerda, solo letras
            </Typography>
            <Checkbox
              id="ID_Estado"
              name="ID_Estado"
              checked={isChecked}
              onChange={handleInput}
              sx={{ '& .MuiSvgIcon-root': { fontSize: '1.5rem' } }}
            />
            <label htmlFor="ID_Estado" style={{ fontSize: '1rem' }}>
              Disponible
            </label>
            <div>
              <Button type="button" color="secondary" onClick={onHide} sx={{ mr: 1 }}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar cambios
              </Button>
            </div>
          </Stack>
        </form>
      </div>
    </Modal>
  );
}

export { EditarConfi };
