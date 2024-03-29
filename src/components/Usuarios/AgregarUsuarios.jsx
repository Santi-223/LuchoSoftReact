import React, { useState, useEffect, setIsLoading } from 'react';
import '../Layout.css';
import estilos from '../Usuarios/Usuarios.module.css';
import Swal from 'sweetalert2';

function AgregarUsuarios() {

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

        try {
            const response = await fetch('http://localhost:8082/configuracion/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                console.log('Usuario creado exitosamente.');
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario creado exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
                // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
            } else {
                console.error('Error al crear el usuario:', response.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al crear el usuario',
                });
            }
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al crear el usuario',
            });
        }
    };

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
                        <h1>Registro Usuario</h1>
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
                                    <label htmlFor="id_usuario"><i className={["fa-solid fa-id-card iconosRojos"]}></i>id_usuario</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field"]}
                                            type="text"
                                            name="id_usuario"
                                            id={estilos.id_usuario}
                                            value={usuario.id_usuario}
                                            onChange={handleChange}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                            </div>

                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__nombre}>
                                    <label htmlFor="nombre"> <i className={["fa-solid fa-font iconosRojos"]}></i>Nombre</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field"]}
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
                                    <label htmlFor="telefono_usuario"><i className={["fa-solid fa-phone iconosRojos"]}></i> Telefono</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field"]}
                                            type="text"
                                            name="telefono_usuario"
                                            id={estilos.telefono_usuario}
                                            value={usuario.telefono_usuario}
                                            onChange={handleChange}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                            </div>

                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__direccion}>
                                    <label htmlFor="direccion_usuario"><i className={["fa-sharp fa-solid fa-location-dot iconosRojos"]}></i>
                                        Dirección</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field"]}
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
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__contraseña}>
                                    <label htmlFor="contraseña"><i className={["fa-solid fa-lock iconosRojos"]}></i>Contraseña</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={estilos["input-field"]}
                                            type="contraseña"
                                            name="contraseña"
                                            id={estilos.contraseña}
                                            value={usuario.contraseña}
                                            onChange={handleChange}
                                        />
                                        <span></span>
                                    </div>
                                </div>
                            </div>

                            <div className={estilos["input-container"]}>
                                <div className={estilos["eo"]}>
                                    <p className={estilos[""]}><i className={["fas fa-user-shield iconosRojos"]}></i>email</p>
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
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__id_rol}>
                                    <label htmlFor="id_rol"><i className={["fa-solid fa-id-card iconosRojos"]}></i>Seleccionar Rol</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <select
                                            className={estilos["input-field"]}
                                            name="id_rol" // Utiliza el mismo nombre que el campo id_rol
                                            id={estilos.id_rol} // Cambia el id para que sea único
                                            value={usuario.id_rol}
                                            onChange={handleChange}
                                        >
                                            <option>Seleccione un rol</option>
                                            {roles.map(rol => (
                                                <option value={rol.id_rol}>{rol.nombre_rol}</option>
                                            ))}
                                        </select>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id={estilos.cosas}>
                            <center>
                                <br />
                                <br />
                                <div className={`${estilos.divImagen} ${estilos.input1}`} >
                                    <p><i className={["fa-solid fa-image iconosRojos"]}></i> URL Imagen</p>
                                    <img id={estilos.imagen_i}
                                        src={usuario.imagen_usuario ? usuario.imagen_usuario : 'https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180'}
                                        width="200px" />
                                    <br />
                                    <br />
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
                            </center>
                            <br />
                        </div>


                    </div>



                    <div className={estilos["botonsito"]}>
                        <button className={`boton ${estilos.botonMorado}`} type='submit'><i></i> Guardar</button>
                        <button className={`boton ${estilos.botonRojo}`}>
                            <i className={[""]}></i> Cancelar
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
}

export default AgregarUsuarios;
