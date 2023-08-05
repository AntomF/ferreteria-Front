import React, { useState, useEffect } from "react";
import EstructuraMenu from "./EstructuraMenu";
import "./Proveedores.css";
import Actualizar from "../Imagenes/Actualizar.png";
import Eliminar from "../Imagenes/Eliminar.png";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import Swal from "sweetalert2";
import { useForm } from "./useForm";
import {Link} from 'react-router-dom';

function Proveedores() {
  const [isOpenModalAgregar, openModalAgregar, closeModalAgregar] =
    useModal(false);
  const [isOpenModalModificar, openModalModificar, closeModalModificar] =
    useModal(false);

  const [idProveedor, setIdProveedor] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [formDataUpdate, setFormDataUpdate] = useState({
    idProveedor: "",
    nombreProveedor: "",
    descripcionProveedor: "",
    direccionProveedor: "",
    numeroTelefono: "",
    correoElectronico: "",
    cuentaBancaria: "",
    estatusVisible:"1",
  });

  const initialForm ={
    nombreProveedor: "",
    descripcionProveedor: "",
    direccionProveedor: "",
    numeroTelefono: "",
    correoElectronico: "",
    cuentaBancaria: "",
    estatusVisible:"1",
  } 

  const validationsForm = (form) => {
    let errors = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
    let regexComments = /^.{1,60}$/;
    let regexNumbers =/^[0-9]+$/;
    
    
  
    if (!form.nombreProveedor.trim()) {
      errors.nombreProveedor = "El campo 'Nombre' es requerido";
    }else if (!regexName.test(form.nombreProveedor.trim())) {
      errors.nombreProveedor = "El campo 'Nombre' sólo acepta letras y espacios en blanco";
    } 
    
    if (!form.direccionProveedor.trim()) {
      errors.direccionProveedor = "El campo 'direccion' es requerido";
    } else if (!regexComments.test(form.direccionProveedor.trim())) {
      errors.direccionProveedor = "El campo sobrepasa la cantidad de caracteres permitida";
    }
    
    if (!form.numeroTelefono.trim()) {
      errors.numeroTelefono = "El campo 'telefono' es requerido";
    } else if (!regexNumbers.test(form.numeroTelefono.trim())) {
      errors.numeroTelefono = "El campo 'telefono' es incorrecto";
    }

    if (!form.correoElectronico.trim()) {
      errors.correoElectronico = "El campo 'Email' es requerido";
    } else if (!regexEmail.test(form.correoElectronico.trim())) {
      errors.correoElectronico = "El campo 'Email' es incorrecto";
    }

    if (!regexNumbers.test(form.cuentaBancaria.trim())) {
      errors.cuentaBancaria = "El campo 'cuentaBancaria' es incorrecto";
    }

    return errors;
  };
  
  let styles = {
    fontWeight: "bold",
    color: "#dc3545",
  };

  const {
    form,
    setErrors,
    errors,
    handleChange,
    handleBlur,
  } = useForm(initialForm, validationsForm);


  function datosAmodificar(proveedor) {
    console.log(proveedor);
    setIdProveedor(proveedor.idProveedor);
    formDataUpdate.idProveedor = proveedor.idProveedor;
    formDataUpdate.nombreProveedor = proveedor.nombreProveedor;
    formDataUpdate.descripcionProveedor = proveedor.descripcionProveedor;
    formDataUpdate.direccionProveedor = proveedor.direccionProveedor;
    formDataUpdate.numeroTelefono = proveedor.numeroTelefono;
    formDataUpdate.correoElectronico = proveedor.correoElectronico;
    formDataUpdate.cuentaBancaria = proveedor.cuentaBancaria;
    openModalModificar();
  }


  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    window.location.reload();
    fetch(`http://localhost:8000/proveedor/put/${idProveedor}`, {
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
  setErrors(validationsForm(form));

  if (Object.keys(errors).length === 0) {
  fetch("http://localhost:8000/proveedor/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
    window.location.reload();
  }else {
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
      fetch(`http://localhost:8000/proveedor/delete/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .catch((error) => console.log(error));
      Swal.fire("Registro Eliminado", "", "success");

    }
  });
};

useEffect(() => {
  fetch("http://localhost:8000/proveedor")
    .then((res) => res.json())
    .then((data) => setProveedores(data))
    .catch((error) => console.log(error));
}, []);

const handleChangeBusqueda = (e) => {
  setBusqueda(e.target.value);
  //filtrar(busqueda);
};

//filtrar la busqueda
let resultado = [];
if (!busqueda) {
  resultado = proveedores;
} else {
  resultado = proveedores.filter(
    (dato) => dato.nombreProveedor.toLowerCase().includes(busqueda.toLowerCase())
    //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
  );
}


const handleChangeUpdate = (event) => {
  const { name, value } = event.target;
  setFormDataUpdate((prevState) => ({ ...prevState, [name]: value }));
};

return (
  <div>
    <EstructuraMenu />
    <h2>PROVEEDORES</h2>
    
    <div className="contenedorFondo">
      <button className="buttonAgregar" onClick={openModalAgregar}>
        Agregar Proveedor
      </button>
      <Link to="/Proveedor/Pedidos"><button className="buttonAgregar" >
        Pedidos
        </button></Link>
      <div className="contenedor-busqueda-empleado">
            <input
              className="input-text"
              type="text"
              name="busquedaClasificacion"
              placeholder="Buscar"
              onChange={handleChangeBusqueda}
              value={busqueda}
            />
          </div>
          
      <Modal isOpen={isOpenModalAgregar} closeModal={closeModalAgregar}>
        <div>
          <h2>Agregar Proveedor</h2>
          <div className="App">
            <form onSubmit={handleSubmit}>
              <p>Ingrese el nombre del Proveedor</p>
              <input
                className="input-text"
                name="nombreProveedor"
                type="text"
                value={form.nombreProveedor}
                placeholder="Nombre"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.nombreProveedor && <p style={styles}>{errors.nombreProveedor}</p>}

              <p>Ingrese la descripción del Proveedor</p>
              <input
                className="input-text"
                name="descripcionProveedor"
                type="text"
                value={form.descripcionProveedor}
                placeholder="Descripcion"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.descripcionProveedor && <p style={styles}>{errors.descripcionProveedor}</p>}

              <p>Ingrese la dirección del Proveedor</p>
              <input
                className="input-text"
                name="direccionProveedor"
                type="text"
                value={form.direccionProveedor}
                placeholder="Direccion"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.direccionProveedor && <p style={styles}>{errors.direccionProveedor}</p>}

              <p>Ingrese el número de teléfono del Proveedor</p>
              <input
                className="input-text"
                name="numeroTelefono"
                type="number"
                value={form.numeroTelefono}
                placeholder="Telefono"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.numeroTelefono && <p style={styles}>{errors.numeroTelefono}</p>}

              <p>Ingrese el correo electrónico del Proveedor</p>
              <input
                className="input-text"
                name="correoElectronico"
                type="text"
                value={form.correoElectronico}
                placeholder="Correo Electronico"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.correoElectronico && <p style={styles}>{errors.correoElectronico}</p>}

              <p>Ingrese la cuenta bancaria del Proveedor</p>
              <input
                className="input-text"
                name="cuentaBancaria"
                type="text"
                value={form.cuentaBancaria}
                placeholder="Cuenta Bancaria"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.cuentaBancaria && <p style={styles}>{errors.cuentaBancaria}</p>}

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
              <th>Nombre del proveedor</th>
              <th>Descripción del proveedor</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Correo electronico</th>
              <th>Cuenta Bancaria</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultado.map((item) => (
              <tr key={item.idProveedor}>
                <td>{item.idProveedor}</td>
                <td>{item.nombreProveedor}</td>
                <td>{item.descripcionProveedor}</td>
                <td>{item.direccionProveedor}</td>
                <td>{item.numeroTelefono}</td>
                <td>{item.correoElectronico}</td>
                <td>{item.cuentaBancaria}</td>
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
                      onClick={() => mostrarAlert(item.idProveedor)}
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
              name="idProveedor"
              type="number"
              defaultValue={formDataUpdate.idProveedor}
              placeholder="idProveedor"
              onChange={handleChangeUpdate}
            />
            <input
              className="input-text"
              name="nombreProveedor"
              type="text"
              defaultValue={formDataUpdate.nombreProveedor}
              placeholder="Nombre"
              onChange={handleChangeUpdate}
            />
            <input
              className="input-text"
              name="descripcionProveedor"
              type="text"
              defaultValue={formDataUpdate.descripcionProveedor}
              placeholder="Descripcion"
              onChange={handleChangeUpdate}
            />

            <input
              className="input-text"
              name="direccionProveedor"
              type="text"
              defaultValue={formDataUpdate.direccionProveedor}
              placeholder="Direccion"
              onChange={handleChangeUpdate}
            />
            <input
              className="input-text"
              name="numeroTelefono"
              type="text"
              defaultValue={formDataUpdate.numeroTelefono}
              placeholder="Telefono"
              onChange={handleChangeUpdate}
            />
            <input
              className="input-text"
              name="correoElectronico"
              type="text"
              defaultValue={formDataUpdate.correoElectronico}
              placeholder="Correo Electronico"
              onChange={handleChangeUpdate}
            />
            <input
              className="input-text"
              name="cuentaBancaria"
              type="text"
              defaultValue={formDataUpdate.cuentaBancaria}
              placeholder="Cuenta Bancaria"
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
}

export default Proveedores;
