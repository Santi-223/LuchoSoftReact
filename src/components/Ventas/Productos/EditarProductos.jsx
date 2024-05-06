import React, { useState, useEffect } from 'react';
import "./../../Layout.css";
import estilos from './agregarProductos.module.css'
import { Navigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditarProductos() {
    const [redirect, setRedirect] = useState(false);
    const [categorias, setCategorias] = useState([]);

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
                    const response = await fetch(`https://api-luchosoft-mysql.onrender.com/ventas2/productos/${producto.id_producto}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(producto)
                    });

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Producto actualizado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            setRedirect(true);
                        }, 1000);
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
        
        <h1>Editar Producto</h1>
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
                <div id={estilos.contenedorsitos}>
                    <div id={estilos.contenedorsito}>
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
                                    />
                                    <span></span>
                                </div>
                            </div>

                        </div>
                        <div style={{marginLeft: "-20px" }} className={estilos["input-container"]}>
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
                                        style={{ marginLeft: "20px" }}
                                    />
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div style={{marginLeft: "-30px" }}  className={estilos["formulario__grupo2"]} id={estilos.grupo__descripcion}>
                            <label style={{ marginTop: "-90px", marginLeft: "30px" }} htmlFor="descripcion_producto">Descripción</label>
                            <div className={estilos["formulario__grupo-input"]}>
                                <input
                                    className={estilos["input-field2"]}
                                    type="text"
                                    name="descripcion_producto"
                                    id={estilos.descripcion_producto}
                                    value={producto.descripcion_producto}
                                    onChange={handleChange}
                                    style={{ marginLeft: "30px" }}

                                />
                                <span></span>
                            </div>
                        </div>

                        
                        <div className={estilos["input-container"]}>
                            <div className={estilos["formulario__grupo2"]} id={estilos.grupo__id_categoria}>
                                <label htmlFor="id_categoria_producto">Seleccionar Categoría</label>
                                <div className={estilos["formulario__grupo-input"]}>
                                    <select
                                        className={estilos["input-field2"]}
                                        name="id_categoria_producto"
                                        id={estilos.id_categoria_producto}
                                        value={producto.id_categoria_producto}
                                        onChange={handleChange}
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
                            <div style={{marginLeft: "100px" }} className={`${estilos.divImagen} `} >
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
                <br /><br /><br /><br />
                <div className={estilos["botonsito"]}>
                    <button className={`boton ${estilos.azul}`} type='submit'><p className={estilos.textoBoton}>Guardar</p></button>
                    <Link className={`boton ${estilos.gris}`} to='/productos'><p>Cancelar</p></Link>
                </div>
            </form>
        </div>
    </div>
    );
}

export default EditarProductos;



