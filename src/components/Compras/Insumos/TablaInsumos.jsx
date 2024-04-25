import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import '../../Layout.css';
import estilos from './TablaInsumos.module.css'
import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";
import Modal from './modal';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


function Insumos() {
    const token = localStorage.getItem('token');
    const [insumos, setinsumos] = useState([]);
    const [estadoModaleditar, cambiarEstadoModalEditar] = useState(false);
    const [categoria_insumo, setCategoria_insumo] = useState([]);
    const [insumos1, setinsumos1] = useState({
        nombre_insumo: '',
        unidadesDeMedida_insumo: '',
        stock_insumo: '',
        estado_insumo: 1,
        id_categoria_insumo: '',
    });
    const [insumosEditar, setInsumosEditar] = useState({
        nombre_insumo: '',
        unidadesDeMedida_insumo: '',
        stock_insumo: '',
        estado_insumo: 1,
        id_categoria_insumo: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [estadoModalAgregar, cambiarEstadoModalAgregar] = useState(false);
    const tableRef = useRef(null);
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    const filteredinsumos = insumos.filter(insumo =>
        insumo.id_insumo.toString().includes(filtro) ||
        insumo.nombre_insumo.toString().toLowerCase().includes(filtro) ||
        insumo.unidadesDeMedida_insumo.toString().toLowerCase().includes(filtro) ||
        insumo.stock_insumo.toString().includes(filtro) ||
        insumo.nombre_categoria.toString().toLowerCase().includes(filtro) ||
        insumo.estado_insumo.toString().includes(filtro)

    );

    const generarPDF = () => {
        const doc = new jsPDF();
    
        // Encabezado del PDF
        doc.text("Reporte de Insumos", 20, 10);
    
        // Definir las columnas que se mostrarán en el informe
        const columnasInforme = [
            "Id",
            "Nombre",
            "Medida",
            "Stock",
            "Categoría"
        ];
    
        // Filtrar los datos de los insumos para incluir solo las columnas deseadas
        const datosInforme = filteredinsumos.map(insumo => {
            const { id_insumo, nombre_insumo, unidadesDeMedida_insumo, stock_insumo, nombre_categoria } = insumo;
            return [id_insumo, nombre_insumo, unidadesDeMedida_insumo, stock_insumo, nombre_categoria];
        });
    
        // Agregar la tabla al documento PDF
        doc.autoTable({
            startY: 20,
            head: [columnasInforme],
            body: datosInforme
        });
    
        // Guardar el PDF
        doc.save("reporte_insumos.pdf");
    };
    


    const columns = [
        {
            name: "Id",
            selector: (row) => row.id_insumo,
            sortable: true
        },

        {
            name: "Nombre",
            selector: (row) => row.nombre_insumo,
            sortable: true,

        },
        {
            name: "Medida",
            selector: (row) => row.unidadesDeMedida_insumo,
            sortable: true
        },
        {
            name: "Stock",
            selector: (row) => row.stock_insumo,
            sortable: true
        },
        {
            name: "Categoría",
            selector: (row) => row.nombre_categoria,
            sortable: true
        },
        {
            name: "Estado",
            cell: (row) => (

                <div className={estilos["acciones"]}>
                    <button className={estilos.boton} onClick={() => handleEstadoinsumo(row.id_insumo, row.estado_insumo)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
                        {row.estado_insumo === 1 ? (
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

                    <button onClick={() => {
                        if (row.estado_insumo === 1) { // Verifica si el estado es activo
                            cambiarEstadoModalEditar(!estadoModaleditar);
                            setInsumosEditar(row);
                        }
                    }} className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        <i className={`fa-solid fa-pen-to-square ${row.estado_insumo === 1 ? 'iconosVerdes' : 'iconosGris'}`}></i>
                    </button>

                </div>
            )
        },

    ]

    useEffect(() => {
        fetchinsumos();
    }, []);

    useEffect(() => {
        if (insumos.length > 0) {
            setIsLoading(false);
        }
    }, [insumos]);

    useEffect(() => {
        const fetchCategoria_insumo = async () => {
            try {
                const response = await fetch('http://localhost:8082/compras/categoria_insumos');
                if (response.ok) {
                    const data = await response.json();
                    const categoria_insumoFiltrados = data.map(categoria_insumo => ({
                        id_categoria_insumos: categoria_insumo.id_categoria_insumos,
                        nombre_categoria_insumos: categoria_insumo.nombre_categoria_insumos,
                        estado_categoria_insumos: categoria_insumo.estado_categoria_insumos,
                    }));
                    setCategoria_insumo(categoria_insumoFiltrados);
                } else {
                    console.error('Error al obtener las compras');
                }
            } catch (error) {
                console.error('Error al obtener las compras:', error);
            }
        };

        fetchCategoria_insumo();
    }, []);


    const handleEditarChange = (event) => {
        const { name, value } = event.target;
        setInsumosEditar(previnsumos => ({
            ...previnsumos,
            [name]: value
        }));
    };
    
    const handleSubmitEditar = async (event) => {
        event.preventDefault();
        
        // Validar que se haya seleccionado una categoría de insumo
        if (!insumosEditar.id_categoria_insumo) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor selecciona una categoría de insumo',
            });
            return; // Detener la ejecución si no se seleccionó una categoría
        }
        
        console.log(insumos);
        
    
    
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar la información del insumo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8082/compras/insumos/${insumosEditar.id_insumo}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        },
                        body: JSON.stringify(insumosEditar)
                    });
    
                    if (response.ok) {
                        console.log('insumo actualizado exitosamente.');
                        Swal.fire({
                            icon: 'success',
                            title: 'insumo actualizado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            window.location.href = '/insumos';
                        }, 2000);
                        // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
                    } else {
                        console.error('Error al actualizar el insumo:', response.statusText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar el insumo',
                        });
                    }
                } catch (error) {
                    console.error('Error al actualizar el insumo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al actualizar el insumo',
                    });
                }
            }
        });
    };
    
    const handleAgregarClick = () => {
        // Verificar si hay categoría de insumos con estado en 1
        const categoriasActivas = categoria_insumo.some(categoria => categoria.estado_categoria_insumos === 1);
    
        if (!categoriasActivas) {
            // Mostrar mensaje de error si no hay categorías activas
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay categorías de insumos activas',
            });
        } else {
            // Si hay categorías activas, cambiar el estado del modal de agregar
            cambiarEstadoModalAgregar(!estadoModalAgregar);
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log('insumo a enviar: ', insumos1)


            const responseInsumos = await fetch('http://localhost:8082/compras/insumos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify(insumos1)
            });

            if (responseInsumos.ok) {
                console.log('Insumo creado exitosamente.');

                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    window.location.href = '/insumos';
                }, 2000);


            } else {
                console.error('Error al crear el insumo:', responseInsumos.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al crear el insumo',
                });
            }
        } catch (error) {
            console.error('Error al crear el insumo:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setinsumos1(previnsumos => ({
            ...previnsumos,
            [name]: value
        }));
    };

    const fetchinsumos = async () => {
        try {
            const response = await fetch('http://localhost:8082/compras/insumos');
            if (response.ok) {
                const data = await response.json();
                const insumosFiltrador = data.map(insumo => ({
                    id_insumo: insumo.id_insumo,

                    nombre_insumo: insumo.nombre_insumo,
                    unidadesDeMedida_insumo: insumo.unidadesDeMedida_insumo,
                    stock_insumo: insumo.stock_insumo,
                    nombre_categoria: insumo.nombre_categoria,
                    estado_insumo: insumo.estado_insumo,
                }));
                setinsumos(insumosFiltrador);
            } else {
                console.error('Error al obtener las insumos');
            }
        } catch (error) {
            console.error('Error al obtener las insumos:', error);
        }
    };




    const handleEstadoinsumo = async (idinsumo, estadoinsumo) => {
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
                    const nuevoEstado = estadoinsumo === 1 ? 0 : 1;

                    const response = await fetch(`http://localhost:8082/compras/estadoInsumo/${idinsumo}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        },
                        body: JSON.stringify({
                            estado_insumo: nuevoEstado
                        })
                    });

                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de insumos
                        fetchinsumos();
                    } else {
                        console.error('Error al actualizar el estado del usuario');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado del usuario:', error);
                }
            }
        });
    };

    const customStyles = {
        headCells: {
            style: {
                textAlign: 'center',
                backgroundColor: '#E7E7E7',
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
                <h1>Insumos</h1>
            </div>

<br />


<div className={estilos['divFiltro']}>
    <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
    <div>
    <button onClick={handleAgregarClick} className={` ${estilos.botonAgregar}`}>
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
                <DataTable columns={columns} data={filteredinsumos} pagination paginationPerPage={6} highlightOnHover customStyles={customStyles} defaultSortField="id_insumo" defaultSortAsc={true}></DataTable>
            </div>

            <Modal
                estado={estadoModalAgregar}
                cambiarEstado={cambiarEstadoModalAgregar}
                titulo="Registar"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'500px'}
                padding={'20px'}
            >
                <Contenido>

                    <form onSubmit={handleSubmit}>
                        <div id={estilos.contenedorsito}>
                            <div id={estilos.contInput}>
                                <br />
                                <br />
                                <br />
                                <div className={estilos["inputIdNombre"]}>
                                    <div>
                                        <p id={estilos.textito}>  Nombre</p>
                                        <input
                                            id={estilos.nombreinsumo}
                                            className={estilos["inputnombre"]}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_insumo'
                                            value={insumos.nombre_insumo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={estilos["espacio"]}></div>
                                    

                                    <div id={estilos.telefonoproveedor}>
                                        <p id={estilos.textito} >  Stock</p>
                                        <input
                                            className={estilos["inputstock"]}
                                            type="text"
                                            placeholder="000"
                                            name='stock_insumo'
                                            value={insumos.stock_insumo}
                                            onChange={handleChange}
                                        />
                                    </div>

                                   
                                </div>
                                <br />
                                <div className={estilos["inputIdNombre"]}>

                                <div id={estilos.documentoproveedor}>
                                        <p id={estilos.textito} >  Unidad de medida</p>
                                        <select
                                            className={estilos["input2"]}
                                            name="unidadesDeMedida_insumo"
                                            id={estilos.unidadesDeMedida_insumo_input}
                                            value={insumos.unidadesDeMedida_insumo}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled selected>Seleccionar unidad de medida</option>
                                            <option value="kilogramos">Kilogramo</option>
                                            <option value="litros">Litro</option>
                                            <option value="piezas">Pieza</option>
                                            <option value="gramos">Gramos</option>
                                            <option value="miligramos">Miligramos</option>
                                            <option value="mililitros">Mililitro</option>
                                            <option value="toneladas">Tonelada</option>
                                        </select>
                                    </div>


                                 
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito}>  Categoría insumo</p>
                                        <select
    className={estilos["input2"]}
    name="id_categoria_insumo" // Utiliza el mismo nombre que el campo id_rol
    id={estilos.id_categoria_insumos_input} // Cambia el id para que sea único
    value={insumos.id_categoria_insumos}
    onChange={handleChange}
>
    <option value="" disabled selected>Seleccionar categoría</option>
    {categoria_insumo
        .filter(categoria => categoria.estado_categoria_insumos === 1) // Filtrar las categorías con estado 1
        .map(categoria => (
            <option key={categoria.id_categoria_insumos} value={categoria.id_categoria_insumos}>
                {categoria.nombre_categoria_insumos}
            </option>
        ))}
</select>

                                    </div>
                              


                                </div>
                            </div>


                        </div>
                        <center>
                            <div className={estilos["cajaBotones"]}>
                                <button onclick="registrar()" className={estilos.azulado3} type="submit"><p style={{ marginLeft: "-10px" }}> Guardar</p> </button>
                                <div className={estilos["espacioEntreBotones"]}></div>
                                <button style={{ color: "white", }} onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)} className={estilos.gris} type="button"> <p style={{ marginLeft: "-13px" }}> Cancelar</p></button>
                            </div>
                        </center>
                    </form>
                </Contenido>
            </Modal>

            <Modal
                estado={estadoModaleditar}
                cambiarEstado={cambiarEstadoModalEditar}
                titulo="Actualizar"
                mostrarHeader={true}
                mostrarOverlay={true}
                posicionModal={'center'}
                width={'500px'}
                padding={'20px'}
            >
                <Contenido>

                    <form onSubmit={handleSubmitEditar}>
                    <div id={estilos.contenedorsito}>
                            <div id={estilos.contInput}>
                                <br />
                                <br />
                                <br />
                                <div className={estilos["inputIdNombre"]}>
                                    <div>
                                        <p id={estilos.textito}>  Nombre</p>
                                        <input
                                            id={estilos.nombreinsumo}
                                            className={estilos["inputnombreeditado"]}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_insumo'
                                            value={insumosEditar.nombre_insumo}
                                            onChange={handleEditarChange}
                                        />
                                    </div>
                                    <div className={estilos["espacio2"]}></div>
    


                                </div>
                                <br />
                                <div className={estilos["inputIdNombre"]}>
                                <div id={estilos.documentoproveedor}>
                                        <p id={estilos.textito} >  Unidad de medida</p>
                                        <select
                                            className={estilos["input2"]}
                                            name="unidadesDeMedida_insumo"
                                            id={estilos.unidadesDeMedida_insumo_input}
                                            value={insumosEditar.unidadesDeMedida_insumo}
                                            onChange={handleEditarChange}
                                        >
                                            <option value="" disabled selected>Seleccionar unidad de medida</option>
                                            <option value="kilogramos">Kilogramo</option>
                                            <option value="litros">Litro</option>
                                            <option value="piezas">Pieza</option>
                                            <option value="gramos">Gramos</option>
                                            <option value="miligramos">Miligramos</option>
                                            <option value="mililitros">Mililitro</option>
                                            <option value="toneladas">Tonelada</option>
                                        </select>
                                    </div>
                                    <div className={estilos["espacio2"]}></div>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito}>  Categoría insumo</p>
                                        <select
    className={estilos["input2"]}
    name="id_categoria_insumo"
    id={estilos.id_categoria_insumos_input}
    value={insumosEditar.id_categoria_insumo} // Aquí se debe usar insumosEditar.id_categoria_insumo
    onChange={handleEditarChange}
>

    <option value="" disabled selected>Seleccionar categoría</option>
    {categoria_insumo
        .filter(categoria => categoria.estado_categoria_insumos === 1) // Filtrar las categorías con estado 1
        .map(categoria => (
            <option key={categoria.id_categoria_insumos} value={categoria.id_categoria_insumos}>
                {categoria.nombre_categoria_insumos}
            </option>
        ))}
</select>

                                    </div>
                              


                                </div>
                            </div>



                        </div>

                      
                        <center>
                            <div className={estilos["cajaBotones"]}>
                            <button onClick={() => registrar()} className={estilos.azulado3} type="submit"><p style={{ marginLeft: "-10px" }}> Guardar</p> </button>

                                <div className={estilos["espacioEntreBotones"]}></div>
                                <button style={{color: "white"}} onClick={() => cambiarEstadoModalEditar(!estadoModaleditar)} className={estilos.gris} type="button"> <p style={{ marginLeft: "-13px" }}> Cancelar</p></button>
                            </div>
                        </center>
                    </form>
                </Contenido>
            </Modal>
        </div>
    );
}

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
		font-size: 18px;
		margin-bottom: 20px;
	}

	img {
		width: 100%;
		vertical-align: top;
		border-radius: 3px;
	}
`;
export default Insumos;
