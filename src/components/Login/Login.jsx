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
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/auth/login', {
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
                            <Link to={'/recuperarContrasena'}>
                                <label className={["yellow-underline"]}>Recuperar contraseña</label>
                            </Link>
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
