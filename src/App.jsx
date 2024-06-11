import React, { useState, useEffect } from "react";
import './App.css'
import { Routes, Route, HashRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Default from './components/Default';
import Perfil from './components/Perfil/Perfil';
import Usuarios from './components/Usuarios/Usuarios';
import Roles from './components/Configuracion/Roles';
import AgregarUsuarios from './components/Usuarios/AgregarUsuarios';
import EditarUsuarios from './components/Usuarios/EditarUsuarios';
import Login from './components/Login/Login';
import RecuperarContrasena from './components/Login/RecuperarContrasena';
import RecuperarContrasena2 from './components/Login/RecuperarContrasena2';
import PrivateRoute from './components/PrivateRoute';
import './components/Layout.css';

import RegistrarCompra from './components/Compras/Compras/RegistrarCompra';
import TablaCompras from './components/Compras/Compras/TablaCompras';
import TablaProveedores from './components/Compras/Proveedores/TablaProveedores';
import TablaInsumos from './components/Compras/Insumos/TablaInsumos';
import TablaCatInsumos from './components/Compras/Cat-Insumos/TablaCatInsumos';

import Productos from './components/Ventas/Productos/Productos';
import AgregarProductos from './components/Ventas/Productos/AgregarProductos';
import EditarProductos from './components/Ventas/Productos/EditarProductos';
import CategoriasProductos from './components/Ventas/Cat-Productos/CategoriaProductos';
import OrdenesProduccion from './components/Orden/Ordenes';
import AgregarOrdenes from './components/Orden/AgregarOrdenes';

import RegistrarCliente from './components/Ventas/Clientes/RegistrarCliente';
import Ventas from './components/Ventas/Ventas/Ventas';
import RegistrarPedido from './components/Ventas/Pedidos/RegistrarPedidos';
import Pedidos from './components/Ventas/Pedidos/Pedidos';
import Cliente from './components/Ventas/Clientes/Clientes';
import EditarPedidos from './components/Ventas/Pedidos/EditarPedidos';

import { UserProvider } from './components/UserProvider';
import EditarPerfil from "./components/Usuarios/EditarPerfil";

function App() {

  return (
    <HashRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={
            <PrivateRoute publ={true} prot={0}>
              <Login />
            </PrivateRoute>} />
          <Route path="/login" element={
            <PrivateRoute publ={true} prot={0}>
              <Login />
            </PrivateRoute>} />
          <Route path="/recuperarContrasena" element={
            <PrivateRoute publ={true} prot={0}>
              <RecuperarContrasena />
            </PrivateRoute>} />
          <Route path="/recuperarContrasena2/:token" element={
            <PrivateRoute publ={true} prot={0}>
              <RecuperarContrasena2 />
            </PrivateRoute>} />
          <Route element={
            <UserProvider>
              <PrivateRoute prot={0}>
                <Layout />
              </PrivateRoute>
            </UserProvider>
          }>
            <Route exact path="/Perfil" element={
              <PrivateRoute prot={0}>
                <Perfil />
              </PrivateRoute>}
            />
            <Route path="/usuarios" element={
              <PrivateRoute prot={2}>
                <Usuarios />
              </PrivateRoute>}
            />
            <Route path="/agregarUsuarios" element={
              <PrivateRoute prot={2}>
                <AgregarUsuarios />
              </PrivateRoute>}
            />
            <Route path="/editarUsuarios/:id_usuario" element={
              <PrivateRoute prot={2}>
                <EditarUsuarios />
              </PrivateRoute>}
            />
            <Route path="/editarPerfil/:id_usuario" element={
              <PrivateRoute prot={0}>
                <EditarPerfil />
              </PrivateRoute>}
            />
            <Route path="/roles" element={
              <PrivateRoute prot={1}>
                <Roles />
              </PrivateRoute>}
            />
            <Route path="/CatInsumos" element={
              <PrivateRoute prot={3}>
                <TablaCatInsumos />
              </PrivateRoute>}
            />

            <Route path="/RegistrarCompra" element={
              <PrivateRoute prot={6}>
                <RegistrarCompra />
              </PrivateRoute>}
            />

            <Route path="/Compra" element={
              <PrivateRoute prot={6}>
                <TablaCompras />
              </PrivateRoute>}
            />

            <Route path="/Proveedores" element={
              <PrivateRoute prot={5}>
                <TablaProveedores />
              </PrivateRoute>}
            />

            <Route path="/Insumos" element={
              <PrivateRoute prot={4}>
                <TablaInsumos />
              </PrivateRoute>}
            />

            <Route path="/productos" element={
              <PrivateRoute prot={9}>
                <Productos />
              </PrivateRoute>}
            />

            <Route path="/agregarProductos" element={
              <PrivateRoute prot={9}>
                <AgregarProductos />
              </PrivateRoute>}
            />

            <Route path="/editarProductos/:id_producto" element={
              <PrivateRoute prot={9}>
                <EditarProductos />
              </PrivateRoute>}
            />


            <Route path="/categoria_productos" element={
              <PrivateRoute prot={8}>
                <CategoriasProductos />
              </PrivateRoute>}
            />


            <Route path="/ordenes_produccion" element={
              <PrivateRoute prot={7}>
                <OrdenesProduccion />
              </PrivateRoute>}
            />


            <Route path="/agregarOrdenes" element={
              <PrivateRoute prot={7}>
                <AgregarOrdenes />
              </PrivateRoute>}
            />

            <Route path="*" element={
              <PrivateRoute prot={0}>
                <Default />
              </PrivateRoute>}
            />

            <Route path="/clientes" element={
              <PrivateRoute prot={10}>
                <Cliente />
              </PrivateRoute>}
            />

            <Route path="/agregarCliente" element={
              <PrivateRoute prot={10}>
                <RegistrarCliente />
              </PrivateRoute>}
            />

            <Route path="/pedidos" element={
              <PrivateRoute prot={11}>
                <Pedidos />
              </PrivateRoute>}
            />

            <Route path="/agregarPedidos" element={
              <PrivateRoute prot={11}>
                <RegistrarPedido />
              </PrivateRoute>}
            />

            <Route path="/editarpedidos/:id_pedido" element={
              <PrivateRoute prot={11}>
                <EditarPedidos />
              </PrivateRoute>}
            />

            <Route path="/ventas" element={
              <PrivateRoute prot={12}>
                <Ventas />
              </PrivateRoute>}
            />

          </Route>
        </Routes>
      </UserProvider>
    </HashRouter>
  )
}

export default App


