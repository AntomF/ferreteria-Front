import React, { useState } from 'react'
import './EstructuraMenu.css'
import Logo2 from '../Imagenes/Logo2.png'
import UsuarioFoto from '../Imagenes/Foto003.JPG'
import {Link} from 'react-router-dom';
import ProductoImagen from '../Imagenes/inventario.png'
import ProvedorImagen from '../Imagenes/Proveedor.png'
import VentaImagen from '../Imagenes/punto-de-venta.png'
import UsuarioImagen from '../Imagenes/usuario.png'
import ClienteImagen from '../Imagenes/cliente.png'

import ReportesImagen from '../Imagenes/reporte-anual.png'
import ConfiguracionImagen from '../Imagenes/configuraciones.png'
import SalirImagen from '../Imagenes/apagar.png'


export default function EstructuraMenu() {
  const [select,setSelect]=useState("");


  const handleButtonClick = () => {
    //setSelected(buttonId);
    localStorage.removeItem("auth");
    window.location = '/';
    // if (buttonId === "btnSalir") {

    //   // navigate("/login", { replace: true });
    // }
  };

  /*const handleButtonClick = (btnSalir) => {
    setSelected(btnSalir);
    localStorage.removeItem("auth");
    window.location = '/login';
    // if (buttonId === "btnSalir") {

    //   // navigate("/login", { replace: true });
    // }
  };*/


  return (
    <div className='contenetodo'>
      
        <div className='lateral'>
            <img src={Logo2} className='imagen' alt=''></img>
            <Link to="/Productos"><button className='botonesMenu'><img src={ProductoImagen} className='imagenesMenu' alt=''></img>Productos</button></Link>
            <Link to="/Ventas"><button className='botonesMenu'><img src={VentaImagen} className='imagenesMenu' alt=''></img>Ventas</button></Link>
            <Link to="/Proveedores" ><button className='botonesMenu'><img src={ProvedorImagen} className='imagenesMenu' alt=''></img>Proveedores</button></Link>
            <Link to="/Empleados" ><button className='botonesMenu'><img src={UsuarioImagen} className='imagenesMenu' alt=''></img>Empleados</button></Link>
            <Link to="/Clientes" ><button className='botonesMenu'><img src={ClienteImagen} className='imagenesMenu' alt=''></img>Clientes</button></Link>
            <Link to="/Reportes" ><button className='botonesMenu'><img src={ReportesImagen} className='imagenesMenu' alt=''></img>Reportes</button></Link>
            <Link to="/Devoluciones"><button className='botonesMenu'><img src={ConfiguracionImagen} className='imagenesMenu' alt=''></img>Devoluciones</button></Link>
            <button onClick={handleButtonClick} className='botonesMenu'><img src={SalirImagen} className='imagenesMenu' alt=''></img>Salir</button>
            {/*<button className='botonesMenu'><img src={SalirImagen} id='btnSalir' className='imagenesMenu'onClick={()=>handleButtonClick("btnSalir")} alt=''></img>Salir</button>*/}
        </div>
        <div className='header'>
        <img src={UsuarioFoto} className='UsuarioFoto' alt=''></img>
                       
        </div>
        
    </div>
        

  )
}
