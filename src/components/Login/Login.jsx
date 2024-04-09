import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import estilos from '../Login/Login.module.css';
import '../Layout.css';
import Swal from 'sweetalert2';

function Acceso() {

    const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

    const [usuario, setUsuario] = useState({
        email: '',
        contraseña: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUsuario(prevUsuario => ({
            ...prevUsuario,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(usuario)

        try {
            const response = await fetch('http://localhost:8082/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                const data = await response.json(); // Convertir la respuesta a JSON

                // Almacenar en el localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                localStorage.setItem('permisos', JSON.stringify(data.permisos));

                // Obtener el token del localStorage
                const token = localStorage.getItem('token');

                // Obtener el objeto de usuario del localStorage
                const usuarioString = localStorage.getItem('usuario');
                const usuario = JSON.parse(usuarioString); // Convertir de cadena JSON a objeto JavaScript

                // Obtener los permisos del localStorage
                const permisosString = localStorage.getItem('permisos');
                const permisos = JSON.parse(permisosString); // Convertir de cadena JSON a objeto JavaScript



                Swal.fire({
                    icon: 'success',
                    title: `Acceso exitoso`,
                    showConfirmButton: false,
                    timer: 1500
                });

                setUsuarioAutenticado(true);
                // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
            } else {
                console.error('Error al accceder:', response.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Usuario o contraseña incorrecto',
                });
            }
        } catch (error) {
            console.error('Error al acceder:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al acceder',
            });
        }
    };

    // Si el usuario está autenticado, redirige al dashboard
    if (usuarioAutenticado) {
        return <Navigate to="/dashboard" />;
    }

    // Si el usuario no está autenticado, muestra la página de acceso
    return (
        <div>
            <div className={estilos["contenido"]}>
                <center>

                    <div id={estilos.titulo}><h1>Bienvenido</h1></div>
                </center>
                <div className={estilos["divActualizarContraseña"]}>
                    <form onSubmit={handleSubmit}>
                        <div className={estilos["input-group"]}>
                            <label for="contrasenaAntigua">Ingrese correo</label>
                            <input
                                type="email"
                                id={estilos.correoacceso}
                                required
                                name="email"
                                value={usuario.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={estilos["input-group"]}>
                            <label for="password">Ingrese contraseña</label>
                            <input
                                type="password"
                                id={estilos.contrasenaacceso}
                                required
                                name="contraseña"
                                value={usuario.contraseña}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className={["yellow-underline"]} onclick="window.location.href='RecuperarContraseña.html'">Recuperar contraseña</label>
                        </div>
                        <div className={estilos["cajaBotonesRegistro"]}>
                            <button className={estilos["rojo"]} type="submit">Acceder</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        /**<div>
            <h1>Página de Acceso</h1>
            <button onClick={handleLogin}>Iniciar Sesión</button>
        </div>**/
    );
}

export default Acceso;
