import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import estilos from '../Dashboard/Dashboard.module.css';
import Modal from '../Modal';
import styled from 'styled-components';

const Dashboard = () => {
  // Obtener el objeto de usuario del localStorage
  const usuarioString = localStorage.getItem('usuario');
  const usuarioLS = JSON.parse(usuarioString); // Convertir de cadena JSON a objeto JavaScript

  console.log('ID - Usuario local:', usuarioLS.id_usuario);

  const [usuario, setUsuario] = useState({
    contraseñaAntigua: '',
    contraseña: '',
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

    console.log('longitud contraseña: ', usuario.contraseña.length)

    if (usuario.contraseña.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'La contraseña debe tener mínimo 8 caracteres.',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else if (usuario.contraseñaAntigua != usuarioLS.contraseña) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña incorrecta',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else if (usuario.contraseña != usuario.confirmacionContraseña) {
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
            const response = await fetch(`http://localhost:8082/configuracion/contrasenaUsuarios/${usuarioLS.id_usuario}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(usuario)
            });

            if (response.ok) {
              console.log('Contraseña actualizada exitosamente.');
              Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada exitosamente',
                showConfirmButton: false,
                timer: 1500
              });
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 1000);
              // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
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

        // Eliminar usuario del localStorage
        localStorage.removeItem('usuario');

        // Eliminar permisos del localStorage
        localStorage.removeItem('permisos');

        window.location.href = '/login';

      }
    });
  };

  const [estadoModalActContraseña, cambiarEstadoModalActContraseña] = useState(false);

  return (
    <div>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      <link href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />

      <div className={estilos["contenido"]}>
        <center>
          <div id={estilos.titulo}><h1>Inicio</h1></div>
          <div id={estilos.perfil}>
            <div id={estilos.imgPerfil}><img src={usuarioLS.imagen_usuario} height="120vh" length="120vh" alt="Perfil" /></div>

            <div id={estilos.iconoEditar}><Link to={`/editarUsuarios/${usuarioLS.id_usuario}`}><i className="fa-solid fa-pen-to-square"></i></Link></div>

            <div id={estilos.usuarioRegistrado}><h6>Administrador</h6></div>
          </div>
        </center>

        <div id={estilos.datos}>
          <div id={estilos.tituloDatos}><h4>Datos:</h4></div>
          <div id={estilos.contenidoDatos}>
            <h6>Cedula: {usuarioLS.id_usuario}</h6>
            <h6>Nombre: {usuarioLS.nombre_usuario}</h6>
            <h6>Dirección: {usuarioLS.direccion_usuario}</h6>
            <h6>Telefono: {usuarioLS.telefono_usuario}</h6>
            <h6>Correo: {usuarioLS.email}</h6>
          </div>
          <div id={estilos.botones}>
            <button onClick={() => cambiarEstadoModalActContraseña(!estadoModalActContraseña)} className={`${estilos["btn-azul-claro"]}`}>Actualizar contraseña</button>
            <button onClick={alertaCerrarSesion} className={`${estilos["btn-rojo"]}`}>Cerrar Sesión</button>
          </div>
        </div>

      </div>
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
                  value={usuario ? usuario.contraseñaAntigua : ''}
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
                  value={usuario ? usuario.contraseña : ''}
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
                  value={usuario ? usuario.confirmacionContraseña : ''}
                  onChange={handleChange}
                />
              </div>
              <br />
              <div className={estilos["cajaBotones"]}>
                <button className={estilos["azul"]} type="submit">Guardar</button>
                <button className={estilos["gris"]} type="button" onClick={() => {
                  cambiarEstadoModalActContraseña(!estadoModalActContraseña), setUsuario({
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

export default Dashboard;
