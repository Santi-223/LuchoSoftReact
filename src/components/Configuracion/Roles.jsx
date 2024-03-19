import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import 'datatables.net-bs5';
import '../Layout.css'
import estilos from '../Configuracion/Roles.module.css'
import Swal from 'sweetalert2';
import Modal from '../Modal';
import styled from 'styled-components';
import DataTable from "react-data-table-component";

function Roles() {

    const [selectedPermisos, setSelectedPermisos] = useState([]);
    const [estadoModalAgregar, cambiarEstadoModalAgregar] = useState(false);
    const [estadoModaleditar, cambiarEstadoModalEditar] = useState(false);
    const [roles, setRoles] = useState([]);
    const [roles1, setRoles1] = useState({
        id_rol: '',
        nombre_rol: '',
        descripcion_rol: '',
        estado_rol: 1
    });
    const [rolesEditar, setRolesEditar] = useState({
        id_rol: '',
        nombre_rol: '',
        descripcion_rol: '',
        estado_rol: 1
    });
    const [rolesPermisos, setRolesPermisos] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const [permisos1, setPermisos1] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);

    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    const filteredRoles = roles.filter(rol =>
        rol.id_rol.toString().includes(filtro) ||
        rol.nombre_rol.toLowerCase().includes(filtro.toLowerCase()) ||
        rol.descripcion_rol.toString().includes(filtro)

    );

    const columns = [
        {
            name: "Id",
            selector: (row) => row.id_rol,
            sortable: true
        },
        {
            name: "Nombre",
            selector: (row) => row.nombre_rol,
            sortable: true
        },
        {
            name: "Descripción",
            selector: (row) => row.descripcion_rol,
            sortable: true
        },
        {
            name: "Permisos",
            cell: (row) => (
                rolesPermisos.map(rp => {
                    if (row.id_rol === rp.id_rol) {
                        return permisos.map(permiso => {
                            if (permiso.id_permiso == rp.id_permiso) {
                                return `${permiso.nombre_permiso}\n`
                            }
                        });
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
                    <button className={estilos.boton} onClick={() => handleEstadoRol(row.id_rol, row.estado_rol)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        {row.estado_rol === 1 ? (
                            <i className="bi bi-toggle-on" style={{ color: "#1F67B9" }}></i>
                        ) : (
                            <i className="bi bi-toggle-off" style={{ color: "black" }}></i>
                        )}
                    </button>
                    <button className={estilos.boton} onClick={() => handleDeleteRoles(row.id_rol)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        <i className="fas fa-trash iconosRojos"></i>
                    </button>
                    <button onClick={() => {
                        cambiarEstadoModalEditar(!estadoModaleditar),
                            setRolesEditar(row)
                    }} className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        <i class="fa-solid fa-pen-to-square iconosRojos"></i>
                    </button>
                </div>
            )
        },

    ]

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedPermisos(prevSelected => [...prevSelected, value]);
        } else {
            setSelectedPermisos(prevSelected => prevSelected.filter(permiso => permiso !== value));
        }
        console.log(selectedPermisos)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log('rol a enviar: ', roles1)

            const id_rol = roles1.id_rol;
            // Enviar los datos del rol
            const responseRoles = await fetch('http://localhost:8082/configuracion/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(roles1)
            });

            if (responseRoles.ok) {
                console.log('Rol creado exitosamente.');

                // Iterar sobre los permisos seleccionados y enviar los detalles a la API de la tabla de detalle
                selectedPermisos.forEach(async (id_permiso) => {

                    console.log('permiso selecionado: ', id_permiso, 'rol: ', id_rol)
                    const detallePayload = {
                        fecha_roles_permisos: '2023-09-22',
                        id_rol: id_rol,
                        id_permiso: id_permiso
                    };

                    try {
                        const responseDetalle = await fetch('http://localhost:8082/configuracion/roles_permisos', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(detallePayload)
                        });

                        if (!responseDetalle.ok) {
                            console.error('Error al enviar el detalle del permiso:', responseDetalle.statusText);
                        } else {
                            console.log('Detalle enviado con exito')
                        }
                    } catch (error) {
                        console.error('Error al enviar el detalle del permiso:', error);
                    }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    window.location.href = '/roles';
                }, 2000);

                // Resto del código si es necesario
            } else {
                console.error('Error al crear el rol:', responseRoles.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al crear el rol',
                });
            }
        } catch (error) {
            console.error('Error al crear el rol:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchRolesPermisos();
        fetchPermisos();
    }, []);

    useEffect(() => {
        if (roles.length > 0) {
            setIsLoading(false);
        }
    }, [roles]);

    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:8082/configuracion/roles');
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

    const handleDeleteRoles = async (idRol) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Estás seguro de que quieres eliminar este rol?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8082/configuracion/roles/${idRol}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        console.log('Eliminación exitosa')
                        fetchRoles();
                    } else {
                        console.error('Error al eliminar el rol');
                    }
                } catch (error) {
                    console.error('Error al eliminar el rol:', error);
                }
            }
        });
    };

    const handleEstadoRol = async (idRol, estadoRol) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cambiar el estado del rol?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const nuevoEstado = estadoRol === 1 ? 0 : 1;

                    console.log('el estado nuevo sera: ', nuevoEstado)

                    const response = await fetch(`http://localhost:8082/configuracion/estadoRoles/${idRol}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            estado_rol: nuevoEstado
                        })
                    });

                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de compras
                        console.log('actualizacion exitosa')
                        fetchRoles();
                    } else {
                        console.error('Error al actualizar el estado del rol');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del rol:', error);
                }
            }
        });
    };

    const fetchRolesPermisos = async () => {
        try {
            const response = await fetch('http://localhost:8082/configuracion/roles_permisos');
            if (response.ok) {
                const data = await response.json();
                const rolesPermisosFiltrados = data.map(rolP => ({
                    id_roles_permisos: rolP.id_roles_permisos,
                    fecha_roles_permisos: rolP.fecha_roles_permisos,
                    id_rol: rolP.id_rol,
                    id_permiso: rolP.id_permiso,
                }));
                setRolesPermisos(rolesPermisosFiltrados);
            } else {
                console.error('Error al obtener las compras');
            }
        } catch (error) {
            console.error('Error al obtener las compras:', error);
        }
    };

    const fetchPermisos = async () => {
        try {
            const response = await fetch(`http://localhost:8082/configuracion/permisos`);
            if (response.ok) {
                const data = await response.json();
                const permisosFiltrados = data.map(p => ({
                    id_permiso: p.id_permiso,
                    nombre_permiso: p.nombre_permiso,
                    estado_permiso: p.estado_permiso,
                }));
                setPermisos(permisosFiltrados);
                setPermisos1(permisosFiltrados);
            } else {
                console.error('Error al obtener las compras');
            }
        } catch (error) {
            console.error('Error al obtener las compras:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRoles1(prevroles => ({
            ...prevroles,
            [name]: value
        }));
    };

    const handleSubmitEditar = async (event) => {
        event.preventDefault();

        console.log(roles)

        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar la información del rol?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8082/configuracion/roles/${roles.id_rol}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(roles)
                    });

                    if (response.ok) {
                        console.log('rol actualizado exitosamente.');
                        Swal.fire({
                            icon: 'success',
                            title: 'rol actualizado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            window.location.href = '/roles';
                        }, 2000);
                        // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
                    } else {
                        console.error('Error al actualizar el rol:', response.statusText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar el rol',
                        });
                    }
                } catch (error) {
                    console.error('Error al actualizar el rol:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al actualizar el rol',
                    });
                }
            }
        });
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
            <center>
                <div id="titulo">
                    <h1>Gestión de Roles</h1>
                </div>
                <br />
            </center>
            <div className={estilos["botones"]}>
                <button onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)} className={`boton ${estilos.botonRojo}`}><i className={[".fa-solid fa-plus"]}></i> Agregar</button>
            </div>
            <div className={estilos['filtro']}>
                <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
            </div>
            <div className={estilos["tabla"]}>
                <DataTable columns={columns} data={filteredRoles} pagination paginationPerPage={5} highlightOnHover></DataTable>
            </div>
            <Modal
                estado={estadoModalAgregar}
                cambiarEstado={cambiarEstadoModalAgregar}
                titulo="Registar Rol"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'500px'}
                padding={'20px'}
            >
                <Contenido>

                    <form onSubmit={handleSubmit}>
                        <div id={estilos.contenedorsito}>
                            <div id={estilos.contInput}>
                                <div className={estilos["inputIdNombre"]}>
                                    <div>
                                        <p id={estilos.textito}> <i class="fa-solid fa-key iconosRojos"></i> ID del rol</p>
                                        <input
                                            id={estilos.idrol}
                                            className={estilos["input2"]}
                                            type="number"
                                            placeholder="Ingrese el ID del rol"
                                            name='id_rol'
                                            value={roles1.id_rol}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div id={estilos.nombrerol}>
                                        <p id={estilos.textito} > <i class="fa-solid fa-font iconosRojos"></i> Nombre del rol</p>
                                        <input
                                            className={estilos["input2"]}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_rol'
                                            value={roles1.nombre_rol}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                                <br />
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito}> <i class="fa-solid fa-message iconosRojos"></i> Descripción del rol</p>
                                        <input
                                            id={estilos.descrol}
                                            className={estilos["input-field"]}
                                            type="text"
                                            placeholder="Insertar descripción"
                                            name='descripcion_rol'
                                            value={roles1.descripcion_rol}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className={estilos["input-container"]}>
                                <div className={estilos["contDerechaAbajo"]}>
                                    <div id={estilos.seleccionarpermisos}>


                                        <table id={estilos.tablita} className={estilos["tablitaMarginRight"]}>
                                            <thead>
                                                <tr>
                                                    <th id={estilos.fondotabla} style={{ color: 'rgb(255, 255, 255)' }}>Seleccionar permisos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {permisos1.map(permiso => (
                                                    <tr key={permiso.id_permiso}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                className={estilos["checkbox"]}
                                                                value={permiso.id_permiso}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            {permiso.nombre_permiso}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>

                            </div>


                        </div>
                        <center>
                            <div className={estilos["cajaBotones"]}>
                                <button onclick="registrar()" className={estilos["vinotinto"]} type="submit">Guardar</button>
                                <div className={estilos["espacioEntreBotones"]}></div>
                                <button onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)} className={estilos["rojo"]} type="button">Cancelar</button>
                            </div>
                        </center>
                    </form>
                </Contenido>
            </Modal>
            <Modal
                estado={estadoModaleditar}
                cambiarEstado={cambiarEstadoModalEditar}
                titulo="Registar Rol"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'500px'}
                padding={'20px'}
            >
                <Contenido>

                    <form onSubmit={handleSubmitEditar}>
                        <div id={estilos.contenedorsito}>
                            <div id={estilos.contInput}>
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito}> <i class="fa-solid fa-key iconosRojos"></i> ID del rol</p>
                                        <input
                                            id={estilos.idrol}
                                            className={estilos["input-field"]}
                                            type="number"
                                            placeholder="Ingrese el ID del rol"
                                            name='id_rol'
                                            value={rolesEditar.id_rol}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                                <br />
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito} > <i class="fa-solid fa-font iconosRojos"></i> Nombre del rol</p>
                                        <input
                                            id={estilos.nombrerol}
                                            className={estilos["input-field"]}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_rol'
                                            value={rolesEditar.nombre_rol}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                                <br />
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito}> <i class="fa-solid fa-message iconosRojos"></i> Descripción del rol</p>
                                        <input
                                            id={estilos.descrol}
                                            className={estilos["input-field"]}
                                            type="text"
                                            placeholder="Insertar descripción"
                                            name='descripcion_rol'
                                            value={rolesEditar.descripcion_rol}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                            </div>

                        </div>

                        <br />
                        <center>
                            <div className={estilos["cajaBotones"]}>
                                <button onclick="registrar()" className={estilos["vinotinto"]} type="submit">Guardar</button>
                                <div className={estilos["espacioEntreBotones"]}></div>
                                <button onClick={() => cambiarEstadoModalEditar(!estadoModaleditar)} className={estilos["rojo"]} type="button" onclick="window.location.href='gestionroles.html'">Cancelar</button>
                            </div>
                        </center>
                    </form>
                </Contenido>
            </Modal>
        </div>
    );
}


const Contenido = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	h1 {
		font-size: 42px;
		font-weight: 700;
		margin-bottom: 10px;
	}

	p {
		font-size: 18px;
		margin-bottom: 20px;
	}

	img {
		width: 100%;
		vertical-align: top;
		border-radius: 3px;
	}
`;

export default Roles;
