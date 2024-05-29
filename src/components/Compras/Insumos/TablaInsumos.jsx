import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import $ from "jquery";
import "../../Layout.css";
import estilos from "./TablaInsumos.module.css";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Modal from "./modal";
import styled from "styled-components";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Insumos() {
  const token = localStorage.getItem("token");
  const [insumos, setinsumos] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estadoModaleditar, cambiarEstadoModalEditar] = useState(false);
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
      insumo.nombre_insumo.toString().toLowerCase().includes(filtro) ||
      insumo.unidadesDeMedida_insumo
        .toString()
        .toLowerCase()
        .includes(filtro) ||
      insumo.stock_insumo.toString().includes(filtro) ||
      insumo.id_categoria_insumo.toString().includes(filtro) ||
      insumo.nombre_categoria.toString().toLowerCase().includes(filtro) ||
      insumo.estado_insumo.toString().includes(filtro)
  );

  const generarPDF = () => {
    const doc = new jsPDF();

    // Encabezado del PDF
    doc.text("Reporte de Insumos", 20, 10);

    // Definir las columnas que se mostrarán en el informe
    const columnasInforme = ["Id", "Nombre", "Medida", "Stock", "Categoría"];

    // Filtrar los datos de los insumos para incluir solo las columnas deseadas
    const datosInforme = filteredinsumos.map((insumo) => {
      const {
        id_insumo,
        nombre_insumo,
        unidadesDeMedida_insumo,
        stock_insumo,
        nombre_categoria,
      } = insumo;
      return [
        id_insumo,
        nombre_insumo,
        unidadesDeMedida_insumo,
        stock_insumo,
        nombre_categoria,
      ];
    });

    // Agregar la tabla al documento PDF
    doc.autoTable({
      startY: 20,
      head: [columnasInforme],
      body: datosInforme,
    });

    // Guardar el PDF
    doc.save("reporte_insumos.pdf");
  };

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
                row.estado_insumo === 1 ? "iconosNaranjas" : "iconosGris"
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
      title: "¿Estás seguro?",
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
              title: "Error",
              text: "Error al eliminar el insumo",
            });
          }
        } catch (error) {
          console.error("Error al eliminar el insumo:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al eliminar el insumo",
          });
        }
      }
    });
  };

  const handleEditarChange = (event) => {
    const { name, value } = event.target;
    setInsumosEditar((previnsumos) => ({
      ...previnsumos,
      [name]: value,
    }));
  };

  const handleSubmitEditar = async (event) => {
    event.preventDefault();

    const regex = /^[a-zA-Z0-9\s#,;.()-]*$/;

    if (
      !regex.test(insumos1.nombre_insumo) ||
      !regex.test(insumos1.unidadesDeMedida_insumo) ||
      !regex.test(insumos1.stock_insumo)
    ) {
      // Mostrar alerta con SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Los campos no pueden contener caracteres especiales",
      });
      return;
    }

    // Validar que se haya seleccionado una categoría de insumo
    if (!insumosEditar.id_categoria_insumo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor selecciona una categoría de insumo",
      });
      return; // Detener la ejecución si no se seleccionó una categoría
    }

    console.log(insumos);

    Swal.fire({
      title: "¿Estás seguro?",
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
              title: "Error",
              text: "Error al actualizar el insumo",
            });
          }
        } catch (error) {
          console.error("Error al actualizar el insumo:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
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
        title: "Error",
        text: "No hay categorías de insumos activas",
      });
    } else {
      // Si hay categorías activas, cambiar el estado del modal de agregar
      cambiarEstadoModalAgregar(!estadoModalAgregar);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !insumos1.nombre_insumo ||
      !insumos1.unidadesDeMedida_insumo ||
      !insumos1.stock_insumo ||
      !insumos1.id_categoria_insumo
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor completa todos los campos obligatorios",
      });
      return;
    }
    // Validar que el stock sea un número positivo
    if (insumos1.stock_insumo < 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El stock debe ser un número positivo",
      });
      return;
    }

    // Validar que el stock sea un número positivo
    if (insumos1.stock_insumo > 5000000) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El stock no puede tiene un límite de 5 millones",
      });
      return;
    }

    // Validar que el nombre tenga al menos 3 letras
    if (insumos1.nombre_insumo.length < 3) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El nombre del insumo debe tener al menos 3 letras",
      });
      return;
    }

    // Validar que no haya caracteres especiales en los campos
    const regex = /^[a-zA-Z0-9\s#,;.()-]*$/;

    if (
      !regex.test(insumos1.nombre_insumo) ||
      !regex.test(insumos1.unidadesDeMedida_insumo) ||
      !regex.test(insumos1.stock_insumo)
    ) {
      // Mostrar alerta con SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error",
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
          title: "Error",
          text: "Error al crear el insumo",
        });
      }
    } catch (error) {
      console.error("Error al crear el insumo:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
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
        backgroundColor: "#E7E7E7",
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

          <button
            style={{ color: "white" }}
            className={` ${estilos.vinotinto}`}
            onClick={generarPDF}
          >
            <i className="fa-solid fa-download"></i>
          </button>
        </div>
      </div>

      <div className={estilos["tabla"]}>
        <DataTable
          columns={columns}
          data={filteredinsumos}
          pagination
          paginationPerPage={5}
          highlightOnHover
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
                      className={estilos["inputnombre"]}
                      type="text"
                      placeholder="Insertar nombre"
                      name="nombre_insumo"
                      value={insumos1.nombre_insumo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={estilos["espacio"]}></div>

                  <div id={estilos.telefonoproveedor}>
                    <p id={estilos.textito}> Stock</p>
                    <input
                      className={estilos["inputstock"]}
                      type="text"
                      placeholder="000"
                      name="stock_insumo"
                      value={insumos1.stock_insumo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <br />
                <div className={estilos["inputIdNombre"]}>
                  <div id={estilos.documentoproveedor}>
                    <p id={estilos.textito}> Unidad de medida</p>
                    <select
                      className={estilos["input2"]}
                      name="unidadesDeMedida_insumo"
                      id={estilos.unidadesDeMedida_insumo_input}
                      value={insumos1.unidadesDeMedida_insumo}
                      onChange={handleChange}
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
                  </div>

                  <div id={estilos.eo}>
                    <p id={estilos.textito}> Categoría insumo</p>
                    <select
                      className={estilos["input2"]}
                      name="id_categoria_insumo" // Utiliza el mismo nombre que el campo id_rol
                      id={estilos.id_categoria_insumos_input} // Cambia el id para que sea único
                      value={insumos1.id_categoria_insumo}
                      onChange={handleChange}
                    >
                      <option value={0}>Seleccione una categoria</option>
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
            <div className={estilos["BotonesClientes"]}>
              <button
                onclick="registrar()"
                className={estilos["azulado"]}
                type="submit"
              >
                <p>Aceptar</p>{" "}
              </button>

              <button
                onClick={() => cambiarEstadoModalAgregar(!estadoModalAgregar)}
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
                      className={estilos["inputnombreeditado"]}
                      type="text"
                      placeholder="Insertar nombre"
                      name="nombre_insumo"
                      value={insumosEditar.nombre_insumo}
                      onChange={handleEditarChange}
                    />
                  </div>
                  <div className={estilos["espacio2"]}></div>
                </div>
                <br />
                <div className={estilos["inputIdNombre"]}>
                  <div id={estilos.documentoproveedor}>
                    <p id={estilos.textito}> Unidad de medida</p>
                    <select
                      className={estilos["input2"]}
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
                      <option value={0}>Seleccione una categoria</option>
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
                  onClick={() => cambiarEstadoModalEditar(!estadoModaleditar)}
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

  img {
    width: 100%;
    vertical-align: top;
    border-radius: 3px;
  }
`;
export default Insumos;
