import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import "./../Layout.css";
import estilos from './Ordenes.module.css'
import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function OrdenesProduccion() {
    const [usuarios, setUsuarios] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);
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
            const { id_orden_de_produccion, descripcion_orden, fecha_orden, id_usuario } = orden;
            return [id_orden_de_produccion, descripcion_orden, fecha_orden, id_usuario];
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
        }

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
            const ordenesResponse = await fetch('http://localhost:8082/orden/orden_produccion');
            const usuariosResponse = await fetch('http://localhost:8082/configuracion/usuarios');

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
                    <Link to="/agregarOrdenes">
                        <button className={` ${estilos.botonAgregar}`}><i className="fa-solid fa-plus"></i> Agregar</button>
                    </Link>
                    <button
                        style={{ color: "white" }}
                        className={`boton ${estilos.vinotinto}`}
                        onClick={generarPDF}
                    >
                        <i className="fa-solid fa-download"></i>
                    </button>
                </div>
            </div>

            <div className={estilos["tabla"]}>
                <DataTable columns={columns} data={filteredOrdenes} pagination paginationPerPage={6} highlightOnHover customStyles={customStyles} defaultSortField="id_orden_de_produccion" defaultSortAsc={true}></DataTable>
            </div>
        </div>
    );
}

export default OrdenesProduccion;
