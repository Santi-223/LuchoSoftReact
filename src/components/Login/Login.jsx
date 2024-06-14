import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import '../Login/Login.css';
import '../Layout.css';
import Swal from 'sweetalert2';
import { CSSTransition } from 'react-transition-group';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput
}
    from 'mdb-react-ui-kit';

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

    // Si el usuario está autenticado, redirige al Perfil
    if (usuarioAutenticado) {
        return <CSSTransition in={true} timeout={500} classNames="pagina">
            <Navigate to="/Perfil" />
        </CSSTransition>
    }

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

                            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px', marginLeft: '30vh' }}>Log in</h3>
                            <form onSubmit={handleSubmit}>
                                <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Usuario' id='formControlLg' type='email' size="lg"
                                    required
                                    name="email"
                                    value={usuario.email}
                                    onChange={handleChange} />
                                <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Contraseña' id='formControlLg' type='password' size="lg"
                                    required
                                    name="contraseña"
                                    value={usuario.contraseña}
                                    onChange={handleChange} />

                                <MDBBtn type="submit" className="mb-4 px-5 mx-5 w-100" color='info' size='lg'>Login</MDBBtn>
                                <Link to={'/recuperarContrasena'}>
                                    <p className="small mb-5 pb-lg-3 ms-5"><a class="text-muted" href="#!">¿Olvidaste tu contraseña?</a></p>
                                </Link>

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

export default Acceso;
