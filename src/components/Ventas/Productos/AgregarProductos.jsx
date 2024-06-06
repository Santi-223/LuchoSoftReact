
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


    const [imgProducto, setimgProducto] = useState(null); // Cambiado a null
    const [imgPreview, setImgPreview] = useState(''); // Nuevo estado para la URL de la imagen

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setimgProducto(file);
        setImgPreview(URL.createObjectURL(file)); // Crear una URL para la imagen seleccionada
    };


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
                const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas2/categoria_productos');
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
        console.log("Productos:", producto[0]);
    
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
    
        if (!regex.test(producto.nombre_producto) || !regex.test(producto.descripcion_producto)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Evita caracteres especiales en los campos de texto.',
                confirmButtonText: 'Aceptar'
            });
            return; // Detener la ejecución si hay caracteres especiales en campos de texto
        }
    
        // Validar el campo de precio
        if (isNaN(producto.precio_producto) || parseFloat(producto.precio_producto) < 50) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ingresa un precio válido, debe ser mayor o igual que 50',
                confirmButtonText: 'Aceptar'
            });
            return; // Detener la ejecución si el precio no es válido
        }
    
        try {
            const formProducto = new FormData();
            formProducto.append('nombre_producto', producto.nombre_producto);
            formProducto.append('imgProducto', imgProducto); // Usar imgProducto directamente
            formProducto.append('descripcion_producto', producto.descripcion_producto);
            formProducto.append('precio_producto', producto.precio_producto);
            formProducto.append('estado_producto', '1');
            formProducto.append('id_categoria_producto', producto.id_categoria_producto);
    
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas2/productos', {
                method: 'POST',
                body: formProducto
            });
    
            if (response.ok) {
                console.log('Producto creado exitosamente.');
                Swal.fire({
                    icon: 'success',
                    title: 'Producto creado exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    window.location.href = '#/productos'; // Redirigir a la página de productos
                }, 1000);
            } else {
                const errorData = await response.json(); // Parsear el cuerpo de la respuesta como JSON
                console.error('Error al crear el producto:', errorData);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear el producto',
                    text: JSON.stringify(errorData), // Mostrar el error de manera más clara
                });
            }
        } catch (error) {
            console.error('Error al crear el producto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al crear el producto',
                text: error.message
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
            <h1 style={{ marginTop: '-10px' }} >Registro Producto</h1>

            <div className={estilos.contenido2}>
                <br />
                <center>
                    <div id={estilos.titulo}>
                        <br />
                        <br />
                        <br /><b></b>
                    </div>
                </center>
                <div style={{ justifyContent: 'space-between', marginTop: '-50px' }} id={estilos.contenedorsitos}>
                    <div style={{ marginTop: '-20px' }} id={estilos.contenedorsito}>
                        <div style={{ marginBottom: "20px" }} className={estilos["input-container"]}>
                            <div className={estilos["formulariogrupo"]} id={estilos.grupo__nombre}>
                                <label htmlFor="nombre">Nombre</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input style={{ width: '350px' }} className={estilos["input-field"]} type="text" name="nombre_producto" id={estilos.nombre} value={producto.nombre_producto} onChange={handleChange} />
                                    <span></span>
                                </div>
                            </div>
                        </div>


                        <div className={estilos["input-container"]}>
                            <div className={estilos["formulariogrupo"]} id={estilos.grupo__descripcion}>
                                <label htmlFor="descripcion">Descripción</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <textarea cols="33" rows="4"
                                        style={{ resize: 'none', width: '350px' }} className={estilos["input-field"]} type="text" name="descripcion_producto" id={estilos.descripcion} value={producto.descripcion_producto} onChange={handleChange} />
                                    <span></span>
                                </div>
                            </div>
                        </div>

                        <div className={estilos["input-container"]}>
                            <div className={estilos["formulariogrupo"]} id={estilos.grupo__precio}>
                                <label htmlFor="precio">Precio</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input style={{ width: '350px' }} className={estilos["input-field"]} type="number" name="precio_producto" id={estilos.precio} value={producto.precio_producto} onChange={handleChange} />
                                    <span></span>
                                </div>
                            </div>
                        </div>


                        <div style={{}} className={estilos["input-container"]}>
                            <div className={estilos["formulario__grupo2"]} id={estilos.grupo__id_categoria}>
                                <label style={{ marginLeft: "20px", marginTop: '10px' }} htmlFor="id_categoria_producto"></label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <select
                                        className={estilos["input-field2"]}
                                        name="id_categoria_producto"
                                        id={estilos.id_categoria_producto}
                                        value={producto.id_categoria_producto}
                                        onChange={handleChange}
                                        style={{ width: "350px", marginLeft: "20px" }}
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
                            <div className={`${estilos.divImagen} `}>
                                <p>URL Imagen</p>
                                <img id={estilos.imagen}
                                    src={imgPreview || producto.imagen_producto || 'https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180'}
                                    alt="Imagen del producto"
                                />
                                <div>
                                    <input
                                        id={estilos.imagen_producto}
                                        className={estilos["input-field2"]}
                                        type="file"
                                        placeholder="URL de la imagen"
                                        name='imagen_producto'
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </center>
                    </div>


                </div>


            </div><br /><br /><br /><br />
            <div style={{ marginTop: '-35px' }} className={estilos["botonsito"]}>
                <button className={`boton ${estilos.azul}`} onClick={handleSubmit}><i></i> Guardar</button>
                <Link to="/productos">
                    <button className={`boton ${estilos.gris}`} onClick={handleCancelar}><i className={[""]}></i> Cancelar</button>
                </Link>

            </div>
        </div>
    );
}

export default AgregarProductos;

