import React, { useState} from "react";
import EstructuraMenu from "./EstructuraMenu";
import { Link } from "react-router-dom";

function Devoluciones() {
  const [id, setIdVenta] = useState("");
  const [venta, setVenta] = useState([]);
  const [cantidadDevolucion, setCantidadDevolucion] = useState({});
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("");
  const [arregloDevolucion, setArregloDevolucion] = useState([]);

  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setOpcionSeleccionada(value);
  };

  const handleInputChange = (event) => {
    setIdVenta(event.target.value);
  };

  const handleBuscarVenta = () => {
    if (!id) {
      return;
    }

    fetch(`http://localhost:8000/datosDevolucion/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setVenta(data);
        console.log(data);
      })
      .catch((error) => console.log(error));

    setIdVenta("");
    document.getElementById("buscarId").value = "";
  };

  const handleChange = (event, idProducto) => {
    let newValue = Number(event.target.value);
    const maxLimit = venta.find(
      (item) => item.idProducto === idProducto
    ).cantidadVenta;
    const nombreProducto = venta.find(
      (item) => item.idProducto === idProducto
    ).nombreProducto;
    const idVenta = venta.find(
      (item) => item.idProducto === idProducto
    ).idVentas;
    const descuento = venta.find(
      (item) => item.idProducto === idProducto
    ).descuento;
    const tipoVenta = venta.find(
      (item) => item.idProducto === idProducto
    ).idTipoVenta;
    const precioMayoreo = venta.find(
      (item) => item.idProducto === idProducto
    ).precioMayoreo;
    const precioProducto = venta.find(
      (item) => item.idProducto === idProducto
    ).precioProducto;
    const precioDeCompra = venta.find(
      (item) => item.idProducto === idProducto
    ).precioDeCompra;

    if (newValue > maxLimit) {
      event.target.value = maxLimit;
      newValue = maxLimit;
    }

    setCantidadDevolucion((prevCantidadDevolucion) => ({
      ...prevCantidadDevolucion,
      [idProducto]: newValue,
    }));

    setArregloDevolucion((prevArregloDevolucion) => ({
      ...prevArregloDevolucion,
      [idProducto]: {
        idProducto: idProducto,
        cantidadDevolucion: newValue,
        nombreProducto: nombreProducto,
        idVenta: idVenta,
        cantidadVenta: maxLimit,
        descuento: descuento,
        tipoVenta: tipoVenta,
        precioMayoreo: precioMayoreo,
        precioProducto: precioProducto,
        precioDeCompra: precioDeCompra
      },
    }));
  };

  const handleDevolverTodo = () => {
    if (!opcionSeleccionada) {
      alert("Por favor selecciona el motivo de la devolucion.");
      return;
    }
  
    const confirmacion = window.confirm("¿Estás seguro de que deseas devolver todos los productos?");
  
    if (confirmacion) {
      // Lógica para la función "Devolver todo" si se selecciona "Aceptar"
  
      const datosObtenidos = venta.map((v) => ({
        idProducto: v.idProducto,
        cantidadDevolucion: v.cantidadVenta,
        nombreProducto: v.nombreProducto,
        idVenta: v.idVentas,
        cantidadVenta: v.cantidadVenta,
        descuento: v.descuento,
        tipoVenta: v.idTipoVenta,
        precioMayoreo: v.precioMayoreo,
        precioProducto: v.precioProducto,
        precioDeCompra:v.precioDeCompra
      }));
  
      const datosEnviar = {
        arregloDevolucion: datosObtenidos.reduce((acc, obj) => {
          acc[obj.idProducto] = obj;
          return acc;
        }, {}),
        opcionSeleccionada,
      };
 
      devolucion(datosEnviar);
    } else {
      // Acciones a realizar si se selecciona "Cancelar"
    }
  };
  
  const handleDevolver = () => {
    if (!opcionSeleccionada) {
      alert("Por favor selecciona el motivo de la devolucion.");
      return;
    }
    if (!arregloDevolucion || arregloDevolucion.length === 0) {
      alert("No hay ningun cambio en la cantidad devolucion.");
      return;
    }
    const datosEnviar = {
      arregloDevolucion,
      opcionSeleccionada,
    };
    console.log(datosEnviar);
    devolucion(datosEnviar);
 
  };

  function devolucion(datosEnviar) {
    fetch("http://localhost:8000/devolucion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosEnviar),
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  

  if (localStorage.getItem("auth") !== null) {
    return (
      <div>
        <EstructuraMenu />
        <h2>DEVOLUCIONES</h2>
        <div className="contenedorFondo">
          <input
            id="buscarId"
            className="input-text"
            placeholder="Buscar"
            value={id}
            onChange={handleInputChange}
          />
          <button className="buttonAgregar" onClick={handleBuscarVenta}>
            Buscar Venta
          </button>
          <Link to="/ProductosDañados">
            <button className="buttonAgregar">Productos Dañados</button>
          </Link>
          <div>
            {venta && venta.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Nombre</th>
                    <th>Cantidad Vendida</th>
                    <th>Cantidad Devolver</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.map((item, index) => (
                    <tr key={index}>
                      <td>{item.idProducto}</td>
                      <td>{item.nombreProducto}</td>
                      <td>{item.cantidadVenta}</td>
                      <td>
                        <input
                          id={item.idProducto}
                          type="number"
                          value={cantidadDevolucion[item.idProducto] || 0}
                          min={0}
                          max={item.cantidadVenta}
                          onChange={(event) =>
                            handleChange(event, item.idProducto)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {venta && venta.length > 0 && (
            <div>
              <label>Motivo de la devolución</label>
              <br />
              <label>
                <input
                  type="radio"
                  value="1"
                  checked={opcionSeleccionada === "1"}
                  onChange={handleCheckboxChange}
                />
                Comprado por error
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  value="2"
                  checked={opcionSeleccionada === "2"}
                  onChange={handleCheckboxChange}
                />
                Producto Dañado
              </label>
              <br />
              <button onClick={handleDevolverTodo}>Devolver todo</button>
              <button onClick={handleDevolver}>Devolver</button>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    window.location = "/";
  }
}

export default Devoluciones;
