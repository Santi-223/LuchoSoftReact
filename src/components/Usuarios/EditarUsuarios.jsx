import React, { useState, useEffect } from 'react';
import '../Layout.css'
import estilos from '../Usuarios/Usuarios.module.css'
import { Navigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUserContext } from "../UserProvider";

function EditarUsuario() {

    const [isLoading, setIsLoading] = useState(true);

    const { usuarioLogueado, actualizarUsuarioLogueado } = useUserContext();

    console.log("id user log: ", usuarioLogueado.id_usuario)

    const [redirect, setRedirect] = useState(false);

    const [roles, setRoles] = useState([]);

    let { id_usuario } = useParams();
    console.log(id_usuario)

    const [usuario, setUsuario] = useState({
        id_usuario: '',
        imagen_usuario: '',
        nombre_usuario: '',
        email: '',
        contraseña: '',
        telefono_usuario: '',
        direccion_usuario: '',
        estado_usuario: '',
        id_rol: ''
    });

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`http://localhost:8082/configuracion/usuarios/${id_usuario}`);
                if (response.ok) {
                    const data = await response.json();
                    const usuarioFiltrado = data[0];
                    setUsuario(usuarioFiltrado);
                    console.log(usuarioFiltrado)
                    setIsLoading(false)
                } else {
                    console.error('Error al obtener el usuario');
                }
            } catch (error) {
                console.error('Error al obtener el usuario:', error);
            }
        };

        fetchUsuario();
    }, [id_usuario]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUsuario(prevUsuario => ({
            ...prevUsuario,
            [name]: value
        }));
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('http://localhost:8082/configuracion/roles');
                if (response.ok) {
                    const data = await response.json();
                    const rolesFiltrados = data.map(rol => ({
                        id_rol: rol.id_rol,
                        nombre_rol: rol.nombre_rol,
                        descripcion_rol: rol.descripcion_rol,
                        estado_rol: rol.estado_rol,
                    }));
                    setRoles(rolesFiltrados);
                    console.log(roles);
                } else {
                    console.error('Error al obtener las compras');
                }
            } catch (error) {
                console.error('Error al obtener las compras:', error);
            }
        };

        fetchRoles(); // Llama a la función fetchRoles cuando se monta el componente

    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(usuario)

        if (usuario.id_usuario.length == 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de identificación esta vacío.",
            })
        }
        else if (usuario.id_usuario.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de identificación debe tener 5 o más carácteres.",
            })
        }
        else if (usuario.nombre_usuario.length == 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de nombre esta vacío.",
            })
        }
        else if (usuario.nombre_usuario.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de nombre debe tener 5 o más carácteres.",
            })
        }
        else if (usuario.telefono_usuario.length == 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de teléfono esta vacío.",
            })
        }
        else if (usuario.telefono_usuario.length < 7) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de teléfono debe tener 7 o más carácteres.",
            })
        }
        else if (usuario.direccion_usuario.length == 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de dirección esta vacío.",
            })
        }
        else if (usuario.direccion_usuario.length < 7) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de dirección debe tener 7 o más carácteres.",
            })
        }
        else if (usuario.email.length == 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de email esta vacío.",
            })
        }
        else if (usuario.email.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de email debe tener 5 o más carácteres.",
            })
        }
        else if (usuario.contraseña.length == 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de contraseña esta vacío.",
            })
        }
        else if (usuario.contraseña.length < 8) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "La contraseña debe tener 8 o más carácteres.",
            })
        }
        else if (usuario.id_rol == 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Debes seleccionar un rol.",
            })
        }
        else {
            Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Deseas actualizar la información del usuario?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, actualizar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(`http://localhost:8082/configuracion/usuarios/${usuario.id_usuario}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(usuario)
                        });

                        if (response.ok) {

                            console.log('Usuario actualizado exitosamente.');
                            Swal.fire({
                                icon: 'success',
                                title: 'Usuario actualizado exitosamente',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            setTimeout(() => {
                                setRedirect(true);
                            }, 1000);

                        } else {
                            console.error('Error al actualizar el usuario:', response.statusText);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Error al actualizar el usuario',
                            });
                        }
                    } catch (error) {
                        console.error('Error al actualizar el usuario:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al actualizar el usuario',
                        });
                    }
                }
            });
        }

    };

    if (redirect) {
        return <Navigate to={'/usuarios'}></Navigate>
    }

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
            <div className={estilos["contenido2"]}>
                <br />
                <center>
                    <div id={estilos.titulo}>
                        <h1>Editar Usuario</h1>
                        <br />
                        <br />
                        <br />
                    </div>
                </center>
                <form onSubmit={handleSubmit}>
                    <div id={estilos.contenedorsitos}>

                        <div id={estilos.contenedorsito}>
                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__id_usuario}>
                                    <label htmlFor="id_usuario">Identificación</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field2"]}
                                            type="number"
                                            name="id_usuario"
                                            id={estilos.id_usuario}
                                            value={usuario.id_usuario}
                                            onChange={handleChange}
                                            readOnly
                                        />
                                        <span></span>
                                    </div>
                                </div>
                                <div className={estilos["formulario__grupo2"]}>
                                    <label htmlFor="nombre">Nombre</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field2"]}
                                            type="text"
                                            name="nombre_usuario"
                                            id={estilos.nombre}
                                            value={usuario.nombre_usuario}
                                            onChange={handleChange}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__telefono}>
                                    <label htmlFor="telefono_usuario">Telefono</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field2"]}
                                            type="text"
                                            name="telefono_usuario"
                                            id={estilos.telefono_usuario}
                                            value={usuario.telefono_usuario}
                                            onChange={handleChange}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                                <div className={estilos["formulario__grupo2"]} id={estilos.grupo__direccion}>
                                    <label htmlFor="direccion_usuario">Dirección</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field2"]}
                                            type="text"
                                            name="direccion_usuario"
                                            id={estilos.direccion_usuario}
                                            value={usuario.direccion_usuario}
                                            onChange={handleChange}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                            </div>

                            <div className={estilos["input-container"]}>
                                <div className={estilos["eo"]}>
                                    <p className={estilos[""]}>Email</p>
                                    <input
                                        className={estilos["input-field"]}
                                        type="email"
                                        name="email"
                                        id={estilos.email}
                                        value={usuario.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__contraseña}>
                                    <label htmlFor="contraseña">Contraseña</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field2"]}
                                            type="password"
                                            name="contraseña"
                                            id={estilos.contraseña}
                                            value={usuario.contraseña}
                                            onChange={handleChange}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                                <div className={estilos["formulario__grupo2"]} id={estilos.grupo__id_rol}>
                                    <label htmlFor="id_rol">Seleccionar Rol</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <select
                                            className={estilos["input-field2"]}
                                            name="id_rol" // Utiliza el mismo nombre que el campo id_rol
                                            id={estilos.id_rol} // Cambia el id para que sea único
                                            value={usuario.id_rol}
                                            onChange={handleChange}
                                        >
                                            <option value={0}>Seleccione un rol</option>
                                            {roles.map(rol => {
                                                if (rol.estado_rol != false) {
                                                    return <option value={rol.id_rol}>{rol.nombre_rol}</option>
                                                }
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id={estilos.cosas}>
                            <center>
                                <div className={`${estilos.divImagen} `} >
                                    <p>URL Imagen</p>
                                    <img id={estilos.imagen}
                                        src={usuario.imagen_usuario ? usuario.imagen_usuario : 'https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180'} />
                                    <div>
                                        <input
                                            id={estilos.imagen_usuario}
                                            className={estilos["input-field2"]}
                                            type="text"
                                            placeholder="URL de la imagen"
                                            name='imagen_usuario'
                                            value={usuario.imagen_usuario}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                            </center>
                        </div>


                    </div>
                    <div className={estilos["botonsito"]}>
                        <button className={`boton ${estilos.azul}`} type='submit'><p className={estilos.textoBoton}>Guardar</p></button>
                        <Link className={`boton ${estilos.gris}`} to='/usuarios'><p>Cancelar</p></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarUsuario;