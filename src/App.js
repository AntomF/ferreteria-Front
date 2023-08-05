
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './componentes/Login'
import EstructuraMenu from './componentes/EstructuraMenu'
import Productos from './componentes/Productos';
import Proveedores from './componentes/Proveedores';
import Bienvenida from './componentes/Bienvenida';
import Categorias from './componentes/Categoria';
import Clientes from './componentes/Cliente';
import Empleados from './componentes/empleado';
import Usuarios from './componentes/Usuario';
import Venta from './componentes/Ventas';
import Reporte from './componentes/Reportes';
import Pedidos from './componentes/Pedidos';
import Devoluciones from './componentes/Devoluciones';
import ProductosDañados from './componentes/ProductosDañados';

function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/Menu' element={<EstructuraMenu/>} />
          <Route path='/Productos' element={<Productos/>} />
          <Route path='/Productos/Categorias' element={<Categorias/>} />
          <Route path='/Proveedores' element={<Proveedores/>} />
          <Route path='/Clientes' element={<Clientes/>} />
          <Route path='/Empleados' element={<Empleados/>} />
          <Route path='/Usuarios' element={<Usuarios/>} />
          <Route path='/Ventas' element={<Venta/>} />
          <Route path='/Reportes' element={<Reporte/>} />
          <Route path='/Proveedor/Pedidos' element={<Pedidos/>} />
          <Route path='/Home' element={<Bienvenida/>} />
          <Route path='/Devoluciones' element={<Devoluciones/>} />
          <Route path='/ProductosDañados' element={<ProductosDañados/>} />

        </Routes>
      </Router>
      
        
        
    </div>

  );
}

export default App;
