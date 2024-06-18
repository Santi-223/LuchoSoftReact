import React, { useState, useEffect, useContext } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import "./Layout.css";
import { useUserContext } from "../components/UserProvider";
import Swal from "sweetalert2";

const Layout = () => {

    const [cerrarSesion, setCerrarSesion] = useState(false);

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
    const [permisoDashboard, setPermisoDashboard] = useState(false);

    const { usuarioLogueado, permisos } = useUserContext();

    const [openProfile, setOpenProfile] = useState(false);

    const [roles, setRoles] = useState([]);

    const fetchRoles = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/roles');
            if (response.ok) {
                const data = await response.json();
                const rolesFiltrados = data.map(rol => ({
                    id_rol: rol.id_rol,
                    nombre_rol: rol.nombre_rol,
                    descripcion_rol: rol.descripcion_rol,
                    estado_rol: rol.estado_rol,
                }));
                setRoles(rolesFiltrados);
            } else {
                console.error('Error al obtener las compras');
            }
        } catch (error) {
            console.error('Error al obtener las compras:', error);
        }
    };


    useEffect(() => {

        fetchRoles();


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

        if (permisos && permisos.includes(13)) {
            setPermisoDashboard(true);
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
    }, [usuarioLogueado, permisos]);

    const handleModuleClick = (module) => {
        setSelectedModule(selectedModule === module ? null : module);
    };

    const alertaCerrarSesion = () => {
        // Mostrar una alerta de confirmación
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estás a punto de cerrar sesión.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión'
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí puedes agregar la lógica para cerrar la sesión
                // Por ejemplo, redirigir a la página de inicio de sesión
                // Eliminar token del localStorage
                localStorage.removeItem('token');

                // Eliminar usuario2 del localStorage
                localStorage.removeItem('usuario2');

                // Eliminar permisos del localStorage
                localStorage.removeItem('permisos');

                setCerrarSesion(true);

            }
        });
    };


    //<h2>Componente Hijo</h2>
    //{usuario && <p>Hola {usuario.nombre_usuario}</p>}

    if (cerrarSesion) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crosorigin />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />

            <div className="barraPrincipal">
                <div className="contenedor_1">
                    <Link to={"/Dashboard"}>
                        <img src="/archivos/imagenes/LuchoGod.png" height="45px" length="45px" alt="Logo" />
                    </Link>
                    <p id="luchosoft" className="bebas-neue-regular">LuchoSoft</p>
                </div>
                <div>

                    <a className="usuario-link">
                        <img src={usuarioLogueado && usuarioLogueado.imagen_usuario} alt="" onClick={() => setOpenProfile(prev => !prev)} />

                    </a>

                    {openProfile && (
                        <div className="flex flex-col dropDownProfile">
                            <br />
                            <center>
                                <p style={{ fontSize: '17px', color: 'black', fontFamily: 'Roboto' }}>{usuarioLogueado.nombre_usuario}</p>
                                <p style={{ fontSize: '12px', color: 'gray', fontFamily: 'Roboto' }}>{roles.map(rol => {
                                    if (rol.id_rol === usuarioLogueado.id_rol) {
                                        return rol.nombre_rol;
                                    } else {
                                        return null;
                                    }
                                })}</p>
                            </center>
                            <br />
                            <div className="divUl">
                                <ul className="flex flex-col gap-4 no-bullets">
                                    <hr />
                                    <Link to={`/Perfil`} className="custom-link">
                                        <li onClick={() => cambiarEstadoModalPerfil(!estadoModalPerfil)} className="liDiv">
                                            <img src="/archivos/imagenes/user.png" width={'20px'} /> <p style={{ fontSize: '14px', color: 'black', fontFamily: 'Roboto' }}>Perfil</p>
                                        </li>
                                    </Link>
                                    <hr />
                                    <Link to={`/editarPerfil/${usuarioLogueado && usuarioLogueado.id_usuario}`} className="custom-link">
                                        <li className="liDiv">
                                            <img src="/archivos/imagenes/edit.png" width={'20px'} /> <p style={{ fontSize: '14px', color: 'black', fontFamily: 'Roboto' }}>Editar perfil</p>
                                        </li>
                                    </Link>
                                    <hr />
                                    <li onClick={alertaCerrarSesion} className="liDiv">
                                        <i class="fa-solid fa-arrow-right-from-bracket iconoLog"></i><p style={{ fontSize: '14px', color: 'black', fontFamily: 'Roboto' }}>Cerrar sesión</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                </div>

            </div>

            <div className="contenedor">
                <div className="barraLateral">
                    <div className="sidebar">
                        {permisoDashboard && ( // Mostrar el módulo de configuración solo si el permiso uno está presente
                            <div className="module">
                                <p className={`module-heading`} onClick={() => handleModuleClick("Dashboard")}>
                                    <i class="fa-solid fa-chart-line"></i> Dashboard <i className="bi bi-chevron-down arrow-icon"></i>
                                </p>
                                <Link to={"/Dashboard"}>
                                    <ul className={`options ${selectedModule === "Dashboard" ? "active" : ""}`} >
                                        <li>Dashboard</li>
                                    </ul>
                                </Link>
                            </div>
                        )}

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
