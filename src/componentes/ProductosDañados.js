import React, { useState, useEffect } from "react";
import EstructuraMenu from "./EstructuraMenu";
import "./Cliente.css";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import { Link } from "react-router-dom";

function ProductosDañados() {
  const [isOpenModalAgregar, openModalAgregar, closeModalAgregar] =
    useModal(false);

  const [devolucionProducto, setDevolucionProducto] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/devolucionProducto`)
      .then((response) => response.json())
      .then((data) => {
        setDevolucionProducto(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const formatFecha = (fecha) => {
    const fechaDb = new Date(fecha);
    const anio = fechaDb.getFullYear();
    const mes = fechaDb.getMonth() + 1;
    const dia = fechaDb.getDate();
    return `${anio}-${mes < 10 ? "0" + mes : mes}-${
      dia < 10 ? "0" + dia : dia
    }`;
  };

  if (localStorage.getItem("auth") !== null) {
    return (
      <div>
        <EstructuraMenu />
        <h2>PRODUCTOS DAÑADOS</h2>
        <div className="contenedorFondo">
          <button className="buttonAgregar" onClick={openModalAgregar}>
            Agregar Producto
          </button>
          <input
            className="input-text"
            type="text"
            name="busquedaClasificacion"
            placeholder="Buscar"
          />
          <Link to="/Devoluciones">
            <button className="buttonAgregar">Volver a Devoluciones</button>
          </Link>
          <Modal isOpen={isOpenModalAgregar} closeModal={closeModalAgregar}>
            <div>
              <h2>Agregar Datos</h2>
              <div className="App">
                <form>
                  <p>Ingrese el código del Producto</p>
                  <input
                    className="input-text"
                    name=""
                    type="text"
                    placeholder="Codigo"
                  />
                  <p>Ingrese el código Alternativo del Producto</p>
                  <input
                    className="input-text"
                    name=""
                    type="text"
                    placeholder="Codigo"
                  />

                  <p>Ingrese el nombre del Producto</p>
                  <input
                    className="input-text"
                    name="nombreProducto"
                    type="text"
                    placeholder="nombre"
                  />

                  <p>Cantidad del Producto</p>
                  <input
                    className="input-text"
                    name="cantidad"
                    type="number"
                    placeholder="cantidad"
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
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>cantidad Devuelta</th>
                  <th>Nombre Producto</th>
                  <th>Razon devolucion</th>
                </tr>
              </thead>
              <tbody>
                {devolucionProducto.map((item, index) => (
                  <tr key={index}>
                    <td>{item.idDevolucion}</td>
                    <td>{item.fechaDevolucion?formatFecha(item.fechaDevolucion):null}</td>
                    <td>{item.cantidadProducto}</td>
                    <td>{item.nombreProducto}</td>
                    <td>{item.razonDevolucion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div></div>
      </div>
    );
  } else {
    window.location = "/";
  }
}

export default ProductosDañados;
