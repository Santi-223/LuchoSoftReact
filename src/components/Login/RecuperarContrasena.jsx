import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import estilos from '../Login/Login.module.css';
import '../Layout.css';
import Swal from 'sweetalert2';

function RecuperarContrasena() {


    const [usuario, setUsuario] = useState({
        email: '',
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
            const response = await fetch('http://localhost:8082/configuracion/enviarCorreo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: `Se le notificara un correo con el enlace para recuperar su contraseña.`,
                    showConfirmButton: false,
                    timer: 1500
                });

                setTimeout(() => {
                    window.location.href = '/#/login';
                  }, 2000);

            } else {
                const errorData = await response.json();

                console.error('Error al enviar el correo', response);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.msg,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error',
            });
        }
    };

    // Si el usuario no está autenticado, muestra la página de acceso
    return (
        <div>
            <div className={estilos["contenido"]}>
                <center>

                    <div id={estilos.titulo}><h1>Recuperar contraseña</h1></div>
                </center>
                <div className={estilos["divActualizarContraseña"]}>
                    <form onSubmit={handleSubmit}>
                        <div className={estilos["input-group"]}>
                            <label for="contrasenaAntigua">Ingrese el correo electronico de recuperación</label>
                            <input
                                type="email"
                                id={estilos.correoacceso}
                                required
                                name="email"
                                value={usuario.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={estilos["cajaBotonesRegistro"]}>
                            <button className={estilos["rojo"]} type="submit">Enviar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}

export default RecuperarContrasena;
