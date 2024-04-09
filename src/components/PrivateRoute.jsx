import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import Login from '../components/Login/Login';
import Swal from 'sweetalert2';

const PrivateRoute = ({ prot, children }) => {

    let auth = false;

    let permiso = false;

    let cont = false;

    const token = localStorage.getItem('token');

    const usuarioString = localStorage.getItem('usuario');
    const usuario = JSON.parse(usuarioString);

    const permisosString = localStorage.getItem('permisos');
    const permisos = JSON.parse(permisosString);

    const validarToken = async () => {
        console.log("recibo:: ", token)
        try {
            const response = await fetch('http://localhost:8082/configuracion/validarJwt', {
                headers: {
                    'token': token
                }
            });
            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Su sesión ha expirado",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem('token');

                        // Eliminar usuario del localStorage
                        localStorage.removeItem('usuario');
        
                        // Eliminar permisos del localStorage
                        localStorage.removeItem('permisos');
        
                        window.location.href = '/login';
                    }
                });
            }
        } catch (error) {
            console.error('Error al validar el token:', error);
        }
    };

    if (token != null) {
        validarToken();
    }

    console.log('Token local en Private: ', token);
    console.log('Usuario local en Private:', usuario);
    console.log('Permisos local en Private:', permisos);

    console.log("prot: ", prot)

    if (token != null) {
        auth = true
    } else {
        console.log("No autenticado")
    }

    if (permisos && permisos.includes(prot) || prot === 0) {
        permiso = true;
    }

    console.log("El permiso es: ", permiso)

    if (auth && permiso) {
        cont = true
    }

    if (auth) {
        return cont ? children : <Navigate to="/dashboard" />
    } else {
        return cont ? children : <Navigate to="/login" />
    }

}

export default PrivateRoute;
