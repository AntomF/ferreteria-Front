import React, { useState, useEffect } from "react";
import EstructuraMenu from "./EstructuraMenu";
import Actualizar from "../Imagenes/Actualizar.png";
import Eliminar from "../Imagenes/Eliminar.png";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import Swal from "sweetalert2";
import { useForm } from "./useForm";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import "./Productos.css";

function Productos() {
  const { data1 } = useFetch("http://localhost:8000/unidadDeVenta");
  const { data } = useFetch("http://localhost:8000/categoria");
  const [isOpenModalAgregar, openModalAgregar, closeModalAgregar] =
    useModal(false);
  const [isOpenModalModificar, openModalModificar, closeModalModificar] =
    useModal(false);

  const [opcionSeleccionada, setOpcionSeleccionada] =
    useState("nombreProducto");
  const [isUpdate, setIsUpdate] = useState(false);
  const [idProducto, setIdProducto] = useState("");
  const [productos, setProductos] = useState([]);
  const [productosBuscar, setProductosBuscar] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [formDataUpdate, setFormDataUpdate] = useState({
    idProducto: "",
    nombreProducto: "",
    descripcionProducto: "",
    UnidadDeVenta_idUnidadDeVenta: "",
    precioDeCompra: "",
    precioProducto: "",
    precioMayoreo: "",
    marcaProducto: "",
    cantidadEnStock: "",
    codigoBarras: "",
    codigoAlternativo: "",
    Categoria_idCategoria: "",
    estatusVisible: "1",
  });

  const initialForm = {
    idProducto: "",
    nombreProducto: "",
    descripcionProducto: "",
    UnidadDeVenta_idUnidadDeVenta: "",
    precioDeCompra: "",
    precioProducto: "",
    precioMayoreo: "",
    marcaProducto: "",
    cantidadEnStock: "",
    codigoBarras: "",
    codigoAlternativo: "",
    Categoria_idCategoria: "",
    estatusVisible: "1",
  };

  const validationsForm = (form) => {
    let errors = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;

    if (!form.nombreProducto.toString().trim()) {
      errors.nombreProducto = "El campo 'Nombre' es requerido";
    } else if (!regexName.test(form.nombreProducto.trim())) {
      errors.nombreProducto =
        "El campo 'Nombre' sólo acepta letras y espacios en blanco";
    }

    if (!form.precioDeCompra.toString().trim()) {
      errors.precioDeCompra = "El campo 'Precio De Compra' es requerido";
    }

    if (!form.precioProducto.toString().trim()) {
      errors.precioProducto = "El campo 'Precio Producto' es requerido";
    }

    if (!form.precioMayoreo.toString().trim()) {
      errors.precioMayoreo = "El campo 'Precio Mayoreo' es requerido";
    }

    if (!form.marcaProducto.toString().trim()) {
      errors.marcaProducto = "El campo 'Marca' es requerido";
    }
    if (!form.Categoria_idCategoria.toString().trim()) {
      errors.Categoria_idCategoria = "El campo 'Categoria' es requerido";
    }
    if (!form.UnidadDeVenta_idUnidadDeVenta.toString().trim()) {
      errors.UnidadDeVenta_idUnidadDeVenta = "El campo 'Unidad' es requerido";
    }

    return errors;
  };

  let styles = {
    fontWeight: "bold",
    color: "#dc3545",
  };

  const { form, setForm, setErrors, errors, handleChange, handleBlur } =
    useForm(initialForm, validationsForm);

  function datosAmodificar(producto) {
    setIdProducto(producto.idProducto);
    formDataUpdate.idProducto = producto.idProducto;
    formDataUpdate.nombreProducto = producto.nombreProducto;
    formDataUpdate.descripcionProducto = producto.descripcionProducto;
    formDataUpdate.UnidadDeVenta_idUnidadDeVenta =
      producto.UnidadDeVenta_idUnidadDeVenta;
    formDataUpdate.precioDeCompra = producto.precioDeCompra;
    formDataUpdate.precioProducto = producto.precioProducto;
    formDataUpdate.precioMayoreo = producto.precioMayoreo;
    formDataUpdate.marcaProducto = producto.marcaProducto;
    formDataUpdate.cantidadEnStock = producto.cantidadEnStock;
    formDataUpdate.codigoBarras = producto.codigoBarras;
    formDataUpdate.codigoAlternativo = producto.codigoAlternativo;
    formDataUpdate.Categoria_idCategoria = producto.Categoria_idCategoria;
    openModalModificar();
  }

  const handleSelectChangeBuscar = (e) => {
    const selectedOption = e.target.value;
    setOpcionSeleccionada(selectedOption);
  };
  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/producto/put/${idProducto}`, {
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
  function handleSubmitEstatusUpdate() {
    fetch(`http://localhost:8000/producto/estatus/${idProducto}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .finally(window.location.reload())
      .catch((error) => console.log(error));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validationsForm(form));
    console.log(form);
    if (Object.keys(errors).length === 0) {
      fetch("http://localhost:8000/producto/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then((response) => {
          if (response.ok) {
            // Producto agregado exitosamente
            console.log("Producto añadido");
          } else if (response.status === 400) {
            // Código de barras ya existe, mostrar mensaje de error
            response.json().then((data) => {
              alert(data.message); // Mostrar mensaje de error
            });
          } else {
            // Otro error
            console.log("Error al agregar el producto");
          }
        })
        .finally(() => window.location.reload())
        .catch((error) => {
          console.log(error);
        });
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
        fetch(`http://localhost:8000/producto/delete/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .catch((error) => console.log(error));
        Swal.fire("Registro Eliminado", "", "success");
      }
    });
  };

  useEffect(() => {
    fetch("http://localhost:8000/producto")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/productoBuscar")
      .then((res) => res.json())
      .then((data) => setProductosBuscar(data))
      .catch((error) => console.log(error));
  }, []);

  const buscarProducto = (text) => {
    let matches = [];
    if (text.length > 0) {
      const regex = new RegExp(`${text}`, "gi");
      matches = productosBuscar.filter((produc) => {
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

    setOpciones(matches);
    return matches;
  };

  const opcionElegida = (producto) => {
    console.log(producto);
    setIdProducto(producto.idProducto);
    form.idProducto = producto.idProducto;
    form.nombreProducto = producto.nombreProducto;
    form.descripcionProducto = producto.descripcionProducto;
    form.UnidadDeVenta_idUnidadDeVenta = producto.UnidadDeVenta_idUnidadDeVenta;
    form.precioDeCompra = producto.precioDeCompra;
    form.precioProducto = producto.precioProducto;
    form.precioMayoreo = producto.precioMayoreo;
    form.marcaProducto = producto.marcaProducto;
    form.cantidadEnStock = producto.cantidadEnStock;
    form.codigoBarras = producto.codigoBarras;
    form.Categoria_idCategoria = producto.Categoria_idCategoria;
    form.estatusVisible = "1";
    setIsUpdate(true);
    setOpciones([]);
  };

  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setFormDataUpdate((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangeBusqueda = (e) => {
    setBusqueda(e.target.value);
    //filtrar(busqueda);
  };

  const [selectedOption, setSelectedOption] = useState("opcion1");
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  //filtrar la busqueda
  let resultado = [];
  if (selectedOption === "opcion1") {
    // Lógica para la opción 1
    if (!busqueda) {
      resultado = productos;
    } else {
      resultado = productos.filter(
        (dato) =>
          dato.nombreProducto.toLowerCase().includes(busqueda.toLowerCase())
        //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }
  } else if (selectedOption === "opcion2") {
    if (!busqueda) {
      resultado = productos;
    } else {
      resultado = productos.filter(
        (dato) =>
          dato.codigoBarras
            .toString()
            .toLowerCase()
            .includes(busqueda.toLowerCase())
        //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }
  } else if (selectedOption === "opcion3") {
    if (!busqueda) {
      resultado = productos;
    } else {
      resultado = productos.filter(
        (dato) =>
          dato.Categoria_idCategoria.toLowerCase().includes(
            busqueda.toLowerCase()
          )
        //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }
  } else if (selectedOption === "opcion4") {
    if (!busqueda) {
      resultado = productos;
    } else {
      resultado = productos.filter(
        (dato) =>
          dato.marcaProducto.toLowerCase().includes(busqueda.toLowerCase())
        //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }
  }

  const handleChangeTexto = (e) => {
    const { value } = e.target;
    setForm((prevForm) => ({ ...prevForm, nombreProducto: value }));
    buscarProducto(value); // Llamar a buscarProducto con el valor actualizado
  };

  const actualizarEstatus = (e) => {
    e.preventDefault();
    console.log(form);
   handleSubmitEstatusUpdate();
  };

  return (
    <div>
      <EstructuraMenu />
      <h2>PRODUCTOS</h2>
      <div className="contenedorFondo">
        <button className="buttonAgregar" onClick={openModalAgregar}>
          Agregar Producto
        </button>
        <Link to="/Productos/Categorias">
          <button className="buttonAgregar">Categorias</button>
        </Link>

        <div className="contenedor-busqueda">
          <input
            className="input-text"
            type="text"
            name="busquedaClasificacion"
            placeholder="Buscar"
            onChange={handleChangeBusqueda}
            value={busqueda}
          />

          <select value={selectedOption} onChange={handleSelectChange}>
            <option value="opcion1">Nombre</option>
            <option value="opcion2">Código de Barras </option>
            <option value="opcion3">Categoria</option>
            <option value="opcion4">Marca</option>
          </select>
        </div>

        <Modal isOpen={isOpenModalAgregar} closeModal={closeModalAgregar}>
          <div>
            <h2>Agregar Datos</h2>
            <div className="App">
              <form onSubmit={handleSubmit}>
                <div className="input-container">
                  <input
                    className="input-text"
                    name="nombreProducto"
                    type="text"
                    value={form.nombreProducto}
                    placeholder="Nombre"
                    onChange={handleChangeTexto}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                  <select name="opciones" onChange={handleSelectChangeBuscar}>
                    <option value="nombreProducto">Nombre del Producto</option>
                    <option value="codigoBarras">Código de Barras</option>
                    <option value="marcaProducto">Marca del Producto</option>
                  </select>

                  {opciones.length > 0 && (
                    <div>
                      <ul className="options">
                        {opciones.map((opc, index) => (
                          <li key={index} onClick={() => opcionElegida(opc)}>
                            <div>{opc.nombreProducto}</div>
                            <div>Cantidad: {opc.cantidadEnStock}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {errors.nombreProducto && (
                  <p style={styles}>{errors.nombreProducto}</p>
                )}

                <input
                  className="input-text"
                  name="descripcionProducto"
                  type="text"
                  value={form.descripcionProducto}
                  placeholder="Descripcion"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.descripcionProducto && (
                  <p style={styles}>{errors.descripcionProducto}</p>
                )}

                <select
                  name="UnidadDeVenta_idUnidadDeVenta"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={form.UnidadDeVenta_idUnidadDeVenta}>
                  <option value="">Elige una unidad de Venta</option>
                  {data1 &&
                    data1.map((el) => (
                      <option
                        key={el.idUnidadDeVenta}
                        value={el.idUnidadDeVenta}>
                        {el.unidadDeVenta}
                      </option>
                    ))}
                </select>

                <input
                  className="input-text"
                  name="precioDeCompra"
                  type="number"
                  value={form.precioDeCompra}
                  placeholder="Precio de compra"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={0}
                />
                {errors.precioDeCompra && (
                  <p style={styles}>{errors.precioDeCompra}</p>
                )}

                <input
                  className="input-text"
                  name="precioProducto"
                  type="number"
                  value={form.precioProducto}
                  placeholder="Precio del Producto"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={0}
                />
                {errors.precioProducto && (
                  <p style={styles}>{errors.precioProducto}</p>
                )}

                <input
                  className="input-text"
                  name="precioMayoreo"
                  type="number"
                  value={form.precioMayoreo}
                  placeholder="Precio de Mayoreo"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={0}
                />
                {errors.precioMayoreo && (
                  <p style={styles}>{errors.precioMayoreo}</p>
                )}

                <input
                  className="input-text"
                  name="marcaProducto"
                  type="text"
                  value={form.marcaProducto}
                  placeholder="Marca Producto"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.marcaProducto && (
                  <p style={styles}>{errors.marcaProducto}</p>
                )}

                <input
                  className="input-text"
                  name="cantidadEnStock"
                  type="number"
                  value={form.cantidadEnStock}
                  placeholder="Cantidad En Stock"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={0}
                />
                {errors.cantidadEnStock && (
                  <p style={styles}>{errors.cantidadEnStock}</p>
                )}

                <input
                  className="input-text"
                  name="codigoBarras"
                  type="text"
                  value={form.codigoBarras}
                  placeholder="Código Barras del Producto"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <input
                  className="input-text"
                  name="codigoAlternativo"
                  type="text"
                  value={form.codigoAlternativo}
                  placeholder="Código Barras Alternativo"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <select
                  name="Categoria_idCategoria"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={form.Categoria_idCategoria}>
                  <option value="">Elige una categoria</option>
                  {data &&
                    data.map((el) => (
                      <option key={el.idCategoria} value={el.idCategoria}>
                        {el.nombreCategoria}
                      </option>
                    ))}
                </select>
                {errors.Categoria_idCategoria && (
                  <p style={styles}>{errors.Categoria_idCategoria}</p>
                )}

                <br />
                {isUpdate ? (
                  <button
                    type="button"
                    onClick={(e) => actualizarEstatus(e)}
                    className="buttonAgregar">
                    Actualizar
                  </button>
                ) : (
                  <button type="submit" className="buttonAgregar">
                    Agregar
                  </button>
                )}
              </form>
            </div>
          </div>
        </Modal>

        <div className="contenedorHijo">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre del producto</th>
                <th>Descripción del producto</th>
                <th>Unidad De Venta</th>
                <th>Precio De Compra</th>
                <th>Precio Producto</th>
                <th>Precio Mayoreo</th>
                <th>Marca Producto</th>
                <th>Cantidad en Stock</th>
                <th>Código de Barras</th>
                <th>Código Alternativo</th>
                <th>Categoria</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultado.map((item) => (
                <tr key={item.idProducto}>
                  <td>{item.idProducto}</td>
                  <td>{item.nombreProducto}</td>
                  <td>{item.descripcionProducto}</td>
                  <td>
                    {data1 &&
                      data1.map((el) =>
                        el.idUnidadDeVenta ===
                        parseFloat(item.UnidadDeVenta_idUnidadDeVenta)
                          ? el.unidadDeVenta
                          : null
                      )}
                  </td>
                  <td>{item.precioDeCompra}</td>
                  <td>{item.precioProducto}</td>
                  <td>{item.precioMayoreo}</td>
                  <td>{item.marcaProducto}</td>
                  <td>{item.cantidadEnStock}</td>
                  <td>{item.codigoBarras}</td>
                  <td>{item.codigoAlternativo}</td>
                  <td>
                    {data &&
                      data.map((el) =>
                        el.idCategoria ===
                        parseFloat(item.Categoria_idCategoria)
                          ? el.nombreCategoria
                          : null
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
                        onClick={() => mostrarAlert(item.idProducto)}
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
                name="idProducto"
                type="number"
                defaultValue={formDataUpdate.idProducto}
                placeholder="idProducto"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="nombreProducto"
                type="text"
                defaultValue={formDataUpdate.nombreProducto}
                placeholder="Nombre"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="descripcionProducto"
                type="text"
                defaultValue={formDataUpdate.descripcionProducto}
                placeholder="Descripcion"
                onChange={handleChangeUpdate}
              />
              <select
                name="UnidadDeVenta_idUnidadDeVenta"
                onChange={handleChangeUpdate}
                onBlur={handleBlur}
                value={formDataUpdate.UnidadDeVenta_idUnidadDeVenta}>
                {data1 &&
                  data1.map((el) => (
                    <option key={el.idUnidadDeVenta} value={el.idUnidadDeVenta}>
                      {el.unidadDeVenta}
                    </option>
                  ))}
              </select>
              <input
                className="input-text"
                name="precioDeCompra"
                type="number"
                defaultValue={formDataUpdate.precioDeCompra}
                placeholder="Precio de Compra"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="precioProducto"
                type="number"
                defaultValue={formDataUpdate.precioProducto}
                placeholder="Precio Producto"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="precioMayoreo"
                type="number"
                defaultValue={formDataUpdate.precioMayoreo}
                placeholder="Precio Mayoreo"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="marcaProducto"
                type="text"
                defaultValue={formDataUpdate.marcaProducto}
                placeholder="Marca Producto"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="cantidadEnStock"
                type="text"
                defaultValue={formDataUpdate.cantidadEnStock}
                placeholder="Cantidad En Stock"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="codigoBarras"
                type="text"
                defaultValue={formDataUpdate.codigoBarras}
                placeholder="Codigo de Barras"
                onChange={handleChangeUpdate}
              />
              <input
                className="input-text"
                name="codigoAlternativo"
                type="text"
                defaultValue={formDataUpdate.codigoAlternativo}
                placeholder="Codigo Alternativo"
                onChange={handleChangeUpdate}
              />

              <select
                name="Categoria_idCategoria"
                onChange={handleChangeUpdate}
                onBlur={handleBlur}
                value={formDataUpdate.Categoria_idCategoria}>
                {data &&
                  data.map((el) => (
                    <option key={el.idCategoria} value={el.idCategoria}>
                      {el.nombreCategoria}
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
}

export default Productos;
