import React, { useState, useEffect, useRef } from 'react';
import './registroOrdenes.css';
import { Outlet, Link } from "react-router-dom";
import { Table, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useUserContext } from "../UserProvider";



function AgregarOrdenes() {
    const { usuario } = useUserContext();

    const usuarioLO = usuario;

    const [insumos, setInsumos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [precio, setPrecio] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const [orden, setOrden] = useState({
        id_orden_de_produccion: '',
        descripcion_orden: '',
        fecha_orden: '',
        id_usuario: usuarioLO.id_usuario
    });
    const [usuarios, setUsuarios] = useState([]);
    const tableRef = useRef(null);
    const [tableRows, setTableRows] = useState([{ id: '', cantidad: '', cantidad_seleccionada: 0 }]);
    const [precioTotal, setPrecioTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [insumosPerPage] = useState(5);
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const [selectedInsumos, setSelectedInsumos] = useState(new Set());
    const [formChanged, setFormChanged] = useState(false);

    useEffect(() => {
        fetchInsumos();
        fetchUsuarios();
    }, []);

    useEffect(() => {
        if (insumos.length > 0) {
            setIsLoading(false);
        }
    }, [insumos]);

    const handleDeleteRow = (index) => {
        const updatedRows = [...tableRows];
        const deletedInsumo = updatedRows[index].nombre;
        updatedRows.splice(index, 1);
        setTableRows(updatedRows);

        setSelectedInsumos(prevSelected => {
            prevSelected.delete(deletedInsumo);
            return new Set(prevSelected);
        });
        setFormChanged(true);
    };

    const fetchInsumos = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/compras/insumos');
            if (response.ok) {
                const data = await response.json();
                const insumosConSeleccion = data.map(insumo => ({ ...insumo, seleccionado: false, cantidad: 0, precio_unitario: 0 }));
                setInsumos(insumosConSeleccion);
            } else {
                console.error('Error al obtener los insumos');
            }
        } catch (error) {
            console.error('Error al obtener los insumos:', error);
        }
    };



    const fetchUsuarios = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/usuarios');
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            } else {
                console.error('Error al obtener los usuarios');
            }
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name !== 'search') {
            setOrden({ ...orden, [name]: value });
            setFormChanged(true);
        }
    };
    const filteredInsumos = insumos.filter(insumo =>
        insumo.nombre_insumo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleSelectChange = (event, index) => {
        const { value } = event.target;
        if (selectedInsumos.has(value)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Este insumo ya ha sido seleccionado',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }

        const updatedRows = tableRows.map((row, rowIndex) => {
            if (rowIndex === index) {
                const selectedInsumo = insumos.find(insumo => insumo.nombre_insumo === value);
                return { ...row, nombre: value, insumoId: selectedInsumo.id_insumo };
            }
            return row;
        });

        setTableRows(updatedRows);
        setSelectedInsumos(prevSelected => new Set(prevSelected.add(value)));
        setFormChanged(true);
    };

    const handleCantidadChange = (event, index) => {
        const { value } = event.target;
        // Verificar si el valor ingresado es negativo
        if (parseFloat(value) <= 0) {
            // Mostrar un mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad no puede ser negativa o igual a cero',
                confirmButtonColor: '#1F67B9',
            });
            return; // Salir de la función sin hacer cambios
        }
        const updatedRows = tableRows.map((row, rowIndex) => {
            if (rowIndex === index) {
                const cantidad = parseFloat(value) || 0;
                return { ...row, cantidad: value, cantidad_seleccionada: cantidad };
            }
            return row;
        });
        setTableRows(updatedRows);
    
        setFormChanged(true);
    };
    

    const handleSubmitOrden = async (event) => {
        event.preventDefault();
        const regex = /^[a-zA-Z0-9.,?!¡¿\s]+$/; // Expresión regular para permitir letras, números y algunos caracteres especiales

        // Verificar caracteres especiales en el campo de fecha y usuario
        if (!regex.test(orden.descripcion_orden)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Evita caracteres especiales en el campo de descripción.',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }

        const invalidInsumos = tableRows.filter(row => {
            const insumo = insumos.find(i => i.nombre_insumo === row.nombre);
            return insumo && parseFloat(row.cantidad) > insumo.stock_insumo;
        });

        if (invalidInsumos.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `La cantidad de ${invalidInsumos.map(insumo => insumo.nombre).join(', ')} excede el stock disponible`,
                confirmButtonColor: '#1F67B9',
            });
            return;
        }



        if (!orden.fecha_orden || tableRows.some(row => !row.nombre || !row.cantidad)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hay campos vacíos',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }


        Swal.fire({
            icon: 'success',
            title: '',
            text: 'Orden registrada',
            showConfirmButton: false,
            timer: 2000,
        }).then(async () => {
            try {
                // Primero, creamos la orden de producción
                const responseOrden = await fetch('https://api-luchosoft-mysql.onrender.com/orden/orden_produccion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...orden })
                });

                if (!responseOrden.ok) {
                    console.error('Error al enviar los datos de la orden');
                    return;
                }

                const ordenData = await responseOrden.json();
                const idOrden = ordenData.id_orden_de_produccion;

                console.log('Orden registrada correctamente:', ordenData, "id_orden_de_produccion: ", idOrden);

                // Luego, insertamos los detalles de la orden (insumos)
                const ordenesInsumosPromises = tableRows.filter(row => row.nombre !== '').map(async (row) => {
                    const insumoId = insumos.find(insumo => insumo.nombre_insumo === row.nombre).id_insumo;
                    const ordenesInsumosData = {
                        id_orden_de_produccion: idOrden,
                        id_insumo: insumoId,
                        cantidad_insumo_orden_insumos: parseFloat(row.cantidad) || 0,
                        descripcion_orden_insumos: orden.descripcion_orden // Usamos la descripción de la orden como descripción del insumo en la tabla orden_insumos
                    };

                    try {
                        const responseOrdenesInsumos = await fetch('https://api-luchosoft-mysql.onrender.com/orden/orden_insumo', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(ordenesInsumosData)
                        });

                        if (!responseOrdenesInsumos.ok) {
                            console.error('Error al enviar los datos de orden_insumo:', responseOrdenesInsumos.statusText);
                        } else {
                            console.log('Insumo registrado correctamente:', ordenesInsumosData);
                        }
                    } catch (error) {
                        console.error('Error al enviar los datos de orden_insumo:', error);
                    }
                });

                await Promise.all(ordenesInsumosPromises);

                // Una vez que se han registrado todos los detalles de la orden, redireccionamos a la página de órdenes de producción
                window.location.href = '/#/ordenes_produccion';
            } catch (error) {
                console.error('Error al enviar los datos:', error);
            }
        });
    };


    const handleCancel = () => {
        if (formChanged) {
            Swal.fire({
                title: '¿Desea cancelar el registro de la orden?',
                text: 'Los datos ingresados se perderán.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/#/ordenes_produccion';
                }
            });
        } else {
            window.location.href = '/#/ordenes_produccion';
        }
    };

    if (isLoading) {
        return <div>Cargando, por favor espere...</div>;
    }

    const indexOfLastInsumo = currentPage * insumosPerPage;
    const indexOfFirstInsumo = indexOfLastInsumo - insumosPerPage;
    const currentInsumos = filteredInsumos.slice(indexOfFirstInsumo, indexOfLastInsumo);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredInsumos.length / insumosPerPage); i++) {
        pageNumbers.push(i);
    }

    const addTableRow = () => {
        const newRow = { nombre: '', cantidad: '' };
        setTableRows([...tableRows, newRow]);
        setFormChanged(true);
    };

    return (
        <div className='contenido-2' style={{ overflowX: 'hidden' }}>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
            <form onSubmit={(event) => handleSubmitOrden(event)}>
                <div className='contenido-' >
                    <div className='formulario'>
                        <div>
                            <h1 id="titulo">Órdenes de producción</h1>
                        </div><br />

                            <div className='inputs-up'>
                                <div className='contenedor-input' >
                                    <label style={{ marginLeft: "-130px" }} htmlFor="fechaCompra"> Fecha</label>
                                    <p>Fecha</p>
                                    <input
                                        id="fechaCompra"
                                        name="fecha_orden"
                                        className="input-field"
                                        value={orden.fecha_orden}
                                        onChange={handleInputChange}
                                        type="date"
                                        style={{ width: "270px", height: "40px" }}

                                    />
                                </div>


                            </div><br /><br />
                            <div className='contenedor-input' >
                                <label style={{ marginLeft: "-130px" }} htmlFor="fechaCompra"> Descripción</label>
                                <p>Descripción</p>
                                <textarea
                                    id="fechaCompra"
                                    name="descripcion_orden"
                                    className=""
                                    value={orden.descripcion_orden}
                                    onChange={handleInputChange}
                                    cols="33" rows="4"
                                    type="text"
                                    style={{ resize: 'none' }}
                                />
                            </div><br />
                            <div id="kaka">
                                <p>Usuario</p>
                                <select
                                    id="proveedor"
                                    name="id_usuario"
                                    className="input-field2"
                                    style={{ width: "270px", height: "40px" }}
                                    value={orden.id_usuario}
                                    readOnly={true}
                                    onChange={handleInputChange}>
                                    <option value="">{usuario.nombre_usuario}</option>

                                </select>
                            </div>
                            <br /><br />
                            <div className='inputs-up'>
                                <div className='contenedor-input'>
                                    <button className='boton azulado2' type="button" onClick={addTableRow}><center>+ Insumo</center></button>
                                </div>
                            </div>
                        </div>



                    <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid black' }} />
                    <div className='tabla-detalle' style={{ overflowY: scrollEnabled ? 'scroll' : 'auto', maxHeight: '400px' }}>
                        <table className="tablaDT ui celled table" style={{ width: "70%", marginTop: "10%" }} ref={tableRef}>
                            <thead className="rojo thead-fixed">
                                <tr>
                                    <th style={{ textAlign: "left", backgroundColor: '#1F67B9', color: "white" }}> Nombre Insumo</th>
                                    <th style={{ textAlign: "left", backgroundColor: '#1F67B9', color: "white" }}> Cantidad</th>
                                    <th style={{ textAlign: "left", backgroundColor: '#1F67B9', color: "white" }}></th>

                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: "center" }}>
                                            <select className="input-field-tabla" value={row.nombre} onChange={(e) => handleSelectChange(e, index)}>
                                                <option value="">Seleccione un insumo</option>
                                                {filteredInsumos.map((insumo) => (
                                                    <option key={insumo.id_insumo} value={insumo.nombre_insumo}>
                                                        {insumo.nombre_insumo}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ textAlign: "center" }}><input className="input-field-tabla" style={{ width: "100px" }} type="number" onChange={(e) => handleCantidadChange(e, index)} /></td>
                                        {index !== 0 && (
                                            <td style={{ textAlign: "center" }}>
                                                <button className='bot-x' type="button" onClick={() => handleDeleteRow(index)}>X</button>
                                            </td>

                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <br />
                <div style={{ marginRight: "200px" }} className="cajaBotones">
                    <button type="submit" id="can" className="boton azulado3"><center>Guardar</center></button>
                    <button style={{ color: "white" }} type="button" className="boton gris" onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}
export default AgregarOrdenes;