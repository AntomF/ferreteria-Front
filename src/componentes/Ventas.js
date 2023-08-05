import { useState, useEffect } from "react";
import { useForm } from "./useForm";
import { Link } from "react-router-dom";
import EstructuraMenu from "./EstructuraMenu";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import { useFetch } from "../hooks/useFetch";
import "./venta.css";
import Logo2 from "../Imagenes/Logo2.png";

const datosIniciales = {
  nombreProducto: "",
  UnidadDeVenta: "",
  precioCompra: "",
  cantidad: "0",
  subTotal: "0",
  id: null,
};

const validateForm = (form) => {
  let errors = {};

  return errors;
};

let styles = {
  fontWeight: "bold",
  color: "#dc3545",
};

function Ventas() {
  const { form, setErrors, errors, handleChange, handleBlur } = useForm(
    datosIniciales,
    validateForm
  );

  const [listVentas, setListVentas] = useState([]);
  const [total, setTotal] = useState(0);
  const [opciones, setOpciones] = useState([]);
  const [text, setText] = useState("");
  const [selectedMetodoPago, setSelectedMetodoPago] = useState("");
  const [metodoPago, setMetodoPago] = useState([]);
  const [data1, setData1] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [efectivo, setEfectivo] = useState(0);
  const [cambio, setCambio] = useState(0);
  const [nombreCliente, setNombreCliente] = useState("");
  const [ventaPorMayoreo, setVentaPorMayoreo] = useState(false);
  const [descuentoPersonalizado, setDescuentoPersonalizado] = useState(false);
  const [descuentoPesos, setDescuentosPesos] = useState(0);
  const [isCompra, setCompra] = useState(false);
  const [cliente, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [unidadDeVenta, setUnidadDeVenta] = useState([]);
  const currentDate = new Date();
  const [fechaTicket, setFechaTicket] = useState("");

  const [isOpenModalTicket, openModalTicket, closeModalTicket] =
    useModal(false);

  const [cantidad, setCantidad] = useState(1);
  const [subTotal, setSubTotal] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] =
    useState("nombreProducto");
  const [ticketInf, setTicketInf] = useState([]);
  const [isOpenCobro, OpenCobro, closeModalCobro] = useModal(false);

  const datosEnviar = {
    metodoPago: selectedMetodoPago,
    lista: listVentas,
    ventaPorMayoreo: ventaPorMayoreo,
    idCliente: nombreCliente,
    descuento: descuentoPesos,
  };

  useEffect(() => {
    if (metodoPago && metodoPago.length > 0) {
      setSelectedMetodoPago(metodoPago[0].idMetodoPago);
    }
  }, [metodoPago]);

  useEffect(() => {
    fetch(`http://localhost:8000/ventas`)
      .then((response) => response.json())
      .then((data) => {
        setVentas(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/proveedor`)
      .then((response) => response.json())
      .then((data) => {
        setData1(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/metodoPago`)
      .then((response) => response.json())
      .then((data) => {
        setMetodoPago(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const calculatedTotal = listVentas.reduce((total, venta) => {
      const cantidad = parseFloat(venta.cantidadVenta);
      let precio = 0;
      if (ventaPorMayoreo) {
        precio = parseFloat(venta.producto.precioMayoreo);
      } else {
        precio = parseFloat(venta.producto.precioProducto);
      }

      return total + cantidad * precio;
    }, 0);

    setTotal(calculatedTotal);
  }, [listVentas]);

  useEffect(() => {
    fetch(`http://localhost:8000/cliente`)
      .then((response) => response.json())
      .then((data) => {
        setClientes(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/producto")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/unidadDeVenta`)
      .then((response) => response.json())
      .then((data) => {
        setUnidadDeVenta(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/UnidadDeVenta`)
      .then((response) => response.json())
      .then((data) => {
        setUnidadDeVenta(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChangeEfectivo = (e) => {
    const efectivoValor = e.target.value;
    setEfectivo(efectivoValor);

    let totalVenta = 0;
    if (descuentoPersonalizado) {
      totalVenta = parseFloat(total) - parseFloat(descuentoPesos); // Reemplaza con el valor total de la venta

      //  console.log(totalVenta);
    } else {
      totalVenta = parseFloat(total); // Reemplaza con el valor total de la venta
      //console.log(totalVenta);
    }

    const efectivoNumerico = parseFloat(efectivoValor);

    if (
      isNaN(efectivoNumerico) ||
      efectivoNumerico < 0 ||
      efectivoNumerico < totalVenta
    ) {
      setCambio(0);
      setCompra(false);
      return;
    }

    const cambioCalculado = efectivoNumerico - totalVenta;
    setCambio(cambioCalculado);
    setCompra(true);
  };

  const handleChangeVentaPorMayoreo = (e) => {
    const isChecked = e.target.checked;
    setVentaPorMayoreo(isChecked);
    if (!isChecked) {
      setNombreCliente("");
    }

    if (productoSeleccionado) {
      let precio = isChecked
        ? productoSeleccionado.precioMayoreo
        : productoSeleccionado.precioProducto;
      precio = parseFloat(precio);

      if (!isNaN(precio) && cantidad > 0) {
        const subtotal = cantidad * precio;
        setSubTotal(subtotal);
      } else {
        setSubTotal(0);
      }
    }

    if (isChecked) {
      const sumaPrecioMayoreo = listVentas.reduce((acumulador, venta) => {
        return acumulador + venta.cantidadVenta * venta.producto.precioMayoreo;
      }, 0);
      setTotal(sumaPrecioMayoreo);
    } else {
      const sumaPrecioProducto = listVentas.reduce((acumulador, venta) => {
        return acumulador + venta.cantidadVenta * venta.producto.precioProducto;
      }, 0);
      setTotal(sumaPrecioProducto);
    }
  };

  const handleChangeDescuentoPersonalizado = (e) => {
    setDescuentoPersonalizado(e.target.checked);
    setDescuentosPesos(0);
  };

  const buscarProducto = (text) => {
    let matches = [];
    if (text.length > 0) {
      const regex = new RegExp(`${text}`, "gi");
      matches = productos.filter((produc) => {
        // Comprobar la opción seleccionada en el select usando el estado
        switch (opcionSeleccionada) {
          case "nombreProducto":
            return String(produc.nombreProducto).match(regex);
          case "codigoBarras":
            return String(produc.codigoBarras).match(regex);
          case "marcaProducto":
            return String(produc.marcaProducto).match(regex);
          default:
            return false;
        }
      });
    }
    // Restar la cantidad de opciones en listVentas de acuerdo al nombre del producto
    const updatedMatches = matches.map((match) => {
      const existingProduct = listVentas.find(
        (v) => v.producto.nombreProducto === match.nombreProducto
      );
      if (existingProduct) {
        const remainingQuantity =
          match.cantidadEnStock - existingProduct.cantidadVenta;
        return {
          ...match,
          cantidadEnStock: remainingQuantity >= 0 ? remainingQuantity : 0,
        };
      }
      return match;
    });

    setOpciones(updatedMatches);
    setText(text);
  };

  const opcionElegida = (opc) => {
    setText("");
    setProductoSeleccionado(opc);
    setCantidad(1);
    setOpciones([]);
    let subtotal;
    if (ventaPorMayoreo) {
      subtotal = 1 * parseFloat(opc.precioMayoreo);
      setSubTotal(subtotal);
    } else {
      subtotal = 1 * parseFloat(opc.precioProducto);
      setSubTotal(subtotal);
    }

    const venta = {
      producto: opc,
      cantidadVenta: cantidad,
    };

    const existingProduct = listVentas.find(
      (v) => v.producto.idProducto === opc.idProducto
    );
    if (existingProduct) {
      // Si el producto ya existe, aumentar la cantidad
      existingProduct.cantidadVenta =
        parseFloat(existingProduct.cantidadVenta) + parseFloat(cantidad);
    } else {
      // Si el producto no existe, agregarlo a la lista
      setListVentas((prevList) => [...prevList, venta]);
    }
  };

  const cancelarVenta = () => {
    window.location.reload();
  };
  const handleChangeSelect = (e) => {
    const { name, value } = e.target;
    setNombreCliente(value);
  };

  function eliminarLista(e, idProducto) {
    e.preventDefault();
    let lista = listVentas.filter(
      (el) => el.producto.idProducto !== idProducto
    );
    setListVentas(lista);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMetodoPago == 1) {
      OpenCobro();
    } else {
      realizarPedido(e);
    }
  };

  const realizarPedido = (e) => {
    e.preventDefault();
    if (ventaPorMayoreo) {
      if (nombreCliente == "") {
        alert("Por favor, seleccione un cliente");
        return;
      }
    }
    if (selectedMetodoPago === "") {
      alert("Por favor, seleccione un método de pago");
      return; // Detener la ejecución de la función si no se ha seleccionado un método de pago
    }
    fetch("http://localhost:8000/detalleVentas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosEnviar),
    })
      .then((response) => response.json())
      .then(obtenerticket())
      .catch((error) => {
        console.log(error);
      });
    setListVentas([]);
  };

  const handleCantidadChange = (e, id, max) => {
    const newValue = parseInt(e.target.value); // Obtener el nuevo valor como número entero

    if (!isNaN(newValue) && newValue > 0 && newValue <= max) {
      // Actualizar el valor de cantidadVenta para el elemento correspondiente en la lista de ventas
      setListVentas((prevList) =>
        prevList.map((item) => {
          if (item.producto.idProducto === id) {
            const updateItem = { ...item, cantidadVenta: newValue };
            if (ventaPorMayoreo) {
              const total = newValue * item.producto.precioMayoreo;
              setTotal(total);
            } else {
              const total = newValue * item.producto.precioProducto;
              setTotal(total);
            }
            return updateItem;
          }
          return item;
        })
      );
    }
  };

  const hanldeChangeDescuento = (event) => {
    const value = event.target.value;
    // Asegurarse de que el valor sea un número válido
    const descuento = parseFloat(value);

    if (value === "") {
      // Si el valor está vacío, establecer el descuento en cero
      setDescuentosPesos(0);
      document.getElementById("descuentoInput").value = "0";
    } else if (descuento > total) {
      // El descuento es mayor que el total, establecer el descuento al valor del total
      setDescuentosPesos(total);
      document.getElementById("descuentoInput").value = total.toString();
    } else {
      // El descuento es válido, establecer el descuento al valor ingresado
      setDescuentosPesos(value);
    }
  };

  const handleSelectChangeBuscar = (e) => {
    const selectedOption = e.target.value;
    // console.log("Opción seleccionada:", selectedOption);
    setText("");
    setOpciones([]);
    setOpcionSeleccionada(selectedOption);
  };

  const obtenerticket = () => {
    // console.log(datosEnviar);
    const nuevoTicketInf = datosEnviar.lista.map((elemento) => {
      return {
        nombreProducto: elemento.producto.nombreProducto,
        precioMayoreo: elemento.producto.precioMayoreo,
        precioProducto: elemento.producto.precioProducto,
        cantidadVenta: elemento.cantidadVenta,
        ventaPorMayoreo: datosEnviar.ventaPorMayoreo,
        unidadDeVenta: elemento.producto.UnidadDeVenta_idUnidadDeVenta,
        idCliente: datosEnviar.idCliente,
      };
    });
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setFechaTicket(formattedDate);
    setTicketInf(nuevoTicketInf);
    openModalTicket();
  };

  function obtenerCliente(idCliente) {
    const clienteEncontrado = cliente.find(
      (c) => String(idCliente) === String(c.idCliente)
    );
    if (clienteEncontrado) {
      return `${clienteEncontrado.nombreCliente} ${clienteEncontrado.apellidoPaterno} ${clienteEncontrado.apellidoMaterno}`;
    }
    return null;
  }

  function obtenerRFC(idCliente) {
    const clienteEncontrado = cliente.find(
      (c) => String(idCliente) === String(c.idCliente)
    );
    if (clienteEncontrado) {
      return clienteEncontrado.RFC;
    }
    return null;
  }

  if (localStorage.getItem("auth") !== null) {
    return (
      <>
        <EstructuraMenu />
        <h2>VENTAS</h2>
        <div className="contenedorFondo">
          <div>
            <div className="contenedorTabla">
              <form>
                <h2>Datos de los Productos</h2>
                <div className="detalles-pedido">
                  <input
                    id="nombreProducto"
                    className="input-text"
                    type="text"
                    name="nombreProducto"
                    onBlur={handleBlur}
                    onChange={(e) => buscarProducto(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    value={text}
                  />

                  <select name="opciones" onChange={handleSelectChangeBuscar}>
                    <option value="nombreProducto">Nombre del Producto</option>
                    <option value="codigoBarras">Código de Barras</option>
                    <option value="marcaProducto">Marca del Producto</option>
                  </select>

                  <div className="contenedor-opciones">
                    {opciones && opciones.length > 0 ? (
                      <table className="opciones-table">
                        <thead>
                          <tr>
                            <th>Nombre del Producto</th>
                            <th>
                              {ventaPorMayoreo
                                ? "Precio Mayoreo"
                                : "Precio Producto"}
                            </th>
                            <th>Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {opciones.map((opc, index) => (
                            <tr
                              key={index}
                              className={`opciones-row ${
                                hoveredRow === index ? "hovered" : ""
                              }`}
                              onClick={() => {
                                if (opc.cantidadEnStock > 0) {
                                  opcionElegida(opc);
                                } else {
                                  alert("El stock está vacío");
                                }
                              }}
                              onMouseEnter={() => setHoveredRow(index)}
                              onMouseLeave={() => setHoveredRow(null)}>
                              <td>{opc.nombreProducto}</td>
                              <td>
                                $
                                {ventaPorMayoreo
                                  ? opc.precioMayoreo
                                  : opc.precioProducto}
                              </td>
                              <td>{opc.cantidadEnStock}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>
            <div className="contenedor-agregar-tabla-pedidos">
              {descuentoPersonalizado && total > 0 ? (
                <div>
                  <p className="total-pedidos">Total sin descuento: ${total}</p>
                </div>
              ) : total > 0 ? (
                <p className="total-pedidos">Total: ${total}</p>
              ) : (
                <p className="total-pedidos">Total: $0</p>
              )}

              <div>
                <label>
                  <input
                    className="input-checkbox"
                    type="checkbox"
                    checked={descuentoPersonalizado}
                    onChange={handleChangeDescuentoPersonalizado}
                  />
                  Descuento personalizado
                </label>
                {descuentoPersonalizado && total > 0 && (
                  <div>
                    <label>Ingrese descuento en pesos:</label> <br />
                    <input
                      id="descuentoInput"
                      max={total}
                      min={0}
                      type="number"
                      className="input-text"
                      onChange={hanldeChangeDescuento}
                    />
                    <p className="total-pedidos">
                      {total &&
                      total !== 0 &&
                      descuentoPesos &&
                      descuentoPesos !== 0
                        ? descuentoPesos > total
                          ? "Total: 0"
                          : `Total con descuento: $${total - descuentoPesos}`
                        : "Total: 0"}
                    </p>
                  </div>
                )}
              </div>
              <table className="tabla-registro-pedidos">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>
                      {ventaPorMayoreo ? "Precio Mayoreo" : "Precio Producto"}
                    </th>
                    <th>Sub total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listVentas.length === 0 ? (
                    <tr>
                      <td colSpan="4">Aun no hay pedidos</td>
                    </tr>
                  ) : (
                    listVentas.map((dato) => (
                      <tr key={dato.id}>
                        <td>{dato.producto.nombreProducto}</td>
                        <td>
                          <input
                            type="number"
                            value={dato.cantidadVenta}
                            onChange={(e) =>
                              handleCantidadChange(
                                e,
                                dato.producto.idProducto,
                                dato.producto.cantidadEnStock
                              )
                            }
                            min={1}
                            max={dato.producto.cantidadEnStock}
                            style={{ width: "100px", padding: "5px" }}
                          />
                        </td>

                        <td>
                          $
                          {ventaPorMayoreo
                            ? dato.producto.precioMayoreo
                            : dato.producto.precioProducto}
                        </td>
                        <td>
                          $
                          {ventaPorMayoreo
                            ? dato.cantidadVenta * dato.producto.precioMayoreo
                            : dato.cantidadVenta * dato.producto.precioProducto}
                        </td>
                        <td>
                          <button
                            onClick={(e) =>
                              eliminarLista(e, dato.producto.idProducto)
                            }>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="DatosGenerales">
                <h2>Datos de la Venta</h2>
                <div>
                  <div>
                    <select
                      name="metodoPago"
                      value={selectedMetodoPago}
                      onChange={(e) => setSelectedMetodoPago(e.target.value)}>
                      {metodoPago &&
                        metodoPago.map((el) => (
                          <option key={el.idMetodoPago} value={el.idMetodoPago}>
                            {el.metodoPago}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label>Venta por mayoreo</label>
                <br />
                <input
                  className="input-text"
                  type="checkbox"
                  checked={ventaPorMayoreo}
                  onChange={handleChangeVentaPorMayoreo}
                />
              </div>
              <div>
                {ventaPorMayoreo && (
                  <select
                    name="cliente"
                    value={nombreCliente}
                    onChange={handleChangeSelect}>
                    <option value="">Elige un Cliente</option>
                    {cliente &&
                      cliente.map((el) => (
                        <option key={el.idCliente} value={el.idCliente}>
                          {el.nombreCliente + " RFC: " + el.RFC}
                        </option>
                      ))}
                  </select>
                )}
              </div>
              {listVentas.length === 0 ? (
                <p></p>
              ) : (
                <button className="buttonAgregar" onClick={handleSubmit}>
                  Realizar Venta
                </button>
              )}
              <button className="buttonEliminar" onClick={cancelarVenta}>
                Cancelar
              </button>
            </div>
          </div>

          <Modal isOpen={isOpenCobro} closeModal={closeModalCobro}>
            <div className="modal-content-cobro">
              <h2>Ingresa el efectivo</h2>
              <input
                className="input-text"
                type="number"
                id="efectivo"
                value={efectivo}
                onChange={handleChangeEfectivo}
              />
              {descuentoPersonalizado ? (
                <p>
                  Total con descuento: $
                  {parseFloat(total) - parseFloat(descuentoPesos)}
                </p>
              ) : (
                <p>Total: ${total}</p>
              )}

              <div className="cambio-container">
                <h2>Cambio</h2>
                <p>${cambio.toFixed(2)}</p>
              </div>

              <div className="venta-button-container">
                {isCompra && (
                  <button className="buttonAgregar" onClick={realizarPedido}>
                    Realizar venta
                  </button>
                )}
              </div>
            </div>
          </Modal>

          <Modal isOpen={isOpenModalTicket} closeModal={closeModalTicket}>
            <div>
              <img src={Logo2} className="imagen" alt=""></img>
              <p>Fecha de Venta: {fechaTicket}</p>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Unidad</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketInf.map((elemento, index) => (
                    <tr key={index}>
                      <td>{elemento.nombreProducto}</td>
                      <td>
                        {unidadDeVenta.map((opc) => {
                          return opc.idUnidadDeVenta === elemento.unidadDeVenta
                            ? opc.unidadDeVenta
                            : null;
                        })}
                      </td>

                      <td>
                        {elemento.ventaPorMayoreo
                          ? elemento.precioMayoreo
                          : elemento.precioProducto}
                      </td>
                      <td>{elemento.cantidadVenta}</td>
                      <td>
                        {elemento.ventaPorMayoreo
                          ? parseFloat(elemento.cantidadVenta) *
                            parseFloat(elemento.precioMayoreo)
                          : parseFloat(elemento.cantidadVenta) *
                            parseFloat(elemento.precioProducto)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4">Subtotal</td>
                    <td>
                      $
                      {ticketInf.reduce((total, elemento) => {
                        const precio = elemento.ventaPorMayoreo
                          ? parseFloat(elemento.precioMayoreo)
                          : parseFloat(elemento.precioProducto);
                        const cantidad = parseFloat(elemento.cantidadVenta);
                        return total + precio * cantidad;
                      }, 0)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4">Impuestos</td>
                    <td>$</td>
                  </tr>
                  {descuentoPesos > 0 && (
                    <tr>
                      <td colSpan="4">Descuento</td>
                      <td>${descuentoPesos}</td>
                    </tr>
                  )}
                  {selectedMetodoPago === 1 && (
                    <tr>
                      <td colSpan="4">Efectivo</td>
                      <td>${efectivo}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="4">Total</td>
                    <td>
                      $
                      {ticketInf.reduce((total, elemento) => {
                        const precio = elemento.ventaPorMayoreo
                          ? parseFloat(elemento.precioMayoreo)
                          : parseFloat(elemento.precioProducto);
                        const cantidad = parseFloat(elemento.cantidadVenta);
                        return total + precio * cantidad;
                      }, 0) - (descuentoPesos > 0 ? descuentoPesos : 0)}
                    </td>
                  </tr>

                  {selectedMetodoPago === 1 && (
                    <tr>
                      <td colSpan="4">Cambio</td>
                      <td>${cambio}</td>
                    </tr>
                  )}

                  {ticketInf.some((elemento) => elemento.idCliente) && (
                    <tr>
                      <td colSpan="3">Cliente</td>
                      <td colSpan="2"> {obtenerCliente(ticketInf[0]?.idCliente)}</td>
                    </tr>
                  )}

                  {ticketInf.some((elemento) => elemento.idCliente) && (
                    <tr>
                      <td colSpan="3">RFC</td>
                      <td colSpan="2">{obtenerRFC(ticketInf[0]?.idCliente)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <input
                className="buttonEliminar"
                type="button"
                value="Cerrar"
                onClick={() => window.location.reload()}
              />
              <input
                className="buttonModificar"
                type="button"
                value="Imprimir"
                onClick={() => window.print()}
              />
            </div>
          </Modal>
        </div>
      </>
    );
  } else {
    window.location = "/";
  }
}

export default Ventas;
