import React from 'react';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import estilos from '../Pedidos/Pedidos.module.css';
import DataTable from 'react-data-table-component';
import moment from "moment";
import styled from 'styled-components';
import Swal from 'sweetalert2';
import Modal from '../../Modal';

const Pedidos = () => {
    const [Pedidos, setPedidos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [estadoModal1, cambiarEstadoModal1] = useState(false);
    const [estadoModal2, cambiarEstadoModal2] = useState(false);
    const [clienteEditar, setClienteEditar] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [scrollEnabled, setScrollEnabled] = useState(false);

    const [selectedRow, setSelectedRow] = useState({
        observaciones: '',
        fecha_venta: '',
        fecha_pedido: '',
        estado_pedido: 0,
        total_venta: '',
        total_pedido: '',
        id_cliente: '',
        id_usuario: ''
    });
    const [pedidoProductos1, setPedidoProductos] = useState([]);
    const [listarProductos1, setlistarProductos] = useState([]);
    const [idproducto, setIdproducto] = useState({});
    const [selectedClient, setSelectedClient] = useState(null);


    //Función para mapear la api de pedidos
    const fetchPedido = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas/pedidos');
            if (response.ok) {
                const data = await response.json();
                const pedidoData = data.filter(pedido => pedido.estado_pedido !== 3 && pedido.estado_pedido !== 4).map(pedido => ({
                    id_pedido: pedido.id_pedido,
                    observaciones: pedido.observaciones,
                    fecha_venta: pedido.fecha_venta,
                    fecha_pedido: pedido.fecha_pedido,
                    estado_pedido: pedido.estado_pedido,
                    total_venta: pedido.total_venta,
                    total_pedido: pedido.total_pedido,
                    id_cliente: pedido.id_cliente,
                    id_usuario: pedido.id_usuario
                }));


                setPedidos(pedidoData);
            } else {
                console.error('Error al obtener las venta');
            }
        } catch (error) {
            console.error('Error al obtener las venta:', error);
        }
    };
    useEffect(() => {
        fetchPedido();
    }, []);
    //Función para filtrar los datos de la  tabla de pedido 
    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    useEffect(() => {
        if (Pedidos.length > 0) {
            setIsLoading(false);
        }
    }, [Pedidos]);

    const filteredPedidos = Pedidos.filter(pedido =>
        pedido.id_cliente.toString().includes(filtro) ||
        pedido.observaciones.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.total_pedido.toString().includes(filtro)
    );
    //Función para poder renombrar los estados del pedido
    const estadoMapping = {
        1: 'Pendiente',
        2: 'Cancelado',
        3: 'Vendido',
        // Add more state values here as needed
    };

    const columns = [
        {
            name: "Observaciones",
            selector: (row) => row.observaciones,
            sortable: true
        },
        {
            name: "Total del pedido",
            selector: (row) => row.total_pedido,
            sortable: true
        },
        {
            name: "Fecha del pedido",
            selector: (row) => moment(row.fecha_pedido).format('DD/MM/YYYY'),
            sortable: true
        },
        {
            name: 'Cliente',
            selector: (row) => row.id_cliente,
            sortable: true
        },
        {
            name: "Estado",
            selector: (row) => estadoMapping[row.estado_pedido],
            sortable: true,
            cell: (row) => (
                <button className={`${row.estado_pedido === 1 && estilos['estado1-button']} ${row.estado_pedido === 2 && estilos['estado2-button']} ${row.estado_pedido === 3 && estilos['estado3-button']}`}>{estadoMapping[row.estado_pedido]}</button>
            )
        },
        {
            name: 'Acciones',
            cell: (row) => (
                <div>
                    {row.estado_pedido == 1 ? (
                        <div className={estilos['acciones']}>
                            <abbr title="Ver detalle">
                                <button onClick={() => { cambiarEstadoModal2(!estadoModal2); setIdproducto({ id_producto: row.id_pedido }); listarpedidosProductos(row.id_pedido); listarClienteAsociado(row.id_cliente); }}>
                                    <i className={`fa-regular fa-eye `} style={{color: '#1A008E'}}></i>
                                </button>
                            </abbr>
                            <abbr title="Cambiar Estado">
                                <button name="estado_pedido" id={estilos.estado_pedido} onClick={() => { setSelectedRowId(row.id_pedido); setSelectedRow(row); cambiarEstadoModal1(!estadoModal1) }}><i className={`fa-solid fa-shuffle ${estilos.cambiarestado}`}></i></button>
                            </abbr>
                            <Link to={`/editarpedidos/${row.id_pedido}`}>
                                <button><i className={`fa-solid fa-pen-to-square iconosNaranjas`} ></i></button>
                            </Link>
                        </div>
                    ) : (
                        <div className={estilos['acciones']}>
                            <abbr title="Ver detalle">
                                <button ><i className={`bi-eye-slash cerrado ${estilos.estado_pedido_negro}`}></i></button>
                            </abbr>
                            <button name="estado_pedido" id={estilos.estado_pedido_negro}><i className={`fa-solid fa-shuffle ${estilos.estado_pedido_negro}`}></i></button>
                            <button><i className={`fa-solid fa-pen-to-square ${estilos.icono_negro}`} ></i></button>
                        </div>
                    )}
                </div>
            )
        }
    ]
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
    //Función para cambiar el estado
    const handleEstadoPedidos = async (selectedRowId, selectedRow, event) => {
        event.preventDefault();
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cambiar el estado del Pedido?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const nuevoEstado = parseInt(event.target.value, 10);
                    //función para acceder al selectedRowId
                    const id = selectedRowId;
                    const row = selectedRow;
                    console.log(`Updating pedido with ID ${id} to status ${nuevoEstado}`);
                    console.log(row);
                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/pedidos/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...row,
                            estado_pedido: nuevoEstado,
                        })
                    });
                    if (response.ok) {
                        console.log('Pedido actualizado exitosamente.');
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
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
                        setTimeout(() => {
                            window.location.href = '/#/pedidos';
                            cambiarEstadoModal1(false)
                        }, 1000);
                        fetchPedido()
                    } else {
                        console.error('Error al actualizar el estado del pedido');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del pedido:', error);
                }
            }
        });
    };

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
        // setFormChanged(true);
    };
    useEffect(() => {
        listarpedidosProductos();
    }, []);

    const listarpedidosProductos = async (id_pedido) => {
        console.log('El id del pedido es', id_pedido);
        try {
            const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/pedidos_productos/pedidos/${id_pedido}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setPedidoProductos(data)
                console.log('Los productos del pedido es', pedidoProductos1);
            } else {
                console.error('Error al obtener pedidos_productos');
            }
        } catch (error) {
            console.error('Error al obtener pedidos_productos:', error);
        }
    }
    useEffect(() => {
        listarClienteAsociado();
    }, []);

    const listarClienteAsociado = async (id_cliente) => {
        console.log('El id del cliente es:_ ', id_cliente);
        try {
            const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/clientes/${id_cliente}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setClienteEditar(data)
            } else {
                console.log('Error al obtener el cliente')
            }
        } catch (error) {
            console.log('Error al obtener Cliente asociado')
        }
    }

    const exportExcel = (customFileName) => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(Pedidos);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, customFileName || 'Pedidos');
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

    //función para el estilo del header de la tabla
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
    };

    const totalSubtotal = pedidoProductos1.reduce((total, producto) => total + producto.subtotal, 0);

    if (isLoading) {
        return <div>Cargando...</div>;
    }
    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />
            <div className={estilos["titulo"]}>
                <h1>Pedidos</h1>
            </div>
            <div className={estilos["botones"]}>
                <input type="text" placeholder="Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos['busqueda']} />
                <div>
                    <Link to="/agregarPedidos">
                        <button className={`${estilos["botonAgregar"]} bebas-neue-regular`} ><i class="fa-solid fa-plus"></i> Agregar</button>
                    </Link>
                    <button style={{ backgroundColor: 'white', border: '1px solid #c9c6c675', borderRadius: '50px', marginTop: '-20px' }} onClick={() => exportExcel('Reporte_Pedidos')}> <img src='../../excel-logo.png' height={'40px'} /> </button>
                </div>
            </div>
            <div className={estilos["tabla"]}>
                <DataTable columns={columns} data={filteredPedidos} pagination paginationPerPage={5} highlightOnHover customStyles={customStyles} defaultSortField="id_producto" defaultSortAsc={true}></DataTable>
            </div>
            <Modal
                estado={estadoModal1}
                cambiarEstado={cambiarEstadoModal1}
                titulo="Cambiar Estado"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'300px'}
                padding={'20px'}
                selectedRowId={selectedRowId}
                selectedRow={selectedRow}
            >
                <Contenido>
                    <div>
                        <div className={estilos.estado}>
                            <p>Cancelado</p>
                            <button type='submit' value={2} onClick={(event) => { handleEstadoPedidos(selectedRowId, selectedRow, event) }}>Seleccionar</button>
                        </div>
                        <div className={estilos.estado}>
                            <p>Vendido</p>
                            <button type='submit' value={3} onClick={(event) => { handleEstadoPedidos(selectedRowId, selectedRow, event) }}>Seleccionar</button>
                        </div>
                    </div>
                </Contenido>
            </Modal>
            <Modal
                estado={estadoModal2}
                cambiarEstado={cambiarEstadoModal2}
                titulo='Detalle Pedido'
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'500px'}
                padding={'10px'}
            >
                <Contenido>
                    <div >
                        <h3>Cliente Asociado</h3>
                        <p>
                            {
                                clienteEditar.map(cliente => {
                                    return (
                                        <div key={cliente.id_cliente}>
                                            <p>Nombre: {cliente.nombre_cliente}</p>
                                            <p>Documento: {cliente.id_cliente}</p>
                                            <p>Teléfono: {cliente.telefono_cliente}</p>
                                        </div>
                                    );
                                })
                            }
                        </p>
                        <h3>Productos del Pedido</h3>
                        <div style={{ overflowY: scrollEnabled ? 'scroll' : 'auto', height: '50vh', marginTop: '-15px' }}>
                            <table>
                                <thead>
                                    <tr style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                        <th>Productos</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidoProductos1.map(producto => {
                                        const productoInfo = listarProductos1.find(p => p.id_producto === producto.id_producto);
                                        return (
                                            <tr key={producto.id_pedidoProducto}>
                                                <td>{productoInfo ? productoInfo.nombre_producto : 'Producto no encontrado'}</td>
                                                <td>{producto.cantidad_producto}</td>
                                                <td>${producto.subtotal}</td>
                                            </tr>
                                        );
                                    })}

                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2" style={{ padding: '8px', borderTop: '2px solid #ddd', textAlign: 'right' }}>
                                            Total:
                                        </td>
                                        <td style={{ padding: '8px', borderTop: '2px solid #ddd' }}>
                                        ${Math.round(totalSubtotal)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>



                    </div>
                </Contenido>
            </Modal>
        </>
    )
}
export default Pedidos;

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

