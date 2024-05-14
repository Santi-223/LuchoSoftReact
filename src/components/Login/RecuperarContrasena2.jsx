import React, { useState } from "react";
import { Navigate, Link, useParams } from "react-router-dom";
import estilos from '../Login/Login.module.css';
import '../Layout.css';
import Swal from 'sweetalert2';

function RecuperarContrasena2() {

    let { token } = useParams();

    const [usuario, setUsuario] = useState({
        nuevaContraseña: '',
        confirmacionContraseña: ''
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

        console.log('longitud contraseña: ', usuario.nuevaContraseña.length)

        if (usuario.nuevaContraseña.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'La contraseña debe tener mínimo 8 caracteres.',
                showConfirmButton: false,
                timer: 1500
            });
        }
        else if (usuario.nuevaContraseña != usuario.confirmacionContraseña) {
            Swal.fire({
                icon: 'error',
                title: 'La confirmación de contraseña es incorrecta',
                showConfirmButton: false,
                timer: 1500
            });
        }
        else {
            try {
                const response = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/recuperarContrasena', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    },
                    body: JSON.stringify(usuario)
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: `Su contraseña se ha actualizado con exito.`,
                        showConfirmButton: false,
                        timer: 1500
                    });

                    setTimeout(() => {
                        window.location.href = '/#/login';
                    }, 2000);

                } else {
                    const errorData = await response.json();

                    console.error('Error al recuperar la contraseña', errorData.msg);
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
        }
    };

    // Si el usuario no está autenticado, muestra la página de acceso
    return (
        <div>
            <div className={estilos["contenido"]}>
                <center>

                    <div id={estilos.titulo}><img src="/archivos/imagenes/logo.png" width="600px"></img></div>
                </center>
                <div className={estilos["divActualizarContraseña"]}>
                    <form onSubmit={handleSubmit}>
                        <div className={estilos["input-group"]}>
                            <label for="contrasenaAntigua">Ingrese la nueva contraseña</label>
                            <input
                                type="password"
                                id={estilos.correoacceso}
                                required
                                name="nuevaContraseña"
                                value={usuario.nuevaContraseña}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={estilos["input-group"]}>
                            <label for="contrasenaAntigua">Confirme la nueva contraseña</label>
                            <input
                                type="password"
                                id={estilos.correoacceso}
                                required
                                name="confirmacionContraseña"
                                value={usuario.confirmacionContraseña}
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

export default RecuperarContrasena2;
