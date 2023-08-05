import './Login.css'; // Importar estilos CSS personalizados
import Logo2 from '../Imagenes/Logo2.png'
import LoginImagen from '../Imagenes/loginsistema.png'
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataEncrypt } from "../utils/dataEncrypt";
import { dataDecrypts } from "../utils/dataDecrypts";



function Login(){
  const [credentials, setCredentials]=useState({usuario:'',contraseña:''});
  
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/datoFijoDevolucion`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then(data => {
        // Procesar los datos devueltos por el servidor
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/datoFijoTipoUsuario`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then(data => {
        // Procesar los datos devueltos por el servidor
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  useEffect(() => {
    fetch(`http://localhost:8000/datoFijoUnidadVenta`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then(data => {
        // Procesar los datos devueltos por el servidor
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/datoFijoCargo`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then(data => {
        // Procesar los datos devueltos por el servidor
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  useEffect(() => {
    fetch(`http://localhost:8000/datoFijoMetodoPago`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then(data => {
        // Procesar los datos devueltos por el servidor
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  useEffect(() => {
    fetch(`http://localhost:8000/datoFijoTipoDeVenta`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then(data => {
        // Procesar los datos devueltos por el servidor
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  useEffect(() => {
    fetch(`http://localhost:8000/datoFijoUsuario`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then(data => {
        // Procesar los datos devueltos por el servidor
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value
    }));
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
   // console.log(credentials);
    
    // Realizar la solicitud a la API para autenticar al usuario
    fetch('http://localhost:8000/usuarioEntra', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario: credentials.usuario,
        contraseña: credentials.contraseña
      })
    })
      .then((response) => response.json())
      .then((data) => {

      //  console.log(data[0].TipoUsuario_idTipoUsuario);

        // Manejar la respuesta de la API
        if (data[0].TipoUsuario_idTipoUsuario ===1) {
            localStorage.setItem("auth",dataEncrypt('"logeado"'));
          // El usuario ha iniciado sesión exitosamente
          navigate("/Home");
          // Puedes almacenar el token de autenticación en localStorage o en el estado de la aplicación, según tus necesidades
        } else {
          localStorage.setItem("auth",dataEncrypt('"logeado"'));
            navigate("/");
          // La autenticación falló, muestra un mensaje de error o realiza alguna acción adecuada
        }
      })
      .catch((error) => {
        // Manejar errores de la solicitud
        console.error('Error:', error);
      });
  };
  
    return (
      <div className="contenedorFondo-login">
      <form className="login-form" onSubmit={handleLoginSubmit}>
        <h1>Bienvenido</h1>
        <div className="form-group">
          <p >Usuario</p>
          <input className='input-login'
            type="text"
            name="usuario"
            value={credentials.usuario}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <p >Contraseña</p>
          <input className='input-login'
            type="password"
            name="contraseña"
            value={credentials.contraseña}
            onChange={handleInputChange}
          />
        </div>
        <button className='buttonIngresar' type="submit">Iniciar sesión</button>
      </form>
      <div className='contenedor-Imagenes-login'>
      <img src={Logo2} className='imagen-login' alt=''></img>
      <img src={LoginImagen} className='imagen-login2' alt=''></img>
      </div>
      </div>
    );
  
}

export default Login;
