import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import 'datatables.net-bs5';
import '../Layout.css'
import estilos from '../Usuarios/Usuarios.module.css'
import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";
import { useUserContext } from "../UserProvider";

function Usuarios() {

    const { usuarioLogueado  } = useUserContext();
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    const filteredUsuario = usuarios.filter(usuario =>
        usuario.id_usuario.toString().includes(filtro) ||
        usuario.nombre_usuario.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.email.toString().includes(filtro) ||
        usuario.telefono_usuario.toString().includes(filtro) ||
        usuario.direccion_usuario.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.id_rol.toString().includes(filtro)
    );

    const filteredUsuarioSinEspecifico = filteredUsuario.filter(usuario => usuario.id_usuario !== usuarioLogueado.id_usuario);

    const columns = [
        {
            name: "Cedula",
            selector: (row) => row.id_usuario,
            sortable: true
        },
        {
            name: "Imagen",
            cell: (row) => (
                <img id={estilos.imagen_i}
                    src={row.imagen_usuario ? row.imagen_usuario : 'https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180'}
                    width="40px" />
            ),
            sortable: true
        },
        {
            name: "Nombre",
            selector: (row) => row.nombre_usuario,
            sortable: true
        },
        {
            name: "Dirección",
            selector: (row) => row.direccion_usuario,
            sortable: true
        },
        {
            name: "telefono",
            selector: (row) => row.telefono_usuario,
            sortable: true,
        },
        {
            name: "email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "rol",
            cell: (row) => (
                roles.map(rol => {
                    if (rol.id_rol === row.id_rol) {
                        return rol.nombre_rol;
                    } else {
                        return null;
                    }
                })
            ),
            sortable: true,
        },
        {
            name: "Acciones",
            cell: (row) => (
                <div className={estilos["acciones"]}>
                    <button className={estilos.boton} onClick={() => handleEstadoUsuario(row.id_usuario, row.estado_usuario)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        {row.estado_usuario === 1 ? (
                            <i className="bi bi-toggle-on" style={{ color: "#1F67B9" }}></i>
                        ) : (
                            <i className="bi bi-toggle-off" style={{ color: "black" }}></i>
                        )}
                    </button>
                    <Link to={`/editarUsuarios/${row.id_usuario}`}>
                        <button className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                            <i class="fa-solid fa-pen-to-square iconosNaranjas"></i>
                        </button>
                    </Link>
                    <button className={estilos.boton} onClick={() => handleDeleteUsuario(row.id_usuario)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        <i className="fas fa-trash iconosRojos"></i>
                    </button>
                </div>
            )
        },

    ]

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    useEffect(() => {
        if (usuarios.length > 0) {
            setIsLoading(false);
        }
    }, [usuarios]);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/usuarios');
            if (response.ok) {
                const data = await response.json();
                const usuariosFiltrador = data.map(usuario => ({
                    id_usuario: usuario.id_usuario,
                    imagen_usuario: usuario.imagen_usuario,
                    nombre_usuario: usuario.nombre_usuario,
                    direccion_usuario: usuario.direccion_usuario,
                    telefono_usuario: usuario.telefono_usuario,
                    email: usuario.email,
                    estado_usuario: usuario.estado_usuario,
                    id_rol: usuario.id_rol,
                }));
                setUsuarios(usuariosFiltrador);
            } else {
                console.error('Error al obtener las compras');
            }
        } catch (error) {
            console.error('Error al obtener las compras:', error);
        }
    };

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

    const handleDeleteUsuario = async (idUsuario) => {
        // Mostrar la alerta de confirmación
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Estás seguro de que quieres eliminar este usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/usuarios/${idUsuario}`, {
                        method: 'DELETE',
                        headers: {
                            'token': token
                        }
                    });

                    if (response.ok) {
                        // Eliminación exitosa, actualizar la lista de usuarios
                        fetchUsuarios();
                        // Mostrar alerta de éxito
                        Swal.fire(
                            '¡Eliminado!',
                            'El usuario ha sido eliminado correctamente.',
                            'success'
                        );
                    } else {
                        // Mostrar alerta de error si falla la eliminación
                        const errorData = await response.json(); // Parsear el cuerpo de la respuesta como JSON
                        console.error('Error al eliminar el usuario:', errorData.msg);
                        Swal.fire({
                            icon: 'error',
                            title: 'No se pudo eliminar el usuario.',
                            text: errorData.msg
                        });
                    }
                } catch (error) {
                    // Mostrar alerta de error si hay un error en la solicitud
                    console.error('Error al eliminar el usuario:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo eliminar el usuario.',
                    });
                }
            }
        });
    };

    const handleEstadoUsuario = async (idUsuario, estadoUsuario) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cambiar el estado del usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const nuevoEstado = estadoUsuario === 1 ? 0 : 1;

                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/estadoUsuarios/${idUsuario}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            estado_usuario: nuevoEstado
                        })
                    });

                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de compras
                        Swal.fire({
                            icon: 'success',
                            title: 'El estado se ha actualizado',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        fetchUsuarios();
                    } else {
                        console.error('Error al actualizar el estado del usuario');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del usuario:', error);
                }
            }
        });
    };

    const customStyles = {
        headCells: {
            style: {
                textAlign: 'center',
                fontWeight: 'bold',
                padding: '10px',
                fontSize: '16px'
            },
        }
    };


    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />

            <div className={estilos["titulo"]}>

                <h1>Gestión Usuarios</h1>
            </div>
            <br />
            <div className={estilos['divFiltro']}>
                <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                
                <Link to="/agregarUsuarios">


                    <button className={`${estilos.botonAgregar} bebas-neue-regular`}><i className="fa-solid fa-plus"></i> Agregar</button>
                </Link>
            </div>
            <div className={estilos["tabla"]}>
                <DataTable customStyles={customStyles} columns={columns} data={filteredUsuarioSinEspecifico} pagination paginationPerPage={6} highlightOnHover></DataTable>
            </div>
        </div>
    );
}

export default Usuarios;
