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
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState({
        observaciones: '',
        fecha_venta: '',
        fecha_pedido: '',
        estado_pedido: 0,
        total_venta: '',
        total_pedido: '',
        id_cliente: '',
        id_usuario: ''
    })
    //Función para mapear la api de pedidos
    const fetchPedido = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas/pedidos');
            if (response.ok) {
                const data = await response.json();
                const pedidoData = data.filter(pedido => pedido.estado_pedido !== 3 && pedido.estado_pedido !== 4).map(pedido => ({
                    id_pedido: pedido.id_pedido,
                    observaciones: pedido.observaciones,
                    fecha_venta: (pedido.fecha_venta),
                    fecha_pedido: (pedido.fecha_pedido),
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
        pedido.id_pedido.toString().includes(filtro) ||
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
                    {row.estado_pedido ==1 ? (
                        <div className={estilos['acciones']}>
                            <abbr title="Cambiar Estado">
                                <button name="estado_pedido" id={estilos.estado_pedido} onClick={() => { setSelectedRowId(row.id_pedido); setSelectedRow(row); cambiarEstadoModal1(!estadoModal1) }}><i className={`fa-solid fa-shuffle ${estilos.cambiarestado}`}></i></button>
                            </abbr>
                            <Link to={`/editarpedidos/${row.id_pedido}`}>
                                <button><i className={`fa-solid fa-pen-to-square iconosNaranjas`} ></i></button>
                            </Link>
                            <abbr title="Ver detalle">
                                <button onClick={()=>cambiarEstadoModal2(!estadoModal2)}><i className={`fa-regular fa-eye ${estilos.icono_negro}`}></i></button>
                            </abbr>
                        </div>
                    ) : (
                        <div className={estilos['acciones']}>
                            <button name="estado_pedido" id={estilos.estado_pedido_negro}><i className={`fa-solid fa-shuffle ${estilos.estado_pedido_negro}`}></i></button>
                            <button><i className={`fa-solid fa-pen-to-square ${estilos.icono_negro}`} ></i></button>
                            <abbr title="Ver detalle">
                                <button onClick={()=>{cambiarEstadoModal2(!estadoModal2)}}><i className={`fa-regular fa-eye ${estilos.icono_negro}`}></i></button>
                            </abbr>
                        </div>
                    ) }
                </div>                
            )
        }
    ]      
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
                    <button style={{backgroundColor:'white', border:'1px solid #c9c6c675', borderRadius:'50px', marginTop: '-20px'}}> <img src="src\assets\excel-logo.png" height={'40px'}/> </button>
                </div>
            </div>
            <div className={estilos["tabla"]}>
                <DataTable columns={columns} data={filteredPedidos} pagination paginationPerPage={5} highlightOnHover></DataTable>
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
                            <p>Pendiente</p>
                            <button type='button' value={1} onClick={(event) => { handleEstadoPedidos(selectedRowId, selectedRow, event) }}>Seleccionar</button>
                        </div>
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
                    <div>
                        <div>
                            <p>Cliente:</p>
                            
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

