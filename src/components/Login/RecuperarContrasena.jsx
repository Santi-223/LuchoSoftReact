import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import '../Login/Login.css';
import '../Layout.css';
import Swal from 'sweetalert2';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput
}
    from 'mdb-react-ui-kit';

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
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/enviarCorreo', {
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
        <div style={{ objectFit: 'cover', objectPosition: 'left', margin: 'auto', marginTop: '65px' }} >

            <link rel="stylesheet" href="https://mdbcdn.b-cdn.net/wp-content/themes/mdbootstrap4/docs-app/css/dist/mdb5/react/core.min.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
            <MDBContainer fluid>
                <MDBRow>

                    <MDBCol sm='6'>
                        <br />
                        <br />
                        <center>
                            <div>
                                <img src="/archivos/imagenes/logo.png"
                                    alt="Login image" style={{
                                        objectFit: 'cover', objectPosition: 'left', width: '60vh', marginLeft: '13vh'
                                    }} />
                            </div>
                        </center>
                        <br />
                        <div style={{ maxWidth: '75vh', maxHeight: '75vh', objectFit: 'cover', objectPosition: 'left', margin: 'auto', marginTop: '' }}>

                            <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px', marginLeft: '21vh' }}>Recuperar contraseña</h3>
                            <form onSubmit={handleSubmit}>
                                <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Ingrese el email de recuperación' id='formControlLg' type='email' size="lg"
                                    required
                                    name="email"
                                    value={usuario.email}
                                    onChange={handleChange}
                                />
                                <div className="cajaBotonesLogin" style={{ maxWidth: '75vh', maxHeight: '75vh', marginLeft: '15vh'}}>
                                    <button className="text-white bg-info rojoLogin" type="submit">Enviar</button>
                                    <Link to='acceso'>
                                        <button className="grisLLogin" type="button">Cancelar</button>
                                    </Link>
                                </div>
                            </form>
                        </div>

                    </MDBCol>

                    <MDBCol sm='6' className='d-none d-sm-block px-0' style={{ textAlign: 'center' }}>
                        <img src="http://res.cloudinary.com/donirviw7/image/upload/v1718288651/jktiobyufc8ol7kgggt4.jpg"
                            alt="Login image" className="w-100" style={{ maxWidth: '80vh', maxHeight: '80vh', objectFit: 'cover', objectPosition: 'left', margin: 'auto', marginTop: '' }} />
                    </MDBCol>



                </MDBRow>

            </MDBContainer>
        </div>

    );
}

export default RecuperarContrasena;
