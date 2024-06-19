import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import estilos from './Productos.module.css'
import "./../../Layout.css";
import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const imagen = "https://www.bing.com/images/search?view=detailV2&ccid=1mJgu55%2f&id=C5DB30A04093DFACC3C38D88CA89A6C8104CC71F&thid=OIP.1mJgu55_hbMwEz0WksTa4AHaHa&mediaurl=https%3a%2f%2fcdn.icon-icons.com%2ficons2%2f2568%2fPNG%2f512%2fimages_picture_icon_153719.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.d66260bb9e7f85b330133d1692c4dae0%3frik%3dH8dMEMimicqIjQ%26pid%3dImgRaw%26r%3d0&exph=512&expw=512&q=icnoo+d+imagen&simid=607996730800216546&FORM=IRPRST&ck=E29C5C26BA4A2B86E80160EC0EFCD8FD&selectedIndex=3&itb=1"


function Productos() {
    const token = localStorage.getItem("token");
    const [productos, setproductos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [detalleProducto, setDetalleProducto] = useState(null);
    const tableRef = useRef(null);
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    const filteredproductos = productos.filter(producto =>
        (producto.id_producto && producto.id_producto.toString().includes(filtro)) ||
        (producto.imagen_producto && producto.imagen_producto.toString().includes(filtro)) ||
        (producto.nombre_producto && producto.nombre_producto.toString().toLowerCase().includes(filtro)) ||
        (producto.descripcion_producto && producto.descripcion_producto.toString().toLowerCase().includes(filtro)) ||
        (producto.estado_producto && producto.estado_producto.toString().includes(filtro)) ||
        (producto.precio_producto && producto.precio_producto.toString().includes(filtro)) ||
        (producto.id_categoria_producto && producto.id_categoria_producto.toString().includes(filtro))
    );



    const exportExcel = (customFileName) => {
        // Filtra los productos para incluir solo aquellos con estado 1
        const productosHabilitados = productos.filter(producto => producto.estado_producto === 1);

        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(productosHabilitados);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, customFileName || 'productos');
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


    const handleMostrarDetalle = (producto) => {
        setDetalleProducto(producto); // Establece los datos de la fila seleccionada
        setShowDetalleModal(true); // Muestra el modal
    };

    const formatearDinero = (cantidad) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cantidad);
    };



    const columns = [
        {
            name: "Id",
            selector: (row) => row.id_producto,
            sortable: true
        },
        {
            name: "Imagen",
            cell: (row) => (
                <img src={row.imagen_producto ? row.imagen_producto : 'https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180'} style={{ width: '70px', height: '60px' }} />
            ),
            sortable: true
        },
        {
            name: "Nombre",
            selector: (row) => row.nombre_producto,
            sortable: true,

        },

        {
            name: "Precio",
            selector: (row) => formatearDinero(row.precio_producto),
            sortable: true
        },
        {
            name: "Categoría",
            selector: (row) => row.nombre_categoria_producto,
            sortable: true
        },
        {
            name: "Estado",
            cell: (row) => (

                <div className={estilos["acciones"]}>

                    <button className={estilos.boton} onClick={() => handleEstadoproducto(row.id_producto, row.estado_producto)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
                        {row.estado_producto === 1 ? (
                            <i className="bi bi-toggle-on" style={{ color: "#48110d" }}></i>
                        ) : (
                            <i className="bi bi-toggle-off" style={{ width: "60px", color: "black" }}></i>
                        )}
                    </button>

                </div>

            )
        },
        {
            name: "Acciones",
            cell: (row) => (

                <div className={estilos["acciones"]}>

                    <button onClick={() => {
                        if (row.estado_producto === 1) { // Solo abre el modal si el estado es activo
                            handleMostrarDetalle(row)
                        }
                    }} className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
                        <i className={`bi ${row.estado_producto === 0 ? 'bi-eye-slash cerrado' : 'bi-eye'}`} style={{ color: row.estado_producto === 0 ? "gray" : "#1A008E", pointerEvents: row.estado_producto === 0 ? "none" : "auto" }}></i>
                    </button>

                    <button onClick={() => {
                        if (row.estado_producto === 1) { // Verifica si el estado es activo
                            window.location.href = `/#/editarProductos/${row.id_producto}`;
                        }
                    }} className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        <i className={`fa-solid fa-pen-to-square ${row.estado_producto === 1 ? 'iconosNaranjas' : 'iconosGris'}`}></i>
                    </button>

                    <button
                        onClick={() => handleEliminarProducto(row.id_producto)}
                        disabled={row.estado_producto === 0}
                        className={estilos.boton}
                        style={{ cursor: "pointer", textAlign: "center", fontSize: "25px" }}
                    >
                        <i
                            className={`bi bi-trash ${row.estado_producto === 0 ? "basuraDesactivada" : ""
                                }`}
                            style={{ color: row.estado_producto === 0 ? "gray" : "red" }}
                        ></i>
                    </button>

                </div>

            )
        },

    ]

    useEffect(() => {
        fetchproductos();
    }, []);

    useEffect(() => {
        if (productos.length > 0) {
            setIsLoading(false);
        }
    }, [productos]);
    const fetchproductos = async () => {
        try {
            const [productosResponse, categoriasResponse] = await Promise.all([
                fetch('https://api-luchosoft-mysql.onrender.com/ventas2/productos'),
                fetch('https://api-luchosoft-mysql.onrender.com/ventas2/categoria_productos') // Suponiendo que esta es la ruta para obtener las categorías
            ]);

            if (productosResponse.ok && categoriasResponse.ok) {
                const [productosData, categoriasData] = await Promise.all([
                    productosResponse.json(),
                    categoriasResponse.json()
                ]);

                const productosFiltrador = productosData.map(producto => {
                    const categoria = categoriasData.find(cat => cat.id_categoria_productos === producto.id_categoria_producto);
                    return {
                        ...producto,
                        nombre_categoria_producto: categoria ? categoria.nombre_categoria_productos : 'Sin categoría'
                    };
                });

                setproductos(productosFiltrador);
            } else {
                console.error('Error al obtener los productos o las categorías');
            }
        } catch (error) {
            console.error('Error al obtener los productos o las categorías:', error);
        }
    };


    const handleEliminarProducto = async (idProducto) => {
        console.log("Intentando eliminar el producto con ID:", idProducto);
    
        try {
            // Verificar si el producto tiene pedidos asociados
            const pedidosResponse = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas/pedidos_productos/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!pedidosResponse.ok) {
                const errorText = await pedidosResponse.text();
                console.error("Error al verificar pedidos asociados:", pedidosResponse.status, errorText);
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Error al verificar pedidos asociados: ${pedidosResponse.statusText}`,
                });
                return;
            }
    
            const pedidos = await pedidosResponse.json();
    
            const tienePedidosAsociados = pedidos.some(pedido => pedido.id_producto === idProducto);
    
            if (tienePedidosAsociados) {
                await Swal.fire({
                    icon: "warning",
                    title: "No se puede eliminar",
                    text: "El producto tiene pedidos asociados y no puede ser eliminado.",
                });
                return;
            }
    
            // Mostrar mensaje de confirmación
            const { isConfirmed } = await Swal.fire({
                text: "¿Deseas eliminar este producto?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });
    
            if (!isConfirmed) return;
    
            console.log("Confirmación recibida para eliminar el producto.");
    
            // Solicitud DELETE
            const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas2/productos/${idProducto}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            // Manejo de la respuesta
            if (response.ok) {
                console.log("Producto eliminado exitosamente.");
                await Swal.fire({
                    icon: "success",
                    title: "Producto eliminado",
                    text: "El producto ha sido eliminado correctamente",
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchproductos();
            } else {
                const errorText = await response.text();
                console.error("Error al eliminar el producto:", response.status, errorText);
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Error al eliminar el producto: ${response.statusText}`,
                });
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: `Error al eliminar el producto: ${error.message}`,
            });
        }
    };
    
    
    
    
    




    const handleEstadoproducto = async (idproducto, estadoproducto) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cambiar el estado del producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const nuevoEstado = estadoproducto === 1 ? 0 : 1;

                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas2/estadoProducto/${idproducto}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            estado_producto: nuevoEstado
                        })
                    });

                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de insumos
                        fetchproductos();
                    } else {
                        console.error('Error al actualizar el estado del producto');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del producto:', error);
                }
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

    // Resto del código...

    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />
            <div>
                <h1>Productos</h1>
                <br /><br />
                <div className={estilos.botones}>
                    <div>


                    </div>

                </div>
            </div>

            <br /><br /><br />

            <div className={estilos['divFiltro']}>
                <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                <div>
                    <Link to="/agregarProductos">
                        <button className={` ${estilos.botonAgregar} ${estilos.rojo} bebas-neue-regular`}><i className="fa-solid fa-plus"></i> Agregar</button>

                    </Link>

                    <button style={{ backgroundColor: 'white', border: '1px solid #c9c6c675', borderRadius: '50px', marginTop: '-10px', cursor: 'pointer' }} onClick={() => exportExcel('Reporte_Productos')}> <img src='../../excel-logo.png' height={'40px'} /> </button>

                </div>
            </div>


            <div className={estilos["tabla"]} style={{ maxWidth: '100%', overflowX: 'auto' }}> {/* Aplicar estilos CSS al contenedor de la tabla */}
                <DataTable columns={columns} data={filteredproductos} pagination paginationPerPage={5} highlightOnHover customStyles={customStyles} defaultSortField="id_producto" defaultSortAsc={true}></DataTable>
            </div>

            <Modal
                className={estilos["modal"]}
                show={showDetalleModal}
                onHide={() => setShowDetalleModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Datos del producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Muestra los datos de la fila seleccionada */}
                    {detalleProducto && (
                        <div>
                            <p>ID: {detalleProducto.id_producto}</p>
                            <p>Nombre: {detalleProducto.nombre_producto}</p>
                            <p>Descripción: {detalleProducto.descripcion_producto}</p>
                            <p>
                                Precio: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(detalleProducto.precio_producto)}
                            </p>
                            <p>Categoría: {detalleProducto.nombre_categoria_producto}</p>
                            {/* Muestra más detalles si es necesario */}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );

}
export default Productos;
