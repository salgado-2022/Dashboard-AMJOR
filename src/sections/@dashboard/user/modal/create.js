import React, { useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import axios from "axios";

function UsuariosFormulario2() {
  const [values, setValues] = useState({
    correo: "",
    contrasena: "",
  });

  const [errors, setErrors] = useState({
    correo: "",
    contrasena: "",
  });

  const handleCorreoChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Validar el correo electrónico en tiempo real
    setErrors((prevState) => ({
      ...prevState,
      correo: !validateEmail(value) ? "Ingrese un correo electrónico válido." : "",
    }));
  };

  const handleContrasenaChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Validar la contraseña en tiempo real
    setErrors((prevState) => ({
      ...prevState,
      contrasena: !validatePassword(value)
        ? "La contraseña debe tener al menos 8 caracteres y empezar con mayúscula."
        : "",
    }));
  };

  const validateEmail = (email) => {
    // Expresión regular para validar el correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Expresión regular para validar la contraseña (al menos 8 caracteres y empezar con mayúscula)
    const passwordRegex = /^(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (values.correo === "" || values.contrasena === "") {
      return;
    }

    if (!validateEmail(values.correo)) {
      Swal.fire({
        title: "Error!",
        text: "Ingrese un correo electrónico válido.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    axios
      .post("http://localhost:4000/api/crearUsuario", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          Swal.fire({
            title: "Creado Correctamente",
            text: "Tu usuario ha sido creado correctamente",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(function () {
            window.location = "user";
          }, 670);
        } else {
          // Mostrar mensaje de error personalizado
          Swal.fire({
            title: "Error!",
            text: "Hubo un problema al registrar: " + res.data.Error,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((err) => {
        // Mostrar mensaje de error en caso de fallar la llamada a la API
        Swal.fire({
          title: "Error!",
          text: "Hubo un problema al registrar.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const isCorreoValid = values.correo !== "" && validateEmail(values.correo);
  const isContrasenaValid = values.contrasena !== "" && validatePassword(values.contrasena);

  return (
    <>
      <div className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1 className="h3 mb-3 text-black">Crear un nuevo Usuario.</h1>
            </div>
            {/* Contenedor vacío al lado derecho */}
            <div className="col-md-6"></div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {/* Agregar el formulario aquí */}
              <form onSubmit={handleSubmit}>
                <div className="p-3 p-lg-12 border rounded">
                  <div className="form-group row">
                    <div className="col-md-12">
                      <label htmlFor="correo" className="text-black custom-font">
                        CORREO ELECTRONICO{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control rounded ${
                            errors.correo || (values.correo !== "" && !isCorreoValid)
                              ? "is-invalid"
                              : ""
                          }`}
                          id="correo"
                          name="correo"
                          placeholder="juan@gmail.com"
                          value={values.correo}
                          onChange={handleCorreoChange}
                        />
                        {isCorreoValid && (
                          <span className="input-group-append">
                            <span className="input-group-text bg-success border-0">
                              <AiOutlineCheckCircle size={20} color="white" />
                            </span>
                          </span>
                        )}
                      </div>
                      <span className="text-danger">{errors.correo}</span>
                    </div>
                  </div>
                  <br />
                  <div className="form-group row">
                    <div className="col-md-12">
                      <label htmlFor="contraseña" className="text-black">
                        CONTRASEÑA{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="password"
                          className={`form-control rounded ${
                            errors.contrasena || (values.contrasena !== "" && !isContrasenaValid)
                              ? "is-invalid"
                              : ""
                          }`}
                          id="contraseña"
                          name="contrasena"
                          value={values.contrasena}
                          onChange={handleContrasenaChange}
                        />
                        {isContrasenaValid && (
                          <span className="input-group-append">
                            <span className="input-group-text bg-success border-0">
                              <AiOutlineCheckCircle size={20} color="white" />
                            </span>
                          </span>
                        )}
                      </div>
                      <span className="text-danger">{errors.contrasena}</span>
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
                      <button
                        type="submit"
                        className="btn btn-primary2"
                        id="UsuariosFormulario2"
                      >
                        Guardar el nuevo Usuario
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { UsuariosFormulario2 };
