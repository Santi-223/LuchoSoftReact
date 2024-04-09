import React from "react";
import { Link } from "react-router-dom";

const RegistrarCliente = () => {
    return (
        <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="contRCliente">
                <br />
                <center>
                    <h3>
                        Agregar Cliente
                    </h3>
                </center>
                <br />
                <div className="contFormsRCliente">
                    <div className="input1RCliente">
                        <p><i className="fa-solid fa-key iconosRojosRCliente"></i> ID del cliente</p>
                        <input id="id_cliente" className="input-field" type="number" placeholder="Ingrese el id"/>
                    </div>
                    <br/>
                    <div className="input1RCliente">
                        <p><i className="fa-solid fa-font iconosRojosRCliente"></i> Nombre del cliente</p>
                        <input id="nombre_cliente" className="input-field" type="text" placeholder="Ingrese el nombre"/>
                    </div>
                    <br/>
                    <div className="input1RCliente">
                        <p><i className="fa-solid fa-phone iconosRojosRCliente"></i> Telefono del cliente</p>
                        <input id="telefono_cliente" className="input-field" type="text" placeholder="Ingrese el telefono"/>
                    </div>
                    <br/>
                    <div className="input1RCliente">
                        <p><i className="fa-sharp fa-solid fa-location-dot iconosRojosRCliente"></i> Dirección del cliente</p>
                        <input id="direccion_cliente" className="input-field" type="text" placeholder="Ingrese la dirección"/>
                    </div>
                    <br/>
                </div>
                <center>
                    <div className="cajaBotonesRCliente">
                        <button onclick="validarCamposAgregar()" className="vinotintoRCliente" type="submit">Guardar</button>
                        <div className="espacioEntreBotonesRCliente"></div>
                        <Link to="/clientes">
                            <button className="rojoRCliente" type="button" onclick="window.location.href='Clientes.html'">Cancelar</button>
                        </Link>
                    </div>
                </center>
                <br />
            </div>
        </>
    )
}
export default RegistrarCliente;