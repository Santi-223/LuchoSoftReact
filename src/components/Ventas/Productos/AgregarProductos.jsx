
import React, { useState, useEffect } from 'react';
import "./../../Layout.css";
import { Link } from "react-router-dom";
import estilos from './agregarProductos.module.css'
import Swal from 'sweetalert2';
import Productos from './Productos';




function AgregarProductos() {
    const [categorias, setCategorias] = useState([]);
    const [producto, setProducto] = useState({
        imagen_producto: "",
        nombre_producto: "",
        descripcion_producto: "",
        estado_producto: 1,
        precio_producto: "",
        id_categoria_producto: ""

    });


    const handleChange = (event) => {
        const { name, value } = event.target;
        setProducto(prevProducto => ({
            ...prevProducto,
            [name]: value
        }));
    };

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:8082/ventas2/categoria_productos');
                if (response.ok) {
                    const data = await response.json();
                    const categoriasFiltradas = data.map(categoria => ({
                        id_categoria_productos: categoria.id_categoria_productos,
                        nombre_categoria_productos: categoria.nombre_categoria_productos
                    }));
                    setCategorias(categoriasFiltradas);
                } else {
                    console.error('Error al obtener las categorías');
                }
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };

        fetchCategorias();
    }, []);


    const handleSubmit = async () => {
        console.log("Productos:", producto[0])


        if (!producto.nombre_producto || !producto.descripcion_producto || !producto.precio_producto || !producto.id_categoria_producto) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor completa todos los campos obligatorios.',
                confirmButtonText: 'Aceptar'
            });
            return; // Detener la ejecución si hay campos vacíos
        }

        // Validar caracteres especiales
        const regex = /^[a-zA-Z0-9.,?!¡¿\s]+$/; // Expresión regular para permitir letras, números y algunos caracteres especiales

        if (!regex.test(producto.nombre_producto) ||
            !regex.test(producto.descripcion_producto)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Evita caracteres especiales en los campos de texto.',
                confirmButtonText: 'Aceptar'
            });
            return; // Detener la ejecución si hay caracteres especiales en campos de texto
        }

        // Validar el campo de precio
        if (isNaN(producto.precio_producto) || parseFloat(producto.precio_producto) <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ingresa un precio válido.',
                confirmButtonText: 'Aceptar'
            });
            return; // Detener la ejecución si el precio no es válido
        }

        try {
            // Tu código de envío del formulario sigue aquí
        } catch (error) {
            console.error('Error:', error.message);
            // Muestra el SweetAlert de error
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al registrar el producto.',
                confirmButtonText: 'Aceptar'
            });
        }



        try {
            const response = await fetch('http://localhost:8082/ventas2/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (!response.ok) {
                throw new Error('Error al registrar el producto');
            }

            // Muestra el SweetAlert de éxito
            await Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'El producto se ha registrado correctamente',
                confirmButtonText: 'Aceptar'
            });

            // Redirige a la página de productos
            window.location.href = '/productos';
        } catch (error) {
            console.error('Error:', error.message);
            // Muestra el SweetAlert de error
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al registrar el producto.',
                confirmButtonText: 'Aceptar'
            });
        }
    };


    const handleCancelar = () => {
        history.push('/productos');
    };

    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />

            <h1>Registro Producto</h1>

            <div className={estilos.contenido2}>
                <br />
                <center>
                    <div id={estilos.titulo}>
                        <br />
                        <br />
                        <br /><b></b>
                    </div>
                </center>
                <div style={{ justifyContent: 'space-between' }} id={estilos.contenedorsitos}>
                    <div id={estilos.contenedorsito}>
                        <div style={{ marginBottom: "20px" }} className={estilos["input-container"]}>
                            <div className={estilos["formulariogrupo"]} id={estilos.grupo__nombre}>
                                <label htmlFor="nombre">Nombre</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input className={estilos["input-field"]} type="text" name="nombre_producto" id={estilos.nombre} value={producto.nombre_producto} onChange={handleChange} />
                                    <span></span>
                                </div>
                            </div>
                        </div>


                        <div className={estilos["input-container"]}>
                            <div className={estilos["formulariogrupo"]} id={estilos.grupo__descripcion}>
                                <label htmlFor="descripcion">Descripción</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input className={estilos["input-field"]} type="text" name="descripcion_producto" id={estilos.descripcion} value={producto.descripcion_producto} onChange={handleChange} />
                                    <span></span>
                                </div>
                            </div>
                        </div>

                        <div className={estilos["input-container"]}>
                            <div className={estilos["formulariogrupo"]} id={estilos.grupo__precio}>
                                <label htmlFor="precio">Precio</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input className={estilos["input-field"]} type="number" name="precio_producto" id={estilos.precio} value={producto.precio_producto} onChange={handleChange} />
                                    <span></span>
                                </div>
                            </div>
                        </div>


                        <div style={{}} className={estilos["input-container"]}>
                            <div className={estilos["formulario__grupo2"]} id={estilos.grupo__id_categoria}>
                                <label style={{ marginLeft: "20px" }} htmlFor="id_categoria_producto">Seleccionar Categoría</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <select
                                        className={estilos["input-field2"]}
                                        name="id_categoria_producto"
                                        id={estilos.id_categoria_producto}
                                        value={producto.id_categoria_producto}
                                        onChange={handleChange}
                                        style={{ width: "200px", marginLeft: "20px" }}
                                    >
                                        <option>Seleccione una categoría</option>
                                        {categorias.map(categoria => (
                                            <option key={categoria.id_categoria_productos} value={categoria.id_categoria_productos}>{categoria.nombre_categoria_productos}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div id={estilos.cosas}>
                        <center>
                            <div style={{ marginRight: "75px" }} className={`${estilos.divImagen} `} >
                                <p>URL Imagen</p><br /><br />
                                <img style={{ width: "250px", height: "170px", marginTop: "-20px" }} id={estilos.imagen}
                                    src={producto.imagen_producto ? producto.imagen_producto : 'https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180'} />
                                <div>
                                    <br /><br /><br />
                                    <input
                                        id={estilos.imagen_producto}
                                        className={estilos["input-field2"]}
                                        type="text"
                                        placeholder="URL de la imagen"
                                        name='imagen_producto'
                                        value={producto.imagen_producto}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>
                        </center>
                    </div>


                </div>


            </div><br /><br /><br /><br />
            <div className={estilos["botonsito"]}>
                <button className={`boton ${estilos.azul}`} onClick={handleSubmit}><i></i> Guardar</button>
                <Link to="/productos">
                    <button className={`boton ${estilos.gris}`} onClick={handleCancelar}><i className={[""]}></i> Cancelar</button>
                </Link>

            </div>
        </div>
    );
}

export default AgregarProductos;

