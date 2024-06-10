import React, { useState, useEffect } from 'react';
import "./../../Layout.css";
import estilos from './agregarProductos.module.css'
import { Navigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditarProductos() {
    const [redirect, setRedirect] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [inputValidadoImg, setInputValidoImg] = useState(true);


    let { id_producto } = useParams();

    const [producto, setProducto] = useState({
        id_producto: '',
        imagen_producto: '',
        nombre_producto: '',
        descripcion_producto: '',
        estado_producto: '',
        precio_producto: '',
        id_categoria_producto: ''
    });

    const [imgProducto, setImgProducto] = useState(null); // Cambiado a null
    const [imgPreview, setImgPreview] = useState(''); // Nuevo estado para la URL de la imagen

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImgProducto(file);
        setImgPreview(URL.createObjectURL(file)); // Crear una URL para la imagen seleccionada

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos MIME permitidos

        if (file && allowedTypes.includes(file.type)) {
            setErrorImg(''); // Limpia el mensaje de error
            setInputValidoImg(true);
            setImgProducto(file); // Guarda el archivo seleccionado en el estado imgUsuario
            setImgPreview(URL.createObjectURL(file)); // Crea una URL para mostrar la vista previa de la imagen
        } else {
            setErrorImg('Selecciona un archivo de imagen válido (JPEG, PNG, GIF).');
            setInputValidoImg(false);
            setImgProducto(null); // Restablece el estado de la imagen
            setImgPreview(''); // Restablece la vista previa de la imagen
            event.target.value = null;
        }
    };

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas2/productos/${id_producto}`);
                if (response.ok) {
                    const data = await response.json();
                    const productoFiltrado = data[0];
                    setProducto(productoFiltrado);
                } else {
                    console.error('Error al obtener el producto');
                }
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };

        fetchProducto();
    }, [id_producto]);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        

        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar la información del producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formProducto = new FormData();
                    formProducto.append('imgProducto', imgProducto); // Usar imgUsuario directamente
                    formProducto.append('id_producto', producto.id_producto);
                    formProducto.append('nombre_producto', producto.nombre_producto);
                    formProducto.append('descripcion_producto', producto.descripcion_producto);
                    formProducto.append('precio_producto', producto.precio_producto); // Corregido el valor
                    formProducto.append('estado_producto', '1');
                    formProducto.append('id_categoria_producto', producto.id_categoria_producto);
                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas2/productos/${producto.id_producto}`, {
                        method: 'PUT',
                        body: formProducto
                    });

                    if (response.ok) {
                        console.log('Producto actualizado exitosamente.');
                                            
                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                            icon: "success",
                            title: "Producto actualizado exitosamente"
                        });
                        setTimeout(() => {
                            setRedirect(true);
                        }, 1500);

                    } else {
                        console.error('Error al actualizar el producto:', response.statusText);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar el producto',
                        });
                    }
                } catch (error) {
                    console.error('Error al actualizar el producto:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al actualizar el producto',
                    });
                }
            }
        });

    };

    if (redirect) {
        return <Navigate to={'/productos'}></Navigate>
    }

    return (
        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />

            <h1 style={{ marginTop: '-10px' }}>Editar Producto</h1>
            <div className={estilos["contenido2"]}>
                <br />
                <center>
                    <div id={estilos.titulo}>
                        <br />
                        <br />
                        <br />
                    </div>
                </center>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginTop: '-44px', marginLeft: '100px' }} id={estilos.contenedorsitos}>
                        <div style={{ marginTop: '-20px' }} id={estilos.contenedorsito}>
                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__id_producto}>
                                    <label htmlFor="id_producto"></label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field2"]}
                                            type="hidden"
                                            name="id_producto"
                                            id={estilos.id_producto}
                                            value={producto.id_producto}
                                            onChange={handleChange}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                                <div className={estilos["formulario__grupo2"]}>
                                    <label htmlFor="nombre_producto">Nombre</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field2"]}
                                            type="text"
                                            name="nombre_producto"
                                            id={estilos.nombre_producto}
                                            value={producto.nombre_producto}
                                            onChange={handleChange}
                                            style={{ width: '350px' }}

                                        />
                                        <span></span>
                                    </div>
                                </div>

                            </div>
                            <div style={{ marginLeft: "-20px" }} className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__precio}>
                                    <label style={{ marginTop: "-90px", marginLeft: "20px" }} htmlFor="precio_producto">Precio</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field2"]}
                                            type="text"
                                            name="precio_producto"
                                            id={estilos.precio_producto}
                                            value={producto.precio_producto}
                                            onChange={handleChange}
                                            style={{ marginLeft: "20px", width: '350px' }}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginLeft: "-30px" }} className={estilos["formulario__grupo2"]} id={estilos.grupo__descripcion}>
                                <label style={{ marginTop: "-90px", marginLeft: "30px" }} htmlFor="descripcion_producto">Descripción</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <input
                                        className={estilos["input-field2"]}
                                        type="text"
                                        name="descripcion_producto"
                                        id={estilos.descripcion_producto}
                                        value={producto.descripcion_producto}
                                        onChange={handleChange}
                                        style={{ marginLeft: "30px", width: '350px' }}

                                    />
                                    <span></span>
                                </div>
                            </div>


                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo2"]} id={estilos.grupo__id_categoria}>
                                    <label htmlFor="id_categoria_producto"></label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <select
                                            className={estilos["input-field2"]}
                                            name="id_categoria_producto"
                                            id={estilos.id_categoria_producto}
                                            value={producto.id_categoria_producto}
                                            onChange={handleChange}
                                            style={{ width: '350px' }}

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
                                        alt="Imagen del usuario"
                                    />
                                    <div>
                                        <input
                                            id={estilos.imagen_producto}
                                            className={`${!inputValidadoImg ? estilos.inputInvalido : estilos['input-field2']}`}
                                            type="file"
                                            placeholder="URL de la imagen"
                                            name='imagen_producto'
                                            onChange={handleFileChange}
                                        />
                                        {!inputValidadoImg && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '14px' }}>{errorImg}</p>}
                                        <br />
                                        <br />
                                    </div>
                                </div>
                            </center>
                        </div>


                    </div>
                    <br /><br /><br /><br />
                    <div style={{ marginTop: '-35px' }} className={estilos["botonsito"]}>
                        <button className={`boton ${estilos.azul}`} type='submit'><p className={estilos.textoBoton}>Guardar</p></button>
                        <Link className={`boton ${estilos.gris}`} to='/productos'><p>Cancelar</p></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarProductos;

