import React, { useState, useEffect } from "react";
import EstructuraMenu from "./EstructuraMenu";
import "./Cliente.css";
import Actualizar from "../Imagenes/Actualizar.png";
import Eliminar from "../Imagenes/Eliminar.png";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import Swal from "sweetalert2";

function Cliente() {
  //select

  const [isOpenModalAgregar, openModalAgregar, closeModalAgregar] =
    useModal(false);
  const [isOpenModalModificar, openModalModificar, closeModalModificar] =
    useModal(false);

  const [idCliente, setIdCliente] = useState("");
  const [cliente, setCliente] = useState([]);
  const [formDataUpdate, setFormDataUpdate] = useState({
    idCliente: "",
    nombreCliente: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    direccionCliente: "",
    RFC: "",
    estatusVisible:"1",
  });
  const [formData, setFormData] = useState({
    idCliente: "",
    nombreCliente: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    direccionCliente: "",
    RFC: "",
    estatusVisible:"1",
  });

  function datosAmodificar(cliente) {
    console.log(cliente);
    setIdCliente(cliente.idCliente);
    formDataUpdate.idCliente = cliente.idCliente;
    formDataUpdate.nombreCliente = cliente.nombreCliente;
    formDataUpdate.apellidoPaterno = cliente.apellidoPaterno;
    formDataUpdate.apellidoMaterno = cliente.apellidoMaterno;
    formDataUpdate.direccionCliente = cliente.direccionCliente;
    formDataUpdate.RFC = cliente.RFC;
    openModalModificar();
  }


  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    window.location.reload();
    fetch(`http://localhost:8000/cliente/put/${idCliente}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataUpdate)
    })
      .then(response => response.json())
      .catch(error => console.log(error));
  };


const handleSubmit = (e) => {
  e.preventDefault();
  window.location.reload();
  fetch("http://localhost:8000/cliente/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
    
};

const mostrarAlert = (id) => {
  Swal.fire({
    title: "¿Estas seguro de eliminar este registro?",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Confirmar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8000/cliente/delete/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .catch((error) => console.log(error));
      Swal.fire("Registro Eliminado", "", "success");

    }
  });
};


useEffect(() => {
  fetch("http://localhost:8000/cliente")
    .then((res) => res.json())
    .then((data) => setCliente(data))
    .catch((error) => console.log(error));
}, []);

const handleChange = (event) => {
  const { name, value } = event.target;
  setFormData((prevState) => ({ ...prevState, [name]: value }));
};
const handleChangeUpdate = (event) => {
  const { name, value } = event.target;
  setFormDataUpdate((prevState) => ({ ...prevState, [name]: value }));
};


if(localStorage.getItem("auth")!==null ) {
return (
  <div>
    <EstructuraMenu />
    <h2>CLIENTES</h2>
    <div className="contenedorFondo">
      <button className="buttonAgregar" onClick={openModalAgregar}>
        Agregar Cliente
      </button>
      <input className="input-text" type="text" name="" value=""></input>
      <Modal isOpen={isOpenModalAgregar} closeModal={closeModalAgregar}>
        <div>
          <h2>Agregar Datos</h2>
          <div className="App">
            <form onSubmit={handleSubmit}>
              <p>Ingrese el nombre del Cliente</p>
              <input
                className="input-text"
                name="nombreCliente"
                type="text"
                value={formData.nombreCliente}
                placeholder="Nombre"
                onChange={handleChange}
              />
              <p>Ingrese el apellido Paterno del Cliente</p>
              <input 
                className="input-text"
                name="apellidoPaterno"
                type="text"
                value={formData.apellidoPaterno}
                placeholder="Apellido Paterno"
                onChange={handleChange}
              />

              <p>Ingrese el apellido Materno del Cliente</p>
              <input
                className="input-text"
                name="apellidoMaterno"
                type="text"
                value={formData.apellidoMaterno}
                placeholder="Apellido Materno"
                onChange={handleChange}
              />
              
              <p>Ingrese la dirección del Cliente</p>
              <input
                className="input-text"
                name="direccionCliente"
                type="text"
                value={formData.direccionCliente}
                placeholder="Dirección"
                onChange={handleChange}
              />
              
              <p>Ingrese el RFC del Cliente</p>
              <input
                className="input-text"
                name="RFC"
                type="text"
                value={formData.RFC}
                placeholder="RFC"
                onChange={handleChange}
                maxLength={13}
              />
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
              <th>Nombre del cliente</th>
              <th>Apellido Paterno </th>
              <th>Apellido Materno</th>
              <th>Dirección</th>
              <th>RFC</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cliente.map((item) => (
              <tr key={item.idCliente}>
                <td>{item.idCliente}</td>
                <td>{item.nombreCliente}</td>
                <td>{item.apellidoPaterno}</td>
                <td>{item.apellidoMaterno}</td>
                <td>{item.direccionCliente}</td>
                <td>{item.RFC}</td>
                <td>
                  <button>
                    <img
                      src={Actualizar}
                      onClick={() => {
                        datosAmodificar(item);
                      }}
                      className="imagenAccion"
                      alt=""
                    ></img>
                  </button>
                  <button>
                    <img
                      src={Eliminar}
                      onClick={() => mostrarAlert(item.idCliente)}
                      className="imagenAccion"
                      alt=""
                    ></img>
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
              name="idCliente"
              type="number"
              defaultValue={formDataUpdate.idCliente}
              placeholder="idCliente"
              onChange={handleChangeUpdate}
            />
            <input
              className="input-text"
              name="nombreCliente"
              type="text"
              defaultValue={formDataUpdate.nombreCliente}
              placeholder="Nombre"
              onChange={handleChangeUpdate}
            />
            <input
              className="input-text"
              name="apellidoPaterno"
              type="text"
              defaultValue={formDataUpdate.apellidoPaterno}
              placeholder="Apellido Paterno"
              onChange={handleChangeUpdate}
            />

            <input
              className="input-text"
              name="apellidoMaterno"
              type="text"
              defaultValue={formDataUpdate.apellidoMaterno}
              placeholder="Apellido Materno"
              onChange={handleChangeUpdate}
            />
            <input
              className="input-text"
              name="direccionCliente"
              type="text"
              defaultValue={formDataUpdate.direccionCliente}
              placeholder="Direccion"
              onChange={handleChangeUpdate}
            />
            <input
              className="input-text"
              name="RFC"
              type="text"
              defaultValue={formDataUpdate.RFC}
              placeholder="RFC"
              onChange={handleChangeUpdate}
            />
            
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

export default Cliente;
