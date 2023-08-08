import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

function ConfiFormulario() {
  const [rol, setRol] = useState("");
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const permisos = ["Usuarios", "Insumos", "Anchetas", "Pedidos"];

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const validarRolPermiso = () => {
    if (!rol.trim()) {
      Swal.fire({
        title: "Validación fallida",
        text: "Debes ingresar un rol.",
        icon: "error",
      });
    } else if (selectedPermisos.length === 0) {
      Swal.fire({
        title: "Validación fallida",
        text: "Debes seleccionar al menos 1 permiso.",
        icon: "error",
      });
    } else {
      // Aquí se ejecutará la solicitud POST para crear el rol y permisos
      axios
        .post("http://localhost:4000/api/crearRol", { rol, permisos: selectedPermisos })
        .then((res) => {
          if (res.data.Status === "Success") {
            Swal.fire({
              title: "Creado Correctamente",
              text: "El Rol y los permisos se han creado correctamente",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(function () {
              window.location = "confi";
            }, 670);
          } else {
            Swal.fire({
              title: "Error!",
              text: "Hubo un problema al crear el rol.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            title: "Error!",
            text: "Hubo un problema al crear el rol.",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }
  };

  const handleCheckboxChange = (permiso) => {
    if (selectedPermisos.includes(permiso)) {
      setSelectedPermisos(selectedPermisos.filter((item) => item !== permiso));
    } else {
      setSelectedPermisos([...selectedPermisos, permiso]);
    }
  };

  return (
    <Container>
      <Typography variant="h5" className="mt-5 mb-4">
        Configuración
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => setModalOpen(true)}>
            Crear Rol y Permisos
          </Button>
          <Dialog open={modalOpen} onClose={handleCloseModal}>
            <DialogTitle>Crear un nuevo rol y permisos</DialogTitle>
            <DialogContent>
              <TextField
                label="Nuevo rol"
                fullWidth
                variant="outlined"
                required
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              />
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
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Cancelar
              </Button>
              <Button onClick={validarRolPermiso} color="primary">
                Crear
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Container>
  );
}

export { ConfiFormulario };
