import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import estilos from '../Perfil/Perfil.module.css';
import Modal from '../Modal';
import styled from 'styled-components';
import { useUserContext } from "../UserProvider";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';

const Perfil = () => {

  const [cerrarSesion, setCerrarSesion] = useState(false);

  const { usuarioLogueado } = useUserContext();

  const usuarioLS = usuarioLogueado;

  const [usuarioL2, setUsuarioL2] = useState({});

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchUsuario();
    fetchRoles();
  }, []);

  const [usuario2, setUsuario2] = useState({
    contraseñaAntigua: '',
    contraseña: '',
    confirmacionContraseña: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUsuario2(prevUsuario2 => ({
      ...prevUsuario2,
      [name]: value
    }));
  };

  const fetchUsuario = async () => {
    try {
      const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/usuarios/${usuarioLS.id_usuario}`);
      if (response.ok) {
        const data = await response.json();
        const usuarioFiltrado = data[0];
        setUsuarioL2(usuarioFiltrado);
        console.log(usuarioFiltrado)
      } else {
        console.error('Error al obtener el usuario');
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    console.log(usuario2)

    console.log('longitud contraseña: ', usuario2.contraseña.length)

    console.log("usuario logueado: ", usuarioL2)

    if (usuario2.contraseña.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'La contraseña debe tener mínimo 8 caracteres.',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else if (usuario2.contraseñaAntigua != usuarioL2.contraseña) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña incorrecta',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else if (usuario2.contraseña != usuario2.confirmacionContraseña) {
      Swal.fire({
        icon: 'error',
        title: 'La confirmación de contraseña es incorrecta',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas actualizar la contraseña?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(`https://api-luchosoft-mysql.onrender.com/configuracion/contrasenaUsuarios/${usuarioLS.id_usuario}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(usuario2)
            });

            if (response.ok) {
              console.log('Contraseña actualizada exitosamente, debes volver a iniciar sesión.');
              Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada exitosamente, debes volver a iniciar sesión.',
                showConfirmButton: false,
                timer: 1800
              });
              localStorage.removeItem('token');

              // Eliminar usuario del localStorage
              localStorage.removeItem('usuario');

              // Eliminar permisos del localStorage
              localStorage.removeItem('permisos');

              setTimeout(() => {
                window.location.href = '/#/login';
              }, 1800);

            } else {
              console.error('Error al actualizar la contraseña:', response.statusText);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar la contraseña',
              });
            }
          } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al actualizar la contraseña',
            });
          }
        }
      });
    }



  };

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
        console.error('Error al obtener las compras');
      }
    } catch (error) {
      console.error('Error al obtener las compras:', error);
    }
  };

  const alertaCerrarSesion = () => {
    // Mostrar una alerta de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Estás a punto de cerrar sesión.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes agregar la lógica para cerrar la sesión
        // Por ejemplo, redirigir a la página de inicio de sesión
        // Eliminar token del localStorage
        localStorage.removeItem('token');

        // Eliminar usuario2 del localStorage
        localStorage.removeItem('usuario2');

        // Eliminar permisos del localStorage
        localStorage.removeItem('permisos');

        setCerrarSesion(true);

      }
    });
  };

  const [estadoModalActContraseña, cambiarEstadoModalActContraseña] = useState(false);

  if (cerrarSesion) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={estilos.div1}>
      <MDBCard className={`mb-3 ${estilos.card}`} style={{ borderRadius: '.5rem' }}>
        <MDBRow className="g-0 w-100 ${es}">
          <MDBCol md="4" className={`gradient-custom text-center text-white ${estilos.bgcustom}`}
            style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem', heigh: '400px' }}>
            <br />
            <br />
            <br />
            <MDBCardImage src={usuarioLS && usuarioLS.imagen_usuario}
              alt="Avatar" className="my-4" style={{ borderRadius: '50%', width: '80px' }} fluid />
            <MDBTypography tag="h5">{usuarioLS && usuarioLS.nombre_usuario}</MDBTypography>
            <MDBCardText>{
              roles.map(rol => {
                if (rol.id_rol === usuarioLS.id_rol) {
                  return rol.nombre_rol;
                } else {
                  return null;
                }
              })}</MDBCardText>
            <Link to={`/editarPerfil/${usuarioLS && usuarioLS.id_usuario}`}>
              <MDBIcon far icon="edit mb-5" style={{ fontSize: '1.5em', color: '#ffbd2f' }} />
            </Link>
            <br />
            <br />
            <br />
          </MDBCol>
          <MDBCol md="8">
            <MDBCardBody className="p-4">
              <MDBTypography tag="h6">Información</MDBTypography>
              <hr className="mt-0 mb-4" />
              <MDBRow className="pt-1">
                <MDBCol size="6" className="mb-3">
                  <MDBTypography tag="h6">Nombre</MDBTypography>
                  <MDBCardText className="text-muted">{usuarioLS && usuarioLS.nombre_usuario}</MDBCardText>
                </MDBCol>
                <MDBCol size="6" className="mb-3">
                  <MDBTypography tag="h6">Email</MDBTypography>
                  <MDBCardText className="text-muted">{usuarioLS && usuarioLS.email}</MDBCardText>
                </MDBCol>
                <MDBCol size="6" className="mb-3">
                  <MDBTypography tag="h6">Teléfono</MDBTypography>
                  <MDBCardText className="text-muted">{usuarioLS && usuarioLS.telefono_usuario}</MDBCardText>
                </MDBCol>
                <MDBCol size="6" className="mb-3">
                  <MDBTypography tag="h6">Dirección</MDBTypography>
                  <MDBCardText className="text-muted">{usuarioLS && usuarioLS.direccion_usuario}</MDBCardText>
                </MDBCol>
              </MDBRow>
              {/* 
              <div className="d-flex justify-content-start">
                <a href="#!"><MDBIcon fab icon="facebook me-3" size="lg" /></a>
                <a href="#!"><MDBIcon fab icon="twitter me-3" size="lg" /></a>
                <a href="#!"><MDBIcon fab icon="instagram me-3" size="lg" /></a>
              </div> */}
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
        <div className={estilos.bottomRightButtons}>
          <button onClick={() => cambiarEstadoModalActContraseña(!estadoModalActContraseña)} className={` me-2 ${estilos.botonesBordeRojo}`}>Reestablecer contraseña</button>
        </div>
      </MDBCard>
      <Modal
        estado={estadoModalActContraseña}
        cambiarEstado={cambiarEstadoModalActContraseña}
        titulo="Actualizar Contraseña"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={'center'}
        width={'500px'}
        padding={'20px'}
      >
        <Contenido>
          <div>
            <form onSubmit={handleSubmit}>
              <div className={estilos["input-group"]}>
                <label for="contrasenaAntigua">Contraseña antigua</label>
                <input
                  className={estilos["inputs"]}
                  required
                  type="password"
                  id={estilos.contrasenaAntigua}
                  name="contraseñaAntigua"
                  value={usuario2 ? usuario2.contraseñaAntigua : ''}
                  onChange={handleChange} />
              </div>
              <div className={estilos["input-group"]}>
                <br />
                <label for="contrasenaNueva">Contraseña nueva</label>
                <input
                  className={estilos["inputs"]}
                  required
                  type="password"
                  id={estilos.contrasenaNueva}
                  name="contraseña"
                  value={usuario2 ? usuario2.contraseña : ''}
                  onChange={handleChange}
                />
              </div>
              <div className={estilos["input-group"]}>
                <br />
                <label for="confirmarContrasena">Confirmar contraseña nueva</label>
                <input
                  className={estilos["inputs"]}
                  type="password"
                  id={estilos.confirmarContrasena}
                  required
                  name="confirmacionContraseña"
                  value={usuario2 ? usuario2.confirmacionContraseña : ''}
                  onChange={handleChange}
                />
              </div>
              <br />
              <div className={estilos["cajaBotones"]}>
                <button className={estilos["azul"]} type="submit">Guardar</button>
                <button className={estilos["gris"]} type="button" onClick={() => {
                  cambiarEstadoModalActContraseña(!estadoModalActContraseña), setUsuario2({
                    contraseñaAntigua: '',
                    contraseña: '',
                    confirmacionContraseña: ''
                  })
                }}>Cancelar</button>
              </div>
            </form>
          </div>
        </Contenido>
      </Modal>
    </div>
    // <div>
    //   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
    //   <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
    //   <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
    //   <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
    //   <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />

    //   <div className={estilos["contenido"]}>
    //     <center>
    //       <div id={estilos.titulo}><h1>Perfil</h1></div>
    //       <div id={estilos.perfil}>
    //         <div id={estilos.imgPerfil}><img src={usuarioLS && usuarioLS.imagen_usuario} height="120vh" length="120vh" alt="Perfil" /></div>
    //         <div id={estilos.divEd}>
    //           <div id={estilos.usuario2Registrado}><p>{
    //             roles.map(rol => {
    //               if (rol.id_rol === usuarioLS.id_rol) {
    //                 return rol.nombre_rol;
    //               } else {
    //                 return null;
    //               }
    //             })}</p></div><div id={estilos.iconoEditar}><Link to={`/editarPerfil/${usuarioLS && usuarioLS.id_usuario}`}><i className="fa-solid fa-pen-to-square"></i></Link></div>
    //         </div>
    //       </div>
    //     </center>

    //     <div id={estilos.datos}>
    //       <div id={estilos.tituloDatos}><h4>Datos:</h4></div>
    //       <div id={estilos.contenidoDatos}>
    //         <h6>Cedula: {usuarioLS && usuarioLS.id_usuario}</h6>
    //         <h6>Nombre: {usuarioLS && usuarioLS.nombre_usuario}</h6>
    //         <h6>Dirección: {usuarioLS && usuarioLS.direccion_usuario}</h6>
    //         <h6>Telefono: {usuarioLS && usuarioLS.telefono_usuario}</h6>
    //         <h6>Correo: {usuarioLS && usuarioLS.email}</h6>
    //       </div>
    //       <div id={estilos.botones}>
    //         <button onClick={() => cambiarEstadoModalActContraseña(!estadoModalActContraseña)} className={`${estilos["btn-azul-claro"]}`}>Actualizar contraseña</button>
    //         <button onClick={alertaCerrarSesion} className={`${estilos["btn-rojo"]}`}><i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</button>
    //       </div>
    //     </div>

    //   </div>
    // </div>
  );
}

const Contenido = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	h1 {
		font-size: 42px;
		font-weight: 700;
		margin-bottom: 10px;
	}

	p {
		font-size: 18px;
		margin-bottom: 20px;
	}

	img {
		width: 100%;
		vertical-align: top;
		border-radius: 3px;
	}
`;

export default Perfil;
