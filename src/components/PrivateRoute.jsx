import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import Login from '../components/Login/Login';
import Swal from 'sweetalert2';
import { useUserContext } from "../components/UserProvider";

const PrivateRoute = ({ publ, prot, children }) => {

    const { usuarioLogueado, permisos } = useUserContext();

    let auth = false;

    let permiso = false;

    let cont = false;

    let admin = false;

    const token = localStorage.getItem('token');

    const validarToken = async () => {
        try {
            const response = await fetch('https://api-luchosoft-mysql.onrender.com/configuracion/validarJwt', {
                headers: {
                    'token': token
                }
            });
            if (!response.ok) {
                window.location.href = '/#/login';

                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text: "Su sesión ha expirado",
                    showConfirmButton: false
                })
                localStorage.removeItem('token');

                // Eliminar usuario del localStorage
                localStorage.removeItem('usuario');

                // Eliminar permisos del localStorage
                localStorage.removeItem('permisos');

            }
        } catch (error) {
            console.error('Error al validar el token:', error);
        }
    };

    if (token != null) {
        validarToken();
    }


    if (token != null) {
        auth = true
    } else {
        console.log("No autenticado")
    }

    if (permisos && permisos.includes(prot) || prot === 0) {
        permiso = true;
    }

    if(auth){
        if(usuarioLogueado.id_rol === 1){
            admin = true;
        }
    }

    if (auth && permiso) {
        cont = true
    }

    console.log("admin? ", admin)

    if(publ && !auth){
        return children;
    }else if (publ && auth && cont){
        return <Navigate to="/Dashboard"/>
    }else if (!publ && auth){
        return cont ? children : <Navigate to="/Perfil" />
    }else{
        return <Navigate to="/login"/>
    }

}

export default PrivateRoute;
