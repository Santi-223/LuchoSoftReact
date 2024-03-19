import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Default from './components/Default';
import Dashboard from './components/Dashboard/Dashboard';
import Usuarios from './components/Usuarios/Usuarios';
import Roles from './components/Configuracion/Roles';
import AgregarUsuarios from './components/Usuarios/AgregarUsuarios';
import Acceso from './components/Acceso/Acceso'; // Importa el componente Acceso
import EditarUsuarios from './components/Usuarios/EditarUsuarios';
import ActualizarContraseña from './components/Usuarios/ActualizarContraseña';

function LoginPage() {

  return (
    <Acceso />
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/actualizarContraseña" element={<ActualizarContraseña />}/>
          <Route path="/usuarios" element={<Usuarios />}/>
          <Route path="/agregarUsuarios" element={<AgregarUsuarios />}/>
          <Route path="/editarUsuarios/:id_usuario" element={<EditarUsuarios />}/>
          <Route path="/roles" element={<Roles />}/>
          <Route path="*" element={<Default />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
