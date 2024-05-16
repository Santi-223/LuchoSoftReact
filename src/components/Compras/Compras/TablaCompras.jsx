import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate  } from "react-router-dom";
import $ from 'jquery';
import '../../Layout.css';
import estilos from './tablaCompras.module.css'
import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Compras() {
    const [showModal, setShowModal] = useState(false);
    const [compraSeleccionada, setCompraSeleccionada] = useState(null);
    const [insumos, setInsumos] = useState([]);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [detalleCompra, setDetalleCompra] = useState(null);
    const [proveedores, setProveedores] = useState([]);
    const [isLoadingInsumos, setIsLoadingInsumos] = useState(true);
    const [isLoadingProveedores, setIsLoadingProveedores] = useState(true);
    const token = localStorage.getItem('token');
    const [compras, setCompras] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);
    const navigate = useNavigate();
    const [filtro, setFiltro] = useState('');
    const [showMainDataModal, setShowMainDataModal] = useState(false);


    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    const filteredCompras = compras.filter(compra =>
        compra.id_compra.toString().includes(filtro) ||
        compra.numero_compra.toString().includes(filtro) ||
        compra.fecha_compra.toString().includes(filtro) ||
        compra.total_compra.toString().includes(filtro)||
        compra.nombre_proveedor.toString().toLowerCase().includes(filtro)||
        compra.estado_compra.toString().includes(filtro)
    );
    useEffect(() => {
        fetchProveedores();
    }, []);

    const fetchProveedores = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/compras/proveedores/', {
                headers: {
                    'token': token
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProveedores(data); // Establecer los insumos en el estado
            } else {
                console.error('Error al obtener los proveedores');
            }
            setIsLoadingProveedores(false);
        } catch (error) {
            console.error('Error al obtener los proveedores:', error);
        }
    };

    useEffect(() => {
        fetchInsumos();
    }, []);

    const fetchInsumos = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/compras/insumos/', {
                headers: {
                    'token': token
                }
            });
            if (response.ok) {
                const data = await response.json();
                setInsumos(data); // Establecer los insumos en el estado
            } else {
                console.error('Error al obtener los insumos');
            }
            setIsLoadingInsumos(false);
        } catch (error) {
            console.error('Error al obtener los insumos:', error);
        }
    };

    const getNombreInsumoById = (idInsumo) => {
        const insumo = insumos.find(insumo => insumo.id_insumo === idInsumo);
        return insumo ? insumo.nombre_insumo : 'Insumo no encontrado';
    };
    

    const handleAgregarCompra = () => {
        const insumosConEstado1 = insumos.filter(insumo => insumo.estado_insumo === 1);
        const ProveedoresConEstado1 = proveedores.filter(proveedor => proveedor.estado_proveedor === 1);
        if (insumosConEstado1.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay insumos disponibles para agregar una compra',
                confirmButtonColor: '#1F67B9',
            });


        }else if (ProveedoresConEstado1.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay proveedores disponibles para agregar una compra',
                confirmButtonColor: '#1F67B9',
            });
        }
        
        else {
            // Redireccionar al usuario a la página de registro de compra
            navigate('/registrarCompra');
        }
    };

    const handleMostrarCompra = async (idCompra) => {
        try {
            const response = await fetch(`https://api-luchosoft-mysql.onrender.com/compras/compras/${idCompra}`);
            const data = await response.json();
            if (response.ok) {
                // Establecer la compra seleccionada como un objeto individual
                setCompraSeleccionada(data);
                setShowMainDataModal(true);
            } else {
                console.error('Error al obtener la compra:', data.error);
            }
        } catch (error) {
            console.error('Error al obtener la compra:', error);
        }
    };
    
    
    

    const generarPDF = () => {
        const doc = new jsPDF();
    
        // Encabezado del PDF
        doc.text("Reporte de Compras", 20, 10);
    
        // Definir las columnas que se mostrarán en el informe (excluyendo "Estado")
        const columnasInforme = [
            "Id",
            "Número",
            "Fecha",
            "Total compra",
            "Proveedor"
        ];
    
        // Filtrar los datos de las compras para incluir solo las columnas deseadas
        const datosInforme = filteredCompras.map(compra => {
            const { id_compra, numero_compra, fecha_compra, total_compra, nombre_proveedor } = compra;
            return [id_compra, numero_compra, fecha_compra, total_compra, nombre_proveedor];
        });
    
        
        // Agregar la tabla al documento PDF
        doc.autoTable({
            startY: 20,
            head: [columnasInforme],
            body: datosInforme
        });
    
        // Guardar el PDF
        doc.save("reporte_compras.pdf");
    };


    const handleMostrarDetalle = (compra) => {
        setDetalleCompra(compra); // Establece los datos de la fila seleccionada
        setShowDetalleModal(true); // Muestra el modal
    };

    const handleMostrarDetalles = async (idCompra) => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/compras/compras_insumos/');
            const data = await response.json();
            
            // Filtrar los datos para obtener solo los objetos con el id_compra deseado
            const comprasInsumos = data.filter(item => item.id_compra === idCompra);
    
            if (comprasInsumos.length > 0) {
                // Mostrar el modal con los detalles de la compra seleccionada
                setCompraSeleccionada(comprasInsumos);
                setShowModal(true);
            } else {
                console.log("No se encontraron insumos para la compra con el ID especificado.");
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };
    
    
    

    const columns = [
        {
            name : "Id",
            selector: (row)=>row.id_compra,
            sortable: true
        },
        {
            name : "Número",
            selector: (row)=>row.numero_compra,
            sortable: true
        },
        {
            name : "Fecha",
            selector: (row)=>row.fecha_compra,
            sortable: true,
            
        },
        {
            name : "Total compra",
            selector: (row)=>row.total_compra,
            sortable: true
        },
        {
            name: "Proveedor",
            selector: (row) => row.nombre_proveedor,
            sortable: true,

        },
        {
            name: "Estado",
            cell: (row) => (
                <div className={estilos["acciones"]}>
                    <button className={estilos.boton} onClick={() => handleEstadoCompra(row.id_compra, row.estado_compra)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
                        {row.estado_compra === 1 ? (
                            <i className="bi bi-toggle-on" style={{ color: "#1F67B9" }}></i>
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
            <button 
                className={estilos.boton} 
                onClick={() => handleMostrarDetalle(row)} // Llama a la función handleMostrarDetalle y pasa la fila como argumento
                style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}
            >
                <i className="bi bi-eye" style={{ color: "#5F597A" }}></i>
            </button>
            <button 
                className={estilos.boton} 
                onClick={() => handleMostrarDetalles(row.id_compra)} 
                style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}
            >
                <i className="bi bi-info-circle" style={{ color: "#FFA200" }}></i>
            </button>
        </div>
    )
}
    ];
    



    useEffect(() => {
        fetchCompras();
    }, []);

    useEffect(() => {
        if (compras.length > 0) {
            setIsLoading(false);
        }
    }, [compras]);

    const fetchCompras = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/compras/compras');
            if (response.ok) {
                const data = await response.json();
                const comprasFiltrador = data.map(compra => ({
                    id_compra: compra.id_compra,
                    numero_compra: compra.numero_compra,
                    fecha_compra: formatDate(compra.fecha_compra), // Formatear la fecha
                    total_compra: compra.total_compra,
                    nombre_proveedor: compra.nombre_proveedor,
                    estado_compra: compra.estado_compra,
                }));
                setCompras(comprasFiltrador);
            } else {
                console.error('Error al obtener las compras');
            }
        } catch (error) {
            console.error('Error al obtener las compras:', error);
        }
    };


 

    const handleEstadoCompra = async (idCompra, estadoCompra) => {
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
                    const nuevoEstado = estadoCompra === 1 ? 0 : 1;
    
                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/compras/compras/${idCompra}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        },
                        body: JSON.stringify({
                            estado_compra: nuevoEstado
                        })
                    });
    
                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de compras
                        fetchCompras();
                    } else {
                        console.error('Error al actualizar el estado del usuario');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del usuario:', error);
                }
            }
        });
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
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
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />
            <div>
            <h1>Compras</h1>
            </div>
<br />

            <div className={estilos['divFiltro']}>
                <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                <div>
             
                <button onClick={handleAgregarCompra} className={` ${estilos.botonAgregar}`}>
          <i className="fa-solid fa-plus"></i> Agregar
        </button>
                <button
                    style={{ color: "white" }}
                    className={` ${estilos.vinotinto}`}
                    onClick={generarPDF}
                >
                    <i className="fa-solid fa-download"></i>
                </button>
            </div>
            </div>

 
          
            <div className={estilos["tabla"]}>
            <DataTable columns={columns} data={filteredCompras} pagination paginationPerPage={6} highlightOnHover customStyles={customStyles} defaultSortField="id_compra" defaultSortAsc={true}></DataTable>
            </div>



<Modal 
    className={estilos["modal"]} 
    show={showDetalleModal} 
    onHide={() => setShowDetalleModal(false)}
>
    <Modal.Header closeButton>
        <Modal.Title>Datos de la compra</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {/* Muestra los datos de la fila seleccionada */}
        {detalleCompra && (
            <div>
                <p>ID de compra: {detalleCompra.id_compra}</p>
                <p>Número de compra: {detalleCompra.numero_compra}</p>
                <p>Fecha de compra: {detalleCompra.fecha_compra}</p>
                <p>Total de la compra: {detalleCompra.total_compra}</p>
                <p>Proveedor de la compra: {detalleCompra.nombre_proveedor}</p>
                {/* Muestra más detalles si es necesario */}
            </div>
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>Cerrar</Button>
    </Modal.Footer>
</Modal>

            <Modal className={estilos["modal"]} show={showModal} onHide={() => setShowModal(false)}>
                
    <Modal.Header closeButton>
        <Modal.Title>Detalles de la compra</Modal.Title>
    </Modal.Header>
    <Modal.Body>

    {compraSeleccionada && compraSeleccionada.map((compraInsumo, index) => (
    <div key={index} className="objeto-compra">
        <div>
            <p>Insumo: {getNombreInsumoById(compraInsumo.id_insumo)}</p>
            <p>Cantidad: {compraInsumo.cantidad_insumo_compras_insumos}</p>
            <p>Precio: {compraInsumo.precio_insumo_compras_insumos}</p>

            {/* Aquí calculamos el total y lo formateamos */}
            <p>Total: {(compraInsumo.precio_insumo_compras_insumos * compraInsumo.cantidad_insumo_compras_insumos).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
        </div>
        {index < compraSeleccionada.length - 1 && <hr />}
    </div>
))}



    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
    </Modal.Footer>
</Modal>


        </div>
    );
}

export default Compras;
