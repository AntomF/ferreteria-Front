import { useState, useEffect } from "react";
import { useForm } from "./useForm";
import { Link } from "react-router-dom";
import EstructuraMenu from "./EstructuraMenu";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import * as XLSX from "xlsx";

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

function Reportes() {
  const { form, setErrors, errors, handleChange, handleBlur } = useForm(
    datosIniciales,
    validateForm
  );

  const [metodoPago, setMetodoPago] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [detallesVentas, setDetallesVentas] = useState([]);
  const [detallesVentasGeneral, setDetallesVentasGeneral] = useState([]);
  const [fechaFiltrada, setFechaFiltrada] = useState([]);
  const [tipoVenta, setTipoVenta] = useState([]);
  const [cliente, setClientes] = useState([]);
  const [isCheckedCliente, setIsCheckedCliente] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [ticket, setTicket] = useState([]);

  const [isOpenModalDetalles, openModalDetalles, closeModalDetalles] =
    useModal(false);
  const [isOpenModalBuscar, openModalBuscar, closeModalBuscar] =
    useModal(false);
  const [
    isOpenModalBuscarFiltro,
    openModalBuscarFiltro,
    closeModalBuscarFiltro,
  ] = useModal(false);
  const [isOpenticket, openTicket, closeModalTicket] = useModal(false);

  const [
    isOpenModalDetallesEditar,
    OpenModalDetallesEditar,
    closeModalDetallesEditar,
  ] = useModal(false);

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
    fetch(`http://localhost:8000/getDetallesVentasGeneral`)
      .then((response) => response.json())
      .then((data) => {
        setDetallesVentasGeneral(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/tipoDeVenta`)
      .then((response) => response.json())
      .then((data) => {
        setTipoVenta(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const obtenerDetalles = (id) => {
    openModalDetalles();
    fetch(`http://localhost:8000/getDetallesVentas/${id}`)
      .then((res) => res.json())
      .then((data) => setDetallesVentas(data))
      .catch((error) => console.log(error));
  };
  const obtenerTicket = (id) => {
    openTicket();
    fetch(`http://localhost:8000/getNuevoTicket/${id}`)
      .then((res) => res.json())
      .then((data) => setTicket(data))
      .catch((error) => console.log(error));
  };

  const formatFecha = (fecha) => {
    const fechaDb = new Date(fecha);
    const anio = fechaDb.getFullYear();
    const mes = fechaDb.getMonth() + 1;
    const dia = fechaDb.getDate();
    return `${anio}-${mes < 10 ? "0" + mes : mes}-${
      dia < 10 ? "0" + dia : dia
    }`;
  };

  const handleCheckboxChange = (event) => {
    setIsCheckedCliente(event.target.checked);
  };
  const handleSelectChange = (event) => {
    setSelectedCliente(event.target.value);
    console.log(event.target.value);
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

    let ventasFiltradas;

    if (isCheckedCliente) {
      if (selectedCliente === "") {
        // Mostrar mensaje de error o realizar alguna acción en caso de que selectedCliente esté vacío
        alert("Debes seleccionar un cliente");
        return;
      }

      ventasFiltradas = ventas.filter((venta) => {
        const fechaPedido = venta.fechaVenta.substring(0, 10);
        return (
          fechaPedido >= fechaInicio &&
          fechaPedido <= fechaFin &&
          venta.Cliente_idCliente == selectedCliente
        );
      });
    } else {
      ventasFiltradas = ventas.filter((venta) => {
        const fechaPedido = venta.fechaVenta.substring(0, 10);
        return fechaPedido >= fechaInicio && fechaPedido <= fechaFin;
      });
    }

    setFechaFiltrada(ventasFiltradas);
    openModalBuscarFiltro();
    document.getElementById("fechaInicio").value = "";
    document.getElementById("fechaFin").value = "";
  }
  function convertToExcel(tableData, fileName) {
    // Crea un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();

    // Crea una hoja de cálculo a partir de los datos de la tabla
    const worksheet = XLSX.utils.table_to_sheet(tableData);

    // Agrega la hoja de cálculo al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // Guarda el libro de trabajo como archivo Excel
    XLSX.writeFile(workbook, fileName + ".xlsx");
  }

  function exportarExcel() {
    const tableData = document.getElementById("miTabla"); // Reemplaza 'miTabla' con el ID de tu tabla
    const fileName = "tabla_excel";

    convertToExcel(tableData, fileName);
  }

  if (localStorage.getItem("auth") !== null) {
    return (
      <>
        <EstructuraMenu />
        <h2>REGISTRO DE VENTAS</h2>
        <div className="contenedorFondo">
          <div>
            <p>Ingrese la fecha de inicio</p>
            <input className="input-text" type="date" id="fechaInicio" />
            <p>Ingrese la fecha de fin</p>
            <input className="input-text" type="date" id="fechaFin" />
            <br />
            <label>
              <input
                type="checkbox"
                checked={isCheckedCliente}
                onChange={handleCheckboxChange}
              />
              Cliente
            </label>
            {isCheckedCliente && (
              <select value={selectedCliente} onChange={handleSelectChange}>
                <option value="">Seleccionar cliente</option>
                {cliente.map((c) => (
                  <option key={c.idCliente} value={c.idCliente}>
                    {c.nombreCliente + " RFC: " + c.RFC}
                  </option>
                ))}
              </select>
            )}
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
                  <th>Fecha Venta</th>
                  <th>MetodoPago</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Descuento</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((elemento) => (
                  <tr key={elemento.idVentas}>
                    <td>{elemento.idVentas}</td>
                    <td>{formatFecha(elemento.fechaVenta)}</td>
                    <td>
                      {metodoPago &&
                      metodoPago.find(
                        (el) =>
                          el.idMetodoPago === elemento.MetodoPago_idMetodoPago
                      )
                        ? metodoPago.find(
                            (el) =>
                              el.idMetodoPago ===
                              elemento.MetodoPago_idMetodoPago
                          ).metodoPago
                        : "Metodo no encontrado"}
                    </td>
                    <td>
                      {cliente &&
                      cliente.find(
                        (el) => el.idCliente === elemento.Cliente_idCliente
                      )
                        ? cliente.find(
                            (el) => el.idCliente === elemento.Cliente_idCliente
                          ).nombreCliente
                        : "Cliente comun"}
                    </td>

                    <td>${elemento.totalVenta}</td>
                    <td>
                      {elemento.descuento !== null && elemento.descuento !== "0"
                        ? "$" + elemento.descuento
                        : "Sin descuento"}
                    </td>

                    <td>
                      <button
                        onClick={(e) => obtenerDetalles(elemento.idVentas)}>
                        Detalles
                      </button>
                      <br />
                      <button onClick={(e) => obtenerTicket(elemento.idVentas)}>
                        Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal isOpen={isOpenModalBuscar} closeModal={closeModalBuscar}>
            <div style={{ maxHeight: "400px", overflow: "auto" }}>
              <h2>Ventas Encontradas</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha Venta</th>
                    <th>MetodoPago</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Utilidad</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {fechaFiltrada.map((elemento) => (
                    <tr key={elemento.idVentas}>
                      <td>{elemento.idVentas}</td>
                      <td>{formatFecha(elemento.fechaVenta)}</td>
                      <td>
                        {metodoPago &&
                        metodoPago.find(
                          (el) =>
                            el.idMetodoPago === elemento.MetodoPago_idMetodoPago
                        )
                          ? metodoPago.find(
                              (el) =>
                                el.idMetodoPago ===
                                elemento.MetodoPago_idMetodoPago
                            ).metodoPago
                          : "Metodo no encontrado"}
                      </td>
                      <td>
                        {cliente &&
                        cliente.find(
                          (el) => el.idCliente === elemento.Cliente_idCliente
                        )
                          ? cliente.find(
                              (el) =>
                                el.idCliente === elemento.Cliente_idCliente
                            ).nombreCliente
                          : "Cliente comun"}
                      </td>

                      <td>{elemento.totalVenta}</td>
                      {detallesVentasGeneral
                        .filter(
                          (detalles) =>
                            detalles.Ventas_idVentas === elemento.idVentas
                        )
                        .map((detalles, index) => (
                          <td key={index}>{detalles.utilidad}</td>
                        ))}

                      <td>
                        <button
                          onClick={(e) => obtenerDetalles(elemento.idVentas)}>
                          Detalles
                        </button>
                        <br />
                        <button>Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal>

          <Modal
            isOpen={isOpenModalBuscarFiltro}
            closeModal={closeModalBuscarFiltro}>
            <div style={{ maxHeight: "400px", overflow: "auto" }}>
              <h2>Ventas Filtradas</h2>
              <table id="miTabla">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Cantidad</th>
                    <th>UnidadDeVenta</th>
                    <th>Producto</th>
                    <th>utilidad</th>
                    <th>Precio Producto o mayore</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesVentasGeneral.map((detalle) =>
                    fechaFiltrada.map((elemento) =>
                      detalle.Ventas_idVentas === elemento.idVentas ? (
                        <tr key={detalle.Ventas_idVentas}>
                          <td>{formatFecha(elemento.fechaVenta)}</td>
                          <td>{detalle.cantidadVenta}</td>
                          <td>{detalle.unidadDeVenta}</td>
                          <td>{detalle.nombreProducto}</td>
                          <td>{detalle.utilidad}</td>
                          <td>
                            {tipoVenta
                              .find(
                                (tipoventa) =>
                                  tipoventa.idTipoVenta === detalle.idTipoVenta
                              )
                              ?.nombreTipoVenta.toLowerCase() === "mayoreo"
                              ? detalle.precioMayoreo
                              : detalle.precioProducto}
                          </td>

                          <td>{detalle.subTotal_Venta}</td>
                        </tr>
                      ) : null
                    )
                  )}
                  <tr>
                    <td colSpan="7">Datos totales</td>
                  </tr>
                  <tr>
                    <td colSpan="5">Utilidad Total</td>
                    <td colSpan="2">
                      {fechaFiltrada.reduce((total, elemento) => {
                        const util = detallesVentasGeneral
                          .filter(
                            (detalles) =>
                              detalles.Ventas_idVentas === elemento.idVentas
                          )
                          .reduce(
                            (subtotal, detalles) =>
                              subtotal + detalles.utilidad,
                            0
                          );
                        return total + util;
                      }, 0)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5">Total</td>
                    <td colSpan="2">
                      {fechaFiltrada.reduce((total, elemento) => {
                        const subtotal = detallesVentasGeneral
                          .filter(
                            (detalles) =>
                              detalles.Ventas_idVentas === elemento.idVentas
                          )
                          .reduce(
                            (subtotal, detalles) =>
                              subtotal + detalles.subTotal_Venta,
                            0
                          );
                        return total + subtotal;
                      }, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button onClick={(e) => exportarExcel()}>Export Excel</button>
            </div>
          </Modal>

          <Modal isOpen={isOpenModalDetalles} closeModal={closeModalDetalles}>
            <div>
              <h2>Detalles de Venta</h2>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>utilidad</th>
                    <th>Tipo de venta</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesVentas.map((elemento, index) => (
                    <tr key={index}>
                      <td>{elemento.nombreProducto}</td>
                      <td>{elemento.cantidadVenta}</td>
                      <td>{elemento.subTotal_Venta}</td>
                      <td>{elemento.utilidad}</td>
                      <td>
                        {elemento.TipoDeVenta_idTipoVenta === 1
                          ? "Mayoreo"
                          : "Mostrador"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal>

          <Modal isOpen={isOpenticket} closeModal={closeModalTicket}>
            <div>
              <p>
                Fecha de Venta:{" "}
                {ticket[0]?.fechaVenta && formatFecha(ticket[0].fechaVenta)}
              </p>
              <label>Cliente: </label>
              <label>
                {ticket[0]?.nombreCliente &&
                  ticket[0]?.apellidoMaterno &&
                  ticket[0]?.apellidoPaterno &&
                  `${ticket[0].nombreCliente} ${ticket[0].apellidoMaterno} ${ticket[0].apellidoPaterno}`}
              </label>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Nombre del Producto</th>
                    <th>Unidad Venta</th>
                    <th>Precio</th>
                    <th>Cantidad Venta</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {ticket.map((elemento, index) => (
                    <tr key={index}>
                      <td>{elemento.nombreProducto}</td>
                      <td>{elemento.unidadDeVenta}</td>
                      <td>
                        {elemento.nombreTipoVenta === "Mayoreo"
                          ? elemento.precioMayoreo
                          : elemento.precioProducto}
                      </td>
                      <td>{elemento.cantidadVenta}</td>
                      <td>{elemento.subTotal_Venta}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4">Subtotal</td>
                    <td>
                      {ticket.reduce(
                        (total, elemento) => total + elemento.subTotal_Venta,
                        0
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4">Impuestos</td>
                    <td>$</td>
                  </tr>
                  <tr>
                    <td colSpan="4">Descuento</td>
                    <td>{ticket[0]?.descuento || 0}</td>
                  </tr>
                  <tr>
                    <td colSpan="4">Total</td>
                    <td>{ticket[0]?.totalVenta || 0}</td>
                  </tr>
                </tbody>
              </table>
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

export default Reportes;
