import React, { useState, useEffect } from "react";
import { Outlet, Link, json } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [permisoRoles, setPermisoRoles] = useState(false);
    const [permisoUsuarios, setPermisoUsuarios] = useState(false);
    const [permisoCatInsumos, setPermisoCatInsumos] = useState(false);
    const [permisoInsumos, setPermisoInsumos] = useState(false);
    const [permisoProveedores, setPermisoProveedores] = useState(false);
    const [permisoCompras, setPermisoCompras] = useState(false);
    const [permisoOrden, setPermisoOrden] = useState(false);
    const [permisoCatProductos, setPermisoCatProductos] = useState(false);
    const [permisoProductos, setPermisoProductos] = useState(false);
    const [permisoClientes, setPermisoClientes] = useState(false);
    const [permisoPedidos, setPermisoPedidos] = useState(false);
    const [permisoVentas, setPermisoVentas] = useState(false);
    

    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    // Obtener el objeto de usuario del localStorage
    const usuarioString = localStorage.getItem('usuario');
    const usuario = JSON.parse(usuarioString); // Convertir de cadena JSON a objeto JavaScript

    // Obtener los permisos del localStorage
    const permisosString = localStorage.getItem('permisos');
    const permisos = JSON.parse(permisosString); // Convertir de cadena JSON a objeto JavaScript

    console.log('Token local: ', token);
    console.log('Usuario local:', usuario);
    console.log('Permisos local:', permisos);

    useEffect(() => {

        if (permisos && permisos.includes(1)) {
            setPermisoRoles(true);
        }

        if (permisos && permisos.includes(2)) {
            setPermisoUsuarios(true);
        }

        if (permisos && permisos.includes(3)) {
            setPermisoCatInsumos(true);
        }

        if (permisos && permisos.includes(4)) {
            setPermisoInsumos(true);
        }

        if (permisos && permisos.includes(5)) {
            setPermisoProveedores(true);
        }

        if (permisos && permisos.includes(6)) {
            setPermisoCompras(true);
        }

        if (permisos && permisos.includes(7)) {
            setPermisoOrden(true);
        }

        if (permisos && permisos.includes(8)) {
            setPermisoCatProductos(true);
        }

        if (permisos && permisos.includes(9)) {
            setPermisoProductos(true);
        }

        if (permisos && permisos.includes(10)) {
            setPermisoClientes(true);
        }

        if (permisos && permisos.includes(11)) {
            setPermisoPedidos(true);
        }

        if (permisos && permisos.includes(12)) {
            setPermisoVentas(true);
        }

        const handleClickOutside = (event) => {
            if (!event.target.closest(".module-heading, .options li")) {
                setSelectedModule(null);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleModuleClick = (module) => {
        setSelectedModule(selectedModule === module ? null : module);
    };


    return (
        <div>
            <div className="barraPrincipal">
                <div className="contenedor_1">
                    <Link to={"/"}>
                        <img src="/archivos/imagenes/LuchoGod.png" height="45px" length="45px" alt="Logo" />
                    </Link>
                    <p id="luchosoft">LuchoSoft</p>
                </div>
            </div>

            <div className="contenedor">
                <div className="barraLateral">
                    <center>
                        <h2>Menú</h2>
                    </center>
                    <div className="sidebar">
                        {permisoRoles && ( // Mostrar el módulo de configuración solo si el permiso uno está presente
                            <div className="module">
                                <p className={`module-heading ${selectedModule === "Configuración" ? "selected" : ""}`} onClick={() => handleModuleClick("Configuración")}>
                                    Configuración <i className="bi bi-chevron-down arrow-icon"></i>
                                </p>
                                <Link to={"/roles"}>
                                    <ul className={`options ${selectedModule === "Configuración" ? "active" : ""}`}>
                                        <li>Roles</li>
                                    </ul>
                                </Link>
                            </div>
                        )}

                        {permisoUsuarios && (
                            <div className="module">
                                <p className={`module-heading ${selectedModule === "Usuarios" ? "selected" : ""}`} onClick={() => handleModuleClick("Usuarios")}>
                                    Usuarios <i className="bi bi-chevron-down arrow-icon"></i>
                                </p>
                                <Link to="/usuarios">
                                    <ul className={`options ${selectedModule === "Usuarios" ? "active" : ""}`}>
                                        <li>Usuarios</li>
                                    </ul>
                                </Link>
                            </div>
                        )}

                            < div className="module">
                        <p className={`module-heading ${selectedModule === "Compras" ? "selected" : ""}`} onClick={() => handleModuleClick("Compras")}>
                            Compras <i className="bi bi-chevron-down arrow-icon"></i>
                        </p>
                        <ul className={`options ${selectedModule === "Compras" ? "active" : ""}`}>
                            <li>Categoria de insumos</li>
                            <li>Insumos</li>
                            <li>Proveedores</li>
                            <li>Compras</li>
                        </ul>
                    </div>

                    <div className="module">
                        <p className={`module-heading ${selectedModule === "Producción" ? "selected" : ""}`} onClick={() => handleModuleClick("Producción")}>
                            Producción <i className="bi bi-chevron-down arrow-icon"></i>
                        </p>
                        <ul className={`options ${selectedModule === "Producción" ? "active" : ""}`}>
                            <li>Orden de producción</li>
                        </ul>
                    </div>

                    <div className="module">
                        <p className={`module-heading ${selectedModule === "Ventas" ? "selected" : ""}`} onClick={() => handleModuleClick("Ventas")}>
                            Ventas <i className="bi bi-chevron-down arrow-icon"></i>
                        </p>
                        <ul className={`options ${selectedModule === "Ventas" ? "active" : ""}`}>
                            <li>Categoria de productos</li>
                            <li>Productos</li>
                            <li>Clientes</li>
                            <li>Pedidos</li>
                            <li>Ventas</li>
                        </ul>
                    </div>
                    <div className="usuario">
                        <Link to="/home">
                            <a className="usuario-link">
                                <img src="/archivos/imagenes/Profile.png" alt="" />
                                <span id="spanIcono">Nombre de Usuario</span>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="contenido">
                <Outlet />
            </div>
        </div>
        </div >
    );
};

export default Layout;
