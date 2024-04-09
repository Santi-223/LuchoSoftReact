import React from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import '../Pedidos/estilosRPedidos.css';
import Modal from '../Clientes/modal';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { event } from "jquery";
import moment from "moment";
import Swal from 'sweetalert2'
import estilos from './Pedidos.module.css';


const EditarPedidos = () => {
    const [estadoModal1, cambiarEstadoModal1] = useState(false);
    const [clientes, setclientes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [cliente, setCliente] = useState(null);
    const [customers, setClientes] = useState([]);
    const [selectedCliente, setselectedCliente] = useState(null);
    const [ventanaClienteDetalle, VentanaClienteDetalle] = useState(false);
    const [tablaClienteDetalle, TablaClienteDetalle] = useState(true);
    const [listarProductos1, setlistarProductos] = useState([])
    const [tableRows, setTableRows] = useState([{ nombre: '', precio_unitario: 0, cantidad: 0, cantidad_seleccionada: 0, precio_total: 0 }]);
    const [formChanged, setFormChanged] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const [pedidoProductos1, setPedidoProductos] = useState([]);

    //editar pedidos

    const { id_pedido } = useParams();
    console.log(id_pedido)
    const [pedidosEditar, setpedidostEditar] = useState({
        observaciones: '',
        fecha_venta: '',
        fecha_pedido: '',
        estado_pedido: 1,
        total_pedido: '',
        total_venta: '',
        id_cliente: '',
        id_usuario: ''
    })

    const [clienteEditar, setClienteEditar] = useState([])

    useEffect(() => {
        const ListarPedidos = async () => {
            try {
                const response = await fetch(`http://localhost:8082/ventas/pedidos/${id_pedido}`);
                if (response.ok) {
                    const data = await response.json();
                    const pedidoData = data[0];
                    setpedidostEditar(pedidoData);
                    console.log('pedido es: ', pedidosEditar)
                } else {
                    console.error('Error al obtener pedidos');
                }
            } catch (error) {
                console.error('Error al obtener pedidos:', error);
            }
        }
        ListarPedidos();
    }, [id_pedido]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setpedidostEditar(prevPedido => ({
            ...prevPedido,
            [name]: value
        }))
    }



    useEffect(() => {
        const listarCliente = async () => {
            try {
                const response = await fetch(`http://localhost:8082/ventas/clientes`);
                if (response.ok) {
                    const data = await response.json();
                    const clienteData = data.map(cliente => ({
                        id_cliente: cliente.id_cliente,
                        nombre_cliente: cliente.nombre_cliente,
                        telefono_cliente: cliente.telefono_cliente,
                        direccion_cliente: cliente.direccion_cliente
                    }));
                    setClienteEditar(clienteData);
                } else {
                    console.error('Error al obtener cliente');
                }
            } catch (error) {
                console.error('Error al obtener cliente:', error);
            }
        }
        listarCliente();
    }, []);

    useEffect(() => {
        const listarProductos = async () => {
            try {
                const response = await fetch(`http://localhost:8082/ventas2/productos`);
                if (response.ok) {
                    const data = await response.json();
                    const productosData = data.map(productos => ({
                        id_producto: productos.id_producto,
                        nombre_producto: productos.nombre_producto,
                        descripcion_producto: productos.descripcion_producto,
                        estado_producto: productos.estado_producto,
                        precio_producto: productos.precio_producto,
                        id_categoria_producto: productos.id_categoria_producto
                    }));
                    setlistarProductos(productosData);
                    console.log('El cliente es', listarProductos1);
                } else {
                    console.error('Error al obtener cliente');
                }
            } catch (error) {
                console.error('Error al obtener cliente:', error);
            }
        }
        listarProductos();
    }, []);


    const fetchVenta = async () => {
        try {
            const response = await fetch('http://localhost:8082/ventas/clientes');
            if (response.ok) {
                const data = await response.json();
                const clienteData = data.filter(cliente => cliente.cliente_frecuente === 1).map(cliente => ({
                    id_cliente: cliente.id_cliente,
                    nombre_cliente: cliente.nombre_cliente,
                    telefono_cliente: cliente.telefono_cliente,
                    direccion_cliente: cliente.direccion_cliente,
                    cliente_frecuente: cliente.cliente_frecuente,
                    estado_cliente: cliente.estado_cliente,
                }));
                setclientes(clienteData);
                setClientes(clienteData);
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
        if (selectedCliente) {
            setCliente(
                customers.find((c) => c.id_cliente === selectedCliente.id_cliente)
            );
        }
    }, [selectedCliente, customers]);

    const handleChange1 = (event) => {
        const { name, value } = event.target;
        setlistarProductos(prevProducto => ({
            ...prevProducto,
            [name]: value
        }));
    };

    const handleAgregarProducto = () => {
        const { products, selectedProduct } = this.state;
        if (selectedProduct) {
            const newProduct = {
                ...selectedProduct,
                cantidad: 1,
                precio: selectedProduct.precio_producto,
            };
            this.setState({
                products: [...products, newProduct],
                selectedProduct: null,
            });
        }
    };

    const handleCantidadChange = (event, index) => {
        const { products } = this.state;
        const newProducts = [...products];
        newProducts[index].cantidad = event.target.value;
        this.setState({ products: newProducts });
        if (updatedRows.length > 6) {
            setScrollEnabled(true);
        }
    };

    const addTableRow = () => {
        const newRow = { nombre: '', precio_unitario: '', cantidad: '', cantidad_seleccionada: 0, precio_total: 0 };
        setTableRows([...tableRows, newRow]);
        setFormChanged(true);
    };


    // useEffect(() => {
    //     const fetchPedidoProductos = async (id_pedido) => {
    //         console.log('el id para la tabla de detalle es:', id_pedido);
    //         try {
    //             const response = await fetch('http://localhost:8082/ventas/pedidos_productos');
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 const pedidoProductosData1 = data.filter(pedidoProducto => pedidoProducto.id_pedido === id_pedido).map(pedidoProducto => (
    //                     {
    //                         fecha_pedido_producto: pedidoProducto.fecha_pedido_producto,
    //                         cantidad_producto: pedidoProducto.cantidad_producto,
    //                         subtotal: pedidoProducto.subtotal,
    //                         id_producto: pedidoProducto.id_producto,
    //                         id_pedido: pedidoProducto.id_pedido
    //                     }
    //                 ));
    //                 setPedidoProductosData(pedidoProductosData1);
    //                 console.log('Los productos del pedido son:', pedidoProductosData);
    //             } else {
    //                 console.error('Error al obtener los productos del pedido');
    //             }
    //         } catch (error) {
    //             console.error('Error al obtener los productos del pedido:', error);
    //         }
    //     };
    //     fetchPedidoProductos(id_pedido);
    // }, []);

    const editarPedido = async (event) => {
        event.preventDefault();
        if (pedidosEditar.fecha_pedido === '' || pedidosEditar.id_cliente === 0 || pedidosEditar.observaciones == '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Los campos están vacíos',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }
        Swal.fire({
            title: '¿Deseas actualizar la información del pedido?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8082/ventas/pedidos/${id_pedido}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(pedidosEditar)
                    });

                    if (response.ok) {
                        console.log('Pedido actualizado exitosamente.');
                        Swal.fire({
                            icon: 'success',
                            title: 'Pedido actualizado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            window.location.href = '/pedidos';
                        }, 2000);
                        // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
                    } else {
                        console.error('Error al actualizar el pedido:', response.statusText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar pedido',
                        });
                    }
                } catch (error) {
                    console.error('Error al actualizar el pedido:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al actualizar pedido',
                    });
                }
            }
        });
    }

    
    useEffect(() => {
        const listarpedidosProductos = async () => {
            try {
                const response = await fetch('http://localhost:8082/ventas/pedidos_productos');
                if (response.ok) {
                    const data = await response.json();
                    const pedidoproductos = data.filter(pedidoProducto => pedidoProducto.id_pedido === id_pedido).map(pedidoProducto => ({
                        id_pedidos_productos: pedidoProducto.id_pedidos_productos,
                        fecha_pedido_producto: pedidoProducto.fecha_pedido_producto,
                        cantidad_producto: pedidoProducto.cantidad_producto,
                        subtotal: pedidoProducto.subtotal,
                        id_producto: pedidoProducto.id_producto
                    }));
                    setPedidoProductos(pedidoproductos);
                    console.log('pedidosProductos',pedidoProductos1)
                } else {
                    console.error('Error al obtener pedidos_productos');
                }
            } catch (error) {
                console.error('Error al obtener pedidos_productos:', error);
            }
        }
        listarpedidosProductos();
    }, []);

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    const filteredPedidosproductos = pedidoProductos1.filter(pedido =>
        pedido.id_producto.includes(filtro) ||
        pedido.cantidad_producto.includes(filtro) ||
        pedido.subtotal.includes(filtro)
    );

    const columns = [
        {
            name: 'id_producto',
            selector: (row)=>row.id_producto,
            cell: (row) => (
                <div>
                    <select name="id_producto" value={row.id_producto}>
                        <option value="">Elije un producto</option>
                        {listarProductos1.map((producto) => (
                            <option value={producto.id_producto}>{producto.nombre_producto}</option>
                        ))}
                    </select>
                </div>
            )
        },
        {
            name: "Cantidad_producto",
            cell: (row) =>(
                <div>
                    <input type="number" value={pedidoProductos1.cantidad_producto} />
                </div>
            )
        },
        {
            name: "subtotal",
            sortable: true,
            cell: (row)=>(
                <div>
                    <input type="text" value={pedidoProductos1.subtotal} />
                </div>
            )
        }
    ]

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div classNameName={estilos["contenido2"]}>
                <div id={estilos["titulo"]}>
                    <h2>Editar Pedido</h2>
                </div>
                <div id={estilos["contenedorcito"]}>
                    <div className={estilos["input-container"]}>

                        <div id={estilos["kaka"]}>
                            <p id="skad"><i className={`fa-solid fa-calendar-days ${estilos["iconosRojos"]}`}></i> Fecha del Pedido</p>
                            <input id="fecha_pedido" className={estilos["input-field"]} name="fecha_pedido" type="date" value={pedidosEditar.fecha_pedido.slice(0, 10)} onChange={handleChange} />
                        </div>
                        <div id={estilos["kake"]}>
                            <p id="skady"><i className={`fa-solid fa-message ${estilos["iconosRojos"]}`}></i> Descripción del Pedido</p>
                            <textarea name="observaciones" id="descripcion" cols="5" rows="4" value={pedidosEditar.observaciones} onChange={handleChange}></textarea>
                            {/* <input id="descripcion" className={estilos["input-field2"]} type="text" value={pedidosEditar.observaciones} onChange={handleChange} /> */}
                        </div>
                        <div id={estilos["cliente"]}>
                            <select name="id_cliente" id=""
                                value={pedidosEditar.id_cliente} onChange={handleChange}>
                                <option>Seleccione un rol</option>
                                {
                                    clienteEditar.map(cliente => {
                                        return <option value={cliente.id_cliente}>{cliente.nombre_cliente}-{cliente.id_cliente}</option>
                                    })
                                }
                            </select>

                        </div>
                    </div>
                    <div className={estilos["TablaDetallePedidos"]}>
                        <div className={estilos["agrPedidos"]}>
                            <p><i className={`fa-solid fa-basket-shopping ${estilos["iconosRojos"]}`}></i> Agregar Productos</p>
                            <button><i className="fa-solid fa-plus" onClick={addTableRow}></i></button>
                        </div>
                        <div style={{ overflowY: scrollEnabled ? 'scroll' : 'auto', maxHeight: '300px' }}>
                            <DataTable columns={columns} data={filteredPedidosproductos}></DataTable>
                            {/* <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th></th>
                                        <th>Cantidad</th>
                                        <th></th>
                                        <th>Precio</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableRows.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                <select name="id_producto" value={row.id_producto} onChange={(event) => handleAgregarProducto(event, index)}>
                                                    <option value="">Elije un producto</option>
                                                    {listarProductos1.map((producto) => (
                                                        <option value={producto.id_producto}>{producto.nombre_producto}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td></td>
                                            <td>
                                                <input type="number" className="inputcantidad" onChange={(event) => handleCantidadChange(event, index)} />
                                            </td>
                                            <td></td>
                                            <td>
                                                <input type="text" readOnly className="inputPrecio" value={row.precio_unitario} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}
                        </div>
                        <div className={estilos["cajaBotonesRPedidos"]}>
                            <button type='submit' onClick={editarPedido} className={estilos["boton-azul"]} >Guardar</button>

                            <Link to="/pedidos">
                                <button className={estilos["boton-gris"]} type="button">Cancelar</button>
                            </Link>
                        </div>

                    </div>
                    <div className="BotonesPedidos">
                        <div id={estilos["totalpedidos"]}>
                            <p id="skady"><i className={`fa-solid fa-dollar-sign ${estilos["iconosRojos"]}`}></i> Total Pedido</p>
                            <input readOnly id="preciopedido" className={estilos["input-field2"]} type="number"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default EditarPedidos;
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