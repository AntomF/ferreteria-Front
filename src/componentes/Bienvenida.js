import React from 'react'
import EstructuraMenu from './EstructuraMenu';
import Bienvenido from '../Imagenes/Bienvenido.png'
import "./Bienvenida.css";
import Logo from '../Imagenes/Logo.PNG'

function Bienvenida() {
  if(localStorage.getItem("auth")!==null ) {

 
  return (
    <div className='contenedor General'>
        <EstructuraMenu/>
        <div className='contenidoBienvenida'>
            <img src={Logo} className='imagenBienvLogo' alt=''></img>
            <br/>
            <img src={Bienvenido} className='imagenBienv' alt=''></img>
        </div>
    </div>
  );
}else{
  window.location='/';
}
}

export default Bienvenida