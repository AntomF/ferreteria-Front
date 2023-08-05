import React, { useState, useEffect } from "react";
import EstructuraMenu from "./EstructuraMenu";
import Actualizar from "../Imagenes/Actualizar.png";
import Eliminar from "../Imagenes/Eliminar.png";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import Swal from "sweetalert2";
import { useForm } from "./useForm";
import { useFetch } from "../hooks/useFetch";
import {Link} from 'react-router-dom';

function Usuario() {
  const { data1 } = useFetch("http://localhost:8000/tipoUsuario");

  const [isOpenModalModificar, openModalModificar, closeModalModificar] =
    useModal(false);

  const [idUsuario, setIdUsuario] = useState("");
  const [usuario, setUsuario] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [formDataUpdate, setFormDataUpdate] = useState({
    idUsuario: "",
    nombreUsuario: "",
    contrasenia: "",
    Empleado_idEmpleado: "",
    tipoUsuario: "",
  });

  const initialForm = {
    idUsuario: "",
    nombreUsuario: "",
    contrasenia: "",
    Empleado_idEmpleado: "",
    tipoUsuario: "",
  }


  const validationsForm = (form) => {
    let errors = {};

    //Usuarios
    if (!form.nombreUsuario.trim()) {
       errors.nombreUsuario = "El campo 'Nombre Usuario' es requerido";
     }
     if (!form.contrasenia.trim()) {
         errors.contrasenia = "El campo 'contraseña ' es requerido";
     }
     if (!form.Empleado_idEmpleado.trim()) {
        errors.Empleado_idEmpleado = "El campo 'idEmpleado' es requerido";
      }
     if (!form.tipoUsuario.trim()) {
       errors.tipoUsuario = "El campo 'Tipo de Usuario' es requerido";
     }
     


    return errors;
  };

  let styles = {
    fontWeight: "bold",
    color: "#dc3545",
  };

  const {
    form,
    
    errors,
    
    handleBlur,
  } = useForm(initialForm, validationsForm);


  function datosAmodificar(usuario) {
    console.log(usuario);
    setIdUsuario(usuario.idUsuario);
    formDataUpdate.idUsuario = usuario.idUsuario;
    formDataUpdate.nombreUsuario = usuario.nombreUsuario;
    formDataUpdate.contrasenia = usuario.contrasenia;
    formDataUpdate.Empleado_idEmpleado = usuario.Empleado_idEmpleado;
    formDataUpdate.TipoUsuario_idTipoUsuario = usuario.TipoUsuario_idTipoUsuario;
    openModalModificar();
  }


  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/usuario/put/${idUsuario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataUpdate)
    })
      .then(response => response.json())
      .finally(window.location.reload())
      .catch(error => console.log(error));

  };



  const mostrarAlert = (id) => {
    Swal.fire({
      title: "¿Estas seguro de eliminar este registro?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8000/usuario/delete/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .finally(window.location.reload())
          .catch((error) => console.log(error));
        Swal.fire("Registro Eliminado", "", "success");

      }
    });
  };


  useEffect(() => {
    fetch("http://localhost:8000/usuario")
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch((error) => console.log(error));
  }, []);

  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setFormDataUpdate((prevState) => ({ ...prevState, [name]: value }));
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
        resultado = usuario;
      } else {
        resultado = usuario.filter(
          (dato) => dato.nombreUsuario.toLowerCase().includes(busqueda.toLowerCase())
          //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
        );
      }

  }else if (selectedOption === 'opcion2') {
    if (!busqueda) {
        resultado = usuario;
      } else {
        resultado = usuario.filter(
          (dato) => dato.tipoUsuario.toLowerCase().includes(busqueda.toLowerCase())
          //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
        );
      }

  }


  if(localStorage.getItem("auth")!==null ) {
  return (
    <div>
      <EstructuraMenu />
      <h2>USUARIOS</h2>
      <div className="contenedorFondo">
      <Link to="/Empleados"><button className="buttonAgregar" >
            Volver a Empleados
        </button></Link>
        
            <input
              className="input-text"
              type="text"
              name="busquedaClasificacion"
              placeholder="Buscar"
              onChange={handleChangeBusqueda}
              value={busqueda}
            /> 
            <select value={selectedOption} onChange={handleOptionChange}>
        <option value="opcion1" >Nombre de Usuario</option>
        <option value="opcion2">Tipo de Usuario</option>
      </select>

        <div className="contenedorHijo">
          <table>
            <thead>
              <tr>
              <th>Código</th>
              <th>Nombre de Usuario</th>
              <th>Contraseña</th>
              <th>Codigo de Empleado</th>
              <th>Tipo de Usuario</th>
              <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultado.map((item) => (
                <tr key={item.idUsuario}>
                  <td>{item.idUsuario}</td>
                  <td>{item.nombreUsuario}</td>
                  <td>{item.contrasenia}</td>
                  <td>{item.Empleado_idEmpleado}</td>
                  <td>{item.tipoUsuario}</td> 
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
                        onClick={() => mostrarAlert(item.idUsuario)}
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
                name="idUsuario"
                type="number"
                defaultValue={formDataUpdate.idUsuario}
                placeholder="idUsuario"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="nombreUsuario"
                type="text"
                value={formDataUpdate.nombreUsuario}
                placeholder="Nombre de Usuario"
                onChange={handleChangeUpdate}
                onBlur={handleBlur}
              />
                {errors.nombreUsuario && <p style={styles}>{errors.nombreUsuario}</p>}

                <input
                className="input-text"
                name="contrasenia"
                type="password"
                value={formDataUpdate.contrasenia}
                placeholder="Contraseña"
                onChange={handleChangeUpdate}
                onBlur={handleBlur}
                />
                {errors.contrasenia && <p style={styles}>{errors.contrasenia}</p>}

                <input
                className="input-text"
                readOnly
                name="Empleado_idEmpleado"
                type="text"
                value={formDataUpdate.Empleado_idEmpleado}
                placeholder="id Empleado"
                onChange={handleChangeUpdate}
                onBlur={handleBlur}
              />

                <select 
                name="tipoUsuario" 
                onChange={handleChangeUpdate}
                 onBlur={handleBlur}
                  value={form.TipoUsuario_idTipoUsuario}>
                      <option value="">Elige el tipo de Usuario</option>
                      {data1 &&
                        data1.map((el) => (
                          <option key={el.idTipoUsuario} value={el.idTipoUsuario}>
                            {el.tipoUsuario}
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

export default Usuario;
