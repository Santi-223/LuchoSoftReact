import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import $ from 'jquery';
import "./../../Layout.css";
import estilos from './Cat-productos.module.css'
import Swal from 'sweetalert2';
import Modal from './modal';
import styled from 'styled-components';
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom"; // Agrega esta línea


function CategoriasProductos() {
    const token = localStorage.getItem("token");
    const [inputValido, setInputValido] = useState(true);
    const [inputValido2, setInputValido2] = useState(true);
    const [inputValido3, setInputValido3] = useState(true);
    const navigate = useNavigate(); // Agrega esta línea
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
                        if (row.estado_categoria_productos === 1) { // Verifica si el estado es activo
                            cambiarEstadoModalEditar(!estadoModaleditar),
                                setCategoriasEditar(row)
                        }
                    }} className={estilos.boton} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '20px' }}>
                        <i className={`fa-solid fa-pen-to-square ${row.estado_categoria_productos === 1 ? 'iconosNaranjas' : 'iconosGris'}`}></i>
                    </button>
                    <button
                        onClick={() => handleEliminarCategoria(row.id_categoria_productos)}
                        disabled={row.estado_categoria_productos === 0}
                        className={estilos.boton}
                        style={{ cursor: "pointer", textAlign: "center", fontSize: "25px" }}
                    >
                        <i
                            className={`bi bi-trash ${row.estado_categoria_productos === 0 ? "basuraDesactivada" : ""
                                }`}
                            style={{ color: row.estado_categoria_productos === 0 ? "gray" : "red" }}
                        ></i>
                    </button>

                </div>
            )
        },

    ]
    const handleSubmitEditar = async (event) => {
        event.preventDefault();

        if (!inputValido) {
            Swal.fire({
                icon: 'error',
                text: 'Por favor, digite bien los datos',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }

        if (!inputValido2) {
            Swal.fire({
                icon: 'error',
                text: 'Por favor, digite bien los datos',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }

        if (categoriasEditar.nombre_categoria_productos.trim() === '') {
            Swal.fire({
                icon: 'error',

                text: 'El nombre de la categoría de productos no puede estar vacío',
            });
            setInputValido3(false)
            return;
        }

        if (categoriasEditar.nombre_categoria_productos.length < 3) {
            Swal.fire({
                icon: 'error',

                text: 'El nombre de la categorìa de productos debe tener al menos 3 letras',
            });
            setInputValido(false)
            return;
        }


        const regex = /^[a-zA-Z0-9\s#,;.-àèìòù]*$/;

        if (!regex.test(categoriasEditar.nombre_categoria_productos)) {
            // Mostrar alerta con SweetAlert
            Swal.fire({
                icon: 'error',

                text: 'El nombre no puede contener caracteres especiales',
            });
            return;
        }

        // Confirmación de actualización
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar la información de la categoría de producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        });

        if (!isConfirmed) return;

        // Intentar actualizar la categoría
        try {
            const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas2/categoria_productos/${categoriasEditar.id_categoria_productos}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoriasEditar),
            });

            if (response.ok) {
                console.log('Categoría de producto actualizada exitosamente.');
                await Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    icon: 'success',
                    title: 'Actualización exitosa'
                });

                cambiarEstadoModalEditar(false); // Cierra el modal de edición
                navigate('/categoria_productos');
                window.location.reload(); // Recarga la página
            } else {
                const errorText = await response.text();
                console.error('Error al actualizar la categoría de producto:', errorText);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error al actualizar la categoría de producto: ${response.statusText}`,
                });
            }
        } catch (error) {
            console.error('Error al actualizar la categoría de producto:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al actualizar la categoría de producto: ${error.message}`,
            });
        }
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
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas2/categoria_productos');
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

    const handleEliminarCategoria = async (idCategoria) => {
        console.log("Intentando eliminar la categoría con ID:", idCategoria);

        try {
            // Obtener todos los productos y filtrar por la categoría
            const productosResponse = await fetch('https://api-luchosoft-mysql.onrender.com/ventas2/productos/', {
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                },
            });

            if (!productosResponse.ok) {
                throw new Error('Error al verificar los productos de la categoría.');
            }

            const productos = await productosResponse.json();

            // Filtrar productos que pertenecen a la categoría
            const productosEnCategoria = productos.filter(producto => producto.id_categoria_producto === idCategoria);

            if (productosEnCategoria.length > 0) {
                await Swal.fire({
                    icon: "warning",
                    title: "No se puede eliminar",
                    text: "La categoría tiene productos asociados. Elimínelos primero.",
                });
                return;
            }

            // Mostrar mensaje de confirmación
            const { isConfirmed } = await Swal.fire({
                text: "¿Deseas eliminar esta categoría?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (!isConfirmed) return;

            console.log("Confirmación recibida para eliminar la categoría.");
            console.log("Token utilizado:", token);

            // Solicitud DELETE
            const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas2/categoria_productos/${idCategoria}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                },
            });

            // Manejo de la respuesta
            if (response.ok) {
                console.log("Categoría eliminada exitosamente.");
                await Swal.fire({
                    icon: "success",
                    title: "Categoría eliminada",
                    text: "La categoría ha sido eliminada correctamente",
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchcategorias();
            } else {
                const errorText = await response.text();
                console.error("Error al eliminar la categoría:", response.status, errorText);
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Error al eliminar la categoría: ${response.statusText}`,
                });
            }
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: `Error al eliminar la categoría: ${error.message}`,
            });
        }
    };



    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'nombre_categoria_productos') {
            if (value.length > 30) {
                setInputValido(false);
            } else {
                setInputValido(true);
            }
        }
        if (name === 'nombre_categoria_productos') {
            if (value.length > 0) {
                setInputValido3(true)
            }
        }

        if (name === 'nombre_categoria_productos') {
            // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
            const caracteresEspeciales = /^[a-zA-Z0-9\s#,;.-àèìòù]*$/;

            // Verificar si la cadena no contiene caracteres especiales
            if (caracteresEspeciales.test(value)) {
                setInputValido2(true);
            } else {
                setInputValido2(false);
            }
        }

        setCategorias1(prevcategorias => ({
            ...prevcategorias,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!inputValido) {
            Swal.fire({
                icon: 'error',

                text: 'Por favor, digite bien los datos.',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }

        if (!inputValido2) {
            Swal.fire({
                icon: 'error',

                text: 'Por favor, digite bien los datos.',
                confirmButtonColor: '#1F67B9',
            });
            return;
        }

        if (categorias1.nombre_categoria_productos.trim() === '') {
            Swal.fire({
                icon: 'error',

                text: 'El nombre de la categoría de productos no puede estar vacío',
            });
            setInputValido3(false)
            return;
        }

        if (categorias1.nombre_categoria_productos.length < 3) {
            Swal.fire({
                icon: 'error',

                text: 'El nombre de la categorìa de productos debe tener al menos 3 letras',
            });
            setInputValido(false)
            return;
        }


        const regex = /^[a-zA-Z0-9\s#,;.-àèìòùñ]*$/;

        if (!regex.test(categorias1.nombre_categoria_productos)) {
            // Mostrar alerta con SweetAlert
            Swal.fire({
                icon: 'error',

                text: 'El nombre no puede contener caracteres especiales',
            });
            return;
        }


        try {

            console.log('Categoría de producto a enviar: ', categorias1);

            const responseCategorias = await fetch('https://api-luchosoft-mysql.onrender.com/ventas2/categoria_productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categorias1)
            });

            if (responseCategorias.ok) {
                console.log('Categoría de producto creada exitosamente.');

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    icon: "success",
                    title: "Registro exitoso"
                }).then(() => {
                    cambiarEstadoModalEditar(false); // Cierra el modal de edición
                    navigate('/categoria_productos');
                    window.location.reload(); // Recarga la página
                });
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

        if (name === 'nombre_categoria_productos') {
            if (value.length > 30) {
                setInputValido(false);
            } else {
                setInputValido(true);
            }
        }
        if (name === 'nombre_categoria_productos') {
            if (value.length > 0) {
                setInputValido3(true)
            }
        }

        if (name === 'nombre_categoria_productos') {
            // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
            const caracteresEspeciales = /^[a-zA-Z0-9\s#,;.-àèìòù]*$/;

            // Verificar si la cadena no contiene caracteres especiales
            if (caracteresEspeciales.test(value)) {
                setInputValido2(true);
            } else {
                setInputValido2(false);
            }
        }

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

                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas2/estadoCategoria/${idcategoria}`, {
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


            <div className={estilos['divFiltro']}>
                <input type="text" placeholder=" Buscar..." value={filtro} onChange={handleFiltroChange} className={estilos["busqueda"]} />
                <div>

                    <button onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)} className={` ${estilos.botonAgregar} ${estilos.rojo} bebas-neue-regular`}><i className="fa-solid fa-plus"></i> Agregar</button>

                </div>

            </div>


            <div className={estilos["tabla"]}>
                <DataTable columns={columns} data={filteredcategorias} pagination paginationPerPage={6} highlightOnHover customStyles={customStyles} defaultSortField="id_categoria_productos" defaultSortAsc={true}></DataTable>
            </div>
            <Modal
                estado={estadoModalAgregar}
                cambiarEstado={cambiarEstadoModalAgregar}
                titulo="Registrar"
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
                                            className={`${estilos.inputfield2} ${!inputValido ? estilos.inputInvalido : ''} ${!inputValido2 ? estilos.inputInvalido : ''} ${!inputValido3 ? estilos.inputInvalido : ''}`}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_categoria_productos'
                                            value={categorias.nombre_categoria_productos}
                                            onChange={handleChange}
                                            style={{ width: "250px", height: "40px" }}
                                        />
                                        {
                                            !inputValido3 && (
                                                <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
                                            )
                                        }
                                        {
                                            !inputValido2 && !inputValido && (
                                                <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
                                            )
                                        }
                                        {
                                            !inputValido && inputValido2 && (
                                                <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Debe de contener al menos 3 letras y máximo 30.</p>
                                            )
                                        }
                                        {
                                            !inputValido2 && inputValido && (
                                                <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
                                            )
                                        }
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
                                    <div style={{ marginLeft: "-50px" }} id={estilos.eo}>
                                        <p id={estilos.textito} > Nombre</p>
                                        <input
                                            id={estilos.nombreproveedor}
                                            className={`${estilos.inputfield2} ${!inputValido ? estilos.inputInvalido : ''} ${!inputValido2 ? estilos.inputInvalido : ''} ${!inputValido3 ? estilos.inputInvalido : ''}`}
                                            type="text"
                                            placeholder="Insertar nombre"
                                            name='nombre_categoria_productos'
                                            value={categoriasEditar.nombre_categoria_productos}
                                            onChange={handleEditarChange}
                                            style={{ width: "250px", height: "40px" }}

                                        />
                                        {
                                            !inputValido3 && (
                                                <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
                                            )
                                        }
                                        {

                                            !inputValido && !inputValido2 && (
                                                <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El límite es de 30 letras y no se aceptan caracteres especiales.</p>
                                            )
                                        }
                                        {
                                            inputValido && !inputValido2 && (
                                                <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
                                            )
                                        }
                                        {
                                            !inputValido && inputValido2 && (
                                                <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El límite es de 30 letras.</p>
                                            )
                                        }

                                    </div>

                                </div>
                                <br />

                                <br />
                            </div>
                        </div>
                        <br />
                        <center>
                            <div style={{ marginTop: "-5px" }} className={estilos["cajaBotones"]}>
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
                font - size: 42px;
            font-weight: 700;
            margin-bottom: 10px;
	}

            p {
                font - size: 18px;
            margin-bottom: 20px;
	}

            img {
                width: 100%;
            vertical-align: top;
            border-radius: 3px;
	}
            `;

export default CategoriasProductos;
