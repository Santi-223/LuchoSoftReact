import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import $ from 'jquery';
import "./../Layout.css";
import estilos from './Ordenes.module.css'
import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';



function OrdenesProduccion() {
    const [showModal, setShowModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [detalleOrden, setDetalleOrden] = useState(null);
    const [insumos, setInsumos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const token = localStorage.getItem('token');
    const [ordenes, setOrdenes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);
    const navigate = useNavigate();
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    const filteredOrdenes = ordenes.filter(orden =>
        orden.id_orden_de_produccion.toString().includes(filtro) ||
        orden.descripcion_orden.toString().toLowerCase().includes(filtro) ||
        orden.fecha_orden.toString().includes(filtro) ||
        orden.id_usuario.toString().includes(filtro)
    );

    useEffect(() => {
        fetchInsumos();
    }, []);

    const fetchInsumos = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/compras/insumos/', {
                headers: {
                    'token': token // Asegúrate de que 'token' esté definido
                }
            });
            if (response.ok) {
                const data = await response.json();
                setInsumos(data); // Establecer los insumos en el estado
                console.log('Insumos cargados:', data); // Agregar un log para verificar los insumos cargados
            } else {
                console.error('Error al obtener los insumos');
            }
        } catch (error) {
            console.error('Error al obtener los insumos:', error);
        }
    };


    const getNombreInsumoById = (idInsumo) => {
        const insumo = insumos.find(insumo => insumo.id_insumo === idInsumo);
        return insumo ? insumo.nombre_insumo : 'Insumo no encontrado';
    };

    const handleAgregarOrden = () => {
        const insumosConEstado1 = insumos.filter(insumo => insumo.estado_insumo === 1);
        if (insumosConEstado1.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay insumos disponibles para agregar una orden',
                confirmButtonColor: '#1F67B9',
            });

        } else {
            navigate('/agregarOrdenes');
        }
    };



    const generarPDF = () => {
        const doc = new jsPDF();

        // Encabezado del PDF
        doc.text("Reporte de Ordenes de producción", 20, 10);

        // Definir las columnas que se mostrarán en el informe (excluyendo "Estado")
        const columnasInforme = [
            "Id",
            "Descripcion",
            "Fecha",
            "Usuario"
        ];

        // Filtrar los datos de las compras para incluir solo las columnas deseadas
        const datosInforme = filteredOrdenes.map(orden => {
            const { id_orden_de_produccion, descripcion_orden, fecha_orden, nombre_usuario } = orden;
            return [id_orden_de_produccion, descripcion_orden, fecha_orden, nombre_usuario];
        });

        // Agregar la tabla al documento PDF
        doc.autoTable({
            startY: 20,
            head: [columnasInforme],
            body: datosInforme
        });

        // Guardar el PDF
        doc.save("reporte_ordenes.pdf");
    };


    const handleMostrarDetalle = (orden) => {
        setDetalleOrden(orden); // Establece los datos de la fila seleccionada
        setShowDetalleModal(true); // Muestra el modal
    };


    const handleMostrarDetalles = async (idOrden) => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/orden/orden_insumo/');
            const data = await response.json();

            // Filtrar los datos para obtener solo los objetos con el id_compra deseado
            const ordenInsumos = data.filter(item => item.id_orden_de_produccion === idOrden);

            if (ordenInsumos.length > 0) {
                // Mostrar el modal con los detalles de la compra seleccionada
                setOrdenSeleccionada(ordenInsumos);
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
            name: "Id",
            selector: (row) => row.id_orden_de_produccion,
            sortable: true
        },
        {
            name: "Descripción",
            selector: (row) => row.descripcion_orden,
            sortable: true
        },
        {
            name: "Fecha",
            selector: (row) => row.fecha_orden,
            sortable: true,

        },
        {
            name: "Usuario",
            selector: (row) => row.nombre_usuario,
            sortable: true
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

                    <button className={estilos.boton} onClick={() => handleMostrarDetalles(row.id_orden_de_produccion)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
                        <i className="bi bi-info-circle" style={{ color: "#FFA200" }}></i>
                    </button>
                </div>
            )
        },

    ]

    useEffect(() => {
        fetchOrdenes();
    }, []);

    useEffect(() => {
        if (ordenes.length > 0) {
            setIsLoading(false);
        }
    }, [ordenes]);

    const fetchOrdenes = async () => {
        try {
            const ordenesResponse = await fetch('https://api-luchosoft-mysql.onrender.com/orden/orden_produccion');
            const usuariosResponse = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/usuarios');

            if (ordenesResponse.ok && usuariosResponse.ok) {
                const ordenesData = await ordenesResponse.json();
                const usuariosData = await usuariosResponse.json();

                const usuariosMap = usuariosData.reduce((map, usuario) => {
                    map[usuario.id_usuario] = usuario.nombre_usuario;
                    return map;
                }, {});

                const ordenesFiltrador = ordenesData.map(orden => ({
                    id_orden_de_produccion: orden.id_orden_de_produccion,
                    descripcion_orden: orden.descripcion_orden,
                    fecha_orden: formatDate(orden.fecha_orden),
                    id_usuario: orden.id_usuario,
                    nombre_usuario: usuariosMap[orden.id_usuario]
                }));

                setOrdenes(ordenesFiltrador);
                setUsuarios(usuariosData);
            } else {
                console.error('Error al obtener las órdenes de producción');
            }
        } catch (error) {
            console.error('Error al obtener las órdenes de producción:', error);
        }
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
                <h1>Ordenes de producción</h1>
                <div className={estilos.botones}>


                </div>
            </div>


            <br />
            <br /><br /><br /><br />

            <div className={estilos['divFiltro']}>
                <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                <div>
                    <button onClick={handleAgregarOrden} className={` ${estilos.botonAgregar} ${estilos.rojo} bebas-neue-regular`}><i className="fa-solid fa-plus"></i> Agregar</button>

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
                <DataTable columns={columns} data={filteredOrdenes} pagination paginationPerPage={6} highlightOnHover customStyles={customStyles} defaultSortField="id_orden_de_produccion" defaultSortAsc={true}></DataTable>
            </div>
            <Modal
                className={estilos["modal"]}
                show={showDetalleModal}
                onHide={() => setShowDetalleModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Datos de la orden de producción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Muestra los datos de la fila seleccionada */}
                    {detalleOrden && (
                        <div>
                            <p>ID de la orden: {detalleOrden.id_orden_de_produccion}</p>
                            <p>Descripción de la orden: {detalleOrden.descripcion_orden}</p>
                            <p>Fecha de la orden: {detalleOrden.fecha_orden}</p>
                            <p>Usuario de la orden: {detalleOrden.nombre_usuario}</p>
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
                    <Modal.Title>Detalles de la orden</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {ordenSeleccionada && ordenSeleccionada.map((ordenInsumo, index) => (
                        <div key={index} className="objeto-compra">
                            <div>
                                <p>Insumo: {getNombreInsumoById(ordenInsumo.id_insumo)}</p>
                                <p>Cantidad: {ordenInsumo.cantidad_insumo_orden_insumos}</p>
                                <p>Descripcion: {ordenInsumo.descripcion_orden_insumos}</p>
                            </div>
                            {index < ordenSeleccionada.length - 1 && <hr />}
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

export default OrdenesProduccion;
