import React, { useState, useEffect } from "react";
import EstructuraMenu from "./EstructuraMenu";
import "./Categoria.css";
import Actualizar from "../Imagenes/Actualizar.png";
import Eliminar from "../Imagenes/Eliminar.png";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import Swal from "sweetalert2";
import {Link} from 'react-router-dom';
import { useForm } from "./useForm";

function Categoria() {
  
  const [isOpenModalAgregar, openModalAgregar, closeModalAgregar] =
    useModal(false);
  const [isOpenModalModificar, openModalModificar, closeModalModificar] =
    useModal(false);

  const [idCategoria, setIdCategoria] = useState("");
  const [Categoria, setCategoria] = useState([]);
  const [formDataUpdate, setFormDataUpdate] = useState({
    idCategoria: "",
    nombreCategoria: "",
    estatusVisible:"1",
  });

  
  const initialForm ={
    nombreCategoria: "",
    estatusVisible:"1",
  } 

  const validationsForm = (form) => {
    let errors = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    
    
  
    if (!form.nombreCategoria.trim()) {
      errors.nombreCategoria = "El campo 'Nombre' es requerido";
    }else if (!regexName.test(form.nombreCategoria.trim())) {
      errors.nombreCategoria = "El campo 'Nombre' sólo acepta letras y espacios en blanco";
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

  function datosAmodificar(categoria) {
    console.log(categoria);
    setIdCategoria(categoria.idCategoria);
    formDataUpdate.idCategoria = categoria.idCategoria;
    formDataUpdate.nombreCategoria = categoria.nombreCategoria;
    openModalModificar();
  }


  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    window.location.reload();
    fetch(`http://localhost:8000/categoria/put/${idCategoria}`, {
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
  fetch("http://localhost:8000/categoria/post", {
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
      fetch(`http://localhost:8000/categoria/delete/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .catch((error) => console.log(error));
      Swal.fire("Registro Eliminado", "", "success");

    }
  });
};


useEffect(() => {
  fetch("http://localhost:8000/categoria")
    .then((res) => res.json())
    .then((data) => setCategoria(data))
    .catch((error) => console.log(error));
}, []);

const handleChangeUpdate = (event) => {
  const { name, value } = event.target;
  setFormDataUpdate((prevState) => ({ ...prevState, [name]: value }));
};

//validaciones

if(localStorage.getItem("auth")!==null ) {

return (
  <div>
    <EstructuraMenu />
    <h2>CATEGORIAS</h2>
    <div className="contenedorFondo">
      <button className="buttonAgregar" onClick={openModalAgregar}>
        Agregar Categoria
      </button>
      <input
            className="input-text"
            type="text"
            name="busquedaClasificacion"
            placeholder="Buscar"
          />
      <Link to="/Productos"><button className="buttonAgregar">
        Volver a Productos
      </button></Link>
      <Modal isOpen={isOpenModalAgregar} closeModal={closeModalAgregar}>
        <div>
          <h2>Agregar Datos</h2>
          <div className="App">
            <form onSubmit={handleSubmit}>
              <p>Ingrese el nombre de la Categoria</p>
              <input
                className="input-text"
                name="nombreCategoria"
                type="text"
                value={form.nombreCategoria}
                placeholder="Nombre"
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.nombreCategoria && <p style={styles}>{errors.nombreCategoria}</p>}
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
              <th>Nombre de la Categoria</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Categoria.map((item) => (
              <tr key={item.idCategoria}>
                <td>{item.idCategoria}</td>
                <td>{item.nombreCategoria}</td>
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
                      onClick={() => mostrarAlert(item.idCategoria)}
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
              readOnly
              className="input-text"
              name="idCategoria"
              type="number"
              defaultValue={formDataUpdate.idCategoria}
              placeholder="idCategoria"
              onChange={handleChangeUpdate}
            />
            <input
              className="input-text"
              name="nombreCategoria"
              type="text"
              defaultValue={formDataUpdate.nombreCategoria}
              placeholder="Nombre"
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

export default Categoria;
