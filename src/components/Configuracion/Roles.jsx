import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, Navigate } from "react-router-dom";
import 'datatables.net-bs5';
import '../Layout.css'
import estilos from '../Configuracion/Roles.module.css'
import Swal from 'sweetalert2';
import Modal from '../Modal';
import styled from 'styled-components';
import DataTable from "react-data-table-component";
import { error } from 'jquery';

function Roles() {

    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    const [inputValidoNombre, setInputValidoNombre] = useState(true);
    const [errorNombre, setErrorNombre] = useState('')
    const [inputValidoDes, setInputValidoDes] = useState(true);
    const [errorDes, setErrorDes] = useState('')
    const [inputValidoNombre2, setInputValidoNombre2] = useState(true);
    const [errorNombre2, setErrorNombre2] = useState('')
    const [inputValidoDes2, setInputValidoDes2] = useState(true);
    const [errorDes2, setErrorDes2] = useState('')

    const [selectedPermisos, setSelectedPermisos] = useState([]);
    const [estadoModalAgregar, cambiarEstadoModalAgregar] = useState(false);
    const [estadoModaleditar, cambiarEstadoModalEditar] = useState(false);
    const [roles, setRoles] = useState([]);
    const [roles1, setRoles1] = useState({
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
            sortable: true,
            maxWidth: "150px",
            cell: (row) => (
                <div className="text-wrap">
                    {row.id_rol}
                </div>
            )
        },
        {
            name: "Nombre",
            selector: (row) => row.nombre_rol,
            sortable: true,
            maxWidth: "300px",
            cell: (row) => (
                <div className="text-wrap">
                    {row.nombre_rol}
                </div>
            )
        },
        {
            name: "Descripción",
            selector: (row) => row.descripcion_rol,
            sortable: true,
            maxWidth: "300px",
            cell: (row) => (
                <div className="text-wrap">
                    {row.descripcion_rol}
                </div>
            )
        },
        {
            name: "Permisos",
            cell: (row) => (
                <ul>{
                    rolesPermisos.map(rp => {
                        if (row.id_rol === rp.id_rol) {
                            return permisos.map(permiso => {
                                if (permiso.id_permiso == rp.id_permiso) {
                                    return <li>{permiso.nombre_permiso}</li>
                                }
                            });
                        } else {
                            return null;
                        }
                    })
                }</ul>
            ),
            sortable: true,
        },
        {
            name: "Estado",
            sortable: true,
            maxWidth: "100px",
            cell: (row) => (
                <button className={estilos.boton} onClick={() => handleEstadoRol(row.id_rol, row.estado_rol)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
                    {row.estado_rol === 1 ? (
                        <i className="bi bi-toggle-on" style={{ color: "#48110d" }}></i>
                    ) : (
                        <i
                            className="bi bi-toggle-off"
                            style={{ width: "60px", color: "black" }}
                        ></i>
                    )}
                </button>
            )
        },
        {
            name: "Acciones",
            cell: (row) => (
                <div className={estilos["acciones"]}>
                    <button disabled={row.estado_rol === 0} onClick={() => {
                        cambiarEstadoModalEditar(!estadoModaleditar),
                            setRolesEditar(row)
                    }} className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '22px' }}>
                        <i className={`fa-solid fa-pen-to-square ${row.estado_rol === 1 ? 'iconosNaranjas' : 'iconosGrises'}`}></i>
                    </button>
                    <button disabled={row.estado_rol === 0} className={estilos.boton} onClick={() => handleDeleteRoles(row.id_rol)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '22px' }}>
                        <i className={`bi bi-trash ${row.estado_rol === 1 ? 'iconosRojos' : 'iconosGrises'}`}></i>
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

    const checkEditar = (event, idRolP, idRol, idPermiso) => {
        const { value, checked } = event.target;
        if (checked) {
            console.log("Ya esta descheck", idRolP)
            crearRolPer(idRol, idPermiso)
        } else {
            console.log("Ya esta check", idRolP)
            handleDeleteRolesPermisos(idRolP)
        }
        console.log(selectedPermisos)
    };

    const crearRolPer = async (id_rol, id_permiso) => {
        console.log('permiso selecionado: ', id_permiso, 'rol: ', id_rol)

        const fechaActual = new Date();
        const año = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0-11
        const día = String(fechaActual.getDate()).padStart(2, '0');
        const fechaFormateada = `${año}-${mes}-${día}`;

        const detallePayload = {
            fecha_roles_permisos: fechaFormateada,
            id_rol: id_rol,
            id_permiso: id_permiso
        };

        try {
            const responseDetalle = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/roles_permisos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(detallePayload)
            });

            if (!responseDetalle.ok) {
                console.error('Error al enviar el detalle del permiso:', responseDetalle.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar el detalle',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                console.log('Detalle enviado con exito')
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    showConfirmButton: false,
                    timer: 1500
                });
                fetchRolesPermisos();
            }
        } catch (error) {
            console.error('Error al enviar el detalle del permiso:', error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!inputValidoNombre || !inputValidoDes) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Verifica todos los campos.",
            });
        } else if (!roles1.nombre_rol || !roles1.descripcion_rol) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hay campos vacios.",
            });
        }
        else {
            try {
                console.log('rol a enviar: ', roles1)

                // Enviar los datos del rol
                const responseRoles = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/roles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(roles1)
                });

                if (responseRoles.ok) {
                    const compraData = await responseRoles.json();
                    const id_rol = compraData.id_rol;

                    console.log('Rol creado exitosamente. su id es: ', id_rol);

                    // Iterar sobre los permisos seleccionados y enviar los detalles a la API de la tabla de detalle
                    selectedPermisos.forEach(async (id_permiso) => {

                        console.log('permiso selecionado: ', id_permiso, 'rol: ', id_rol)

                        const fechaActual = new Date();
                        const año = fechaActual.getFullYear();
                        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0-11
                        const día = String(fechaActual.getDate()).padStart(2, '0');
                        const fechaFormateada = `${año}-${mes}-${día}`;

                        const detallePayload = {
                            fecha_roles_permisos: fechaFormateada,
                            id_rol: id_rol,
                            id_permiso: id_permiso
                        };
                        try {
                            const responseDetalle = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/roles_permisos', {
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
                    fetchRolesPermisos();
                    fetchRoles();
                    setSelectedPermisos([]);
                    setRoles1({
                        nombre_rol: '',
                        descripcion_rol: '',
                        estado_rol: 1
                    });
                    cambiarEstadoModalAgregar(false);

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
                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/roles/${idRol}`, {
                        method: 'DELETE',
                        headers: {
                            'token': token
                        }
                    });

                    if (response.ok) {
                        console.log('Eliminación exitosa')
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminación exitosa',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        fetchRoles();
                    } else {
                        const errorData = await response.json(); // Parsear el cuerpo de la respuesta como JSON
                        console.error('Error al eliminar el rol:', errorData.msg);
                        Swal.fire({
                            icon: 'error',
                            title: `Error al eliminar el rol`,
                            text: errorData.msg, // Mostrar el mensaje de error recibido desde la API
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                } catch (error) {
                    console.error('Error al eliminar el rol:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar el rol',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        });
    };

    const handleDeleteRolesPermisos = async (idRolP) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Estás seguro de que quieres eliminar esta asignación de permiso?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/roles_permisos/${idRolP}`, {
                        method: 'DELETE',
                        headers: {
                            'token': token
                        }
                    });

                    if (response.ok) {
                        console.log('Eliminación exitosa')
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminación exitosa',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        fetchRolesPermisos();
                    } else {
                        const errorData = await response.json(); // Parsear el cuerpo de la respuesta como JSON
                        console.error('Error al eliminar la aisgnación del permiso:', errorData.msg);
                        Swal.fire({
                            icon: 'error',
                            title: `Error al eliminar la aisgnación del permiso`,
                            text: errorData.msg, // Mostrar el mensaje de error recibido desde la API
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                } catch (error) {
                    console.error('Error al eliminar la asignación del permiso:', error);
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

                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/estadoRoles/${idRol}`, {
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
                        Swal.fire({
                            icon: 'success',
                            title: 'El estado se ha actualizado',
                            showConfirmButton: false,
                            timer: 1500
                        });
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
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/roles_permisos');
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
            const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/permisos`);
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

        if (name === 'nombre_rol') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorNombre('El campo es obligatorio.');
                setInputValidoNombre(false);
            }
            // Verifica si el valor contiene caracteres especiales
            else if (/[^a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]/.test(value)) {
                setErrorNombre('No se permiten caracteres especiales.');
                setInputValidoNombre(false);
            }
            // Verifica si la longitud es menor a 5 caracteres
            else if (value.length < 5) {
                setErrorNombre('Ingresa al menos 5 caracteres.');
                setInputValidoNombre(false);
            }
            // Verifica si la longitud es mayor a 30 caracteres
            else if (value.length > 30) {
                setErrorNombre('Ingresa un máximo de 30 caracteres.');
                setInputValidoNombre(false);
            }
            // Si todo es válido
            else {
                setErrorNombre(''); // Limpia el mensaje de error
                setInputValidoNombre(true);
            }
        }
        if (name === 'descripcion_rol') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorDes('El campo es obligatorio.');
                setInputValidoDes(false);
            }
            // Verifica si el valor contiene caracteres especiales
            else if (/[^a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]/.test(value)) {
                setErrorDes('No se permiten caracteres especiales.');
                setInputValidoDes(false);
            }
            // Verifica si la longitud es menor a 5 caracteres
            else if (value.length < 5) {
                setErrorDes('Ingresa al menos 5 caracteres.');
                setInputValidoDes(false);
            }
            // Verifica si la longitud es mayor a 30 caracteres
            else if (value.length > 150) {
                setErrorDes('Ingresa un máximo de 150 caracteres.');
                setInputValidoDes(false);
            }
            // Si todo es válido
            else {
                setErrorDes(''); // Limpia el mensaje de error
                setInputValidoDes(true);
            }
        }


        setRoles1(prevroles => ({
            ...prevroles,
            [name]: value
        }));
    };

    const handleChangeEditar = (event) => {
        const { name, value } = event.target;

        if (name === 'nombre_rol') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorNombre2('El campo es obligatorio.');
                setInputValidoNombre2(false);
            }
            // Verifica si el valor contiene caracteres especiales
            else if (/[^a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]/.test(value)) {
                setErrorNombre2('No se permiten caracteres especiales.');
                setInputValidoNombre2(false);
            }
            // Verifica si la longitud es menor a 5 caracteres
            else if (value.length < 5) {
                setErrorNombre2('Ingresa al menos 5 caracteres.');
                setInputValidoNombre2(false);
            }
            // Verifica si la longitud es mayor a 30 caracteres
            else if (value.length > 30) {
                setErrorNombre2('Ingresa un máximo de 30 caracteres.');
                setInputValidoNombre2(false);
            }
            // Si todo es válido
            else {
                setErrorNombre2(''); // Limpia el mensaje de error
                setInputValidoNombre2(true);
            }
        }
        if (name === 'descripcion_rol') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorDes2('El campo es obligatorio.');
                setInputValidoDes2(false);
            }
            // Verifica si el valor contiene caracteres especiales
            else if (/[^a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]/.test(value)) {
                setErrorDes2('No se permiten caracteres especiales.');
                setInputValidoDes2(false);
            }
            // Verifica si la longitud es menor a 5 caracteres
            else if (value.length < 5) {
                setErrorDes2('Ingresa al menos 5 caracteres.');
                setInputValidoDes2(false);
            }
            // Verifica si la longitud es mayor a 30 caracteres
            else if (value.length > 150) {
                setErrorDes2('Ingresa un máximo de 150 caracteres.');
                setInputValidoDes2(false);
            }
            // Si todo es válido
            else {
                setErrorDes2(''); // Limpia el mensaje de error
                setInputValidoDes2(true);
            }
        }

        setRolesEditar(prevroles => ({
            ...prevroles,
            [name]: value
        }));
    };

    const handleSubmitEditar = async (event) => {
        event.preventDefault();

        if (!inputValidoNombre2 || !inputValidoDes2) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Verifica todos los campos.",
            });
        } else if (!rolesEditar.nombre_rol || !rolesEditar.descripcion_rol) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hay campos vacios.",
            });
        }
        else {
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
                        const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/roles/${rolesEditar.id_rol}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(rolesEditar)
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
                                fetchRoles();
                                cambiarEstadoModalEditar(false);
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
        }
    };

    const customStyles = {
        headCells: {
            style: {
                textAlign: 'center',
                fontWeight: 'bold',
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
                <h1>Gestión de Roles</h1>

            </div>
            <br />
            <div className={estilos['divFiltro']}>
                <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                <div className={estilos["botones"]}>
                    <button onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)} className={`${estilos.botonAgregar} bebas-neue-regular`}><i className="fa-solid fa-plus"></i> Agregar</button>
                </div>
            </div>
            <div className={estilos["tabla"]}>
                <DataTable customStyles={customStyles} columns={columns} data={filteredRoles} pagination paginationPerPage={6} highlightOnHover></DataTable>
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
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito} >Nombre del rol</p>
                                        <input
                                            className={`${!inputValidoNombre ? estilos.inputInvalido : estilos['input-field']}`}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_rol'
                                            value={roles1.nombre_rol}
                                            onChange={handleChange}
                                        />
                                        {!inputValidoNombre && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorNombre}</p>}
                                    </div>

                                </div>
                                <br />
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito}>Descripción del rol</p>
                                        <textarea
                                            id={estilos.descrol}
                                            className={`${!inputValidoDes ? estilos.inputInvalido : estilos['input-field']}`}
                                            placeholder="Insertar descripción"
                                            name='descripcion_rol'
                                            value={roles1.descripcion_rol}
                                            onChange={handleChange}
                                        />
                                        {!inputValidoDes && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorDes}</p>}
                                    </div>
                                </div>

                            </div>
                            <div className={estilos["input-container"]}>
                                <div className={estilos["contDerechaAbajo"]}>
                                    <div id={estilos.seleccionarpermisos}>


                                        <table id={estilos.tablita}  >
                                            <thead>
                                                <tr id={estilos.fondotabla}>
                                                    <th style={{ color: 'rgb(255, 255, 255)' }}>Seleccionar permisos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {permisos1.map(permiso => (
                                                    <tr key={permiso.id_permiso}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                className={`form-check-input ${estilos["checkbox"]}`}
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
                                <button onclick="registrar()" className={estilos["azul"]} type="submit">Guardar</button>
                                <div className={estilos["espacioEntreBotones"]}></div>
                                <button onClick={() => {
                                    cambiarEstadoModalAgregar(!estadoModalAgregar);
                                    setInputValidoNombre(true);
                                    setInputValidoDes(true);
                                    setRoles1({
                                        nombre_rol: '',
                                        descripcion_rol: '',
                                        estado_rol: 1
                                    })
                                }} className={estilos["gris"]} type="button">Cancelar</button>
                            </div>
                        </center>
                    </form>
                </Contenido>
            </Modal>
            <Modal
                estado={estadoModaleditar}
                cambiarEstado={cambiarEstadoModalEditar}
                titulo="Editar Rol"
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
                                <div className={estilos["inputIdNombre"]}>
                                    <div>
                                        <p id={estilos.textito}>ID del rol</p>
                                        <input
                                            id={estilos.idrol}
                                            className={estilos['input2']}
                                            type="number"
                                            placeholder="Id rol"
                                            name='id_rol'
                                            value={rolesEditar.id_rol}
                                            onChange={handleChangeEditar}
                                            readOnly
                                        />

                                    </div>
                                    <div id={estilos.nombrerol}>
                                        <p id={estilos.textito} >Nombre del rol</p>
                                        <input
                                            className={`${!inputValidoNombre2 ? estilos.inputInvalido2 : estilos['input2']}`}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_rol'
                                            value={rolesEditar.nombre_rol}
                                            onChange={handleChangeEditar}
                                        />
                                        {!inputValidoNombre2 && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorNombre2}</p>}
                                    </div>

                                </div>
                                <br />
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito}>Descripción del rol</p>
                                        <textarea
                                            id={estilos.descrol}
                                            className={`${!inputValidoDes ? estilos.inputInvalido : estilos['input-field']}`}
                                            placeholder="Insertar descripción"
                                            name='descripcion_rol'
                                            value={roles1.descripcion_rol}
                                            onChange={handleChange}
                                        />
                                        {!inputValidoDes && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorDes}</p>}
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
                                                {permisos1.map(permiso => {
                                                    let sent2 = false;
                                                    let idRolP = 0;
                                                    rolesPermisos.forEach(rolP => {
                                                        if (rolP.id_rol === rolesEditar.id_rol && rolP.id_permiso === permiso.id_permiso) {
                                                            sent2 = true;
                                                            idRolP = rolP.id_roles_permisos;
                                                        }
                                                    });
                                                    return (
                                                        <tr key={permiso.id_permiso}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    className={`form-check-input ${estilos["checkbox"]}`}
                                                                    value={permiso.id_permiso}
                                                                    checked={sent2 === true}
                                                                    onChange={(event) => checkEditar(event, idRolP, rolesEditar.id_rol, permiso.id_permiso)}
                                                                />
                                                                {permiso.nombre_permiso}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>

                            </div>


                        </div>

                        <br />
                        <center>
                            <div className={estilos["cajaBotones"]}>
                                <button onclick="registrar()" className={estilos["azul"]} type="submit">Guardar</button>
                                <div className={estilos["espacioEntreBotones"]}></div>
                                <button onClick={() => {
                                    cambiarEstadoModalEditar(!estadoModaleditar);
                                    setInputValidoNombre2(true);
                                    setInputValidoDes2(true);

                                }} className={estilos["gris"]} type="button">Cancelar</button>
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
