import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import "./../../Layout.css";
import estilos from './Cat-productos.module.css'
import Swal from 'sweetalert2';
import Modal from './modal';
import styled from 'styled-components';
import DataTable from "react-data-table-component";

function CategoriasProductos() {
    const [categorias, setcategoria] = useState([]);
    const [estadoModaleditar, cambiarEstadoModalEditar] = useState(false);
    const [categorias1, setCategorias1] = useState({
        nombre_categoria_productos: '',
        estado_categoria_productos: 1
    });
    const [categoriasEditar, setCategoriasEditar] = useState({
        nombre_categoria_productos: '',
        estado_categoria_productos: 1
    });
    const [isLoading, setIsLoading] = useState(true);
    const [estadoModalAgregar, cambiarEstadoModalAgregar] = useState(false);

    const tableRef = useRef(null);
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };
    const filteredcategorias = categorias.filter(categoria =>
        categoria.id_categoria_productos.toString().includes(filtro) ||
        categoria.nombre_categoria_productos.toString().toLowerCase().includes(filtro) ||
        categoria.estado_categoria_productos.toString().includes(filtro)
    );

    const columns = [
        {
            name: "Id",
            selector: (row) => row.id_categoria_productos,
            sortable: true
        },
        {
            name: "Nombre",
            selector: (row) => row.nombre_categoria_productos,
            sortable: true
        },
        {
            name: "Estado",
            cell: (row) => (

                <div className={estilos["acciones"]}>
                    <button className={estilos.boton} onClick={() => handleEstadocategoria(row.id_categoria_productos, row.estado_categoria_productos)} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '25px' }}>
                        {row.estado_categoria_productos === 1 ? (
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
                        cambiarEstadoModalEditar(!estadoModaleditar),
                            setCategoriasEditar(row)
                    }} className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        <i class="fa-solid fa-pen-to-square iconosNaranjas"></i>
                    </button>

                </div>
            )
        },

    ]
    const handleSubmitEditar = async (event) => {
        event.preventDefault();

        console.log(categorias)

        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar la información de la categoría de producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8082/ventas2/categoria_productos/${categoriasEditar.id_categoria_productos}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(categoriasEditar)
                    });

                    if (response.ok) {
                        console.log('categoría de producto actualizado exitosamente.');
                        Swal.fire({
                            icon: 'success',
                            title: 'categoría de producto actualizado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            window.location.href = '/categoria_productos';
                        }, 2000);
                        // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
                    } else {
                        console.error('Error al actualizar la categoría de producto:', response.statusText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar la categoría de producto',
                        });
                    }
                } catch (error) {
                    console.error('Error al actualizar la categoría de producto:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al actualizar la categoría de producto',
                    });
                }
            }
        });
    };

    useEffect(() => {
        fetchcategorias();
    }, []);

    useEffect(() => {
        if (categorias.length > 0) {
            setIsLoading(false);
        }
    }, [categorias]);

    const fetchcategorias = async () => {
        try {
            const response = await fetch('http://localhost:8082/ventas2/categoria_productos');
            if (response.ok) {
                const data = await response.json();
                const categoriasFiltrador = data.map(categoria => ({
                    id_categoria_productos: categoria.id_categoria_productos,
                    nombre_categoria_productos: categoria.nombre_categoria_productos,
                    estado_categoria_productos: categoria.estado_categoria_productos,
                }));
                setcategoria(categoriasFiltrador);
            } else {
                console.error('Error al obtener las categorías de producto');
            }
        } catch (error) {
            console.error('Error al obtener las categorías de producto:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCategorias1(prevcategorias => ({
            ...prevcategorias,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!categorias1.nombre_categoria_productos) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor completa el nombre de la categoría.',
                confirmButtonText: 'Aceptar'
            });
            return; // Detener la ejecución si hay campos vacíos
        }

        // Validar caracteres especiales
        const regex = /^[a-zA-Z0-9.,?!¡¿\s]+$/; // Expresión regular para permitir letras, números y algunos caracteres especiales

        if (!regex.test(categorias1.nombre_categoria_productos)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Evita caracteres especiales en el nombre de la categoría.',
                confirmButtonText: 'Aceptar'
            });
            return; // Detener la ejecución si hay caracteres especiales en el nombre de la categoría
        }
        

        try {
            console.log('categoría de producto a enviar: ', categorias1)

            const responseCategorias = await fetch('http://localhost:8082/ventas2/categoria_productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categorias1)
            });

            if (responseCategorias.ok) {
                console.log('categoría de producto creada exitosamente.');

                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    window.location.href = '/categoria_productos';
                }, 2000);

            } else {
                console.error('Error al crear la categoría de producto:', responseCategorias.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al crear la categoría de producto',
                });
            }
        } catch (error) {
            console.error('Error al crear la categoría de producto:', error);
        }

    };

    const handleEditarChange = (event) => {
        const { name, value } = event.target;
        setCategoriasEditar(prevcategorias => ({
            ...prevcategorias,
            [name]: value
        }));
    };

    const handleEstadocategoria = async (idcategoria, estadocategoria) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cambiar el estado de la categoría de producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const nuevoEstado = estadocategoria === 1 ? 0 : 1;

                    const response = await fetch(`http://localhost:8082/ventas2/estadoCategoria/${idcategoria}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            estado_categoria_productos: nuevoEstado
                        })
                    });

                    if (response.ok) {
                        // Actualización exitosa, actualizar la lista de proveedores
                        fetchcategorias();
                    } else {
                        console.error('Error al actualizar el estado de la categoría de producto');
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado de la categoría de producto:', error);
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

    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />
            <div>
                <h1>Categorías de productos</h1>
            </div>


            <div className={estilos['filtro']}>
                <br />
                <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                <div className={estilos.botones}>
                    <button onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)} className={`boton ${estilos.botonAgregar}`}><i className="fa-solid fa-plus"></i> Agregar</button>
                </div>
            </div>

            <div className={estilos["tabla"]}>
                <DataTable columns={columns} data={filteredcategorias} pagination paginationPerPage={6} highlightOnHover customStyles={customStyles} defaultSortField="id_categoria_productos" defaultSortAsc={true}></DataTable>
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
                                <div className={estilos["inputIdNombre"]}>

                                    <div>
                                        <p id={estilos.textito}>  Nombre</p>
                                        <input
                                            id={estilos.nombreproveedor}
                                            className={estilos["input2"]}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_categoria_productos'
                                            value={categorias.nombre_categoria_productos}
                                            onChange={handleChange}
                                            style={{ width: "250px", height: "40px"}}
                                        />
                                    </div>

                                </div>
                                <br />
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
                                <div className={estilos["input-container"]}>
                                    <div id={estilos.eo}>
                                        <p id={estilos.textito} > Nombre</p>
                                        <input
                                            id={estilos.nombreproveedor}
                                            className={estilos["input2"]}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_categoria_productos'
                                            value={categoriasEditar.nombre_categoria_productos}
                                            onChange={handleEditarChange}
                                        />
                                    </div>

                                </div>
                                <br />

                                <br />
                            </div>
                        </div>
                        <br />
                        <center>
                            <div className={estilos["cajaBotones"]}>
                                <button onClick={() => registrar()} className={estilos.azulado3} type="submit"><p style={{ marginLeft: "-10px" }}> Guardar</p> </button>

                                <div className={estilos["espacioEntreBotones"]}></div>
                                <button style={{ color: "white" }} onClick={() => cambiarEstadoModalEditar(!estadoModaleditar)} className={estilos.gris} type="button"> <p style={{ marginLeft: "-13px" }}> Cancelar</p></button>
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

export default CategoriasProductos;