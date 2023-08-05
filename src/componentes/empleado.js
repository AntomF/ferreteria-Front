import React, { useState, useEffect } from "react";
import EstructuraMenu from "./EstructuraMenu";
import Actualizar from "../Imagenes/Actualizar.png";
import Eliminar from "../Imagenes/Eliminar.png";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import Swal from "sweetalert2";
import { useForm } from "./useForm";
import { useFetch } from "../hooks/useFetch";
import { Link } from "react-router-dom";

function Empleado() {
  const { data } = useFetch("http://localhost:8000/cargo");
  const { data1 } = useFetch("http://localhost:8000/tipoUsuario");
  const [isOpenModalAgregar, openModalAgregar, closeModalAgregar] =
    useModal(false);
  const [isOpenModalModificar, openModalModificar, closeModalModificar] =
    useModal(false);

  const [busqueda, setBusqueda] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");
  const [empleado, setEmpleado] = useState([]);
  const [formDataUpdate, setFormDataUpdate] = useState({
    idEmpleado: "",
    nombrePersona: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    curp: "",
    Cargo_idCargo: "",
    estatusVisible: "1",
  });

  const initialForm = {
    idEmpleado: "",
    nombrePersona: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    curp: "",
    Cargo_idCargo: "",
    estatusVisible: "1",
    idUsuario: "",
    nombreUsuario: "",
    contrasenia: "",
    Empleado_idEmpleado: "",
    tipoUsuario: "",
  };

  const validationsForm = (form) => {
    let errors = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;

    if (!form.nombrePersona.trim()) {
      errors.nombrePersona = "El campo 'Nombre' es requerido";
    } else if (!regexName.test(form.nombrePersona.trim())) {
      errors.nombrePersona = "El campo 'Nombre' sólo acepta letras ";
    }

    if (!form.apellidoPaterno.trim()) {
      errors.apellidoPaterno = "El campo 'Apellido Paterno' es requerido";
    } else if (!regexName.test(form.apellidoPaterno.trim())) {
      errors.apellidoPaterno = "El campo 'Apellido Paterno' sólo acepta letras";
    }

    if (!form.apellidoMaterno.trim()) {
      errors.apellidoMaterno = "El campo 'Apellido Materno' es requerido";
    } else if (!regexName.test(form.apellidoMaterno.trim())) {
      errors.apellidoMaterno =
        "El campo 'Apellido Materno' sólo acepta letras y espacios en blanco";
    }

    if (!form.curp.trim()) {
      errors.curp = "El campo 'Curp' es requerido";
    }

    if (!form.Cargo_idCargo.trim()) {
      errors.Cargo_idCargo = "El campo 'Cargo' es requerido";
    }
    //Usuarios
    /*if (!form.nombreUsuario.trim()) {
       errors.nombreUsuario = "El campo 'Nombre Usuario' es requerido";
     }
     if (!form.contrasenia.trim()) {
         errors.contrasenia = "El campo 'contraseña ' es requerido";
     }
     if (!form.tipoUsuario.trim()) {
       errors.tipoUsuario = "El campo 'Tipo de Usuario' es requerido";
     }
     */

    return errors;
  };

  const handleChangeBusqueda = (e) => {
    setBusqueda(e.target.value);
    //filtrar(busqueda);
  };
  
  //filtrar la busqueda
  let resultado = [];
  

  //busquedas
  const [selectedOption, setSelectedOption] = useState('opcion1');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  if (selectedOption === 'opcion1') {
    // Lógica para la opción 1
    if (!busqueda) {
        resultado = empleado;
      } else {
        resultado = empleado.filter(
          (dato) => dato.nombrePersona.toLowerCase().includes(busqueda.toLowerCase())
          //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
        );
      }

  }else if (selectedOption === 'opcion2') {
    if (!busqueda) {
        resultado = empleado;
      } else {
        resultado = empleado.filter(
          (dato) => dato.curp.toLowerCase().includes(busqueda.toLowerCase())
          //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
        );
      }

  }

  let styles = {
    fontWeight: "bold",
    color: "#dc3545",
  };

  const { form, setErrors, errors, handleChange, handleBlur } = useForm(
    initialForm,
    validationsForm
  );

  function datosAmodificar(empleado) {
    console.log(empleado);
    setIdEmpleado(empleado.idEmpleado);
    formDataUpdate.idEmpleado = empleado.idEmpleado;
    formDataUpdate.nombrePersona = empleado.nombrePersona;
    formDataUpdate.apellidoPaterno = empleado.apellidoPaterno;
    formDataUpdate.apellidoMaterno = empleado.apellidoMaterno;
    formDataUpdate.curp = empleado.curp;
    formDataUpdate.Cargo_idCargo = empleado.Cargo_idCargo;
    openModalModificar();
  }

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/empleado/put/${idEmpleado}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataUpdate),
    })
      .then((response) => response.json())
      .finally(window.location.reload())
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isChecked) {
      handleSubmitEmpleado();
      handleSubmitUsuario();
    } else {
      handleSubmitEmpleado();
    }
  };

  const handleSubmitEmpleado = () => {
    setErrors(validationsForm(form));

    if (Object.keys(errors).length === 0) {
      fetch("http://localhost:8000/empleado/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombrePersona: form.nombrePersona,
          apellidoPaterno: form.apellidoPaterno,
          apellidoMaterno: form.apellidoMaterno,
          curp: form.curp,
          Cargo_idCargo: form.Cargo_idCargo,
          estatusVisible: form.estatusVisible,
        }),
      })
        .then((response) => response.json())
        .finally(window.location.reload())
        .catch((error) => console.log(error));
    } else {
      return;
    }
  };
  const handleSubmitUsuario = () => {
    setErrors(validationsForm(form));

    console.log(form);
    if (Object.keys(errors).length === 0) {
      fetch("http://localhost:8000/usuario/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreUsuario: form.nombreUsuario,
          contrasenia: form.contrasenia,
          tipoUsuario: form.tipoUsuario,
        }),
      })
        .then((response) => response.json())
        .catch((error) => console.log(error));
    } else {
      return;
    }
  };

  const mostrarAlert = (id) => {
    Swal.fire({
      title: "¿Estas seguro de eliminar este registro?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8000/empleado/delete/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .catch((error) => console.log(error));
        Swal.fire("Registro Eliminado", "", "success");
      }
    });
  };

  useEffect(() => {
    fetch("http://localhost:8000/empleado")
      .then((res) => res.json())
      .then((data) => setEmpleado(data))
      .catch((error) => console.log(error));
  }, []);

  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setFormDataUpdate((prevState) => ({ ...prevState, [name]: value }));
  };
  //check
  const [showForm, setShowForm] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setShowForm(event.target.checked);
    setIsChecked(event.target.checked);
  };

  if(localStorage.getItem("auth")!==null ) {
  return (
    <div>
      <EstructuraMenu />
      <h2>EMPLEADOS</h2>
      <div className="contenedorFondo">
        <button className="buttonAgregar" onClick={openModalAgregar}>
          Agregar Empleado
        </button>
        <input
              className="input-text"
              type="text"
              name="busquedaClasificacion"
              placeholder="Buscar"
              onChange={handleChangeBusqueda}
              value={busqueda}
            /> 
            <select value={selectedOption} onChange={handleOptionChange}>
        <option value="opcion1" >Nombre de Empleado</option>
        <option value="opcion2">CURP</option>
      </select>
        <Link to="/Usuarios">
          <button className="buttonAgregar">Usuarios</button>
        </Link>
        <Modal isOpen={isOpenModalAgregar} closeModal={closeModalAgregar}>
          <div>
            <h2>Agregar Empleado</h2>
            <div className="App">
              <form onSubmit={handleSubmit}>
                <input 
                  className="input-text"
                  name="nombrePersona"
                  type="text"
                  value={form.nombrePersona}
                  placeholder="Nombre"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.nombrePersona && (
                  <p style={styles}>{errors.nombrePersona}</p>
                )}

                <input
                  className="input-text"
                  name="apellidoPaterno"
                  type="text"
                  value={form.apellidoPaterno}
                  placeholder="Apellido Paterno"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.apellidoPaterno && (
                  <p style={styles}>{errors.apellidoPaterno}</p>
                )}

                <input
                  className="input-text"
                  name="apellidoMaterno"
                  type="text"
                  value={form.apellidoMaterno}
                  placeholder="Direccion"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.apellidoMaterno && (
                  <p style={styles}>{errors.apellidoMaterno}</p>
                )}

                <input
                  className="input-text"
                  name="curp"
                  type="text"
                  value={form.curp}
                  placeholder="Curp"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.curp && <p style={styles}>{errors.curp}</p>}

                <select
                  name="Cargo_idCargo"
                  onChange={handleChange}
                  value={form.Cargo_idCargo}>
                  <option value="">Elige el cargo del empleado</option>
                  {data &&
                    data.map((el) => (
                      <option key={el.idCargo} value={el.idCargo}>
                        {el.nombreCargo}
                      </option>
                    ))}
                </select>

                {errors.Cargo_idCargo && (
                  <p style={styles}>{errors.Cargo_idCargo}</p>
                )}

                <div>
                  <p>Es Usuario?</p>

                  <input
                    className="input-text"
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </div>
                {showForm && (
                  <form>
                    <h2>Agregar Usuario</h2>
                    <input 
                      className="input-text"
                      name="nombreUsuario"
                      type="text"
                      value={form.nombreUsuario}
                      placeholder="Nombre de Usuario"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.nombreUsuario && (
                      <p style={styles}>{errors.nombreUsuario}</p>
                    )}

                    <input 
                      className="input-text"
                      name="contrasenia"
                      type="password"
                      value={form.contrasenia}
                      placeholder="Contraseña"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.contrasenia && (
                      <p style={styles}>{errors.contrasenia}</p>
                    )}

                    <select
                      name="tipoUsuario"
                      onChange={handleChange}
                      value={form.tipoUsuario}>
                      <option value="">Elige el tipo de Usuario</option>
                      {data1 &&
                        data1.map((el) => (
                          <option
                            key={el.idTipoUsuario}
                            value={el.idTipoUsuario}>
                            {el.tipoUsuario}
                          </option>
                        ))}
                    </select>

                    {errors.tipoUsuario && (
                      <p style={styles}>{errors.tipoUsuario}</p>
                    )}
                  </form>
                )}

                <br />
                <button type="submit" className="buttonAgregar">
                  Agregar
                </button>
              </form>
            </div>
          </div>
        </Modal>

        <div className="contenedorHijo">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombres</th>
                <th>Apellido Paterno</th>
                <th>Apellido Paterno</th>
                <th>CURP</th>
                <th>Cargo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultado.map((item) => (
                <tr key={item.idEmpleado}>
                  <td>{item.idEmpleado}</td>
                  <td>{item.nombrePersona}</td>
                  <td>{item.apellidoPaterno}</td>
                  <td>{item.apellidoMaterno}</td>
                  <td>{item.curp}</td>
                  <td>
                    {data &&
                      data.map((el) =>
                        el.idCargo == item.Cargo_idCargo ? el.nombreCargo : null
                      )}
                  </td>

                  <td>
                    <button>
                      <img
                        src={Actualizar}
                        onClick={() => {
                          datosAmodificar(item);
                        }}
                        className="imagenAccion"
                        alt=""></img>
                    </button>
                    <button>
                      <img
                        src={Eliminar}
                        onClick={() => mostrarAlert(item.idEmpleado)}
                        className="imagenAccion"
                        alt=""></img>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <Modal isOpen={isOpenModalModificar} closeModal={closeModalModificar}>
          <div>
            <h2>Actualizar</h2>

            <form onSubmit={handleSubmitUpdate}>
              <input
                className="input-text"
                readOnly
                name="idEmpleado"
                type="number"
                defaultValue={formDataUpdate.idEmpleado}
                placeholder="idEmpleado"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="nombrePersona"
                type="text"
                defaultValue={formDataUpdate.nombrePersona}
                placeholder="Nombre"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="apellidoPaterno"
                type="text"
                defaultValue={formDataUpdate.apellidoPaterno}
                placeholder="ApellidoPaterno"
                onChange={handleChangeUpdate}
              />

              <input
                className="input-text"
                name="apellidoMaterno"
                type="text"
                defaultValue={formDataUpdate.apellidoMaterno}
                placeholder="ApellidoMaterno"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="curp"
                type="text"
                defaultValue={formDataUpdate.curp}
                placeholder="Curp"
                onChange={handleChangeUpdate}
              />
              <select
                name="Cargo_idCargo"
                onChange={handleChangeUpdate}
                value={formDataUpdate.Cargo_idCargo}>
                <option value="">Elige el cargo del empleado</option>
                {data &&
                  data.map((el) => (
                    <option key={el.idCargo} value={el.idCargo}>
                      {el.nombreCargo}
                    </option>
                  ))}
              </select>
              <br />
              <button type="submit" className="buttonAgregar">
                Modificar
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}else{
  window.location='/';
}
}

export default Empleado;
