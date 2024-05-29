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

    const [inputValidoId, setInputValidoId] = useState(true);
    const [errorId, setErrorId] = useState('')
    const [inputValidoNombre, setInputValidoNombre] = useState(true);
    const [errorNombre, setErrorNombre] = useState('')
    const [inputValidadoTelefono, setInputValidoTelefono] = useState(true);
    const [errorTelefono, setErrorTelefono] = useState('')
    const [inputValidadoDireccion, setInputValidoDireccion] = useState(true);
    const [errorDireccion, setErrorDireccion] = useState('')
    const [inputValidadoEmail, setInputValidoEmail] = useState(true);
    const [errorEmail, setErrorEmail] = useState('')
    const [inputValidadoContrasena, setInputValidoContrasena] = useState(true);
    const [errorContrasena, setErrorContrasena] = useState('')
    const [inputValidadoRol, setInputValidoRol] = useState(true);
    const [errorRol, setErrorRol] = useState('')
    const [inputValidadoImg, setInputValidoImg] = useState(true);
    const [errorImg, setErrorImg] = useState('')

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

    const [imgUsuario, setImgUsuario] = useState(null); // Cambiado a null
    const [imgPreview, setImgPreview] = useState(''); // Nuevo estado para la URL de la imagen

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImgUsuario(file);
        setImgPreview(URL.createObjectURL(file)); // Crear una URL para la imagen seleccionada

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos MIME permitidos

        if (file && allowedTypes.includes(file.type)) {
            setErrorImg(''); // Limpia el mensaje de error
            setInputValidoImg(true);
            setImgUsuario(file); // Guarda el archivo seleccionado en el estado imgUsuario
            setImgPreview(URL.createObjectURL(file)); // Crea una URL para mostrar la vista previa de la imagen
        } else {
            setErrorImg('Selecciona un archivo de imagen válido (JPEG, PNG, GIF).');
            setInputValidoImg(false);
            setImgUsuario(null); // Restablece el estado de la imagen
            setImgPreview(''); // Restablece la vista previa de la imagen
            event.target.value = null;
        }
    };

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/usuarios/${id_usuario}`);
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

        if (name === 'id_usuario') {
            // Verifica si el valor contiene solo dígitos positivos
            const esNumeroPositivo = /^[0-9/s]+$/.test(value);

            if (value.trim() === '') {
                setErrorTelefono('El campo es obligatorio.');
                setInputValidoTelefono(false);
            } else if (!esNumeroPositivo) {
                setErrorId('No se permiten caracteres especiales ni letras.');
                setInputValidoId(false);
            } else if (value.length < 5) {
                setErrorId('Ingresa más de 5 dígitos.');
                setInputValidoId(false);
            } else if (value.length > 11) {
                setErrorId('Ingresa un máximo de 11 dígitos.');
                setInputValidoId(false);
            } else {
                setErrorId(''); // Limpia el mensaje de error
                setInputValidoId(true);
            }
        }

        if (name === 'nombre_usuario') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorNombre('El campo es obligatorio.');
                setInputValidoNombre(false);
            }
            // Verifica si el valor contiene caracteres especiales
            else if (/[^a-zA-Z0-9\s]/.test(value)) {
                setErrorNombre('No se permiten caracteres especiales.');
                setInputValidoNombre(false);
            }
            // Verifica si la longitud es menor a 5 caracteres
            else if (value.length < 5) {
                setErrorNombre('Ingresa al menos 5 caracteres.');
                setInputValidoNombre(false);
            }
            // Verifica si la longitud es mayor a 30 caracteres
            else if (value.length > 30) {
                setErrorNombre('Ingresa un máximo de 30 caracteres.');
                setInputValidoNombre(false);
            }
            // Si todo es válido
            else {
                setErrorNombre(''); // Limpia el mensaje de error
                setInputValidoNombre(true);
            }
        }

        if (name === 'telefono_usuario') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorTelefono('El campo es obligatorio.');
                setInputValidoTelefono(false);
            }
            // Verifica si el valor contiene caracteres especiales
            else if (/[^0-9\s]/.test(value)) {
                setErrorTelefono('No se permiten caracteres especiales ni letras.');
                setInputValidoTelefono(false);
            }
            // Verifica si la longitud es menor a 5 caracteres
            else if (value.length < 7) {
                setErrorTelefono('Ingresa al menos 7 caracteres.');
                setInputValidoTelefono(false);
            }
            // Verifica si la longitud es mayor a 30 caracteres
            else if (value.length > 10) {
                setErrorTelefono('Ingresa un máximo de 10 caracteres.');
                setInputValidoTelefono(false);
            }
            // Si todo es válido
            else {
                setErrorTelefono(''); // Limpia el mensaje de error
                setInputValidoTelefono(true);
            }
        }

        if (name === 'direccion_usuario') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorDireccion('El campo es obligatorio.');
                setInputValidoDireccion(false);
            }
            // Verifica si la longitud es menor a 5 caracteres
            else if (value.length < 7) {
                setErrorDireccion('Ingresa al menos 7 caracteres.');
                setInputValidoDireccion(false);
            }
            // Verifica si la longitud es mayor a 30 caracteres
            else if (value.length > 30) {
                setErrorDireccion('Ingresa un máximo de 30 caracteres.');
                setInputValidoDireccion(false);
            }
            // Si todo es válido
            else {
                setErrorDireccion(''); // Limpia el mensaje de error
                setInputValidoDireccion(true);
            }
        }

        if (name === 'email') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorEmail('El campo es obligatorio.');
                setInputValidoEmail(false);
            }
            // Verifica si la longitud es menor a 5 caracteres
            else if (value.length < 5) {
                setErrorEmail('Ingresa al menos 7 caracteres.');
                setInputValidoEmail(false);
            }
            // Verifica si la longitud es mayor a 30 caracteres
            else if (value.length > 45) {
                setErrorEmail('Ingresa un máximo de 30 caracteres.');
                setInputValidoEmail(false);
            }
            // Si todo es válido
            else {
                setErrorEmail(''); // Limpia el mensaje de error
                setInputValidoEmail(true);
            }
        }

        if (name === 'contraseña') {
            // Verifica si el campo no está vacío
            if (value.trim() === '') {
                setErrorContrasena('El campo es obligatorio.');
                setInputValidoContrasena(false);
            }
            // Verifica si la longitud es menor a 5 caracteres
            else if (value.length < 8) {
                setErrorContrasena('La contraseña de tener al menos 8 caracteres.');
                setInputValidoContrasena(false);
            }
            // Verifica si la longitud es mayor a 30 caracteres
            else if (value.length > 15) {
                setErrorContrasena('La contraseña debe tener un máximo de 15 caracteres.');
                setInputValidoContrasena(false);
            }
            // Si todo es válido
            else {
                setErrorContrasena(''); // Limpia el mensaje de error
                setInputValidoContrasena(true);
            }
        }

        if (name == 'id_rol') {
            // Verifica si el campo no está vacío
            if (value == 0) {
                setErrorRol('Debes selecionar un rol.');
                setInputValidoRol(false);
            }
            else {
                setErrorRol(''); // Limpia el mensaje de error
                setInputValidoRol(true);
            }
        }

        setUsuario(prevUsuario => ({
            ...prevUsuario,
            [name]: value
        }));
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

        if (!inputValidoId || !inputValidoNombre || !inputValidadoDireccion || !inputValidadoTelefono || !inputValidadoEmail || !inputValidadoContrasena || !inputValidadoRol || !inputValidadoImg) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Verifica todos los campos.",
            });
        } else if (!usuario.id_usuario || !usuario.nombre_usuario || !usuario.direccion_usuario || !usuario.telefono_usuario || !usuario.email || !usuario.contraseña || usuario.id_rol == 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hay campos vacios.",
            });
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
                        const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/usuarios/${usuario.id_usuario}`, {
                            method: 'PUT',
                            body: formUsuario
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
                                            readonly
                                            className={`${!inputValidoId ? estilos.inputInvalido : estilos['input-field2']}`}
                                            type="text"
                                            name="id_usuario"
                                            id={estilos.id_usuario}
                                            value={usuario.id_usuario}
                                            onChange={handleChange}
                                        />
                                        {!inputValidoId && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorId}</p>}
                                    </div>
                                </div>
                                <div className={estilos["formulario__grupo2"]}>
                                    <label htmlFor="nombre">Nombre Completo</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={`${!inputValidoNombre ? estilos.inputInvalido : estilos['input-field2']}`}
                                            type="text"
                                            name="nombre_usuario"
                                            id={estilos.nombre}
                                            value={usuario.nombre_usuario}
                                            onChange={handleChange}
                                        />
                                        {!inputValidoNombre && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorNombre}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__telefono}>
                                    <label htmlFor="telefono_usuario">Teléfono</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={`${!inputValidadoTelefono ? estilos.inputInvalido : estilos['input-field2']}`}
                                            type="text"
                                            name="telefono_usuario"
                                            id={estilos.telefono_usuario}
                                            value={usuario.telefono_usuario}
                                            onChange={handleChange}
                                        />
                                        {!inputValidadoTelefono && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorTelefono}</p>}
                                    </div>
                                </div>
                                <div className={estilos["formulario__grupo2"]} id={estilos.grupo__direccion}>
                                    <label htmlFor="direccion_usuario">Dirección</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={`${!inputValidadoDireccion ? estilos.inputInvalido : estilos['input-field2']}`}
                                            type="text"
                                            name="direccion_usuario"
                                            id={estilos.direccion_usuario}
                                            value={usuario.direccion_usuario}
                                            onChange={handleChange}
                                        />
                                        {!inputValidadoDireccion && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorDireccion}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className={estilos["input-container"]}>
                                <div className={estilos["eo"]}>
                                    <p>Email</p>
                                    <input
                                        className={`${!inputValidadoEmail ? estilos.inputInvalido2 : estilos['input-field']}`}
                                        type="email"
                                        name="email"
                                        id={estilos.email}
                                        value={usuario.email}
                                        onChange={handleChange}
                                    />
                                    {!inputValidadoEmail && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorEmail}</p>}
                                </div>
                            </div>
                            <div className={estilos["input-container"]}>
                                <div className={estilos["formulario__grupo"]} id={estilos.grupo__contraseña}>
                                    <label htmlFor="contraseña">Contraseña</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <input
                                            className={`${!inputValidadoContrasena ? estilos.inputInvalido : estilos['input-field2']}`}
                                            type="password"
                                            name="contraseña"
                                            id={estilos.contraseña}
                                            value={usuario.contraseña}
                                            onChange={handleChange}
                                        />
                                        {!inputValidadoContrasena && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorContrasena}</p>}
                                    </div>
                                </div>
                                <div className={estilos["formulario__grupo2"]} id={estilos.grupo__id_rol}>
                                    <label htmlFor="id_rol">Seleccionar Rol</label>
                                    <div className={estilos["formulario__grupo-input"]}>
                                        <select
                                            className={`${!inputValidadoRol ? estilos.inputInvalido : estilos['input-field2']}`}
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
                                        {!inputValidadoRol && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute' }}>{errorRol}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id={estilos.cosas}>
                            <center>
                                <div className={`${estilos.divImagen} `}>
                                    <p>URL Imagen</p>
                                    <img id={estilos.imagen}
                                        src={imgPreview || usuario.imagen_usuario || 'https://tse2.mm.bing.net/th?id=OIP.U8HnwxkbTkhoZ_DTf7sCSgHaHa&pid=Api&P=0&h=180'}
                                        alt="Imagen del usuario"
                                    />
                                    <div>
                                        <input
                                            id={estilos.imagen_usuario}
                                            className={`${!inputValidadoImg ? estilos.inputInvalido : estilos['input-field2']}`}
                                            type="file"
                                            placeholder="URL de la imagen"
                                            name='imagen_usuario'
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
