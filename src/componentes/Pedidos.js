import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "./useForm";
import Actualizar from "../Imagenes/Actualizar.png";
import Eliminar from "../Imagenes/Eliminar.png";
import { Link } from "react-router-dom";
import EstructuraMenu from "./EstructuraMenu";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import { useFetch } from "../hooks/useFetch";
import "./Pedido.css";

const datosIniciales = {
  nombreProducto: "",
  cantidad: "0",
  precioCompra: "",
  subTotal: "0",
  id: "",
};

const validateForm = (form) => {
  let errors = {};
  return errors;
};

let styles = {
  fontWeight: "bold",
  color: "#dc3545",
};

function Pedidos() {
  const { form, setErrors, errors, handleChange, handleBlur } = useForm(
    datosIniciales,
    validateForm
  );

  const [listPedidos, setListPedidos] = useState([]);
  const [total, setTotal] = useState(0);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [idPedido, setIdPedido] = useState("");
  const [fechaPedido, setFechaPedido] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [fechaFiltrada, setFechaFiltrada] = useState([]);
  const [detallepedidos, setDetallePedidos] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [text, setText] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const [cantidad, setCantidad] = useState();
  const [proveedorGeneral, setProveedorGeneral] = useState("");
  const [metodoPagoGeneral, setMetodoPagoGeneral] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const datosParaEnviar = {
    listaPedidos: listPedidos.map(
      ({ proveedor, metodoPago, ...pedido }) => pedido
    ),
    total: total,
    proveedor: proveedorGeneral,
    metodoPago: metodoPagoGeneral,
  };

  const [isOpenModalAgregar, openModalAgregar, closeModalAgregar] =
    useModal(false);
  const [isOpenModalDetalles, openModalDetalles, closeModalDetalles] =
    useModal(false);
  const [isOpenModalBuscar, openModalBuscar, closeModalBuscar] =
    useModal(false);

  const [
    isOpenModalDetallesEditar,
    OpenModalDetallesEditar,
    closeModalDetallesEditar,
  ] = useModal(false);

  const { data1 } = useFetch("http://localhost:8000/proveedor");
  const { data } = useFetch("http://localhost:8000/metodoPago");

  useEffect(() => {
    const calculatedTotal = listPedidos.reduce((total, pedido) => {
      const cantidad = parseFloat(pedido.cantidadCompra);
      const precio = parseFloat(pedido.producto.precioDeCompra);
      return total + cantidad * precio;
    }, 0);

    setTotal(calculatedTotal);
  }, [listPedidos]);

  useEffect(() => {
    actualizarTabla();
  }, []);

  const actualizarTabla = () => {
    fetch(`http://localhost:8000/Pedido`)
      .then((response) => response.json())
      .then((data) => {
        setPedidos(data); // Actualiza el estado de pedidos
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetch(`http://localhost:8000/producto`)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) => console.log(error));
  }, []);

  let resultadoproductos = [];
  if (productos.length <= 0) {
    resultadoproductos = resultadoproductos;
  } else {
    if (productos.length >= 1) {
      resultadoproductos = productos;
    }
  }

  const buscarProducto = (text) => {
    let matches = [];
    if (text.length > 0) {
      const regex = new RegExp(`${text}`, "gi");
      matches = productos.filter((produc) => {
        return String(produc.nombreProducto).match(regex);
      });
    }

    setOpciones(matches);
    setText(text);
  };

  const opcionElegida = (opc) => {
    setText(opc.nombre);
    setProductoSeleccionado(opc);
    setOpciones([]);
    setCantidad(1);
    let subtotal = 1 * parseFloat(opc.precioDeCompra);
    setSubTotal(subtotal);
    document.getElementById("nombreProducto").readOnly = true;
  };

  const handleSubmitPedido = (e) => {
    e.preventDefault();

    if (productoSeleccionado.length === 0) {
      return;
    }
    if (proveedorGeneral === "") {
      alert("Selecciona un proveedor");
      return;
    }
    if (metodoPagoGeneral === "") {
      alert("Selecciona un método de pago");
      return;
    }

    const compra = {
      producto: productoSeleccionado,
      cantidadCompra: cantidad,
    };

    // Verificar si el producto ya existe en la lista
    const existingProductIndex = listPedidos.find(
      (v) => v.producto.idProducto === productoSeleccionado.idProducto
    );

    if (existingProductIndex) {
      existingProductIndex.cantidadCompra =
        parseFloat(existingProductIndex.cantidadCompra) + cantidad;
    } else {
      // Si el producto no existe, agregarlo a la lista
      setListPedidos((prevList) => prevList.concat(compra));
    }
    limpiarCampos();
  };

  const handleFechaPedidoChange = (e) => {
    setFechaPedido(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //setErrors(validateForm(form));
    console.log(datosParaEnviar);
    fetch("http://localhost:8000/createPedido", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosParaEnviar),
    })
      .then((Response) => Response.json())
      .then((error) => console.log(error));
    setListPedidos([]);
    closeModalAgregar();
  };

  const handleDetalle = (e, id) => {
    fetch(`http://localhost:8000/detalles/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // Aquí puedes manipular los datos recibidos del backend
        setDetallePedidos(data);
        // Realiza las operaciones necesarias con los detalles del pedido
      })
      .finally(openModalDetalles)
      .catch((error) => {
        // Manejo de errores
        console.error(error);
      });
  };
  function updateDetallesPedidoFecha() {
    if (fechaEntrega >= fechaPedido) {
      actualizarDetalle();
    } else {
      alert("La fecha de entrega no debe ser menor, por favor corregirlo");
    }
  }

  const actualizarDetalle = () => {
    const datos = {
      fechaEntrega: fechaEntrega, // Reemplaza fechaEntrega con el valor correspondiente
    };

    fetch(`http://localhost:8000/actualizarDetalles/${idPedido}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .then(setFechaEntrega(""))
      .finally(window.location.reload())
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDetalleEditar = (e, detallesEditar) => {
    if (detallesEditar.fechaDeEntrega != null) {
      alert("Ya no puedes modificar la fecha de entrega");
    } else {
      setIdPedido(detallesEditar.idPedidos);
      setFechaPedido(formatFecha(detallesEditar.fechaDePedido));
      OpenModalDetallesEditar();
    }
  };

  function cancelarAgregarPedidos() {
    setErrors([]);
    setListPedidos([]);
    datosIniciales.nombreProducto = "";
    datosIniciales.precioCompra = "";
    closeModalAgregar();
  }
  const handleFechaEntregaChange = (e) => {
    setFechaEntrega(e.target.value);
  };

  const handleChangeCantidad = (e) => {
    const { value } = e.target;
    if (value === 0) {
      setCantidad(1);
    }
    setCantidad(value);
    const subtotal = value * parseFloat(productoSeleccionado.precioDeCompra);
    setSubTotal(subtotal);
  };

  function limpiarCampos() {
    document.getElementById("nombreProducto").readOnly = false;
    document.getElementById("nombreProducto").value = "";
    document.getElementById("precio").value = "0";
    setCantidad(0);
    setSubTotal(0);
    setTotal(0);
    setProductoSeleccionado([]);
  }
  function eliminarLista(e, idProducto) {
    e.preventDefault();
    let lista = listPedidos.filter(
      (el) => el.producto.idProducto !== idProducto
    );
    setListPedidos(lista);
  }

  const formatFecha = (fecha) => {
    const fechaDb = new Date(fecha);
    const anio = fechaDb.getFullYear();
    const mes = fechaDb.getMonth() + 1;
    const dia = fechaDb.getDate();
    return `${anio}-${mes < 10 ? "0" + mes : mes}-${
      dia < 10 ? "0" + dia : dia
    }`;
  };

  function buscarFecha() {
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;

    if (fechaInicio === "") {
      alert("La fecha de inicio no puede estar vacía.");
      return;
    }

    if (fechaFin === "") {
      alert("La fecha de fin no puede estar vacía.");
      return;
    }

    if (fechaInicio > fechaFin) {
      document.getElementById("fechaFin").value = "";
      alert("La fecha de inicio no puede ser mayor a la fecha de fin.");
      return;
    }

        // Filtrar las ventas por fecha
        const pedidosFiltrados = pedidos.filter((pedido) => {
          const fechaPedido = pedido.fechaDePedido.substring(0, 10);
          return fechaPedido >= fechaInicio && fechaPedido <= fechaFin;
        });
    
        setFechaFiltrada(pedidosFiltrados);
        openModalBuscar();
        document.getElementById("fechaInicio").value = "";
        document.getElementById("fechaFin").value = "";
  }

  const handleCantidadChange = (e, id) => {
    const newValue = parseInt(e.target.value); // Obtener el nuevo valor como número entero

    if (!isNaN(newValue) && newValue > 0) {
      // Actualizar el valor de cantidadCompra para el elemento correspondiente en la lista de pedidos
      setListPedidos((prevList) =>
        prevList.map((item) => {
          if (item.producto.idProducto === id) {
            const updatedItem = { ...item, cantidadCompra: newValue };
            const total = newValue * item.producto.precioDeCompra;
            setTotal(total);
            return updatedItem;
          }
          return item;
        })
      );
    }
  };

  if (localStorage.getItem("auth") !== null) {
    return (
      <>
        <EstructuraMenu />
        <h2>PEDIDOS</h2>
        <div className="contenedorFondo">
          <button className="buttonAgregar" onClick={openModalAgregar}>
            Agregar Pedido
          </button>
          <Link to="/Proveedores">
            <button className="buttonAgregar">Volver a Proveedores</button>
          </Link>
          <div>
            <p>Ingrese la fecha de inicio</p>
            <input className="input-text" type="date" id="fechaInicio" />
            <br />
            <p>Ingrese la fecha de fin</p>
            <input className="input-text" type="date" id="fechaFin" />
            <br />
            <button className="buttonAgregar" onClick={buscarFecha}>
              Buscar
            </button>
          </div>

          <div className="contenedorTabla">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha Pedido</th>
                  <th>Fecha Entrega</th>
                  <th>Monto Total</th>
                  <th>Proveedor</th>
                  <th>Metodo Pago</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((elemento) => (
                  <tr key={elemento.idPedidos}>
                    <td>{elemento.idPedidos}</td>
                    <td>{formatFecha(elemento.fechaDePedido)}</td>
                    <td>
                      {elemento.fechaDeEntrega
                        ? formatFecha(elemento.fechaDeEntrega)
                        : ""}
                    </td>
                    <td>{elemento.montoTotal}</td>
                    <td>
                      {data1 &&
                        data1.map((el) =>
                          el.idProveedor ===
                          parseFloat(elemento.Proveedor_idProveedor)
                            ? el.nombreProveedor
                            : null
                        )}
                    </td>
                    <td>
                      {data &&
                        data.map((el) =>
                          el.idMetodoPago ===
                          parseFloat(elemento.MetodoPago_idMetodoPago)
                            ? el.metodoPago
                            : null
                        )}
                    </td>

                    <td>
                      <button
                        onClick={(e) => handleDetalle(e, elemento.idPedidos)}>
                        Detalles pedido
                      </button>
                      <br />
                      <button onClick={(e) => handleDetalleEditar(e, elemento)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal isOpen={isOpenModalBuscar} closeModal={closeModalBuscar}>
            <div>
              <h2>Pedidos Encontrados</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha Pedido</th>
                    <th>Fecha Entrega</th>
                    <th>Monto Total</th>
                    <th>Proveedor</th>
                    <th>Metodo Pago</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {fechaFiltrada.map((elemento) => (
                    <tr key={elemento.idPedidos}>
                      <td>{elemento.idPedidos}</td>
                      <td>{formatFecha(elemento.fechaDePedido)}</td>
                      <td>
                        {elemento.fechaDeEntrega
                          ? formatFecha(elemento.fechaDeEntrega)
                          : ""}
                      </td>
                      <td>{elemento.montoTotal}</td>
                      <td>
                        {data1 &&
                          data1.map((el) =>
                            el.idProveedor ===
                            parseFloat(elemento.Proveedor_idProveedor)
                              ? el.nombreProveedor
                              : null
                          )}
                      </td>
                      <td>
                        {" "}
                        {data &&
                          data.map((el) =>
                            el.idMetodoPago ===
                            parseFloat(elemento.MetodoPago_idMetodoPago)
                              ? el.metodoPago
                              : null
                          )}
                      </td>
                      <td>
                        <>
                          <button
                            onClick={(e) =>
                              handleDetalle(e, elemento.idPedidos)
                            }>
                            Detalles pedidos
                          </button>
                          <br />
                          <button
                            onClick={(e) => handleDetalleEditar(e, elemento)}>
                            Editar
                          </button>
                        </>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal>

          <Modal isOpen={isOpenModalDetalles} closeModal={closeModalDetalles}>
            <div>
              <h2>Detalles de pedido</h2>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>cantidad</th>
                    <th>precio unitario</th>
                    <th>subTotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detallepedidos.map((elemento) => (
                    <tr key={elemento.Productos_idProducto}>
                      <td>{elemento.nombreProducto}</td>
                      <td>{elemento.cantidadPedido}</td>
                      <td>{elemento.precioUnitario}</td>
                      <td>{elemento.subTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal>

          <Modal
            isOpen={isOpenModalDetallesEditar}
            closeModal={closeModalDetallesEditar}>
            <div>
              <p>Fecha Pedido</p>
              <input
                className="input-text"
                type="text"
                name="fechaPedido"
                value={fechaPedido}
                autoComplete="off"
                readOnly
                onChange={handleFechaPedidoChange}
              />

              <p>Fecha Entrega</p>
              <input
                className="input-text"
                type="date"
                name="fechaEntrega"
                autoComplete="off"
                value={fechaEntrega}
                onChange={handleFechaEntregaChange}
              />

              <br />
              <button
                className="buttonAgregar"
                onClick={updateDetallesPedidoFecha}>
                Aceptar
              </button>
            </div>
          </Modal>

          <Modal isOpen={isOpenModalAgregar} closeModal={closeModalAgregar}>
            <div className="modal-scroll">
              <h2>Datos del Pedido</h2>
              <div className="App">
                <form>
                  <div className="DatosGeneralesPedidos">
                    <select
                      name="proveedor"
                      onChange={(e) => setProveedorGeneral(e.target.value)}
                      value={proveedorGeneral}>
                      <option value="">Elige un Proveedor</option>
                      {data1 &&
                        data1.map((el) => (
                          <option key={el.idProveedor} value={el.idProveedor}>
                            {el.nombreProveedor}
                          </option>
                        ))}
                    </select>

                    <select
                      name="metodoPago"
                      onChange={(e) => setMetodoPagoGeneral(e.target.value)}
                      value={metodoPagoGeneral}>
                      <option value="">Elige un método de Pago</option>
                      {data &&
                        data.map((el) => (
                          <option key={el.idMetodoPago} value={el.idMetodoPago}>
                            {el.metodoPago}
                          </option>
                        ))}
                    </select>
                  </div>

                  <h2>Datos de los Productos</h2>
                  <div className="detalles-pedido">
                    <p>Nombre del Producto</p>
                    <input
                      id="nombreProducto"
                      className="input-text"
                      type="text"
                      name="nombreProducto"
                      onBlur={handleBlur}
                      onChange={(e) => buscarProducto(e.target.value)}
                      value={productoSeleccionado.nombreProducto}
                      autoComplete="off"
                      required
                    />
                    {errors.nombreProducto && (
                      <p style={styles}>{errors.nombreProducto}</p>
                    )}

                    <div className="contenedor-opciones">
                      {opciones && opciones.length > 0 ? (
                        <table className="opciones-table">
                          <thead>
                            <tr>
                              <th>Nombre del Producto</th>
                              <th>Stock</th>
                              {listPedidos.length > 0 && (
                                <>
                                  <th>Pedido en curso</th>
                                  <th>Total en stock</th>
                                </>
                              )}
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
                                  opcionElegida(opc);
                                }}
                                onMouseEnter={() => setHoveredRow(index)}
                                onMouseLeave={() => setHoveredRow(null)}>
                                <td>{opc.nombreProducto}</td>
                                <td>{opc.cantidadEnStock}</td>
                                <td
                                  style={{
                                    display:
                                      listPedidos.length > 0 &&
                                      listPedidos.some(
                                        (el) =>
                                          el.producto.idProducto ===
                                          opc.idProducto
                                      )
                                        ? "table-cell"
                                        : "none",
                                  }}>
                                  {listPedidos.map((el) =>
                                    el.producto.idProducto === opc.idProducto
                                      ? el.cantidadCompra
                                      : null
                                  )}
                                </td>
                                <td
                                  style={{
                                    display:
                                      listPedidos.length > 0 &&
                                      listPedidos.some(
                                        (el) =>
                                          el.producto.idProducto ===
                                          opc.idProducto
                                      )
                                        ? "table-cell"
                                        : "none",
                                  }}>
                                  {listPedidos.map((el) =>
                                    el.producto.idProducto === opc.idProducto
                                      ? parseFloat(opc.cantidadEnStock) +
                                        parseFloat(el.cantidadCompra)
                                      : null
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : null}
                    </div>
                  </div>

                  <p>Cantidad</p>
                  <input
                    className="input-text"
                    type="number"
                    name="cantidad"
                    onBlur={handleBlur}
                    onChange={handleChangeCantidad}
                    value={cantidad}
                    required
                    min={1}
                  />
                  {errors.cantidad && <p style={styles}>{errors.cantidad}</p>}

                  <div className="input-box-agregar-pedido">
                    <p>Precio de Compra</p>
                    <input
                      id="precio"
                      className="input-text"
                      type="text"
                      name="precioCompra"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={productoSeleccionado.precioDeCompra}
                      required
                      readOnly
                      placeholder="Precio de Compra"
                    />
                    {errors.precioCompra && (
                      <p style={styles}>{errors.precioCompra}</p>
                    )}
                  </div>
                  <p>SubTotal</p>
                  <input
                    className="input-text"
                    type="text"
                    name="subTotal"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={subTotal}
                    readOnly
                    required
                    placeholder="SubTotal"
                  />
                  {errors.precioCompra && (
                    <p style={styles}>{errors.precioCompra}</p>
                  )}

                  <div className="contenedor-botones-pedidos">
                    <input
                      type="button"
                      onClick={handleSubmitPedido}
                      value="Agregar a la lista"
                    />
                    <input
                      type="button"
                      onClick={limpiarCampos}
                      value="limpiar datos"
                    />
                    <br />
                  </div>
                </form>
              </div>
              <div className="contenedor-agregar-tabla-pedidos">
                <p className="total-pedidos">Total = $ {total}</p>
                <table className="tabla-registro-pedidos">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th>Precio unitario de compra</th>
                      <th>Sub total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPedidos.length === 0 ? (
                      <tr>
                        <td colSpan="4">Aun no hay pedidos</td>
                      </tr>
                    ) : (
                      listPedidos.map((dato) => (
                        <tr key={dato.id}>
                          <td>{dato.producto.nombreProducto}</td>
                          <td>
                            <input
                              type="number"
                              min={1}
                              value={dato.cantidadCompra}
                              onChange={(e) =>
                                handleCantidadChange(
                                  e,
                                  dato.producto.idProducto
                                )
                              }
                              style={{ width: "100px", padding: "5px" }}
                            />
                          </td>

                          <td>${dato.producto.precioDeCompra}</td>
                          <td>
                            $
                            {parseFloat(dato.cantidadCompra) *
                              parseFloat(dato.producto.precioDeCompra)}
                          </td>
                          <td>
                            <button
                              onClick={(e) =>
                                eliminarLista(e, dato.producto.idProducto)
                              }>
                              <img
                                className="imagenAccion"
                                src={Eliminar}
                                alt="Imagen boton eliminar"
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {listPedidos.length === 0 ? (
                  <p></p>
                ) : (
                  <button
                    className="btn-realizar-pedido"
                    type="submit"
                    onClick={handleSubmit}>
                    Realizar Pedido
                  </button>
                )}
                <button
                  className="btn-cancelar-pedido"
                  onClick={cancelarAgregarPedidos}>
                  Cacelar
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </>
    );
  } else {
    window.location = "/";
  }
}

export default Pedidos;
