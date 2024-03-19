import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import estilos from '../Dashboard/Dashboard.module.css';

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
      window.location.href = '/login';
    }
  });
};

const Dashboard = () => {
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
            <div id={estilos.imgPerfil}><img src="archivos/imagenes/Profile.png" height="120vh" length="120vh" alt="Perfil" /></div>
            <div id={estilos.iconoEditar}><i className="fa-solid fa-pen-to-square"></i></div>
            <div id={estilos.usuarioRegistrado}><h6>Administrador</h6></div>
          </div>
        </center>

        <div id={estilos.datos}>
          <div id={estilos.tituloDatos}><h4>Datos:</h4></div>
          <div id={estilos.contenidoDatos}>
            <h6><i className="fa-solid fa-id-card"></i> Cedula: 10000230</h6>
            <h6><i className="fa-solid fa-font"></i> Nombre: juan</h6>
            <h6><i className="fa-sharp fa-solid fa-location-dot"></i> Dirección: cr32 #41-12</h6>
            <h6><i className="fa-solid fa-phone"></i> Telefono: 3281712</h6>
            <h6><i className="fa-solid fa-envelope"></i> Correo: juan@hotmail.com</h6>
            <h6><i className="fa-solid fa-lock"></i> Contraseña: *******</h6>
          </div>
          <div id={estilos.botones}>
            <Link to="/actualizarContraseña">
              <button className={`${estilos["btn-rojo-claro"]}`}>Actualizar contraseña</button>
            </Link>
            <button onClick={alertaCerrarSesion} className={`${estilos["btn-rojo"]}`}>Cerrar Sesión</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
