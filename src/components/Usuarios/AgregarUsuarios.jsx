import React, { useState, useEffect } from 'react';
import '../Layout.css';
import estilos from '../Usuarios/Usuarios.module.css';
import { Navigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function AgregarUsuarios() {
    const [redirect, setRedirect] = useState(false);
    const [roles, setRoles] = useState([]);

    const [usuario, setUsuario] = useState({
        id_usuario: '',
        imagen_usuario: '',
        nombre_usuario: '',
        email: '',
        contraseña: '',
        telefono_usuario: '',
        direccion_usuario: '',
        estado_usuario: 1,
        id_rol: ''
    });

    const [imgUsuario, setImgUsuario] = useState(null); // Cambiado a null

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUsuario(prevUsuario => ({
            ...prevUsuario,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        setImgUsuario(event.target.files[0]);
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/roles');
                if (response.ok) {
                    const data = await response.json();
                    const rolesFiltrados = data.map(rol => ({
                        id_rol: rol.id_rol,
                        nombre_rol: rol.nombre_rol,
                        descripcion_rol: rol.descripcion_rol,
                        estado_rol: rol.estado_rol,
                    }));
                    setRoles(rolesFiltrados);
                } else {
                    console.error('Error al obtener los roles');
                }
            } catch (error) {
                console.error('Error al obtener los roles:', error);
            }
        };

        fetchRoles(); // Llama a la función fetchRoles cuando se monta el componente
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (usuario.id_usuario.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de identificación está vacío.",
            });
            return;
        }
        if (usuario.id_usuario.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de identificación debe tener 5 o más caracteres.",
            });
            return;
        }
        if (usuario.nombre_usuario.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de nombre está vacío.",
            });
            return;
        }
        if (usuario.nombre_usuario.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de nombre debe tener 5 o más caracteres.",
            });
            return;
        }
        if (usuario.telefono_usuario.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de teléfono está vacío.",
            });
            return;
        }
        if (usuario.telefono_usuario.length < 7) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de teléfono debe tener 7 o más caracteres.",
            });
            return;
        }
        if (usuario.direccion_usuario.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de dirección está vacío.",
            });
            return;
        }
        if (usuario.direccion_usuario.length < 7) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de dirección debe tener 7 o más caracteres.",
            });
            return;
        }
        if (usuario.email.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de email está vacío.",
            });
            return;
        }
        if (usuario.email.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de email debe tener 5 o más caracteres.",
            });
            return;
        }
        if (usuario.contraseña.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El campo de contraseña está vacío.",
            });
            return;
        }
        if (usuario.contraseña.length < 8) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "La contraseña debe tener 8 o más caracteres.",
            });
            return;
        }
        if (usuario.id_rol === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Debes seleccionar un rol.",
            });
            return;
        }

        try {
            const formUsuario = new FormData();
            formUsuario.append('imgUsuario', imgUsuario); // Usar imgUsuario directamente
            formUsuario.append('id_usuario', usuario.id_usuario);
            formUsuario.append('nombre_usuario', usuario.nombre_usuario);
            formUsuario.append('email', usuario.email);
            formUsuario.append('contrasena', usuario.contraseña);
            formUsuario.append('telefono_usuario', usuario.telefono_usuario); // Corregido el valor
            formUsuario.append('direccion_usuario', usuario.direccion_usuario);
            formUsuario.append('estado_usuario', '1');
            formUsuario.append('id_rol', usuario.id_rol);

            const response = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/usuarios', {
                method: 'POST',
                body: formUsuario
            });

            if (response.ok) {
                console.log('Usuario creado exitosamente.');
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario creado exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    setRedirect(true);
                }, 1000);
            } else {
                const errorData = await response.json(); // Parsear el cuerpo de la respuesta como JSON
                console.error('Error al crear el usuario:', errorData);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear el usuario',
                    text: errorData,
                });
            }
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al crear el usuario',
                text: error.message
            });
        }
    };

    if (redirect) {
        return <Navigate to={'/usuarios'} />;
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
                        <h1>Registrar Usuario</h1>
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
                                    <label htmlFor="telefono_usuario">Teléfono</label>
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
                                    <p>Email</p>
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
                                                if (rol.estado_rol !== false) {
                                                    return <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre_rol}</option>;
                                                }
                                                return null;
                                            })}
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
                                        src={usuario.imagen_usuario ? usuario.imagen_usuario : 'https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180'}
                                        alt="Imagen del usuario"
                                    />
                                    <div>
                                        <input
                                            id={estilos.imagen_usuario}
                                            className={estilos["input-field2"]}
                                            type="file"
                                            placeholder="URL de la imagen"
                                            name='imagen_usuario'
                                            onChange={handleFileChange}
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

export default AgregarUsuarios;
