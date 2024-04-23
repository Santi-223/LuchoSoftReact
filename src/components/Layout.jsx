import React, { useState, useEffect, useContext } from "react";
import { Outlet, Link, json } from "react-router-dom";
import "./Layout.css";
import { useUserContext } from "../components/UserProvider";

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
    const [permisoMCompras, setPermisoMCompras] = useState(false);
    const [permisoMVentas, setPermisoMVentas] = useState(false);

    const { usuario, permisos } = useUserContext();

    useEffect(() => {


        if (permisos && permisos.includes(1)) {
            setPermisoRoles(true);
        }

        if (permisos && permisos.includes(2)) {
            setPermisoUsuarios(true);
        }

        if (permisos && permisos.includes(3) || permisos.includes(4) || permisos.includes(5) || permisos.includes(6)) {
            setPermisoMCompras(true);
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

        if (permisos && permisos.includes(8) || permisos.includes(9) || permisos.includes(10) || permisos.includes(11) || permisos.includes(12)) {
            setPermisoMVentas(true);
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
    }, [permisos]);

    const handleModuleClick = (module) => {
        setSelectedModule(selectedModule === module ? null : module);
    };


    //<h2>Componente Hijo</h2>
    //{usuario && <p>Hola {usuario.nombre_usuario}</p>}

    return (
        <div>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crosorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

            <div className="barraPrincipal">
                <div className="contenedor_1">
                    <Link to={"/dashboard"}>
                        <img src="/archivos/imagenes/LuchoGod.png" height="45px" length="45px" alt="Logo" />
                    </Link>
                    <p id="luchosoft" className="bebas-neue-regular">LuchoSoft</p>
                </div>
                <div>
                    <Link to="/dashboard">
                        <a className="usuario-link">
                            <img src={usuario && usuario.imagen_usuario} alt="" />
                        </a>
                    </Link>
                </div>

            </div>

            <div className="contenedor">
                <div className="barraLateral">
                    <div className="sidebar">
                        {permisoRoles && ( // Mostrar el módulo de configuración solo si el permiso uno está presente
                            <div className="module">
                                <p className={`module-heading ${selectedModule === "Configuración" ? "selected" : ""}`} onClick={() => handleModuleClick("Configuración")}>
                                   <i className="bi bi-gear"></i> Configuración <i className="bi bi-chevron-down arrow-icon"></i>
                                </p>
                                <Link to={"/roles"}>
                                    <ul className={`options ${selectedModule === "Configuración" ? "active" : ""}`} >
                                        <li>Roles</li>
                                    </ul>
                                </Link>
                            </div>
                        )}

                        {permisoUsuarios && (
                            <div className="module">
                                <p className={`module-heading ${selectedModule === "Usuarios" ? "selected" : ""}`} onClick={() => handleModuleClick("Usuarios")}>
                                   <i className="bi bi-person-circle"></i>Usuarios <i className="bi bi-chevron-down arrow-icon"></i>
                                </p>
                                <Link to="/usuarios">
                                    <ul className={`options ${selectedModule === "Usuarios" ? "active" : ""}`}>
                                        <li>Usuarios</li>
                                    </ul>
                                </Link>
                            </div>
                        )}

                        {permisoMCompras && (
                            < div className="module">
                                <p className={`module-heading ${selectedModule === "Compras" ? "selected" : ""}`} onClick={() => handleModuleClick("Compras")}>
                                   <i className="bi bi-cart-check"></i> Compras <i className="bi bi-chevron-down arrow-icon"></i>
                                </p>
                                <ul className={`options ${selectedModule === "Compras" ? "active" : ""}`}>
                                    {permisoCatInsumos && (
                                        <Link to="/CatInsumos">
                                            <li>Categoria de insumos</li>
                                        </Link>
                                    )}
                                    {permisoInsumos && (
                                        <Link to="/Insumos">
                                            <li>Insumos</li>
                                        </Link>
                                    )}
                                    {permisoProveedores && (
                                        <Link to="/Proveedores">
                                            <li>Proveedores</li>
                                        </Link>
                                    )}
                                    {permisoCompras && (
                                        <Link to="/Compra">
                                            <li>Compras</li>
                                        </Link>
                                    )}
                                </ul>
                            </div>
                        )}
                        {permisoOrden && (
                            <div className="module">
                                <p className={`module-heading ${selectedModule === "Producción" ? "selected" : ""}`} onClick={() => handleModuleClick("Producción")}>
                                   <i className="bi bi-box-seam"></i> Producción <i className="bi bi-chevron-down arrow-icon"></i>
                                </p>
                                <ul className={`options ${selectedModule === "Producción" ? "active" : ""}`}>
                                    <Link to="/ordenes_produccion">
                                        <li>Orden de producción</li>
                                    </Link>
                                </ul>
                            </div>
                        )}
                        {permisoMVentas && (
                            <div className="module">
                                <p className={`module-heading ${selectedModule === "Ventas" ? "selected" : ""}`} onClick={() => handleModuleClick("Ventas")}>
                                    <i className="bi bi-receipt"></i>Ventas <i className="bi bi-chevron-down arrow-icon"></i>
                                </p>
                                <ul className={`options ${selectedModule === "Ventas" ? "active" : ""}`}>
                                    {permisoCatProductos && (
                                        <Link to="/categoria_productos">
                                            <li>Categoria de productos</li>
                                        </Link>
                                    )}
                                    {permisoProductos && (
                                        <Link to="/productos">
                                            <li>Productos</li>
                                        </Link>
                                    )}
                                    {permisoClientes && (
                                        <Link to="/clientes">
                                            <li>Clientes</li>
                                        </Link>
                                    )}
                                    {permisoPedidos && (
                                        <Link to="/pedidos">
                                            <li>Pedidos</li>
                                        </Link>
                                    )}
                                    {permisoVentas && (
                                        <Link to="/ventas">
                                            <li>Ventas</li>
                                        </Link>
                                    )}
                                </ul>
                            </div>
                        )}
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
