import React from "react";
import { Outlet, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import '../../Layout.css';
import estilos from '../Clientes/Clientes.module.css';
import Modal from './modal';
import styled from 'styled-components';
import Swal from 'sweetalert2';


const Cliente = () => {
    const [clientes, setclientes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [estadoModal1, cambiarEstadoModal1] = useState(false);
    const [estadoModal2, cambiarEstadoModal2] = useState(false);
    const [estadoModal3, cambiarEstadoModal3] = useState(false);
    const [ClienteRegistrar, setClienteRegistrar] = useState({
        id_cliente: '',
        nombre_cliente: '',
        telefono_cliente: '',
        direccion_cliente: '',
        cliente_frecuente: 1,
        estado_cliente: 1
    });

    const [ClientesEditar, setClientesEditar] = useState({
        id_cliente: '',
        nombre_cliente: '',
        telefono_cliente: '',
        direccion_cliente: ''
    });

    const [inputValidoId, setInputValidoId] = useState(true);
    const [errorId, setErrorId] = useState('')
    const [inputValidoNombre, setInputValidoNombre] = useState(true);
    const [errorNombre, setErrorNombre] = useState('')
    const [inputValidoTelefono, setInputValidoTelefono] = useState(true);
    const [errorTelefono, setErrorTelefono] = useState('')
    const [inputValidoDireccion, setInputValidoDireccion] = useState(true);
    const [errorDireccion, setErrorDireccion] = useState('')
    const [inputValidoNombreEditar, setInputValidoNombreEditar] = useState(true);
    const [errorNombreEditar, setErrorNombreEditar] = useState('')
    const [inputValidoTelefonoEditar, setInputValidoTelefonoEditar] = useState(true);
    const [errorTelefonoEditar, setErrorTelefonoEditar] = useState('')
    const [inputValidoDireccionEditar, setInputValidoDireccionEditar] = useState(true);
    const [errorDireccionEditar, setErrorDireccionEditar] = useState('')

    const fetchVenta = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas/clientes');
            if (response.ok) {
                const data = await response.json();
                const clienteData = data.map(cliente => ({
                    id_cliente: cliente.id_cliente,
                    nombre_cliente: cliente.nombre_cliente,
                    telefono_cliente: cliente.telefono_cliente,
                    direccion_cliente: cliente.direccion_cliente,
                    cliente_frecuente: cliente.cliente_frecuente,
                    estado_cliente: cliente.estado_cliente,
                }));
                setclientes(clienteData);
            } else {
                console.error('Error al obtener las venta');
            }
        } catch (error) {
            console.error('Error al obtener las venta:', error);
        }
    };
    useEffect(() => {
        fetchVenta();
    }, []);
    useEffect(() => {
        if (clientes.length > 0) {
            setIsLoading(false);
        }
    }, [clientes]);

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    const filteredClientes = clientes.filter(cliente =>
        cliente.id_cliente.toString().includes(filtro) ||
        cliente.nombre_cliente.toLowerCase().includes(filtro.toLowerCase()) ||
        cliente.telefono_cliente.includes(filtro) ||
        cliente.direccion_cliente.toString().includes(filtro) ||
        cliente.cliente_frecuente.toString().includes(filtro) ||
        cliente.estado_cliente.toString().includes(filtro)

    );



    const columns = [
        {
            name: "Documento",
            selector: (row) => row.id_cliente,
            sortable: true
        },
        {
            name: "Nombre",
            selector: (row) => row.nombre_cliente,
            sortable: true
        },
        {
            name: "Teléfono",
            selector: (row) => row.telefono_cliente,
            sortable: true
        },
        {
            name: "Dirección",
            selector: (row) => row.direccion_cliente,
            sortable: true
        },
        {
            name: "Cliente Frecuente",
            selector: (row) => row.cliente_frecuente === 1 ? 'Frecuente' : 'No frecuente',
            sortable: true,
            cell: (row) => (
                <div>
                    <button className={`${estilos["frecuente-button"]} ${row.cliente_frecuente !== 1 && estilos['no-frecuente-button']}`} onClick={() => handleClienteFrecuente(row)} >{row.cliente_frecuente == 1 ? 'Frecuente' : 'No frecuente'}</button>
                </div>
            ),
        },
        {
            name: "ㅤㅤㅤAcciones",
            cell: (row) => (
                <div>
                    {
                        row.estado_cliente === 1 ? (
                            <div className={estilos["acciones"]}>
                                <label className={estilos["switch"]} >
                                    <input type="checkbox" onChange={() => handleEstadoCliente(row)} />
                                    {row.estado_cliente === 1 ? (
                                        <span className={`${row.estado_cliente == 1 && estilos['slider2']}`}></span>
                                    ) : (
                                        <span className={`${row.estado_cliente !== 1 && estilos['slider']}`}></span>
                                    )}
                                    <span className={`${row.estado_cliente == 1 && estilos['slider2']} ${row.estado_cliente !== 1 && estilos['slider']}`}></span>
                                </label>
                                <button onClick={() => { cambiarEstadoModal2(!estadoModal2), setClientesEditar(row) }}><i className={`fa-solid fa-pen-to-square iconosNaranjas`}></i></button>
                                <abbr title="Ver detalle">
                                    <button onClick={() => { cambiarEstadoModal3(!estadoModal3), setClientesEditar(row) }}><i className={`fa-regular fa-eye iconosAzules`}></i></button>
                                </abbr>
                                <button
                                    onClick={() => handleEliminarCliente(row.id_cliente)}
                                    // disabled={row.estado_producto === 0}
                                    className={estilos["boton"]}
                                    style={{ cursor: "pointer", textAlign: "center", fontSize: "23px" }}
                                >
                                    <i
                                        className={`bi bi-trash ${row.estado_producto === 0 ? "basuraDesactivada" : ""
                                            }`}
                                        style={{ color: row.estado_producto === 0 ? "gray" : "red" }}
                                    ></i>
                                </button>
                            </div>
                        ) : (
                            <div className={estilos["acciones"]}>
                                <label className={estilos["switch"]} >
                                    <input type="checkbox" onChange={() => handleEstadoCliente(row)} />
                                    {row.estado_cliente === 1 ? (
                                        <span className={`${row.estado_cliente == 1 && estilos['slider2']}`}></span>
                                    ) : (
                                        <span className={`${row.estado_cliente !== 1 && estilos['slider']}`}></span>
                                    )}
                                    <span className={`${row.estado_cliente == 1 && estilos['slider2']} ${row.estado_cliente !== 1 && estilos['slider']}`}></span>
                                </label>
                                <button><i className={`fa-solid fa-pen-to-square ${estilos.icono_negro}`}></i></button>
                                <abbr title="Ver detalle">
                                    <button ><i className={`bi-eye-slash cerrado ${estilos.icono_negro}`}></i></button>
                                </abbr>
                                <button
                                    onClick={() => handleEliminarCliente(row.id_cliente)}
                                    // disabled={row.estado_producto === 0}
                                    className={estilos["boton"]}
                                    style={{ cursor: "pointer", textAlign: "center", fontSize: "23px" }}
                                >
                                    <i
                                        className={`bi bi-trash ${row.estado_producto === 0 ? "basuraDesactivada" : ""
                                            }`}
                                        style={{ color: row.estado_producto === 0 ? "gray" : "red" }}
                                    ></i>
                                </button>
                            </div>
                        )
                    }
                </div>

            )
        },

    ]

    const handleEliminarCliente = async (id_cliente) => {
        console.log("Intentando eliminar el cliente con ID:", id_cliente);
    
        try {
            // Verificar si el producto tiene pedidos asociados
            const ClienteResponse = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/pedidos/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!ClienteResponse.ok) {
                const errorText = await ClienteResponse.text();
                console.error("Error al verificar cliente asociado:", ClienteResponse.status, errorText);
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Error al verificar cliente asociado: ${ClienteResponse.statusText}`,
                });
                return;
            }
    
            const Clientes = await ClienteResponse.json();
    
            const tienePedidosAsociados = Clientes.some(cliente => cliente.id_cliente === id_cliente);
    
            if (tienePedidosAsociados) {
                await Swal.fire({
                    icon: "warning",
                    title: "No se puede eliminar",
                    text: "El cliente tiene pedidos asociados y no puede ser eliminado.",
                });
                return;
            }
    
            // Mostrar mensaje de confirmación
            const { isConfirmed } = await Swal.fire({
                text: "¿Deseas eliminar este cliente?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });
    
            if (!isConfirmed) return;
    
            console.log("Confirmación recibida para eliminar el cliente.");
    
            // Solicitud DELETE
            const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/clientes/${id_cliente}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            // Manejo de la respuesta
            if (response.ok) {
                console.log("Cliente eliminado exitosamente.");
                await Swal.fire({
                    icon: "success",
                    title: "Cliente eliminado",
                    text: "El cliente ha sido eliminado correctamente",
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchVenta();
            } else {
                const errorText = await response.text();
                console.error("Error al eliminar el cliente:", response.status, errorText);
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Error al eliminar el cliente: ${response.statusText}`,
                });
            }
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: `Error al eliminar el cliente: ${error.message}`,
            });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'id_cliente') {
            // Verifica si el valor contiene solo dígitos positivos
            const esNumeroPositivo = /^[0-9/s]+$/.test(value);

            if (value.trim() === '') {
                setErrorId('El campo es obligatorio.');
                setInputValidoId(false);
            } else if (!esNumeroPositivo) {
                setErrorId('No se permiten caracteres especiales ni letras.');
                setInputValidoId(false);
            } else if (value.length < 8) {
                setErrorId('Ingresa un mínimo 8 dígitos.');
                setInputValidoId(false);
            }else if (value.length > 10) {
                setErrorId('Ingresa un máximo de 10 dígitos.');
                setInputValidoId(false);
            } else {
                setErrorId(''); // Limpia el mensaje de error
                setInputValidoId(true);
            }
        }
        if (name === 'nombre_cliente') {
            if (value.trim() === '') {
                setErrorNombre('El campo es obligatorio.');
                setInputValidoNombre(false);
            }
            else if (/[^a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]/.test(value)) {
                setErrorNombre('No se permiten caracteres especiales.');
                setInputValidoNombre(false);
            }
            else if (value.length < 4) {
                setErrorNombre('Ingresa al menos 4 caracteres.');
                setInputValidoNombre(false);
            }
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
        if (name === 'telefono_cliente') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorTelefono('El campo es obligatorio.');
                setInputValidoTelefono(false);
            }
            else if (/[^0-9\s]/.test(value)) {
                setErrorTelefono('No se permiten caracteres especiales ni letras.');
                setInputValidoTelefono(false);
            }
            else if (value.length < 7) {
                setErrorTelefono('Ingresa al menos 7 caracteres.');
                setInputValidoTelefono(false);
            }else if (value.length ==8 ||value.length ==9) {
                setErrorTelefono('El teléfono contiene 7 o 10 caracteres');
                setInputValidoTelefono(false);
            }
            else if (value.length > 10) {
                setErrorTelefono('Ingresa un máximo de 10 caracteres.');
                setInputValidoTelefono(false);
            }
            else {
                setErrorTelefono(''); // Limpia el mensaje de error
                setInputValidoTelefono(true);
            }
        }
        if (name === 'direccion_cliente') {
            if (value.trim() === '') {
                setErrorDireccion('El campo es obligatorio.');
                setInputValidoDireccion(false);
            }
            else if (value.length < 15) {
                setErrorDireccion('Ingresa al menos 15 caracteres.');
                setInputValidoDireccion(false);
            }
            else if (value.length > 30) {
                setErrorDireccion('Ingresa un máximo de 30 caracteres.');
                setInputValidoDireccion(false);
            }
            else {
                setErrorDireccion(''); // Limpia el mensaje de error
                setInputValidoDireccion(true);
            }
        }

        setClienteRegistrar(reclientes => ({
            ...reclientes,
            [name]: value
        }));
    };

    const handleEditarChange = (event) => {
        const { name, value } = event.target;
        if (name === 'nombre_cliente') {
            if (value.trim() === '') {
                setErrorNombreEditar('El campo es obligatorio.');
                setInputValidoNombreEditar(false);
            }
            else if (/[^a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]/.test(value)) {
                setErrorNombreEditar('No se permiten caracteres especiales.');
                setInputValidoNombreEditar(false);
            }
            else if (value.length < 5) {
                setErrorNombreEditar('Ingresa al menos 5 caracteres.');
                setInputValidoNombreEditar(false);
            }
            else if (value.length > 30) {
                setErrorNombreEditar('Ingresa un máximo de 30 caracteres.');
                setInputValidoNombreEditar(false);
            }
            // Si todo es válido
            else {
                setErrorNombreEditar(''); // Limpia el mensaje de error
                setInputValidoNombreEditar(true);
            }
        }
        if (name === 'telefono_cliente') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorTelefonoEditar('El campo es obligatorio.');
                setInputValidoTelefonoEditar(false);
            }
            else if (/[^0-9\s]/.test(value)) {
                setErrorTelefonoEditar('No se permiten caracteres especiales ni letras.');
                setInputValidoTelefonoEditar(false);
            }
            else if (value.length < 7) {
                setErrorTelefonoEditar('Ingresa al menos 7 caracteres.');
                setInputValidoTelefonoEditar(false);
            }
            else if (value.length > 10) {
                setErrorTelefonoEditar('Ingresa un máximo de 10 caracteres.');
                setInputValidoTelefonoEditar(false);
            }
            else {
                setErrorTelefonoEditar(''); // Limpia el mensaje de error
                setInputValidoTelefonoEditar(true);
            }
        }
        if (name === 'direccion_cliente') {
            if (value.trim() === '') {
                setErrorDireccionEditar('El campo es obligatorio.');
                setInputValidoDireccionEditar(false);
            }
            else if (value.length < 10) {
                setErrorDireccionEditar('Ingresa al menos 10 caracteres.');
                setInputValidoDireccionEditar(false);
            }
            else if (value.length > 30) {
                setErrorDireccionEditar('Ingresa un máximo de 30 caracteres.');
                setInputValidoDireccionEditar(false);
            }
            else {
                setErrorDireccionEditar(''); // Limpia el mensaje de error
                setInputValidoDireccionEditar(true);
            }
        }

        setClientesEditar(reclientes => ({
            ...reclientes,
            [name]: value
        }));
    };

    const RegistrarCliente = async (event) => {
        event.preventDefault();
        if (ClienteRegistrar.id_cliente === '' && ClienteRegistrar.nombre_cliente === '' && ClienteRegistrar.telefono_cliente === '' && ClienteRegistrar.direccion_cliente === '') {
            Swal.fire({
                icon: 'error',
                text: 'Los campos se encuentran vacíos',
                confirmButtonColor: '#1F67B9',
            });
            return;
        } else if (ClienteRegistrar.id_cliente === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El campo del documento esta vacío',
                confirmButtonColor: '#1F67B9',
            });
            return;
        } else if (ClienteRegistrar.nombre_cliente === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El campo del nombre esta vacío',
                confirmButtonColor: '#1F67B9',
            });
            return;
        } else if (ClienteRegistrar.telefono_cliente === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El campo del teléfono esta vacío',
                confirmButtonColor: '#1F67B9',
            });
            return;
        } else if (ClienteRegistrar.direccion_cliente === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El campo de la dirección está vacío',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }
        if (ClienteRegistrar.id_cliente <= 9) {
            Swal.fire({
                icon: 'error',
                text: 'El documento no cuenta con la longitud establecida',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }
        try {
            const responseProveedores = await fetch('https://api-luchosoft-mysql.onrender.com/ventas/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ClienteRegistrar)
            });

            if (responseProveedores.ok) {
                fetchVenta();
                console.log('Cliente creado exitosamente.');

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: "Registro exitoso"
                });

                setClienteRegistrar(
                    {
                        id_cliente: 0,
                        nombre_cliente: '',
                        telefono_cliente: '',
                        direccion_cliente: '',
                        cliente_frecuente: 1,
                        estado_cliente: 1
                    }
                )

                setTimeout(() => {
                    cambiarEstadoModal1(false)
                }, 1000);


            } else {
                console.error('Error al crear el cliente:', responseProveedores.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al crear cliente',
                });
            }
        } catch (error) {
            console.error('Error al crear cliente:', error);
        }
    };


    const handleEstadoCliente = async (row) => {
        Swal.fire({
            title: '¿Deseas cambiar el estado del Cliente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const nuevoEstado = row.estado_cliente === 1 ? 0 : 1;
                    if (nuevoEstado === 0) {
                        const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/clientes/${row.id_cliente}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                ...row,
                                cliente_frecuente: nuevoEstado,
                                estado_cliente: nuevoEstado
                            })

                        });
                        if (response.ok) {
                            // Actualización exitosa, actualizar la lista de clientes
                            fetchVenta();
                        } else {
                            console.error('Error al actualizar el estado del usuario');
                        }
                    } else {
                        const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/clientes/${row.id_cliente}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                ...row,
                                estado_cliente: nuevoEstado
                            })

                        });
                        if (response.ok) {
                            // Actualización exitosa, actualizar la lista de compras
                            fetchVenta();
                        } else {
                            console.error('Error al actualizar el estado del usuario');
                        }
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del usuario:', error);
                }
            }
        });
    };

    const handleClienteFrecuente = async (row) => {
        // const estado_cliente=row.estado_cliente === 0 
        if (row.estado_cliente === 0) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: 'No se puede cambiar porque el cliente se encuentra Inhabilitado',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }
        Swal.fire({
            title: '¿Deseas cambiar el estado del Cliente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const nuevoEstado = row.cliente_frecuente === 1 ? 0 : 1;

                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/clientes/${row.id_cliente}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...row,
                            cliente_frecuente: nuevoEstado
                        })

                    });
                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de compras
                        fetchVenta();
                    } else {
                        console.error('Error al actualizar el estado del usuario');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del usuario:', error);
                }
            }
        })
    }

    const EditarCliente = async (event) => {
        event.preventDefault();
        console.log(clientes)
        if (ClientesEditar.nombre_cliente === '' && ClientesEditar.telefono_cliente === '' && ClientesEditar.direccion_cliente === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Los campos están vacíos',
                confirmButtonColor: '#1F67B9',
            });
            return;
        } else if (ClientesEditar.nombre_cliente === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El campo del nombre se encuentra vacío',
                confirmButtonColor: '#1F67B9',
            });
            return;
        } else if (ClientesEditar.telefono_cliente === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El campo de la teléfono se encuentra vacío',
                confirmButtonColor: '#1F67B9',
            });
            return;
        } else if (ClientesEditar.direccion_cliente === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El campo de la dirección se encuentra vacío',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }
        Swal.fire({
            title: '¿Deseas actualizar la información del cliente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/clientes/${ClientesEditar.id_cliente}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(ClientesEditar)
                    });

                    if (response.ok) {
                        console.log('Cliente actualizado exitosamente.');
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.onmouseenter = Swal.stopTimer;
                                toast.onmouseleave = Swal.resumeTimer;
                            }
                        });
                        Toast.fire({
                            icon: "success",
                            title: "Actualización exitosa"
                        });
                        setTimeout(() => {
                            fetchVenta();
                            cambiarEstadoModal2(false)

                        }, 1000);
                        // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
                        window.location.href = "/#/clientes";
                    } else {
                        console.error('Error al actualizar el cliente:', response.statusText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar cliente',
                        });
                    }
                } catch (error) {
                    console.error('Error al actualizar el cliente:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al actualizar cliente',
                    });
                }
            }
        });
    };

    const exportExcel = (customFileName) => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(clientes);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, customFileName || 'clientes');
        });
    };
    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });
                module.default.saveAs(data, fileName + EXCEL_EXTENSION);
            }
        });
    };

    const customStyles = {
        headCells: {
            style: {
                textAlign: 'center',
                backgroundColor: '#f2f2f2',
                fontWeight: 'bold',
                padding: '10px',
                fontSize: '16px'
            },
        },
        cells: {
            style: {
                textAlign: 'center',

                fontSize: '13px'
            },
        },

        name:{
            style:{
                textAlign: 'center',

            }
        },
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }
    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />
            <div className={estilos["tituloCliente"]}>
                <h1>Clientes</h1>
            </div>
            <div className={estilos['botones']}>
                <input type="text" placeholder="Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                <div className={estilos['boton2']}>
                    <button onClick={() => cambiarEstadoModal1(!estadoModal1)} className={`${estilos.botonAgregar} ${estilos.rojo} bebas-neue-regular`}><i className="fa-solid fa-plus"></i> Agregar</button>
                    <button style={{ backgroundColor: 'white', border: '1px solid #c9c6c675', borderRadius: '50px', marginTop: '-2px', height: '45px', cursor: 'pointer' }} onClick={() => exportExcel('Cliente_informacion')}><img src="src\assets\excel-logo.png" height={'40px'} /></button>
                </div>

            </div>
            <div className={estilos["tabla"]}>
                <DataTable columns={columns} data={filteredClientes} pagination paginationPerPage={6} highlightOnHover customStyles={customStyles} defaultSortField="id_cliente" defaultSortAsc={true}></DataTable>
            </div>
            <Modal
                estado={estadoModal1}
                cambiarEstado={cambiarEstadoModal1}
                titulo="Registrar Cliente"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'600px'}
                padding={'20px'}
            >
                <Contenido>
                    <div className={estilos["contFormsRCliente"]}>
                        <div className={estilos["input1RCliente"]}>
                            <label>Documento <span style={{ color: 'red' }}>*</span></label>
                            <input
                                id={estilos["id_cliente"]} className={`${!inputValidoId ? estilos['input-field2'] : estilos['input-field']}`} type="number" placeholder="10203040" name="id_cliente"
                                value={ClienteRegistrar.id_cliente} onChange={handleChange}
                            />
                            {!inputValidoId && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'relative' }}>{errorId}</p>}
                        </div>
                        <div className={estilos["input1RCliente"]}>
                            <label>Nombre <span style={{ color: 'red' }}>*</span></label>
                            <input id={estilos["nombre_cliente"]} className={`${!inputValidoNombre ? estilos['input-field2'] : estilos['input-field']}`} type="text" placeholder="Nombre" name="nombre_cliente"
                                value={ClienteRegistrar.nombre_cliente} onChange={handleChange} size="small" />
                            {!inputValidoNombre && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'relative' }}>{errorNombre}</p>}
                        </div>
                    </div>
                    <div style={{ display: 'flex' }} >
                        <div className={estilos["input1RCliente"]}>
                            <label>Teléfono <span style={{ color: 'red' }}>*</span></label>
                            <input id={estilos["telefono_cliente"]} className={`${!inputValidoTelefono ? estilos['input-field2'] : estilos['input-field']}`} type="number" placeholder="Teléfono" name="telefono_cliente"
                                value={ClienteRegistrar.telefono_cliente} onChange={handleChange} size="small" />
                            {!inputValidoTelefono && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'relative' }}>{errorTelefono}</p>}
                        </div>
                        <div className={estilos["input1RCliente"]}>
                            <label>Dirección <span style={{ color: 'red' }}>*</span></label>
                            <input id="direccion_cliente" className={`${!inputValidoDireccion ? estilos['input-field2'] : estilos['input-field']}`} type="text" placeholder="Dirección" name="direccion_cliente"
                                value={ClienteRegistrar.direccion_cliente} onChange={handleChange} size="small" />
                            {!inputValidoDireccion && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'relative' }}>{errorDireccion}</p>}
                        </div>
                    </div>
                    <div className={estilos["BotonesClientes"]}>
                        <button type='submit' onClick={RegistrarCliente} className={estilos['RegistrarCliente']}>Aceptar</button>
                        <button onClick={() => cambiarEstadoModal1(!estadoModal1, setClienteRegistrar({
                            id_cliente: '',
                            nombre_cliente: '',
                            telefono_cliente: '',
                            direccion_cliente: '',
                            cliente_frecuente: 1,
                            estado_cliente: 1
                        }), setInputValidoId(true), setInputValidoNombre(true), setInputValidoTelefono(true), setInputValidoDireccion(true))} className={estilos['boton-cancelar']}>Cancelar</button>
                    </div>
                </Contenido>
            </Modal>
            <Modal
                estado={estadoModal2}
                cambiarEstado={cambiarEstadoModal2}
                titulo="Editar Cliente"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'600px'}
                padding={'20px'}
            >
                <Contenido>
                    <div className={estilos["contFormsRCliente"]}>
                        <div className={estilos["input1RCliente"]}>
                            <label>Documento <span style={{ color: 'red' }}>*</span></label>
                            <input
                                id={estilos["id_cliente"]} className={`${!inputValidoId ? estilos['input-field2'] : estilos['input-field']}`} type="number" placeholder="10203040" name="id_cliente"
                                value={ClientesEditar.id_cliente} onChange={handleChange} disabled
                            />
                            {!inputValidoId && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'relative' }}>{errorId}</p>}
                        </div>
                        <div className={estilos["input1RCliente"]}>
                            <p> Nombre<span style={{ color: 'red' }}>*</span></p>
                            <input id={estilos["nombre_cliente"]} className={`${!inputValidoNombreEditar ? estilos['input-field2'] : estilos['input-field']}`} type="text" placeholder="Nombre" name="nombre_cliente" value={ClientesEditar.nombre_cliente} onChange={handleEditarChange} />
                            {!inputValidoNombreEditar && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'relative' }}>{errorNombreEditar}</p>}
                        </div>
                        <br />
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className={estilos["input1RCliente"]}>
                            <p>Telefono<span style={{ color: 'red' }}>*</span></p>
                            <input id={estilos["telefono_cliente"]} className={`${!inputValidoTelefonoEditar ? estilos['input-field2'] : estilos['input-field']}`} type="number" placeholder="Telefono" name="telefono_cliente" value={ClientesEditar.telefono_cliente} onChange={handleEditarChange} />
                            {!inputValidoTelefonoEditar && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'relative' }}>{errorTelefonoEditar}</p>}
                        </div>
                        <div className={estilos["input1RCliente"]}>
                            <p> Dirección<span style={{ color: 'red' }}>*</span></p>
                            <input id="direccion_cliente" className={`${!inputValidoDireccionEditar ? estilos['input-field2'] : estilos['input-field']}`} type="text" placeholder="Dirección" name="direccion_cliente" value={ClientesEditar.direccion_cliente} onChange={handleEditarChange} />
                            {!inputValidoDireccionEditar && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'relative' }}>{errorDireccionEditar}</p>}
                        </div>
                    </div>
                    <div className={estilos["BotonesClientes"]}>
                        <button type='submit' onClick={EditarCliente} className={estilos['RegistrarCliente']}>Aceptar</button>
                        <button onClick={() => cambiarEstadoModal2(!estadoModal2, setClientesEditar({
                            nombre_cliente: '',
                            telefono_cliente: '',
                            direccion_cliente: '',
                        }), setInputValidoDireccionEditar(true), setInputValidoNombreEditar(true), setInputValidoTelefonoEditar(true))}>Cancelar</button>
                    </div>
                </Contenido>
            </Modal>
            <Modal
                estado={estadoModal3}
                cambiarEstado={cambiarEstadoModal3}
                titulo="Detalle"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'400px'}
                padding={'20px'}
            >
                <Contenido>
                    <div className={estilos["input1RCliente"]}>
                        <label htmlFor="" > Nombre: {ClientesEditar.nombre_cliente} </label>
                        <br />
                        <label htmlFor=""> Documento: {ClientesEditar.id_cliente}</label>
                        <br />
                        <label htmlFor="">Teléfono: {ClientesEditar.telefono_cliente}</label>
                        <br />
                        <label htmlFor="">Dirección: {ClientesEditar.direccion_cliente}</label>


                    </div>
                    <div className={estilos["boton-cerrar"]}>
                        <button onClick={() => cambiarEstadoModal3(!estadoModal3)}>Cerrar</button>
                    </div>


                </Contenido>
            </Modal>
        </div>
    )
}
// id, nombre, telefono, direccion, funciones

export default Cliente;

const ContenedorBotones = styled.div`
	padding: 40px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 20px;
`;

const Boton = styled.button`
	display: block;
	padding: 10px 30px;
	border-radius: 100px;
	color: #fff;
	border: none;
	background: #1766DC;
	cursor: pointer;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	transition: .3s ease all;
    margin-top: 20px;

	&:hover {
		background: #0066FF;
	}
`;

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
		font-size: 16px;
		margin-bottom: 11px;
	}

	img {
		width: 100%;
		vertical-align: top;
		border-radius: 3px;
	}
`;