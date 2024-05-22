import React from "react";
import { Outlet, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import '../../Layout.css';
import estilos from '../Clientes/Clientes.module.css';
import Modal from './modal';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import { event } from "jquery";

const Cliente = () => {
    const [clientes, setclientes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [estadoModal1, cambiarEstadoModal1] = useState(false);
    const [estadoModal2, cambiarEstadoModal2] = useState(false);
    const [ClienteRegistrar, setClienteRegistrar] = useState({
        id_cliente: '',
        nombre_cliente: '',
        telefono_cliente: '',
        direccion_cliente: '',
        cliente_frecuente: 1,
        estado_cliente: 1
    });

    const [ClientesEditar, setClientesEditar] = useState({
        nombre_cliente: '',
        telefono_cliente: '',
        direccion_cliente: ''
    });

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
            name: "Acciones",
            cell: (row) => (
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
                </div>
            )
        },

    ]

    const handleChange = (event) => {
        const { name, value } = event.target;
        setClienteRegistrar(reclientes => ({
            ...reclientes,
            [name]: value
        }));
    };

    const handleEditarChange = (event) => {
        const { name, value } = event.target;
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
                title: 'Error',
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

                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    showConfirmButton: false,
                    timer: 1500
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
                }, 2000);


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
                        Swal.fire({
                            icon: 'success',
                            title: 'Cliente actualizado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            cambiarEstadoModal2(false)
                        }, 1000);
                        // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
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
    const [cedula, setCedula] = React.useState("");
    const [leyenda, setLeyenda] = React.useState("");
    const [errorTitulo, setErrorTitulo] = React.useState(false);
    const validacion = (event) => {
        setCedula(event.target.value);
        
        // Realizar la validación en función del estado actualizado 'cedula'
        if (event.target.value.length <=9) {
            setErrorTitulo(true);
            setLeyenda("El dígito no puede ser menor de 10");            
        } else if (event.target.value.length === 10) {
            setErrorTitulo(false);
            setLeyenda("");
        } else if (event.target.value.length >= 10) {
            setErrorTitulo(true);
            setLeyenda("El número de cédula no puede ser mayor de 10");
        }
        handleChange(event);
    }
    

    if (isLoading) {
        return <div>Cargando...</div>;
    }
    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div id={estilos["tituloCliente"]}>
                <h1>Clientes</h1>
            </div>
            <div className={estilos['botones']}>
                <input type="text" placeholder="Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                <div>
                    <button onClick={() => cambiarEstadoModal1(!estadoModal1)} className={`${estilos.botonAgregar} ${estilos.rojo} bebas-neue-regular`}><i className="fa-solid fa-plus"></i> Agregar</button>
                    <button className={`${estilos["boton-generar"]} ${estilos.vinotinto}`}><i className="fa-solid fa-download"></i></button>
                </div>

            </div>
            <div className={estilos["tabla"]}>
                <DataTable columns={columns} data={filteredClientes} pagination paginationPerPage={6} highlightOnHover></DataTable>
            </div>
            <Modal
                estado={estadoModal1}
                cambiarEstado={cambiarEstadoModal1}
                titulo="Registrar Cliente"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'500px'}
                padding={'10px'}
            >
                <Contenido>
                    <div className={estilos["contFormsRCliente"]}>
                        <div className={estilos["input1RCliente"]}>
                            <label>Documento <span style={{color: 'red'}}>*</span></label>
                            <TextField
                                id="id_cliente" className={estilos["input-field"]} type="number" placeholder="10203040" name="id_cliente"
                                value={ClienteRegistrar.id_cliente} onChange={validacion} error={errorTitulo} size="small"
                                helperText={<span style={{ fontSize: '11px' }}>{leyenda}</span>}
                            />
                        </div>
                        <div className={estilos["input1RCliente"]}>
                            <label>Nombre <span style={{color: 'red'}}>*</span></label>
                            <TextField id="nombre_cliente" className={estilos["input-field"]} type="text" placeholder="Nombre" name="nombre_cliente"
                                value={ClienteRegistrar.nombre_cliente} onChange={validacion} size="small" />
                        </div> 
                        <br />
                        <div className={estilos["input1RCliente"]}>
                            <label>Telefono <span style={{color: 'red'}}>*</span></label>
                            <TextField id="telefono_cliente" className={estilos["input-field"]} type="number" placeholder="Telefono" name="telefono_cliente"
                                value={ClienteRegistrar.telefono_cliente} onChange={validacion}  size="small" />
                        </div>
                        <br />
                        <div className={estilos["input1RCliente"]}>
                            <label>Dirección <span style={{color: 'red'}}>*</span></label>
                            <TextField id="direccion_cliente" className={estilos["input-field"]} type="text" placeholder="Dirección" name="direccion_cliente"
                                value={ClienteRegistrar.direccion_cliente} onChange={validacion}  size="small" />
                        </div>
                        <br />
                    </div>
                    <div className={estilos["BotonesClientes"]}>
                        <button type='submit' onClick={RegistrarCliente} className={estilos['RegistrarCliente']}>Aceptar</button>
                        <button onClick={() => cambiarEstadoModal1(!estadoModal1, setErrorTitulo(false),setCedula(""))}>Cancelar</button>
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
                width={'500px'}
                padding={'20px'}
            >
                <Contenido>
                    <div className={estilos["contFormsRCliente"]}>
                        <div className={estilos["input1RCliente"]}>
                            <p> Nombre del cliente</p>
                            <input id="nombre_cliente" className={estilos["input-field"]} type="text" placeholder="Nombre" name="nombre_cliente" value={ClientesEditar.nombre_cliente} onChange={handleEditarChange} />
                        </div>
                        <br />
                        <div className={estilos["input1RCliente"]}>
                            <p>Telefono del cliente</p>
                            <input id="telefono_cliente" className={estilos["input-field"]} type="text" placeholder="Telefono" name="telefono_cliente" value={ClientesEditar.telefono_cliente} onChange={handleEditarChange} />
                        </div>
                        <br />
                        <div className={estilos["input1RCliente"]}>
                            <p> Dirección del cliente</p>
                            <input id="direccion_cliente" className={estilos["input-field"]} type="text" placeholder="Dirección" name="direccion_cliente" value={ClientesEditar.direccion_cliente} onChange={handleEditarChange} />
                        </div>
                        <br />
                    </div>
                    <div className={estilos["BotonesClientes"]}>
                        <button type='submit' onClick={EditarCliente} className={estilos['RegistrarCliente']}>Aceptar</button>
                        <button onClick={() => cambiarEstadoModal2(!estadoModal2)}>Cancelar</button>
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