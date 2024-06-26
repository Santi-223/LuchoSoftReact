import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import $ from "jquery";
import "../../Layout.css";
import estilos from "./TablaProveedores.module.css";
import Swal from "sweetalert2";
import Modal from "./modal";
import styled from "styled-components";
import DataTable from "react-data-table-component";


function Proveedores() {
  const token = localStorage.getItem("token");
  const [proveedores, setProveedores] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estadoModaleditar, cambiarEstadoModalEditar] = useState(false);

  const [inputNombreValido, setInputNombreValido] = useState(true);
  const [inputNombreValido2, setInputNombreValido2] = useState(true);
  const [inputNombreValido3, setInputNombreValido3] = useState(true);

  const [inputTipoValido, setInputTipoValido] = useState(true);

  const [inputDocValido, setInputDocValido] = useState(true);
  const [inputDocValido3, setInputDocValido3] = useState(true);

  const [inputTelValido, setInputTelValido] = useState(true);
  const [inputTelValido3, setInputTelValido3] = useState(true);

  const [inputDirecValido, setInputDirecValido] = useState(true);
  const [inputDirecValido2, setInputDirecValido2] = useState(true);
  const [inputDirecValido3, setInputDirecValido3] = useState(true);

  const [proveedores1, setProveedores1] = useState({
    nombre_proveedor: "",
    documento_proveedor: "",
    telefono_proveedor: "",
    direccion_proveedor: "",
    estado_proveedor: 1,
    tipo_documento: "",
  });
  const [proveedoresEditar, setProveedoresEditar] = useState({
    nombre_proveedor: "",
    documento_proveedor: "",
    telefono_proveedor: "",
    direccion_proveedor: "",
    estado_proveedor: 1,
    tipo_documento: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [estadoModalAgregar, cambiarEstadoModalAgregar] = useState(false);

  const tableRef = useRef(null);
  const [filtro, setFiltro] = useState("");

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };
  const filteredproveedores = proveedores.filter(
    (proveedor) =>
      proveedor.id_proveedor.toString().includes(filtro) ||
      proveedor.nombre_proveedor.toLowerCase().includes(filtro.toLowerCase()) ||
      proveedor.documento_proveedor.toString().toLowerCase().includes(filtro) ||
      proveedor.telefono_proveedor.toString().includes(filtro) ||
      proveedor.direccion_proveedor.toString().toLowerCase().includes(filtro.toLowerCase()) ||
      proveedor.estado_proveedor.toString().includes(filtro) ||
      proveedor.tipo_documento.toString().toLowerCase().includes(filtro.toLowerCase())
  );



  const handleEliminarProveedor = (idProveedor) => {
    // Mostrar un mensaje de confirmación antes de eliminar
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este proveedor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://api-luchosoft-mysql.onrender.com/compras/proveedores/${idProveedor}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
            }
          );

          if (response.ok) {
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Proveedor elminado exitosamente."
            })

            fetchproveedores();
          } else {
            console.error(
              "Error al eliminar el proveedor:",
              response.statusText
            );
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "El proveedor está siendo usado en alguna compra",
            });
          }
        } catch (error) {
          console.error("Error al eliminar el proveedor:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al eliminar el proveedor",
          });
        }
      }
    });
  };

  const columns = [
    {
        name: "Id",
        selector: (row) => row.id_proveedor,
        sortable: true
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre_proveedor,
      sortable: true,
    },
    // {
    //   name: "Tipo Doc",
    //   selector: (row) => row.tipo_documento,
    //   sortable: true,
    // },
    {
      name: "Documento",
      cell: (row) =>(
        <div>
            <a>{row.tipo_documento}ㅤ{row.documento_proveedor}</a>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.telefono_proveedor,
      sortable: true,
    },
    {
      name: "Dirección",
      selector: (row) => row.direccion_proveedor,
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row) => (
        <div className={estilos["acciones"]}>
          <button
            className={estilos.boton}
            onClick={() =>
              handleEstadoproveedor(row.id_proveedor, row.estado_proveedor)
            }
            style={{ cursor: "pointer", textAlign: "center", fontSize: "30px" }}
          >
            {row.estado_proveedor === 1 ? (
              <i className="bi bi-toggle-on" style={{ color: "#48110d" }}></i>
            ) : (
              <i
                className="bi bi-toggle-off"
                style={{ width: "60px", color: "black" }}
              ></i>
            )}
          </button>
        </div>
      ),
    },
    {
      name: "ㅤㅤAcciones",
      cell: (row) => (
        <div className={estilos["acciones"]}>
          <button
            onClick={() => {
              if (row.estado_proveedor === 1) {
                // Solo abre el modal si el estado es activo
                setSelectedItem(row);
                setIsModalOpen(true);
              }
            }}
            className={estilos.boton}
            style={{ cursor: "pointer", textAlign: "center", fontSize: "25px" }}
          >
            <i
              className={`bi ${
                row.estado_proveedor === 0 ? "bi-eye-slash cerrado" : "bi-eye"
              }`}
              style={{
                color: row.estado_proveedor === 0 ? "gray" : "#1A008E",
                pointerEvents: row.estado_proveedor === 0 ? "none" : "auto",
              }}
            ></i>
          </button>
          {/* Botón para editar */}
          <button
            onClick={() => {
              if (row.estado_proveedor === 1) {
                cambiarEstadoModalEditar(!estadoModaleditar);
                setProveedoresEditar(row);
              }
            }}
            className={estilos.boton}
            style={{ cursor: "pointer", textAlign: "center", fontSize: "20px" }}
          >
            <i
              className={`fa-solid fa-pen-to-square ${
                row.estado_proveedor === 1
                  ? "iconosNaranjas"
                  : "iconosGris"
              }`}
            ></i>
          </button>

          <button
            onClick={() => handleEliminarProveedor(row.id_proveedor)}
            disabled={row.estado_proveedor === 0}
            className={estilos.boton}
            style={{ cursor: "pointer", textAlign: "center", fontSize: "25px" }}
          >
            <i
              className={`bi bi-trash ${
                row.estado_proveedor === 0 ? "basuraDesactivada" : ""
              }`}
              style={{ color: row.estado_proveedor === 0 ? "gray" : "red" }}
            ></i>
          </button>
        </div>
      ),
    },

    // Resto de columnas
  ];

  const handleSubmitEditar = async (event) => {
    event.preventDefault();

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.nombre_proveedor && !proveedoresEditar.tipo_documento && !proveedoresEditar.telefono_proveedor && !proveedoresEditar.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.nombre_proveedor && !proveedoresEditar.tipo_documento && !proveedoresEditar.direccion_proveedor
    ) {
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.nombre_proveedor && !proveedoresEditar.telefono_proveedor && !proveedoresEditar.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.tipo_documento && !proveedoresEditar.telefono_proveedor && !proveedoresEditar.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.nombre_proveedor && !proveedoresEditar.tipo_documento && !proveedoresEditar.telefono_proveedor && !proveedoresEditar.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.nombre_proveedor && !proveedoresEditar.direccion_proveedor
    ) {

      setInputDocValido3(false)

      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.tipo_documento && !proveedoresEditar.direccion_proveedor
    ) {

      setInputDocValido3(false)
      setInputTipoValido(false)

      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.nombre_proveedor && !proveedoresEditar.tipo_documento && !proveedoresEditar.direccion_proveedor
    ) {
      setInputTipoValido(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.telefono_proveedor && !proveedoresEditar.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.nombre_proveedor && !proveedoresEditar.telefono_proveedor && !proveedoresEditar.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.tipo_documento && !proveedoresEditar.telefono_proveedor && !proveedoresEditar.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputTipoValido(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.nombre_proveedor && !proveedoresEditar.tipo_documento && !proveedoresEditar.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.nombre_proveedor && !proveedoresEditar.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.tipo_documento && !proveedoresEditar.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputTipoValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
       !proveedoresEditar.nombre_proveedor && !proveedoresEditar.tipo_documento && !proveedoresEditar.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.nombre_proveedor && !proveedoresEditar.tipo_documento
    ) {
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.tipo_documento && !proveedoresEditar.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputTipoValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)

      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.nombre_proveedor && !proveedoresEditar.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }



    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.nombre_proveedor
    ) {
      setInputDocValido3(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.documento_proveedor && !proveedoresEditar.tipo_documento
    ) {
      setInputDocValido3(false)
      setInputTipoValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.tipo_documento && !proveedoresEditar.nombre_proveedor
    ) {
      setInputTipoValido(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedoresEditar.tipo_documento
    ) {

      setInputTipoValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor completa todos los campos vacíos",
      });
      
      return;
    }

    if (!inputTelValido) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    
    if (!inputTelValido3) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    if (!inputDocValido) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    
    if (!inputDocValido3) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }
    
    if (!inputNombreValido) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }


    if (!inputNombreValido2) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    if (
      !proveedoresEditar.nombre_proveedor
    ) {

      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor completa todos los campos",
      });
      
      return;
    }

        // Validar que el nombre tenga al menos 3 letras
        if (proveedoresEditar.nombre_proveedor.length < 2) {
          Swal.fire({
            icon: "error",
            text: "El nombre del proveedor debe tener al menos 2 letras",
          });
          setInputNombreValido(false)
          return;
        }

        if (
          !proveedoresEditar.telefono_proveedor
        ) {
    
          setInputTelValido3(false)
          Swal.fire({
            icon: "error",
             
            text: "Por favor completa todos los campos",
          });
          
          return;
        }
    


        if (
          !proveedoresEditar.documento_proveedor
        ) {
    
          setInputDocValido3(false)
          Swal.fire({
            icon: "error",
             
            text: "Por favor completa todos los campos",
          });
          
          return;
        }
    
            // Validar que el nombre tenga al menos 3 letras
            if (proveedoresEditar.documento_proveedor.length < 7) {
              setInputDocValido(false)
              Swal.fire({
                icon: "error",
                text: "El documento del proveedor debe tener al menos 7 dígitos",
              });
              
              return;
            }


            // Validar que el nombre tenga al menos 3 letras
            if (proveedoresEditar.telefono_proveedor.length < 7) {
              setInputTelValido(false)
              Swal.fire({
                icon: "error",
                text: "El teléfono del proveedor debe tener al menos 7 dígitos",
              });
              
              return;
            }



    // Verificar que todos los campos estén llenos
    const {
      nombre_proveedor,
      documento_proveedor,
      telefono_proveedor,
      direccion_proveedor,
    } = proveedoresEditar;
    if (
      nombre_proveedor.trim() !== "" &&
      telefono_proveedor.trim() !== "" &&
      direccion_proveedor.trim() !== ""
    ) {
      // Validar que los campos no contengan caracteres especiales
      const regex = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü#,;.-]*$/;// Expresión regular que permite letras, números, espacios, '#' y '-'
      if (
        regex.test(nombre_proveedor) &&
        regex.test(telefono_proveedor) &&
        regex.test(direccion_proveedor)
      ) {
        try {
          // Tu código para enviar el formulario de edición
          console.log("proveedor a actualizar: ", proveedoresEditar);

          const response = await fetch(
            `https://api-luchosoft-mysql.onrender.com/compras/proveedores/${proveedoresEditar.id_proveedor}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify(proveedoresEditar),
            }
          );

          if (response.ok) {
            console.log("proveedor actualizado exitosamente.");
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Proveedor actualizado exitosamente."
            })
            setTimeout(() => {
              window.location.href = "/#/proveedores";
              fetchproveedores();
              cambiarEstadoModalEditar(false);
            }, 2000);
            // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
          } else {
            console.error(
              "Error al actualizar el proveedor:",
              response.statusText
            );
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error al actualizar el proveedor",
            });
          }
        } catch (error) {
          console.error("Error al actualizar el proveedor:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al actualizar el proveedor",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor ingresa caracteres válidos en todos los campos",
        });
      }
    } else {
      // Mostrar mensaje de error si algún campo está vacío
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor completa todos los campos",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !proveedores1.documento_proveedor && !proveedores1.nombre_proveedor && !proveedores1.tipo_documento && !proveedores1.telefono_proveedor && !proveedores1.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.nombre_proveedor && !proveedores1.tipo_documento && !proveedores1.direccion_proveedor
    ) {
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.nombre_proveedor && !proveedores1.telefono_proveedor && !proveedores1.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.tipo_documento && !proveedores1.telefono_proveedor && !proveedores1.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.nombre_proveedor && !proveedores1.tipo_documento && !proveedores1.telefono_proveedor && !proveedores1.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.nombre_proveedor && !proveedores1.direccion_proveedor
    ) {

      setInputDocValido3(false)

      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.tipo_documento && !proveedores1.direccion_proveedor
    ) {

      setInputDocValido3(false)
      setInputTipoValido(false)

      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.nombre_proveedor && !proveedores1.tipo_documento && !proveedores1.direccion_proveedor
    ) {
      setInputTipoValido(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.telefono_proveedor && !proveedores1.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.nombre_proveedor && !proveedores1.telefono_proveedor && !proveedores1.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.tipo_documento && !proveedores1.telefono_proveedor && !proveedores1.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputTipoValido(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }
    
    if (
      !proveedores1.documento_proveedor && !proveedores1.nombre_proveedor && !proveedores1.tipo_documento && !proveedores1.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.nombre_proveedor && !proveedores1.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.tipo_documento && !proveedores1.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)
      setInputTipoValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
       !proveedores1.nombre_proveedor && !proveedores1.tipo_documento && !proveedores1.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.nombre_proveedor && !proveedores1.tipo_documento
    ) {
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.tipo_documento && !proveedores1.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputTipoValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputDocValido3(false)

      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.nombre_proveedor && !proveedores1.telefono_proveedor
    ) {
      setInputTelValido3(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }
    
    if (
      !proveedores1.documento_proveedor && !proveedores1.nombre_proveedor && !proveedores1.tipo_documento
    ) {
      setInputDocValido3(false)
      setInputTipoValido(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.nombre_proveedor
    ) {
      setInputDocValido3(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.tipo_documento
    ) {
      setInputDocValido3(false)
      setInputTipoValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.telefono_proveedor && !proveedores1.direccion_proveedor
    ) {
      setInputTelValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.documento_proveedor && !proveedores1.direccion_proveedor
    ) {
      setInputDocValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.nombre_proveedor && !proveedores1.direccion_proveedor
    ) {
      setInputNombreValido3(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.tipo_documento && !proveedores1.direccion_proveedor
    ) {
      setInputTipoValido(false)
      setInputDirecValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !proveedores1.tipo_documento && !proveedores1.nombre_proveedor
    ) {
      setInputTipoValido(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

  


    if (!inputNombreValido3) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos vacíos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    if (!inputDirecValido) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }


    if (!inputDirecValido2) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }


    if (!inputDirecValido3) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos vacíos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }


    if (
      !proveedores1.nombre_proveedor
    ) {

      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor completa todos los campos vacíos",
      });
      
      return;
    }

    if (!inputTelValido) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    
    if (!inputTelValido3) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    if (!inputDocValido) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    
    if (!inputDocValido3) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    if (
      !proveedores1.documento_proveedor
    ) {

      setInputDocValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor completa todos los campos",
      });
      
      return;
    }




    if (
      !proveedores1.tipo_documento
    ) {

      setInputTipoValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor completa todos los campos vacíos",
      });
      
      return;
    }

    if (!inputNombreValido) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }


    if (!inputNombreValido2) {
      Swal.fire({
        icon: 'error',

        text: 'Por favor, digite bien los datos.',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }





        if (
          !proveedores1.nombre_proveedor
        ) {
    
          
          Swal.fire({
            icon: "error",
             
            text: "Por favor completa todos los campos vacíos",
          });
          setInputNombreValido3(false)
          return;
        }

        if (
          !proveedores1.telefono_proveedor
        ) {
    
          setInputTelValido3(false)
          Swal.fire({
            icon: "error",
             
            text: "Por favor completa todos los campos",
          });
          
          return;
        }
    


        if (proveedores1.nombre_proveedor.length < 2) {
          Swal.fire({
            icon: "error",
            text: "El nombre del proveedor debe tener al menos 2 letras",
          });
          setInputNombreValido(false)
          return;
          
        }

                // Validar que el nombre tenga al menos 3 letras
                if (proveedores1.documento_proveedor.length < 7) {
                  Swal.fire({
                    icon: "error",
                    text: "El documento del proveedor debe tener al menos 7 dígitos",
                  });
                  setInputDocValido(false)
                  return;
                }

            // Validar que el nombre tenga al menos 3 letras
            if (proveedores1.telefono_proveedor.length < 7) {
              setInputTelValido(false)
              Swal.fire({
                icon: "error",
                text: "El teléfono del proveedor debe tener al menos 7 dígitos",
              });
              
              return;
            }

            if (
              !proveedores1.direccion_proveedor
            ) {
        
              setInputDirecValido3(false)
              Swal.fire({
                icon: "error",
                 
                text: "Por favor completa todos los campos",
              });
              
              return;
            }
        
                // Validar que el nombre tenga al menos 3 letras
                if (proveedores1.direccion_proveedor.length < 4) {
                  Swal.fire({
                    icon: "error",
                    text: "La dirección del proveedor debe tener al menos 4 letras",
                  });
                  setInputDirecValido(false)
                  return;
                }


    // Verificar que todos los campos estén llenos
    const {
      nombre_proveedor,
      documento_proveedor,
      telefono_proveedor,
      direccion_proveedor,
      tipo_documento,
    } = proveedores1;
    if (
      nombre_proveedor.trim() !== "" &&
      documento_proveedor.trim() !== "" &&
      telefono_proveedor.trim() !== "" &&
      direccion_proveedor.trim() !== "" &&
      tipo_documento.trim() !== ""
    ) {
      // Validar que los campos no contengan caracteres especiales
      const regex = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü#,;.-]*$/;// Expresión regular que permite letras, números, espacios, '#' y '-'
      if (
        regex.test(nombre_proveedor) &&
        regex.test(documento_proveedor) &&
        regex.test(telefono_proveedor) &&
        regex.test(direccion_proveedor) &&
        regex.test(tipo_documento)
      ) {
        try {
          // Tu código para enviar el formulario
          console.log("proveedor a enviar: ", proveedores1);

          const responseProveedores = await fetch(
            "https://api-luchosoft-mysql.onrender.com/compras/proveedores/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify(proveedores1),
            }
          );

          if (responseProveedores.ok) {
            console.log("Proveedor creado exitosamente.");

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Proveedor registrado exitosamente."
            })
            setTimeout(() => {
              fetchproveedores();
              setProveedores1({
                nombre_proveedor: "",
                documento_proveedor: "",
                telefono_proveedor: "",
                direccion_proveedor: "",
                estado_proveedor: 1,
                tipo_documento: "",
              });
              cambiarEstadoModalAgregar(false);
            }, 2000);
          } else {
            console.error(
              "Error al crear el proveedor:",
              responseProveedores.statusText
            );
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error al crear el proveedor",
            });
          }
        } catch (error) {
          console.error("Error al crear el proveedor:", error);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor ingresa caracteres válidos en todos los campos",
        });
      }
    } else {
      // Mostrar mensaje de error si algún campo está vacío
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor completa todos los campos",
      });
    }
  };

  useEffect(() => {
    fetchproveedores();
  }, []);

  useEffect(() => {
    if (proveedores.length > 0) {
      setIsLoading(false);
    }
  }, [proveedores]);

  const fetchproveedores = async () => {
    try {
      const response = await fetch(
        "https://api-luchosoft-mysql.onrender.com/compras/proveedores/"
      );
      if (response.ok) {
        const data = await response.json();
        const proveedoresFiltrador = data.map((proveedor) => ({
          id_proveedor: proveedor.id_proveedor,
          nombre_proveedor: proveedor.nombre_proveedor,
          tipo_documento: proveedor.tipo_documento,
          documento_proveedor: proveedor.documento_proveedor,
          telefono_proveedor: proveedor.telefono_proveedor,
          direccion_proveedor: proveedor.direccion_proveedor,
          estado_proveedor: proveedor.estado_proveedor,
        }));
        setInputNombreValido(true)
        setInputNombreValido2(true)
        setInputNombreValido3(true)
        setInputDirecValido(true)
        setInputDirecValido2(true)
        setInputDirecValido3(true)
        setInputDocValido(true)
        setInputDocValido3(true)
        setInputTelValido(true)
        setInputTelValido3(true)
        setInputTipoValido(true)
        setProveedores(proveedoresFiltrador);
      } else {
        console.error("Error al obtener las proveedores");
      }
    } catch (error) {
      console.error("Error al obtener las proveedores:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;


    if (name === 'tipo_documento') {
      if (value.length > 0) {
        setInputTipoValido(true)
      } 
    }

    if (name === 'nombre_proveedor') {
      if (value.length > 60) {
        setInputNombreValido(false);
      } else {
        setInputNombreValido(true);
      }
    }

    if (name === 'nombre_proveedor') {
      if (value.length > 0) {
        setInputNombreValido3(true);
      } 
    }

    if (name === 'direccion_proveedor') {
      if (value.length > 60) {
        setInputDireceValido(false);
      } else {
        setInputDirecValido(true);
      }
    }

    if (name === 'direccion_proveedor') {
      if (value.length > 0) {
        setInputDirecValido3(true);
      } 
    }

    if (name === 'documento_proveedor') {
      if (value.length > 15) {
        setInputDocValido(false);
      } else {
        setInputDocValido(true);
      }
    }

    if (name === 'documento_proveedor') {
      if (value.length > 0) {
        setInputDocValido3(true);
      } 
    }

    if (name === 'telefono_proveedor') {
      if (value.length > 13) {
        setInputTelValido(false);
      } else {
        setInputTelValido(true);
      }
    }

    if (name === 'telefono_proveedor') {
      if (value.length > 0) {
        setInputTelValido3(true);
      } 
    }

    if (name === 'nombre_proveedor') {
      // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
      const caracteresEspeciales = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]*$/;
    
      // Verificar si la cadena no contiene caracteres especiales
      if (caracteresEspeciales.test(value)) {
        setInputNombreValido2(true);
      } else {
        setInputNombreValido2(false);
      }
    }

    if (name === 'direccion_proveedor') {
      // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
      const caracteresEspeciales = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü#,;.-]*$/;
    
      // Verificar si la cadena no contiene caracteres especiales
      if (caracteresEspeciales.test(value)) {
        setInputDirecValido2(true);
      } else {
        setInputDirecValido2(false);
      }
    }
    setProveedores1((prevproveedores) => ({
      ...prevproveedores,
      [name]: value,
    }));
  };



  const handleEditarChange = (event) => {
    const { name, value } = event.target;


    if (name === 'tipo_documento') {
      if (value.length > 0) {
        setInputTipoValido(true)
      } 
    }

    if (name === 'nombre_proveedor') {
      if (value.length > 0) {
        setInputNombreValido3(true)
      } 
    }

    if (name === 'direccion_proveedor') {
      if (value.length > 60) {
        setInputDireceValido(false);
      } else {
        setInputDirecValido(true);
      }
    }

    if (name === 'direccion_proveedor') {
      if (value.length > 0) {
        setInputDirecValido3(true);
      } 
    }
    

    if (name === 'nombre_proveedor') {
      if (value.length > 60) {
        setInputNombreValido(false);
      } else {
        setInputNombreValido(true);
      }
    }

    if (name === 'documento_proveedor') {
      if (value.length > 15) {
        setInputDocValido(false);
      } else {
        setInputDocValido(true);
      }
    }

    if (name === 'documento_proveedor') {
      if (value.length > 0) {
        setInputDocValido3(true);
      } 
    }

    if (name === 'telefono_proveedor') {
      if (value.length > 13) {
        setInputTelValido(false);
      } else {
        setInputTelValido(true);
      }
    }

    if (name === 'telefono_proveedor') {
      if (value.length > 0) {
        setInputTelValido3(true);
      } 
    }

    if (name === 'nombre_proveedor') {
      // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
      const caracteresEspeciales = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]*$/;
    
      // Verificar si la cadena no contiene caracteres especiales
      if (caracteresEspeciales.test(value)) {
        setInputNombreValido2(true);
      } else {
        setInputNombreValido2(false);
      }
    }

    if (name === 'direccion_proveedor') {
      // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
      const caracteresEspeciales = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü#,;.-]*$/;
    
      // Verificar si la cadena no contiene caracteres especiales
      if (caracteresEspeciales.test(value)) {
        setInputDirecValido2(true);
      } else {
        setInputDirecValido2(false);
      }
    }

    setProveedoresEditar((prevproveedores) => ({
      ...prevproveedores,
      [name]: value,
    }));
  };

  const handleEstadoproveedor = async (idproveedor, estadoproveedor) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas cambiar el estado del usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const nuevoEstado = estadoproveedor === 1 ? 0 : 1;

          const response = await fetch(
            `https://api-luchosoft-mysql.onrender.com/compras/proveedores/${idproveedor}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                estado_proveedor: nuevoEstado,
              }),
            }
          );

          if (response.ok) {
            // Actualización exitosa, actualizar la lista de proveedores
            fetchproveedores();
          } else {
            console.error("Error al actualizar el estado del usuario");
          }
        } catch (error) {
          console.error("Error al actualizar el estado del usuario:", error);
        }
      }
    });
  };

  const customStyles = {
    headCells: {
      style: {
        textAlign: "center",
        backgroundColor: "#f2f2f2",
        fontWeight: "bold",
        padding: "10px",
        fontSize: "16px",
        
      },
    },
    cells: {
      style: {
        textAlign: "center",

        fontSize: "13px",
      },
    },
  };

  const exportExcel = (customFileName) => {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(proveedores);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, customFileName || 'proveedores');
    });
};
const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
        if (module && module.default) {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });
            module.default.saveAs(data, fileName + EXCEL_EXTENSION);
        }
    });
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.datatables.net/2.0.2/css/dataTables.semanticui.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css"
        rel="stylesheet"
      />
      <div id={estilos["titulo"]}>
        <h1>Proveedores</h1>
      </div>

      <br />

      <div className={estilos["divFiltro"]}>
        <input
          type="text"
          placeholder=" Buscar..."
          value={filtro}
          onChange={handleFiltroChange}
          className={estilos["busqueda"]}
        />
        <div>
          <button
            onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)}
            className={` ${estilos.botonAgregar} ${estilos.rojo} bebas-neue-regular`}
          >
            <i className="fa-solid fa-plus"></i> Agregar
          </button>

          <button style={{backgroundColor:'white', border:'1px solid #c9c6c675', borderRadius:'50px', marginTop: '-10px', cursor:'pointer'}} onClick={() => exportExcel('Reporte_Proveedores')}> <img src="src\assets\excel-logo.png" height={'40px'}/> </button>
        </div>
      </div>

      <div className={estilos["tabla"]}>
        <DataTable
          columns={columns}
          data={filteredproveedores}
          pagination
          paginationPerPage={6}
          customStyles={customStyles} defaultSortField="id_categoria_productos" defaultSortAsc={true}
        ></DataTable>
      </div>

      <Modal
        estado={isModalOpen}
        cambiarEstado={setIsModalOpen}
        titulo="Detalles del Proveedor"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        width={"500px"}
        padding={"20px"}
      >
        {/* Contenido del modal */}
        {selectedItem && (
          <>
            <p>ID: {selectedItem.id_proveedor}</p>
            <p>Nombre: {selectedItem.nombre_proveedor}</p>
            <p>Tipo de documento: {selectedItem.tipo_documento}</p>
            <p>Documento: {selectedItem.documento_proveedor}</p>
            <p>Teléfono: {selectedItem.telefono_proveedor}</p>
            <p>Dirección: {selectedItem.direccion_proveedor}</p>
          </>
        )}

        <hr />
        <button
          type="button"
          className="btn btn-secondary"
          id={estilos["secondary"]}
          onClick={() => setIsModalOpen(false)}
        >
          Cerrar
        </button>
      </Modal>

      <Modal
        estado={estadoModalAgregar}
        cambiarEstado={cambiarEstadoModalAgregar}
        titulo="Registar"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        width={"500px"}
        padding={"20px"}
      >
        <Contenido>
          <form onSubmit={handleSubmit}>
            <div id={estilos.contenedorsito}>
              <div id={estilos.contInput}>
                <br />
                <br />
                <br />
                <div className={estilos["inputIdNombre"]}>
                  <div>
                    <p id={estilos.textito}> Nombre</p>
                    <input
                      id={estilos.nombreproveedor}
                      className={`${estilos.inputlargo} ${!inputNombreValido ? estilos.inputInvalido : ''}
                      ${!inputNombreValido2 ? estilos.inputInvalido : ''}
                      ${!inputNombreValido3 ? estilos.inputInvalido : ''}`}
                      type="text"
                      placeholder="Insertar"
                      name="nombre_proveedor"
                      value={proveedores.nombre_proveedor}
                      onChange={handleChange}
                    />


{
  !inputNombreValido3 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
{
  !inputNombreValido2 && !inputNombreValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}
                    {
  !inputNombreValido && inputNombreValido2 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Debe de contener al menos 2 letras y máximo 60.</p>
  )
}
{
  !inputNombreValido2 && inputNombreValido &&(
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}


                  </div>
                </div>

                <div className={estilos["inputIdNombre"]}>
                  <div>
                    <p id={estilos.textito}>Tipo Documento</p>
                    <select
                      className={`${estilos.inputchiquito} ${!inputTipoValido ? estilos.inputInvalido : ''}
                      `}
                      name="tipo_documento"
                      value={proveedores1.tipo_documento}
                      onChange={handleChange}
                    >
                                            <option value="" disabled selected>
                        Selección
                      </option>
                      <option value="NIT">NIT</option>
                      <option value="T.I">T.I</option>
                      <option value="C.C">C.C</option>
                    </select>
                    {
  !inputTipoValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
                    
                  </div>

                  <div id={estilos.documentoproveedor}>
                    <p id={estilos.textito}> Documento</p>
                    <input
                      className={`${estilos.input2} ${!inputDocValido ? estilos.inputInvalido : ''}
                      ${!inputDocValido3 ? estilos.inputInvalido : ''}`}
                      type="number"
                      placeholder="Insertar"
                      name="documento_proveedor"
                      value={proveedores1.documento_proveedor}
                      onChange={handleChange}
                    />
                    {
  !inputDocValido3 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '85px' }}>El campo no puede estar vacío</p>
  )
}
{
  !inputDocValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Debe de contener al menos 7 dígitos y máximo 15.</p>
  )
}

                  </div>
                </div>

                <div id={estilos.telefonoproveedor}>
                  <p id={estilos.textito}> Teléfono</p>
                  <input
                      className={`${estilos.inputlargo} ${!inputTelValido ? estilos.inputInvalido : ''}
                      ${!inputTelValido3 ? estilos.inputInvalido : ''}`}
                    type="number"
                    placeholder="Insertar"
                    name="telefono_proveedor"
                    value={proveedores1.telefono_proveedor}
                    onChange={handleChange}
                  />
                                      {
  !inputTelValido3 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
{
  !inputTelValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Debe de contener al menos 7 dígitos y máximo 13.</p>
  )
}
                </div>
                <br />
                <div className={estilos["inputIdNombre"]}>
                  <div id={estilos.eo}>
                    <p id={estilos.textito}> Dirección</p>
                    <input
                      id={estilos.direccionproveedor}
                      className={`${estilos.inputlargo} ${!inputDirecValido ? estilos.inputInvalido : ''}
                      ${!inputDirecValido2 ? estilos.inputInvalido : ''}
                      ${!inputDirecValido3 ? estilos.inputInvalido : ''}`}
                      type="text"
                      placeholder="Insertar"
                      name="direccion_proveedor"
                      value={proveedores1.direccion_proveedor}
                      onChange={handleChange}
                    />
                    {
  !inputDirecValido3 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
{
  !inputDirecValido2 && !inputDirecValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}
                    {
  !inputDirecValido && inputDirecValido2 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Debe de contener al menos 2 letras y máximo 60.</p>
  )
}
{
  !inputDirecValido2 && inputDirecValido &&(
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}
                  </div>
                </div>
              </div>
            </div>
            <center>
              <div className={estilos["BotonesClientes"]}>
                <button
                  onclick="registrar()"
                  className={estilos["azulado"]}
                  type="submit"
                >
                  <p>Aceptar</p>{" "}
                </button>

                <button
                
                  onClick={() => {cambiarEstadoModalAgregar(!estadoModalAgregar)
                    setProveedores1({
                      nombre_proveedor: "",
                      documento_proveedor: "",
                      telefono_proveedor: "",
                      direccion_proveedor: "",
                      estado_proveedor: 1,
                      tipo_documento: "",
                    });
                    setInputNombreValido(true)
                    setInputNombreValido2(true)
                    setInputNombreValido3(true)
                    setInputDirecValido(true)
                    setInputDirecValido2(true)
                    setInputDirecValido3(true)
                    setInputDocValido(true)
                    setInputDocValido3(true)
                    setInputTelValido(true)
                    setInputTelValido3(true)
                    setInputTipoValido(true)
                  }}
                  className={estilos["gris"]}
                  type="button"
                >
                  {" "}
                  <p>Cancelar</p>
                </button>
              </div>
            </center>
          </form>
        </Contenido>
      </Modal>

      <Modal
        estado={estadoModaleditar}
        cambiarEstado={cambiarEstadoModalEditar}
        titulo="Actualizar"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        width={"500px"}
        padding={"20px"}
      >
        <Contenido>
          <form onSubmit={handleSubmitEditar}>
            <div id={estilos.contenedorsito}>
              <div id={estilos.contInput}>
                <br />
                <br />
                <br />
                <div className={estilos["inputIdNombre"]}>
                  <div id={estilos.eo}>
                    <p id={estilos.textito}> Nombre</p>
                    <input
                      id= {estilos.nombreproveedor}
                      className={`${estilos.inputlargo} ${!inputNombreValido ? estilos.inputInvalido : ''}
                      ${!inputNombreValido2 ? estilos.inputInvalido : ''}
                      ${!inputNombreValido3 ? estilos.inputInvalido : ''}`}
                      type="text"
                      placeholder="Insertar"
                      name="nombre_proveedor"
                      value={proveedoresEditar.nombre_proveedor}
                      onChange={handleEditarChange}
                    />
{
  !inputNombreValido3 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
{
  !inputNombreValido2 && !inputNombreValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}
                    {
  !inputNombreValido && inputNombreValido2 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Debe de contener al menos 2 letras y máximo 60.</p>
  )
}
{
  !inputNombreValido2 && inputNombreValido &&(
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}
                  </div>
                </div>

                <div className={estilos["inputIdNombre"]}>
                  <div>
                    <p id={estilos.textito}>Tipo Documento</p>
                    {/* <select
            className={estilos["inputchiquito"]}
            name='tipo_documento'
            value={proveedoresEditar.tipo_documento}
            onChange={handleEditarChange}
        >
            <option value="">{proveedoresEditar.tipo_documento}</option>
            <option value="NIT">NIT</option>
            <option value="T.I">T.I</option>
            <option value="C.C">C.C</option>

        </select> */}
                    <select
                      className={`${estilos.inputchiquito} ${!inputTipoValido ? estilos.inputInvalido : ''}
                      `}
                      name="tipo_documento"
                      
                      value={proveedoresEditar.tipo_documento}
                      onChange={handleEditarChange}
                    >
                      <option value="" disabled selected>
                        Seleccionar unidad de medida
                      </option>
                      <option value="NIT">NIT</option>
            <option value="T.I">T.I</option>
            <option value="C.C">C.C</option>
                    </select>

                    {!inputTipoValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
                  </div>

                  <div className={estilos["espacio"]}> </div>
                  <div className={estilos["inputIdNombre"]}></div>

                  <div id={estilos.eo}>
                    <p id={estilos.textito}> Documento</p>

                    <input
                      id={estilos.docmentoproveedor}
                      className={`${estilos.input2} ${!inputDocValido ? estilos.inputInvalido : ''}
                      ${!inputDocValido3 ? estilos.inputInvalido : ''}`}
                      type="number"
                      placeholder="Insertar"
                      name="documento_proveedor"
                      value={proveedoresEditar.documento_proveedor}
                      onChange={handleEditarChange}
                    />
                  {    !inputDocValido3 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '85px' }}>El campo no puede estar vacío</p>
  )
}
{
  !inputDocValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Debe de contener al menos 7 dígitos y máximo 15.</p>
  )
}
                  </div>
                </div>

                <div id={estilos.eo}>
                  <p id={estilos.textito}> Teléfono</p>
                  <input
                    id={estilos.telefonoproveedor}
                    className={`${estilos.inputlargo} ${!inputTelValido ? estilos.inputInvalido : ''}
                    ${!inputTelValido3 ? estilos.inputInvalido : ''}`}
                    type="number"
                    placeholder="Insertar"
                    name="telefono_proveedor"
                    value={proveedoresEditar.telefono_proveedor}
                    onChange={handleEditarChange}
                  />
                                    {    !inputTelValido3 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
{
  !inputTelValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Debe de contener al menos 7 dígitos y máximo 13.</p>
  )
}
                </div>
                <br />

                <div className={estilos["inputIdNombre"]}>
                  <div id={estilos.eo}>
                    <p id={estilos.textito}> Dirección</p>
                    <input
                      id={estilos.direccionproveedor}
                      className={`${estilos.inputlargo} ${!inputDirecValido ? estilos.inputInvalido : ''}
                      ${!inputDirecValido2 ? estilos.inputInvalido : ''}
                      ${!inputDirecValido3 ? estilos.inputInvalido : ''}`}
                      type="text"
                      placeholder="Insertar"
                      name="direccion_proveedor"
                      value={proveedoresEditar.direccion_proveedor}
                      onChange={handleEditarChange}
                    />
                                        {
  !inputDirecValido3 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
{
  !inputDirecValido2 && !inputDirecValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}
                    {
  !inputDirecValido && inputDirecValido2 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Debe de contener al menos 2 letras y máximo 60.</p>
  )
}
{
  !inputDirecValido2 && inputDirecValido &&(
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}
                  </div>
                </div>
              </div>
            </div>

            <center>
              <div className={estilos["BotonesClientes"]}>
                <button
                  onclick="registrar()"
                  className={estilos["azulado"]}
                  type="submit"
                >
                  <p>Aceptar</p>{" "}
                </button>

                <button
                  onClick={() => {cambiarEstadoModalEditar(!estadoModaleditar)
                    setProveedores1({
                      nombre_proveedor: "",
                      documento_proveedor: "",
                      telefono_proveedor: "",
                      direccion_proveedor: "",
                      estado_proveedor: 1,
                      tipo_documento: "",
                    });
                    setInputNombreValido(true)
                    setInputNombreValido2(true)
                    setInputNombreValido3(true)
                    setInputDirecValido(true)
                    setInputDirecValido2(true)
                    setInputDirecValido3(true)
                    setInputDocValido(true)
                    setInputDocValido3(true)
                    setInputTelValido(true)
                    setInputTelValido3(true)
                    setInputTipoValido(true)
                  }}
                  className={estilos["gris"]}
                  type="button"
                >
                  {" "}
                  <p>Cancelar</p>
                </button>
              </div>
            </center>
          </form>
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

export default Proveedores;
