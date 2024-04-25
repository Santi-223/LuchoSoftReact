import React from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import Modal from '../Clientes/modal';
import styled from "styled-components";
import { useState, useEffect } from "react";
import { event } from "jquery";
import moment from "moment";
import Swal from 'sweetalert2'
import estilos from './Pedidos.module.css';
import { height } from "@fortawesome/free-regular-svg-icons/faAddressBook";


const EditarPedidos = () => {
    const [customers, setClientes] = useState([]);
    const [listarProductos1, setlistarProductos] = useState([])
    const [tableRows, setTableRows] = useState([{ id_producto: 0, precio_unitario: 0, cantidad: '', cantidad_seleccionada: 0, precio_total: 0 }]);
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
        total_pedido: 0,
        total_venta: 0,
        id_cliente: 0,
        id_usuario: 1
    })

    const [clienteEditar, setClienteEditar] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [precioSeleccionado, setPrecioSeleccionado] = useState(0);
    const [precioTotal, setPrecioTotal] = useState(0);
    const handleDeleteNewProduct = (index) => {
        const updatedNewProducts = [...newProducts];
        updatedNewProducts.splice(index, 1);
        setNewProducts(updatedNewProducts);
    };

    useEffect(() => {
        const ListarPedidos = async () => {
            try {
                const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/pedidos/${id_pedido}`);
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
                const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/clientes`);
                if (response.ok) {
                    const data = await response.json();
                    setClienteEditar(data);
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
                const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas2/productos`);
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

    const handleEliminarProducto = async (id_pedidos_productos) => {
        Swal.fire({
            title: '¿Estás seguro de eliminar este producto?',
            text: 'Esta acción no se puede revertir',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/pedidos_productos/${id_pedidos_productos}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });

                    if (response.ok) {
                        console.log("Producto eliminado correctamente");
                        Swal.fire({
                            icon: 'success',
                            title: '',
                            text: 'Producto eliminado correctamente',
                        }).then(() => {
                            // Después de que el usuario haga clic en "OK", recargamos la página
                            setPedidoProductos(pedidoProductos1.filter(producto => producto.id_pedidos_productos !== id_pedidos_productos));
                        });
                    } else {
                        console.error("Error al eliminar el producto:", response.statusText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al eliminar el producto',
                        });
                    }
                } catch (error) {
                    console.error("Error al eliminar el producto:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al eliminar el producto',
                    });
                }
            }
        });
    };


    const fetchVenta = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas/clientes');
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

    const handleChange1 = (event) => {
        const { name, value } = event.target;
        setlistarProductos(prevProducto => ({
            ...prevProducto,
            [name]: value
        }));
    };

    const handleCantidadChange = (event, index) => {
        const { value } = event.target;
        const cantidad = parseFloat(value);

        if (isNaN(cantidad) || cantidad <= 0) {
            return;
        }

        const updatedDetallesPedido = pedidoProductos1.map((detalle, rowIndex) => {
            if (rowIndex === index) {
                const precioTotal = cantidad * detalle.precio_unitario;
                return {
                    ...detalle,
                    cantidad_producto: cantidad,
                    subtotal: precioTotal,
                };
            }
            return detalle;
        });

        setPedidoProductos(updatedDetallesPedido);
        // Aquí podrías también actualizar el precio total si es necesario
        setFormChanged(true);
    };

    const handleCantidadChange2 = (event, index) => {
        const { value } = event.target;
        const cantidad = parseFloat(value);

        if (isNaN(cantidad) || cantidad <= 0) {
            return;
        }

        const updatedRows = tableRows.map((row, rowIndex) => {
            if (rowIndex === index) {
                const precioUnitario = parseFloat(row.precio_unitario) || 0;
                const precioTotal = cantidad * precioUnitario;
                return {
                    ...row,
                    cantidad: value,
                    cantidad_seleccionada: cantidad,
                    precio_total: precioTotal,
                };
            }
            return row;
        });

        setTableRows(updatedRows);

        const total = updatedRows.reduce((accumulator, currentValue) => {
            return accumulator + (parseFloat(currentValue.precio_total) || 0);
        }, 0);

        setPrecioTotal(total);
        setFormChanged(true);

        calculateTotalPrice();
    };

    const addTableRow = () => {
        const newRow = { nombre: '', precio_unitario: '', cantidad: '', cantidad_seleccionada: 0, precio_total: 0 };
        setTableRows([...tableRows, newRow]);
        setFormChanged(true);
        calculateTotalPrice();
    };

    const editarPedido = async (event) => {
        event.preventDefault();
        if (pedidosEditar.fecha_pedido === '' || pedidosEditar.id_cliente === 0 || pedidosEditar.observaciones == '' || tableRows.some((row) => !row.cantidad)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hay campos vacíos',
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

                    const detallespedido2 = pedidosEditar.total_pedido
                    const totalPedido = tableRows.reduce(
                        (total, row) => total + parseFloat(row.precio_total || 0),
                        0
                    );
                    const fechaproductos = pedidosEditar.fecha_pedido
                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/pedidos/${id_pedido}`, {
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
                            window.location.href = '/#/pedidos';
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

    const AgregarPedidoDetalle = async (event) => {
        event.preventDefault();
        if (tableRows.some((row) => !row.cantidad_seleccionada) || tableRows.some((row) => !row.id_producto)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Los campos se encuentran vacíos',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }
        Swal.fire({
            title: '¿Deseas Agregar nuevo producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const detallesPedido = tableRows.map((row) => ({
                        cantidad_producto: parseInt(row.cantidad),
                        id_producto: tableRows.find(
                            (producto) => producto.id_producto === row.id_producto
                        ).id_producto,
                        subtotal: row.precio_unitario * row.cantidad,

                    }));
                    const pedidosProductosPromise = detallesPedido.map(async (detalle) => {
                        const responsePedidosProductos = await fetch(
                            "https://api-luchosoft-mysql.onrender.com/ventas/pedidos_productos",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    ...detalle,
                                    id_pedido: id_pedido,
                                    fecha_pedido_producto: pedidosEditar.fecha_pedido
                                }),
                            });
                        if (!responsePedidosProductos.ok) {
                            console.error(
                                "Error al enviar los datos de pedidos_productos:",
                                responsePedidosProductos.statusText
                            );
                            throw new Error("Error al enviar los datos de pedidos_productos");
                        }
                        Swal.fire({
                            icon: 'success',
                            title: '',
                            text: 'Producto Agregado correctamente',
                        })

                        const productoRegistrado = await responsePedidosProductos.json();
                        console.log("Producto registrado correctamente:", productoRegistrado);
                        
                        setTableRows(tableRows.slice(0, -1).concat({ id_producto: 0, precio_unitario: '', cantidad: '', cantidad_seleccionada: 0, precio_total: 0 }));
                        
                    });
                    await Promise.all(pedidosProductosPromise);

                } catch (error) {
                    console.error('Error al actualizar la tabla de pedidos productos:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al actualizar pedidoProducto',
                    });
                }
            }
        })
    }


    useEffect(() => {
        const listarpedidosProductos = async () => {
            try {
                const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/pedidos_productos/pedidos/${id_pedido}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setPedidoProductos(data)
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
    const handleDeleteRow = (index) => {
        const updatedRows = [...tableRows];
        updatedRows.splice(index, 1);
        setTableRows(updatedRows);///////////////////////////////////////////////////////////////////////////////////

        const total = updatedRows.reduce((accumulator, currentValue) => {
            return accumulator + (parseFloat(currentValue.precio_total) || 0);
        }, 0);


        setPrecioTotal(total);

        setFormChanged(true);
    };

    const handleAgregarProducto = (event, index) => {
        const productId = event.target.value;
        const selectedProduct = listarProductos1.find(product => product.id_producto === parseInt(productId));

        if (selectedProduct) {
            const updatedRows = [...tableRows];
            updatedRows[index] = { ...updatedRows[index], id_producto: selectedProduct.id_producto, precio_unitario: selectedProduct.precio_producto };
            setTableRows(updatedRows);
        }
    };

    const handleSelectChange = (event, index) => {
        const { value } = event.target;

        const selectedProducto = listarProductos1.find(
            (producto) => producto.id_producto.toString() === value
        );

        if (!selectedProducto) {
            return;
        }

        const updatedDetallesPedido = pedidoProductos1.map((detalle, rowIndex) => {
            if (rowIndex === index) {
                return {
                    ...detalle,
                    id_producto: selectedProducto.id_producto,
                    nombre_producto: selectedProducto.nombre_producto,
                    precio_unitario: selectedProducto.precio_producto, // Actualiza el precio del producto seleccionado
                };
            }
            return detalle;
        });

        setPedidoProductos(updatedDetallesPedido);
        setFormChanged(true);
    };

    const handlePrecioChange = (event, index) => {
        const { value } = event.target;
        const precio = parseFloat(value);

        if (isNaN(precio) || precio <= 0) {
            return;
        }

        const updatedDetallesPedido = pedidoProductos1.map((detalle, rowIndex) => {
            if (rowIndex === index) {
                const subtotal = detalle.cantidad_producto * precio;
                return {
                    ...detalle,
                    precio_unitario: precio,
                    subtotal: subtotal,
                };
            }
            return detalle;
        });

        setPedidoProductos(updatedDetallesPedido);
        // Aquí podrías también actualizar el precio total si es necesario
        setFormChanged(true);
    };

    const calculateTotalPrice = () => {
        const totalPrice = tableRows.reduce((accumulator, currentValue) => {
            const price = parseFloat(currentValue.precio_unitario) || 0;
            const quantity = parseFloat(currentValue.cantidad) || 0;
            return accumulator + price * quantity;
        }, 0);

        setPrecioTotal(totalPrice);
    };
    useEffect(() => {
        const total = tableRows.reduce((accumulator, currentValue) => {
            return accumulator + (parseFloat(currentValue.precio_total) || 0);
        }, 0);

        setPrecioTotal(total);

        const totalPedido = pedidoProductos1.reduce((acc, curr) => acc + curr.subtotal, 0);
        setpedidostEditar({ ...pedidosEditar, total_pedido: totalPedido });
    }, [tableRows, pedidoProductos1]);



    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
            />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div classNameName={estilos["contenido2"]}>
                <div id={estilos["titulo2"]}>
                    <h2>Editar Pedido</h2>
                </div>
                <div id={estilos["contenedorcito"]}>
                    <div className={estilos["input-container"]}>

                        <div id={estilos["kaka"]}>
                            <p id="skad">Fecha del Pedido</p>
                            <input id="fecha_pedido" className={estilos["input-field"]} name="fecha_pedido" type="date" value={pedidosEditar.fecha_pedido.slice(0, 10)} onChange={handleChange} />
                        </div>
                        <div id={estilos["kake"]}>
                            <p id="skady">Descripción del Pedido</p>
                            <textarea name="observaciones" id="descripcion" cols="5" rows="4" value={pedidosEditar.observaciones} onChange={handleChange}></textarea>
                            {/* <input id="descripcion" className={estilos["input-field2"]} type="text" value={pedidosEditar.observaciones} onChange={handleChange} /> */}
                        </div>
                        <div id={estilos["cliente"]}>
                            <p>Cliente asociado</p>
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
                        <div className="BotonesPedidos">
                            <div id={estilos["totalpedidos"]}>
                                <p id="skady"> Total Pedido</p>
                                <input readOnly id="preciopedido" className={estilos["input-field2"]} type="number" value={(pedidosEditar.total_pedido + precioTotal)}
                                />
                            </div>

                        </div>
                    </div>
                    <div className={estilos["TablaDetallePedidos"]}>
                        <div className={estilos["agrPedidos"]}>
                            <p>Agregar Productos</p>
                            <button className="btn btn-primary fa-solid fa-plus" style={{ height: '30px' }} onClick={addTableRow}></button>
                        </div>
                        <div style={{ overflowY: scrollEnabled ? 'scroll' : 'auto', maxHeight: '300px' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{
                                            textAlign: "center",
                                            backgroundColor: "#1F67B9",
                                            color: "white",
                                        }}>Nombre</th>
                                        <th style={{
                                            textAlign: "center",
                                            backgroundColor: "#1F67B9",
                                            color: "white",
                                        }}> Precio</th>
                                        <th style={{
                                            textAlign: "center",
                                            backgroundColor: "#1F67B9",
                                            color: "white",

                                        }}>Cantidad</th>
                                        <th style={{
                                            textAlign: "center",
                                            backgroundColor: "#1F67B9",
                                            color: "white",
                                        }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidoProductos1.map((detalle, index) => (

                                        <tr key={detalle.id_pedidos_productos}>
                                            <td>
                                                <select
                                                    name={`producto-${index}`}
                                                    value={detalle.id_producto}
                                                    onChange={(event) => handleSelectChange(event, index)}
                                                >
                                                    <option value="">Seleccione un producto</option>
                                                    {listarProductos1.map((producto) => (
                                                        <option key={producto.id_producto} value={producto.id_producto}>
                                                            {producto.nombre_producto}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    name={`precio-${index}`}
                                                    value={listarProductos1.find(producto => producto.id_producto === detalle.id_producto)?.precio_producto || ''}
                                                    readOnly // El precio del producto no debe ser editable desde aquí
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    name={`cantidad-${index}`}
                                                    value={detalle.cantidad_producto || ''}
                                                    onChange={(e) => handleCantidadChange(e, index)}
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-danger fa-solid fa-trash" style={{ height: '30px', width: '40px', fontSize: '15px', borderRadius: '30px' }} onClick={() => handleEliminarProducto(detalle.id_pedidos_productos)}></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {tableRows.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                <select name="id_producto" value={row.id_producto} onChange={(event) => handleAgregarProducto(event, index)}>
                                                    <option value="">Seleccione un producto</option>
                                                    {listarProductos1.map((producto) => (
                                                        <option value={producto.id_producto}>{producto.nombre_producto}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input type="text" readOnly className="inputPrecio" value={row.precio_unitario} />
                                            </td>
                                            <td>
                                                <input type="number" value={row.cantidad} onChange={(event) => handleCantidadChange2(event, index)} />
                                            </td>
                                            <td style={{ display: "flex" }}>
                                                <button className="btn btn-success fa-solid fa-check" style={{ height: '30px', width: '40px', fontSize: '15px', borderRadius: '30px', marginRight: '5px' }} onClick={AgregarPedidoDetalle}></button>
                                                <button onClick={() => handleDeleteRow(index)} className="btn btn-danger fa-solid fa-trash" style={{ height: '30px', width: '40px', fontSize: '15px', borderRadius: '30px' }}></button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className={estilos["cajaBotonesRPedidos"]}>
                    <button type='submit' onClick={editarPedido} className={estilos["boton-azul"]} >Guardar</button>

                    <Link to="/pedidos">
                        <button className={estilos["boton-gris"]} type="button">Cancelar</button>
                    </Link>
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