import React, { useState, useEffect } from "react";
import moment from "moment";
import estilos from '../Ventas/Ventas.module.css';
import '../../Layout.css';
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';


const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const fetchVenta = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas/pedidos');
            if (response.ok) {
                const data = await response.json();
                const ventaData = data.filter(venta => venta.estado_pedido === 3 || venta.estado_pedido === 4).map(venta => ({
                    id_pedido: venta.id_pedido,
                    observaciones: venta.observaciones,
                    fecha_venta: venta.fecha_venta,
                    fecha_pedido:venta.fecha_pedido,
                    estado_pedido: venta.estado_pedido,
                    total_venta: venta.total_venta,
                    total_pedido: venta.total_pedido,
                    id_cliente : venta.id_cliente,
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
            selector: (row)=>estadoMapping[row.estado_pedido],
            sortable: true,
            cell : (row) =>(
                <button className={`${row.estado_pedido ===3 && estilos['estado3-button']} ${row.estado_pedido ===4 && estilos['Estado4-button']}`}>{estadoMapping[row.estado_pedido]}</button>
            )
        },
        {
            name: "Accion",
            cell: (row) => (
                <div>
                    <label className={estilos["switch"]}>
                        <input type="checkbox" onChange={() => CambiarEstadoVenta(row)}/>
                        {row.estado_pedido ===3 ? (
                            <span className={`${row.estado_pedido == 3 && estilos['slider2']}`}></span>
                        ):(
                            <span className={`${row.estado_pedido !==3 && estilos['slider']}`}></span>
                        )}
                        4e<span className={`${row.estado_pedido == 3 && estilos['slider2']} ${row.estado_pedido !==3 && estilos['slider']}`}></span>                        
                    </label>
                </div>
            )
        }
    ]

    const CambiarEstadoVenta= async(row)=>{
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

    if (isLoading) {
        return <div>Cargando...</div>;
    }
    return (
        <>
        
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

            <div id={estilos["titulo"]}>
                <h1>Ventas</h1>
            </div>
            <div className={estilos["botones"]}>
                <input type="text" placeholder="Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                <div>
                <button style={{backgroundColor:'white', border:'1px solid #c9c6c675', borderRadius:'50px', marginTop: '-10px', cursor:'pointer'}} onClick={() => exportExcel('Reporte_Ventas')}> <img src="src\assets\excel-logo.png" height={'40px'}/> </button>
                </div>
            </div>
            <div className={estilos['tabla']}>
                <DataTable columns={columns} data={filteredVentas} pagination highlightOnHover />
            </div>

        </>
    )
}

export default Ventas;