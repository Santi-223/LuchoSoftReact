import React from "react";
import estilos from '../Dashboard/Dashboard.module.css'

function ActualizarContraseña() {
    return (
        <div>
            <center>
                <div id={estilos.titulo}>
                    <h1>Actualizar contraseña</h1>
                </div>
            </center>
            <div className={estilos["divActualizarContraseña"]}>
                <div className={estilos["input-group"]}>
                    <label for="contrasenaAntigua">Contraseña antigua</label>
                    <input type="password" id={estilos.contrasenaAntigua} required />
                </div>
                <div className={estilos["input-group"]}>
                    <label for="contrasenaNueva">Contraseña nueva</label>
                    <input type="password" id={estilos.contrasenaNueva} required />
                </div>
                <div className={estilos["input-group"]}>
                    <label for="confirmarContrasena">Confirmar contraseña nueva</label>
                    <input type="password" id={estilos.confirmarContrasena} required />
                </div>
                <div className={estilos["cajaBotones"]}>
                    <br/>
                    <center>
                        <button className={estilos["vinotinto"]} type="submit">Guardar</button>
                        <button className={estilos["rojo"]} type="button" onclick="window.location.href='Inicio.html'">Cancelar</button>
                    </center>
                </div>
            </div>
        </div>
    );
}

export default ActualizarContraseña;