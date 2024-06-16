import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import $ from "jquery";
import "../../Layout.css";
import estilos from "./TablaInsumos.module.css";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Modal from "./modal";
import styled from "styled-components";

function Insumos() {
  const token = localStorage.getItem("token");
  const [insumos, setinsumos] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estadoModaleditar, cambiarEstadoModalEditar] = useState(false);

  const [inputNombreValido, setInputNombreValido] = useState(true);
  const [inputNombreValido2, setInputNombreValido2] = useState(true);
  const [inputNombreValido3, setInputNombreValido3] = useState(true);

  const [inputStockValido, setInputStockValido] = useState(true);
  const [inputStockValido2, setInputStockValido2] = useState(true);
  const [inputStockValido3, setInputStockValido3] = useState(true);

  const [inputMedidaValido, setInputMedidaValido] = useState(true);

  const [inputCategoriaValido, setInputCategoriaValido] = useState(true);

  const [categoria_insumo, setCategoria_insumo] = useState([]);
  const [insumos1, setinsumos1] = useState({
    nombre_insumo: "",
    unidadesDeMedida_insumo: "",
    stock_insumo: "",
    estado_insumo: 1,
    id_categoria_insumo: "",
  });
  const [insumosEditar, setInsumosEditar] = useState({
    nombre_insumo: "",
    unidadesDeMedida_insumo: "",
    stock_insumo: "",
    estado_insumo: 1,
    id_categoria_insumo: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [estadoModalAgregar, cambiarEstadoModalAgregar] = useState(false);
  const tableRef = useRef(null);
  const [filtro, setFiltro] = useState("");

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };
  const filteredinsumos = insumos.filter(
    (insumo) =>
      insumo.id_insumo.toString().includes(filtro) ||
      insumo.nombre_insumo.toString().toLowerCase().includes(filtro.toLowerCase()) ||
      insumo.unidadesDeMedida_insumo
        .toString()
        .toLowerCase()
        .includes(filtro) ||
      insumo.stock_insumo.toString().includes(filtro) ||
      insumo.id_categoria_insumo.toString().includes(filtro) ||
      insumo.nombre_categoria.toString().toLowerCase().includes(filtro.toLowerCase()) ||
      insumo.estado_insumo.toString().includes(filtro)
  );



  const columns = [
    {
      name: "Id",
      selector: (row) => row.id_insumo,
      sortable: true,
    },

    {
      name: "Nombre",
      selector: (row) => row.nombre_insumo,
      sortable: true,
    },
    {
      name: "Medida",
      selector: (row) => row.unidadesDeMedida_insumo,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.stock_insumo,
      sortable: true,
    },
    {
      name: "Categoría",
      selector: (row) => row.nombre_categoria,
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row) => (
        <div className={estilos["acciones"]}>
          <button
            className={estilos.boton}
            onClick={() => handleEstadoinsumo(row.id_insumo, row.estado_insumo)}
            style={{ cursor: "pointer", textAlign: "center", fontSize: "30px" }}
          >
            {row.estado_insumo === 1 ? (
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
              if (row.estado_insumo === 1) {
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
                row.estado_insumo === 0 ? "bi-eye-slash cerrado" : "bi-eye"
              }`}
              style={{
                color: row.estado_insumo === 0 ? "gray" : "#1A008E",
                pointerEvents: row.estado_insumo === 0 ? "none" : "auto",
              }}
            ></i>
          </button>
          {/* Botón para editar */}
          <button
            onClick={() => {
              if (row.estado_insumo === 1) {
                cambiarEstadoModalEditar(!estadoModaleditar);
                setInsumosEditar(row);
              }
            }}
            className={estilos.boton}
            style={{ cursor: "pointer", textAlign: "center", fontSize: "20px" }}
          >
            <i
              className={`fa-solid fa-pen-to-square ${
                row.estado_insumo === 1
                  ? "iconosNaranjas"
                  : "iconosGris"
              }`}
            ></i>
          </button>

          <button
            onClick={() => handleEliminarInsumo(row.id_insumo)}
            disabled={row.estado_insumo === 0}
            className={estilos.boton}
            style={{ cursor: "pointer", textAlign: "center", fontSize: "25px" }}
          >
            <i
              className={`bi bi-trash ${
                row.estado_insumo === 0 ? "basuraDesactivada" : ""
              }`}
              style={{ color: row.estado_insumo === 0 ? "gray" : "red" }}
            ></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchinsumos();
  }, []);

  useEffect(() => {
    if (insumos.length > 0) {
      setIsLoading(false);
    }
  }, [insumos]);

  useEffect(() => {
    const fetchCategoria_insumo = async () => {
      try {
        const response = await fetch(
          "https://api-luchosoft-mysql.onrender.com/compras/categoria_insumos"
        );
        if (response.ok) {
          const data = await response.json();
          const categoria_insumoFiltrados = data.map((categoria_insumo) => ({
            id_categoria_insumos: categoria_insumo.id_categoria_insumos,
            nombre_categoria_insumos: categoria_insumo.nombre_categoria_insumos,
            estado_categoria_insumos: categoria_insumo.estado_categoria_insumos,
          }));
          setInputStockValido(true)
          setInputStockValido2(true)
          setInputNombreValido(true)
          setInputNombreValido2(true)
          setInputNombreValido3(true)
          setInputStockValido3(true)
          setInputMedidaValido(true)
          setInputCategoriaValido(true)
          setCategoria_insumo(categoria_insumoFiltrados);
        } else {
          console.error("Error al obtener las compras");
        }
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      }
    };

    fetchCategoria_insumo();
  }, []);

  const handleEliminarInsumo = (idInsumo) => {
    // Mostrar un mensaje de confirmación antes de eliminar
    Swal.fire({
      text: "¿Deseas eliminar este insumo?",
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
            `https://api-luchosoft-mysql.onrender.com/compras/insumos/${idInsumo}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
            }
          );

          if (response.ok) {
            // Insumo eliminado exitosamente
            Swal.fire({
              icon: "success",
              title: "Insumo eliminado",
              text: "El insumo ha sido eliminado correctamente",
              showConfirmButton: false,
              timer: 1500,
            });
            // Actualizar la lista de insumos
            fetchinsumos();
          } else {
            console.error("Error al eliminar el insumo:", response.statusText);
            Swal.fire({
              icon: "error",
               
              text: "Error al eliminar el insumo",
            });
          }
        } catch (error) {
          console.error("Error al eliminar el insumo:", error);
          Swal.fire({
            icon: "error",
             
            text: "Error al eliminar el insumo",
          });
        }
      }
    });
  };

  const handleEditarChange = (event) => {
    const { name, value } = event.target;

    if (name === 'nombre_insumo') {
      if (value.length > 50) {
        setInputNombreValido(false);
      } else {
        setInputNombreValido(true);
      }
    }

    if (name === 'unidadesDeMedida_insumo') {
      if (value.length > 0) {
        setInputMedidaValido(true)
      } 
    }

    if (name === 'nombre_insumo') {
      if (value.length > 0) {
        setInputNombreValido3(true);
      } 
    }

    if (name === 'nombre_insumo') {
      // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
      const caracteresEspeciales = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]*$/;
    
      // Verificar si la cadena no contiene caracteres especiales
      if (caracteresEspeciales.test(value)) {
        setInputNombreValido2(true);
      } else {
        setInputNombreValido2(false);
      }
    }



    setInsumosEditar((previnsumos) => ({
      ...previnsumos,
      [name]: value,
    }));
  };

  const handleSubmitEditar = async (event) => {
    event.preventDefault();


    
    if (
      !insumosEditar.nombre_insumo && !insumosEditar.stock_insumo && !insumosEditar.unidadesDeMedida_insumo && !insumosEditar.id_categoria_insumo
    ) {

      setInputNombreValido3(false)
      setInputStockValido3(false)
      setInputMedidaValido(false)
      setInputCategoriaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumosEditar.id_categoria_insumo && !insumosEditar.stock_insumo && !insumosEditar.unidadesDeMedida_insumo
    ) {
      setInputCategoriaValido(false)
      setInputStockValido3(false)
      setInputMedidaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumosEditar.id_categoria_insumo && !insumosEditar.stock_insumo && !insumosEditar.nombre_insumo
    ) {
      setInputCategoriaValido(false)
      setInputStockValido3(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumosEditar.stock_insumo && !insumosEditar.id_categoria_insumo
    ) {
      setInputStockValido3(false)
      setInputCategoriaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumosEditar.nombre_insumo && !insumosEditar.unidadesDeMedida_insumo && !insumosEditar.id_categoria_insumo
    ) {

      setInputNombreValido3(false)
      setInputMedidaValido(false)
      setInputCategoriaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumosEditar.nombre_insumo && !insumosEditar.id_categoria_insumo
    ) {

      setInputNombreValido3(false)
      setInputCategoriaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumosEditar.unidadesDeMedida_insumo && !insumosEditar.id_categoria_insumo
    ) {
      setInputMedidaValido(false)
      setInputCategoriaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumosEditar.nombre_insumo && !insumosEditar.stock_insumo && !insumosEditar.unidadesDeMedida_insumo
    ) {

      setInputNombreValido3(false)
      setInputStockValido3(false)
      setInputMedidaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumosEditar.stock_insumo && !insumosEditar.unidadesDeMedida_insumo
    ) {

      setInputStockValido3(false)
      setInputMedidaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumosEditar.nombre_insumo && !insumosEditar.unidadesDeMedida_insumo
    ) {

      setInputNombreValido3(false)
      setInputMedidaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumosEditar.nombre_insumo && !insumosEditar.stock_insumo
    ) {

      setInputNombreValido3(false)
      setInputStockValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }


    if (!inputNombreValido) {
      Swal.fire({
        icon: 'error',

        text: "El mínimo es 3 letras y el máximo es de 50.",
        confirmButtonColor: '#1F67B9',
      });
      return;
    }


    if (!inputNombreValido2) {
      Swal.fire({
        icon: 'error',

        text: "No se aceptan caracteres especiales",
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    if (
      !insumosEditar.nombre_insumo
    ) {

      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor completa todos los campos vacíos",
      });
      
      return;
    }

        // Validar que el nombre tenga al menos 3 letras
        if (insumosEditar.nombre_insumo.length < 3) {
          Swal.fire({
            icon: "error",
             
            text: "El nombre del insumo debe tener al menos 3 letras",
          });
          setInputNombreValido3(false)
          return;
        }




    const regex = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü.,]*$/;

    if (
      !regex.test(insumos1.nombre_insumo) ||
      !regex.test(insumos1.unidadesDeMedida_insumo) ||
      !regex.test(insumos1.stock_insumo)
    ) {
      // Mostrar alerta con SweetAlert
      Swal.fire({
        icon: "error",
         
        text: "Los campos no pueden contener caracteres especiales",
      });
      return;
    }



    console.log(insumos);

    Swal.fire({

      text: "¿Deseas actualizar la información del insumo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://api-luchosoft-mysql.onrender.com/compras/insumos/${insumosEditar.id_insumo}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify(insumosEditar),
            }
          );

          if (response.ok) {
            console.log("insumo actualizado exitosamente.");
            Swal.fire({
              icon: "success",
              title: "insumo actualizado exitosamente",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => {
              window.location.href = "/#/insumos";
              fetchinsumos();
              cambiarEstadoModalEditar(false);
            }, 2000);
            // Aquí podrías redirigir a otra página, mostrar un mensaje de éxito, etc.
          } else {
            console.error(
              "Error al actualizar el insumo:",
              response.statusText
            );
            Swal.fire({
              icon: "error",
               
              text: "Error al actualizar el insumo",
            });
          }
        } catch (error) {
          console.error("Error al actualizar el insumo:", error);
          Swal.fire({
            icon: "error",
             
            text: "Error al actualizar el insumo",
          });
        }
      }
    });
  };

  const handleAgregarClick = () => {
    // Verificar si hay categoría de insumos con estado en 1
    const categoriasActivas = categoria_insumo.some(
      (categoria) => categoria.estado_categoria_insumos === 1
    );

    if (!categoriasActivas) {
      // Mostrar mensaje de error si no hay categorías activas
      Swal.fire({
        icon: "error",
         
        text: "No hay categorías de insumos activas",
      });
    } else {
      // Si hay categorías activas, cambiar el estado del modal de agregar
      cambiarEstadoModalAgregar(!estadoModalAgregar);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();




    if (!inputNombreValido) {
      Swal.fire({
        icon: 'error',

        text: "El mínimo es 3 letras y el máximo es de 50.",
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    if (!inputNombreValido2) {
      Swal.fire({
        icon: 'error',

        text: "No se aceptan caracteres especiales",
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    if (
      !insumos1.nombre_insumo && !insumos1.stock_insumo && !insumos1.unidadesDeMedida_insumo && !insumos1.id_categoria_insumo
    ) {

      setInputNombreValido3(false)
      setInputStockValido3(false)
      setInputMedidaValido(false)
      setInputCategoriaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.id_categoria_insumo && !insumos1.stock_insumo && !insumos1.unidadesDeMedida_insumo
    ) {
      setInputCategoriaValido(false)
      setInputStockValido3(false)
      setInputMedidaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.id_categoria_insumo && !insumos1.stock_insumo && !insumos1.nombre_insumo
    ) {
      setInputCategoriaValido(false)
      setInputStockValido3(false)
      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.stock_insumo && !insumos1.id_categoria_insumo
    ) {
      setInputStockValido3(false)
      setInputCategoriaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.nombre_insumo && !insumos1.unidadesDeMedida_insumo && !insumos1.id_categoria_insumo
    ) {

      setInputNombreValido3(false)
      setInputMedidaValido(false)
      setInputCategoriaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.nombre_insumo && !insumos1.id_categoria_insumo
    ) {

      setInputNombreValido3(false)
      setInputCategoriaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.unidadesDeMedida_insumo && !insumos1.id_categoria_insumo
    ) {
      setInputMedidaValido(false)
      setInputCategoriaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.nombre_insumo && !insumos1.stock_insumo && !insumos1.unidadesDeMedida_insumo
    ) {

      setInputNombreValido3(false)
      setInputStockValido3(false)
      setInputMedidaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.stock_insumo && !insumos1.unidadesDeMedida_insumo
    ) {

      setInputStockValido3(false)
      setInputMedidaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.nombre_insumo && !insumos1.unidadesDeMedida_insumo
    ) {

      setInputNombreValido3(false)
      setInputMedidaValido(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.nombre_insumo && !insumos1.stock_insumo
    ) {

      setInputNombreValido3(false)
      setInputStockValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor, completa los campos vacíos",
      });
      
      return;
    }



    if (
      !insumos1.nombre_insumo
    ) {

      setInputNombreValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor completa todos los campos vacíos",
      });
      
      return;
    }

    if (
      !insumos1.stock_insumo
    ) {

      setInputStockValido3(false)
      Swal.fire({
        icon: "error",
         
        text: "Por favor completa todos los campos vacíos",
      });
      
      return;
    }

    if (!insumos1.unidadesDeMedida_insumo) {
      Swal.fire({
        icon: "error",
        text: "Por favor, selecciona la medida del insumo",
      });
      setInputMedidaValido(false)
      return; // Detener la ejecución si no se seleccionó una categoría
    }

    // Validar que se haya seleccionado una categoría de insumo
    if (!insumos1.id_categoria_insumo) {
      Swal.fire({
        icon: "error",
         
        text: "Por favor, selecciona una categoría de insumo",
      });
      setInputCategoriaValido(false)
      return; // Detener la ejecución si no se seleccionó una categoría
    }

    

        // Validar que el nombre tenga al menos 3 letras
        if (insumos1.nombre_insumo.length < 3) {
          Swal.fire({
            icon: "error",
             
            text: "El nombre del insumo debe tener al menos 3 letras",
          });
          setInputNombreValido(false)
          return;
          
        }

        if (!inputStockValido) {
          Swal.fire({
            icon: 'error',
    
            text: 'El número de stock sobrepasa los límites.',
            confirmButtonColor: '#1F67B9',
          });
          return;
        }
    
        if (!inputStockValido2) {
          Swal.fire({
            icon: 'error',
    
            text: "No se aceptan caracteres especiales",
            confirmButtonColor: '#1F67B9',
          });
          return;
        }
        



    if (

      !insumos1.unidadesDeMedida_insumo

    ) {

      Swal.fire({
        icon: "error",
         
        text: "Por favor completa todos los campos vacíos",
      });
      return;
    }

    if (

      !insumos1.stock_insumo
    ) {

      Swal.fire({
        icon: "error",
         
        text: "Por favor completa todos los campos vacíos",
      });
      return;
    }

    if (
      !insumos1.id_categoria_insumo
    ) {


      Swal.fire({
        icon: "error",

        text: "Por favor completa todos los campos vacíos",
      });
      return;
    }
    // Validar que el stock sea un número positivo
    if (insumos1.stock_insumo < 0) {
      Swal.fire({
        icon: "error",
         
        text: "El stock debe ser un número positivo",
      });
      return;
    }

    // Validar que el stock sea un número positivo
    if (insumos1.stock_insumo.length > 9) {
      Swal.fire({
        icon: "error",
         
        text: "El stock no puede exceder los 0 números",
      });
      
      return;
    }



    // Validar que no haya caracteres especiales en los campos
    const regex = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü.,]*$/;

    if (
      !regex.test(insumos1.nombre_insumo) ||
      !regex.test(insumos1.unidadesDeMedida_insumo) ||
      !regex.test(insumos1.stock_insumo)
    ) {
      // Mostrar alerta con SweetAlert
      Swal.fire({
        icon: "error",
         
        text: "Los campos no pueden contener caracteres especiales",
      });
      return;
    }

    try {
      console.log("insumo a enviar: ", insumos1);

      const responseInsumos = await fetch(
        "https://api-luchosoft-mysql.onrender.com/compras/insumos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(insumos1),
        }
      );

      if (responseInsumos.ok) {
        console.log("Insumo creado exitosamente.");

        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          fetchinsumos();
          setinsumos1({
            nombre_insumo: "",
            unidadesDeMedida_insumo: "",
            stock_insumo: "",
            estado_insumo: 1,
            id_categoria_insumo: "",
          });
          cambiarEstadoModalAgregar(false);
        }, 2000);
      } else {
        console.error("Error al crear el insumo:", responseInsumos.statusText);
        Swal.fire({
          icon: "error",
           
          text: "Error al crear el insumo",
        });
      }
    } catch (error) {
      console.error("Error al crear el insumo:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;


    if (name === 'nombre_insumo') {
      if (value.length > 50) {
        setInputNombreValido(false);
      } else {
        setInputNombreValido(true);
      }
    }

    if (name === 'nombre_insumo') {
      if (value.length > 0) {
        setInputNombreValido3(true);
      } 
    }

    if (name === 'id_categoria_insumo') {
      if (value.length > 0) {
        setInputCategoriaValido(true);
      } 
    }

    if (name === 'unidadesDeMedida_insumo') {
      if (value.length > 0) {
        setInputMedidaValido(true)
      } 
    }

    
    if (name === 'stock_insumo') {
      if (value.length > 0) {
        setInputStockValido3(true);
      } 
    }

    if (name === 'nombre_insumo') {
      // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
      const caracteresEspeciales = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]*$/;
    
      // Verificar si la cadena no contiene caracteres especiales
      if (caracteresEspeciales.test(value)) {
        setInputNombreValido2(true);
      } else {
        setInputNombreValido2(false);
      }
    }

    if (name === 'stock_insumo') {
      if (value.length > 9 || value.length < 0) {
        setInputStockValido(false);
      } else {
        setInputStockValido(true);
        
      }
    }

    if (name === 'stock_insumo') {
      // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
      const caracteresEspeciales = /^[0-9.,]*$/;
    
      // Verificar si la cadena no contiene caracteres especiales
      if (caracteresEspeciales.test(value)) {
        setInputStockValido2(true);
      } else {
        setInputStockValido2(false);
      }
    }


    setinsumos1((previnsumos) => ({
      ...previnsumos,
      [name]: value,
    }));
  };

  const fetchinsumos = async () => {
    try {
      const response = await fetch(
        "https://api-luchosoft-mysql.onrender.com/compras/insumos"
      );
      if (response.ok) {
        const data = await response.json();
        const insumosFiltrador = data.map((insumo) => ({
          id_insumo: insumo.id_insumo,

          nombre_insumo: insumo.nombre_insumo,
          unidadesDeMedida_insumo: insumo.unidadesDeMedida_insumo,
          stock_insumo: insumo.stock_insumo,
          id_categoria_insumo: insumo.id_categoria_insumo,
          nombre_categoria: insumo.nombre_categoria,
          estado_insumo: insumo.estado_insumo,
        }));
        setinsumos(insumosFiltrador);
      } else {
        console.error("Error al obtener las insumos");
      }
    } catch (error) {
      console.error("Error al obtener las insumos:", error);
    }
  };

  const handleEstadoinsumo = async (idinsumo, estadoinsumo) => {
    Swal.fire({
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
          const nuevoEstado = estadoinsumo === 1 ? 0 : 1;

          const response = await fetch(
            `https://api-luchosoft-mysql.onrender.com/compras/estadoInsumo/${idinsumo}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                estado_insumo: nuevoEstado,
              }),
            }
          );

          if (response.ok) {
            // Actualización exitosa, actualizar la lista de insumos
            fetchinsumos();
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
        const worksheet = xlsx.utils.json_to_sheet(insumos);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, customFileName || 'insumos');
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
        <h1>Insumos</h1>
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
            onClick={handleAgregarClick}
            className={` ${estilos.botonAgregar} ${estilos.rojo} bebas-neue-regular`}
          >
            <i className="fa-solid fa-plus"></i> Agregar
          </button>

          <button style={{backgroundColor:'white', border:'1px solid #c9c6c675', borderRadius:'50px', marginTop: '-10px', cursor:'pointer'}} onClick={() => exportExcel('Reporte_Insumos')}> <img src="src\assets\excel-logo.png" height={'40px'}/> </button>
        </div>
      </div>

      <div className={estilos["tabla"]}>
        <DataTable
          columns={columns}
          data={filteredinsumos}
          pagination
          paginationPerPage={5}
          highlightOnHover
          customStyles={customStyles} defaultSortField="id_categoria_productos" defaultSortAsc={true}
        ></DataTable>
      </div>

      <Modal
        estado={isModalOpen}
        cambiarEstado={setIsModalOpen}
        titulo="Detalles del Insumo"
        mostrarHeader={true}
        mostrarOverlay={true}
        posicionModal={"center"}
        width={"500px"}
        padding={"20px"}
      >
        {/* Contenido del modal */}
        {selectedItem && (
          <>
            <p>ID: {selectedItem.id_insumo}</p>
            <p>Nombre: {selectedItem.nombre_insumo}</p>
            <p>Medida: {selectedItem.unidadesDeMedida_insumo}</p>
            <p>Stock: {selectedItem.stock_insumo}</p>
            <p>Categoría: {selectedItem.nombre_categoria}</p>
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
                      id={estilos.nombreinsumo}

                      className={`${estilos.inputnombre} ${!inputNombreValido ? estilos.inputInvalido : ''}
                      ${!inputNombreValido2 ? estilos.inputInvalido : ''}
                      ${!inputNombreValido3 ? estilos.inputInvalido : ''}`}
                      type="text"
                      placeholder="Insertar nombre"
                      name="nombre_insumo"
                      value={insumos1.nombre_insumo}
                      onChange={handleChange}
                    />

{
  !inputNombreValido2 && !inputNombreValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}
                    {
  !inputNombreValido && inputNombreValido2 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Debe de contener al menos 3 letras y máximo 50.</p>
  )
}
{
  !inputNombreValido2 && inputNombreValido &&(
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}

{
  !inputNombreValido3 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}






                  </div>
                  <div className={estilos["espacio"]}></div>

                  <div id={estilos.telefonoproveedor}>
                    <p id={estilos.textito}> Stock</p>
                    <input
                      className={`${estilos.inputstock} ${!inputStockValido ? estilos.inputInvalido : ''}
                      ${!inputStockValido2 ? estilos.inputInvalido : ''}
                      ${!inputStockValido3 ? estilos.inputInvalido : ''}
                      `}
                      type="number"
                      placeholder="000"
                      name="stock_insumo"
                      value={insumos1.stock_insumo}
                      onChange={handleChange}
                    />
                                        {
  !inputStockValido && inputStockValido2 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El número sobrepasa los límites.</p>
  )
}
{
  !inputStockValido2 && inputStockValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>Solo se aceptan números.</p>
  )
}

{
  !inputStockValido3 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}

{
  !inputStockValido2 && !inputStockValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}
                  </div>
                </div>
                <br />
                <div className={estilos["inputIdNombre"]}>
                  <div id={estilos.documentoproveedor}>
                    <p id={estilos.textito}> Unidad de medida</p>
                    <select
                      className={`${estilos.input2} ${!inputMedidaValido ? estilos.inputInvalido : ''}
                    `}
                      name="unidadesDeMedida_insumo"
                      id={estilos.unidadesDeMedida_insumo_input}
                      value={insumos1.unidadesDeMedida_insumo}
                      onChange={handleChange}
                    >
                      <option value="" disabled selected>
                        Seleccionar unidad de medida
                      </option>
                      <option value="unidades">Unidades</option>
                      <option value="miligramos">Miligramos</option>
                      <option value="gramos">Gramos</option>
                      <option value="libras">Libras</option>
                      <option value="kilogramos">Kilogramos</option>
                      <option value="mililitros">Mililitros</option>
                      <option value="litros">Litros</option>
                    </select>
                    {
  !inputMedidaValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
                  </div>

                  <div id={estilos.eo}>
                    <p id={estilos.textito}> Categoría insumo</p>
                    <select
                      className={`${estilos.input2} ${!inputCategoriaValido ? estilos.inputInvalido : ''}
                      `}
                      name="id_categoria_insumo" // Utiliza el mismo nombre que el campo id_rol
                      id={estilos.id_categoria_insumos_input} // Cambia el id para que sea único
                      value={insumos1.id_categoria_insumo}
                      onChange={handleChange}
                    >
                       <option value="" disabled selected>
                        Seleccionar una categoría
                      </option>
                      {categoria_insumo.map((categoria) => {
                        if (categoria.estado_categoria_insumos != false) {
                          return (
                            <option value={categoria.id_categoria_insumos}>
                              {categoria.nombre_categoria_insumos}
                            </option>
                          );
                        }
                      })}
                    </select>
                    {
  !inputCategoriaValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
                  </div>
                </div>
              </div>
            </div>
            <br />
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
                  setInputNombreValido(true)
                  setInputNombreValido2(true)
                  setInputNombreValido3(true)
                  setInputCategoriaValido(true)
                  setInputStockValido(true)
                  setInputStockValido2(true)
                  setInputStockValido3(true)
                  setInputMedidaValido(true)
                  setinsumos1({
                    nombre_insumo: "",
                    unidadesDeMedida_insumo: "",
                    stock_insumo: "",
                    estado_insumo: 1,
                    id_categoria_insumo: "",
                  });
                }
                  
                }
                className={estilos["gris"]}
                type="button"
              >
                {" "}
                <p>Cancelar</p>
              </button>
            </div>
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
                  <div>
                    <p id={estilos.textito}> Nombre</p>
                    <input
                      id={estilos.nombreinsumo}

                      className={`${estilos.inputnombreeditado} ${!inputNombreValido ? estilos.inputInvalido : ''}
                      ${!inputNombreValido2 ? estilos.inputInvalido : ''}
                      ${!inputNombreValido3 ? estilos.inputInvalido : ''}`}
                      type="text"
                      placeholder="Insertar nombre"
                      name="nombre_insumo"
                      value={insumosEditar.nombre_insumo}
                      onChange={handleEditarChange}
                    />

{
  !inputNombreValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El límite es de 50 letras.</p>
  )
}
{
  !inputNombreValido2 && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>No se aceptan caracteres especiales.</p>
  )
}

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
                  </div>
                  <div className={estilos["espacio2"]}></div>
                </div>
                <br />
                <div className={estilos["inputIdNombre"]}>
                  <div id={estilos.documentoproveedor}>
                    <p id={estilos.textito}> Unidad de medida</p>
                    <select
                       className={`${estilos.input2} ${!inputMedidaValido ? estilos.inputInvalido : ''}
                       `}
                      name="unidadesDeMedida_insumo"
                      id={estilos.unidadesDeMedida_insumo_input}
                      value={insumosEditar.unidadesDeMedida_insumo}
                      onChange={handleEditarChange}
                    >
                      <option value="" disabled selected>
                        Seleccionar unidad de medida
                      </option>
                      <option value="kilogramos">Kilogramo</option>
                      <option value="litros">Litro</option>
                      <option value="piezas">Pieza</option>
                      <option value="gramos">Gramos</option>
                      <option value="miligramos">Miligramos</option>
                      <option value="mililitros">Mililitro</option>
                      <option value="toneladas">Tonelada</option>
                    </select>
                    {
  !inputMedidaValido && (
    <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '1px' }}>El campo no puede estar vacío</p>
  )
}
                  </div>
                  <div className={estilos["espacio2"]}></div>
                  <div id={estilos.eo}>
                  <p id={estilos.textito}> Categoria</p>
                  <select
                      className={estilos["input2"]}
                      name="id_categoria_insumo" // Utiliza el mismo nombre que el campo id_rol
                      id={estilos.id_categoria_insumos_input} // Cambia el id para que sea único
                      value={insumosEditar.id_categoria_insumo}
                      onChange={handleEditarChange}
                    >
                                             <option value="" disabled selected>
                        Seleccionar una categoría
                      </option>
                      {categoria_insumo.map((categoria) => {
                        if (categoria.estado_categoria_insumos != false) {
                          return (
                            <option value={categoria.id_categoria_insumos}>
                              {categoria.nombre_categoria_insumos}
                            </option>
                          );
                        }
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <br />

            <center>
              <div className={estilos["BotonesClientes"]}>
                <button
                  onClick={() => registrar()}
                  className={estilos["azulado"]}
                  type="submit"
                >
                  <p> Aceptar</p>{" "}
                </button>

                <button
                  onClick={() => {cambiarEstadoModalEditar(!estadoModaleditar)
                    setInputNombreValido(true)
                    setInputNombreValido2(true)
                    setInputNombreValido3(true)
                    setInputStockValido(true)
                    setInputStockValido2(true)
                    setInputStockValido3(true)
                    setInputMedidaValido(true)
                    setInputCategoriaValido(true)
                  }}
                  className={estilos["gris"]}
                  type="button"
                >
                  {" "}
                  <p> Cancelar</p>
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

  img {
    width: 100%;
    vertical-align: top;
    border-radius: 3px;
  }
`;

const Contenido2 = styled.div`
  display: flex;
  flex-direction: column;

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
export default Insumos;
