import React, { useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwtcls
-decode";

const userContext = React.createContext();

export function useUserContext() {
    return useContext(userContext);
}

export function UserProvider(props) {
    let token = null;
    let usuario = null;
    let permisos = [];

    const storedToken = localStorage.getItem('token');
    token = storedToken;

    // Decodificar el token y obtener el payload
    if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        usuario = decodedToken.usuario;
        permisos = decodedToken.permisos;
    }

    const userContextValue = {
        usuario: usuario,
        token: token,
        permisos: permisos
    };

    return (
        <userContext.Provider value={userContextValue}>
            {props.children}
        </userContext.Provider>
    );
}
