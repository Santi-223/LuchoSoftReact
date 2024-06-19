import React, { useState, useEffect } from "react";
import moment from "moment";
import estilos from '../Ventas/Ventas.module.css';
import '../../Layout.css';
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import Modal from '../../Modal';
import styled from 'styled-components';



const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [estadoModal2, cambiarEstadoModal2] = useState(false);
    const [idproducto, setIdproducto] = useState({});
    const [clienteEditar, setClienteEditar] = useState([]);
    const [listarProductos1, setlistarProductos] = useState([]);



    const fetchVenta = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas/pedidos');
            if (response.ok) {
                const data = await response.json();
                const ventaData = data.filter(venta => venta.estado_pedido === 3 || venta.estado_pedido === 4).map(venta => ({
                    id_pedido: venta.id_pedido,
                    observaciones: venta.observaciones,
                    fecha_venta: venta.fecha_venta,
                    fecha_pedido: venta.fecha_pedido,
                    estado_pedido: venta.estado_pedido,
                    total_venta: venta.total_venta,
                    total_pedido: venta.total_pedido,
                    id_cliente: venta.id_cliente,
                    id_usuario: venta.id_usuario
                }));
                setVentas(ventaData);
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
    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    useEffect(() => {
        if (ventas.length > 0) {
            setIsLoading(false);
        }
    }, [ventas]);

    const filteredVentas = ventas.filter(venta =>
        venta.id_pedido.toString().includes(filtro) ||
        venta.observaciones.toLowerCase().includes(filtro.toLowerCase()) ||
        venta.fecha_venta.includes(filtro) ||
        venta.total_venta.toString().includes(filtro)
    );

    const estadoMapping = {
        3: 'Habilitado',
        4: 'Inhabilitado'
        // Add more state values here as needed
    };

    const columns = [
        {
            name: "Número de venta",
            selector: (row) => row.id_pedido,
            sortable: true
        },
        {
            name: "Observación",
            selector: (row) => row.observaciones,
            sortable: true
        },
        {
            name: "Fecha de la venta",
            selector: (row) => moment(row.fecha_venta).format("DD/MM/YYYY"),
            sortable: true
        },
        {
            name: "Precio de la venta",
            selector: (row) => row.total_venta,
            sortable: true
        },
        {
            name: "Estado",
            selector: (row) => estadoMapping[row.estado_pedido],
            sortable: true,
            cell: (row) => (
                <button className={`${row.estado_pedido === 3 && estilos['estado3-button']} ${row.estado_pedido === 4 && estilos['Estado4-button']}`}>{estadoMapping[row.estado_pedido]}</button>
            )
        },
        {
            name: "Accion",
            cell: (row) => (
                <div>
                    {
                        row.estado_pedido === 3 ? (
                            <div className={estilos['acciones']}>
                                <label className={estilos["switch"]}>
                                    <input type="checkbox" onChange={() => CambiarEstadoVenta(row)} />
                                    {row.estado_pedido === 3 ? (
                                        <span className={`${row.estado_pedido == 3 && estilos['slider2']}`}></span>
                                    ) : (
                                        <span className={`${row.estado_pedido !== 3 && estilos['slider']}`}></span>
                                    )}
                                    <span className={`${row.estado_pedido == 3 && estilos['slider2']} ${row.estado_pedido !== 3 && estilos['slider']}`}></span>

                                </label>
                                <abbr title="Ver detalle">
                                    <button onClick={() => { cambiarEstadoModal2(!estadoModal2); setIdproducto({ id_producto: row.id_pedido }); listarpedidosProductos(row.id_pedido); listarClienteAsociado(row.id_cliente); }}>
                                        <i className={`fa-regular fa-eye iconosAzules`}></i>
                                    </button>
                                </abbr>
                            </div>
                        ) : (
                            <div className={estilos['acciones']}>
                                <label className={estilos["switch"]}>
                                    <input type="checkbox" onChange={() => CambiarEstadoVenta(row)} />
                                    {row.estado_pedido === 3 ? (
                                        <span className={`${row.estado_pedido == 3 && estilos['slider2']}`}></span>
                                    ) : (
                                        <span className={`${row.estado_pedido !== 3 && estilos['slider']}`}></span>
                                    )}
                                    <span className={`${row.estado_pedido == 3 && estilos['slider2']} ${row.estado_pedido !== 3 && estilos['slider']}`}></span>

                                </label>
                                <abbr title="Ver detalle">
                                    <button >
                                        <i className={`fa-regular fa-eye`} style={{color: 'gray'}}></i>
                                    </button>
                                </abbr>
                            </div>
                        )
                    }


                </div>
            )
        }
    ]

    useEffect(() => {
        listarpedidosProductos();
    }, []);
    const [pedidoProductos1, setPedidoProductos] = useState([]);


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

    const CambiarEstadoVenta = async (row) => {
        Swal.fire({
            title: '¿Deseas cambiar el estado de la venta?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const nuevoEstado = row.estado_pedido === 3 ? 4 : 3;

                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/pedidos/${row.id_pedido}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...row,
                            estado_pedido: nuevoEstado
                        })

                    });
                    if (response.ok) {
                        fetchVenta();
                    } else {
                        console.error('Error al actualizar el estado del usuario');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del usuario:', error);
                }
            }
        });
    }

    const exportExcel = (customFileName) => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(ventas);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, customFileName || 'Ventas');
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
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }
    return (
        <>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />

            <div id={estilos["titulo"]}>
                <h1>Ventas</h1>
            </div>
            <div className={estilos["botones"]}>
                <input type="text" placeholder="Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                <div>
                    <button style={{ backgroundColor: 'white', border: '1px solid #c9c6c675', borderRadius: '50px', marginTop: '-10px', cursor: 'pointer' }} onClick={() => exportExcel('Reporte_Ventas')}> <img src="src\assets\excel-logo.png" height={'40px'} /> </button>
                </div>
            </div>
            <div className={estilos['tabla']}>
                <DataTable columns={columns} data={filteredVentas} pagination highlightOnHover customStyles={customStyles} defaultSortField="id_producto" defaultSortAsc={true} />
            </div>
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
                    <div className="">
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
                        <table>
                            <thead>
                                <tr>
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
                        </table>



                    </div>
                </Contenido>
            </Modal>

        </>
    )
}

export default Ventas;

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
