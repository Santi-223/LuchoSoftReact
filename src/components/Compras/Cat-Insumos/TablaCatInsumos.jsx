import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import $ from "jquery";
import "../../Layout.css";
import estilos from "./TablaCat-Insumos.module.css";
import Modal from "./modal";
import styled from "styled-components";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";

function categoria_insumos() {
  const token = localStorage.getItem("token");
  const [categoria_insumos, setcategoria_insumos] = useState([]);
  const [estadoModaleditar, cambiarEstadoModalEditar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [estadoModalAgregar, cambiarEstadoModalAgregar] = useState(false);
  const [inputValido, setInputValido] = useState(true);
  const [inputValido2, setInputValido2] = useState(true);
  const [inputValido3, setInputValido3] = useState(true);
  const [categoria_insumos1, setCategoria_insumos1] = useState({
    nombre_categoria_insumos: "",
    estado_categoria_insumos: 1,
  });

  const [categoria_insumosEditar, setCategoria_insumosEditar] = useState({
    nombre_categoria_insumos: "",
    estado_categoria_insumos: 1,
  });

  const tableRef = useRef(null);
  const [filtro, setFiltro] = useState("");

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };
  const filteredcategoria_insumos = categoria_insumos.filter(
    (categoria_insumos) =>
      (categoria_insumos.id_categoria_insumos &&
        categoria_insumos.id_categoria_insumos.toString().includes(filtro)) ||
      categoria_insumos.nombre_categoria_insumos
        .toLowerCase()
        .includes(filtro.toLowerCase()) ||
      (categoria_insumos.estado_categoria_insumos &&
        categoria_insumos.estado_categoria_insumos.toString().includes(filtro))
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "nombre_categoria_insumos") {
      if (value.length > 30) {
        setInputValido(false);
      } else {
        setInputValido(true);
      }
    }
    if (name === "nombre_categoria_insumos") {
      if (value.length > 0) {
        setInputValido3(true);
      }
    }

    if (name === "nombre_categoria_insumos") {
      // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
      const caracteresEspeciales = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]*$/;

      // Verificar si la cadena no contiene caracteres especiales
      if (caracteresEspeciales.test(value)) {
        setInputValido2(true);
      } else {
        setInputValido2(false);
      }
    }
    setCategoria_insumos1((prevcategoria_insumos) => ({
      ...prevcategoria_insumos,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputValido) {
      Swal.fire({
        icon: "error",

        text: "El mínimo es 3 letras y el máximo es de 30.",
        confirmButtonColor: "#1F67B9",
      });
      return;
    }

    if (!inputValido2) {
      Swal.fire({
        icon: "error",

        text: "No se aceptan caracteres especiales",
        confirmButtonColor: "#1F67B9",
      });
      return;
    }

    // Validar que el nombre no esté vacío
    if (categoria_insumos1.nombre_categoria_insumos.trim() === "") {
      Swal.fire({
        icon: "error",

        text: "El nombre de la categoría de insumos no puede estar vacío",
      });
      setInputValido3(false);
      return;
    }

    if (categoria_insumos1.nombre_categoria_insumos.length < 3) {
      Swal.fire({
        icon: "error",

        text: "El nombre de la categorìa de insumo debe tener al menos 3 letras",
      });
      setInputValido(false);
      return;
    }

    // Validar que no haya caracteres especiales en el nombre
    const regex = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]*$/;

    if (!regex.test(categoria_insumos1.nombre_categoria_insumos)) {
      // Mostrar alerta con SweetAlert
      Swal.fire({
        icon: "error",

        text: "El nombre no puede contener caracteres especiales",
      });
      return;
    }

    try {
      console.log("categoría de insumo a enviar: ", categoria_insumos1);

      const responseCategoria_insumos = await fetch(
        "https://api-luchosoft-mysql.onrender.com/compras/categoria_insumos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(categoria_insumos1),
        }
      );

      if (responseCategoria_insumos.ok) {
        console.log("categoría de insumo creada exitosamente.");

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
          title: "Categorìa de insumo registrada exitosamente."
        })
        setTimeout(() => {
          fetchcategoria_insumos();

          setCategoria_insumos1({
            nombre_categoria_insumos: "",
            estado_categoria_insumos: 1,
          });

          cambiarEstadoModalAgregar(false);
        }, 2000);
      } else {
        console.error(
          "Error al crear la categoría de insumo:",
          responseCategoria_insumos.statusText
        );
        Swal.fire({
          icon: "error",

          text: "Error al crear la categoría de insumo",
        });
      }
    } catch (error) {
      console.error("Error al crear la categoría de insumo:", error);
    }
  };
  const handleEditarChange = (event) => {
    const { name, value } = event.target;
    if (name === "nombre_categoria_insumos") {
      if (value.length > 30) {
        setInputValido(false);
      } else {
        setInputValido(true);
      }
    }
    if (name === "nombre_categoria_insumos") {
      if (value.length > 0) {
        setInputValido3(true);
      }
    }

    if (name === "nombre_categoria_insumos") {
      // Expresión regular que coincide con cualquier carácter que no sea una letra, un número o un guion bajo
      const caracteresEspeciales = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]*$/;

      // Verificar si la cadena no contiene caracteres especiales
      if (caracteresEspeciales.test(value)) {
        setInputValido2(true);
      } else {
        setInputValido2(false);
      }
    }
    setCategoria_insumosEditar((prevcategoria_insumos) => ({
      ...prevcategoria_insumos,
      [name]: value,
    }));
  };

  const handleEliminarCategoria = (idcategoria_insumos) => {
    // Mostrar un mensaje de confirmación antes de eliminar
    Swal.fire({
      text: "¿Deseas eliminar esta categoría?",
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
            `https://api-luchosoft-mysql.onrender.com/compras/categoria_insumos/${idcategoria_insumos}`,
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
              title: "Categorìa de insumo eliminada exitosamente."
            })

            fetchcategoria_insumos();
          } else {
            console.error(
              "Error al eliminar el categorìa:",
              response.statusText
            );
            Swal.fire({
              icon: "error",

              text: "La categoría está siendo usada en algún insumo",
            });
          }
        } catch (error) {
          console.error("Error al eliminar la categoría:", error);
          Swal.fire({
            icon: "error",

            text: "Error al eliminar la categoría",
          });
        }
      }
    });
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id_categoria_insumos,
      sortable: true,
    },

    {
      name: "Nombre",
      selector: (row) => row.nombre_categoria_insumos,
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row) => (
        <div className={estilos["acciones"]}>
          <button
            className={estilos.boton}
            onClick={() =>
              handleEstadocategoria_insumo(
                row.id_categoria_insumos,
                row.estado_categoria_insumos
              )
            }
            style={{ cursor: "pointer", textAlign: "center", fontSize: "30px" }}
          >
            {row.estado_categoria_insumos === 1 ? (
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
      name: "Acciones",
      cell: (row) => (
        <div className={estilos["acciones"]}>
          <button
            onClick={() => {
              if (row.estado_categoria_insumos === 1) {
                // Verifica si el estado es activo
                cambiarEstadoModalEditar(!estadoModaleditar),
                  setCategoria_insumosEditar(row);
              }
            }}
            className={estilos.boton}
            style={{ cursor: "pointer", textAlign: "center", fontSize: "20px" }}
          >
            <i
              className={`fa-solid fa-pen-to-square ${
                row.estado_categoria_insumos === 1
                  ? "iconosNaranjas"
                  : "iconosGris"
              }`}
            ></i>
          </button>

          <button
            onClick={() => handleEliminarCategoria(row.id_categoria_insumos)}
            disabled={row.estado_categoria_insumos === 0}
            className={estilos.boton}
            style={{ cursor: "pointer", textAlign: "center", fontSize: "25px" }}
          >
            <i
              className={`bi bi-trash ${
                row.estado_categoria_insumos === 0 ? "basuraDesactivada" : ""
              }`}
              style={{
                color: row.estado_categoria_insumos === 0 ? "gray" : "red",
              }}
            ></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchcategoria_insumos();
  }, []);

  useEffect(() => {
    if (categoria_insumos.length > 0) {
      setIsLoading(false);
    }
  }, [categoria_insumos]);

  const fetchcategoria_insumos = async () => {
    try {
      const response = await fetch(
        "https://api-luchosoft-mysql.onrender.com/compras/categoria_insumos"
      );
      if (response.ok) {
        const data = await response.json();
        const categoria_insumosFiltrador = data.map((categoria_insumos) => ({
          id_categoria_insumos: categoria_insumos.id_categoria_insumos,
          nombre_categoria_insumos: categoria_insumos.nombre_categoria_insumos,
          estado_categoria_insumos: categoria_insumos.estado_categoria_insumos,
        }));
        setInputValido(true);
        setInputValido2(true);
        setInputValido3(true);
        setcategoria_insumos(categoria_insumosFiltrador);
      } else {
        console.error("Error al obtener las categoria_insumos");
      }
    } catch (error) {
      console.error("Error al obtener las categoria_insumos:", error);
    }
  };

  const handleSubmitEditar = async (event) => {
    event.preventDefault();

    if (!inputValido) {
      Swal.fire({
        icon: "error",
        text: "Por favor, digite bien los datos",
        confirmButtonColor: "#1F67B9",
      });
      return;
    }

    if (!inputValido2) {
      Swal.fire({
        icon: "error",
        text: "No se aceptan caracteres especiales",
        confirmButtonColor: "#1F67B9",
      });
      return;
    }

    // Validar que el nombre no esté vacío
    if (categoria_insumosEditar.nombre_categoria_insumos.trim() === "") {
      Swal.fire({
        icon: "error",

        text: "El nombre de la categoría de insumos no puede estar vacío",
      });
      setInputValido3(false);
      return;
    }

    if (categoria_insumosEditar.nombre_categoria_insumos.length < 3) {
      Swal.fire({
        icon: "error",

        text: "El nombre de la categorìa de insumo debe tener al menos 3 letras",
      });
      setInputValido(false);
      return;
    }

    // Validar que no haya caracteres especiales en el nombre
    const regex = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñÜü]*$/;

    if (!regex.test(categoria_insumosEditar.nombre_categoria_insumos)) {
      // Mostrar alerta con SweetAlert
      Swal.fire({
        icon: "error",

        text: "El nombre no puede contener caracteres especiales",
      });
      return;
    }

    Swal.fire({
      text: "¿Deseas actualizar la información de la categoría de insumo?",
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
            `https://api-luchosoft-mysql.onrender.com/compras/categoria_insumos/${categoria_insumosEditar.id_categoria_insumos}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify(categoria_insumosEditar),
            }
          );

          if (response.ok) {
            console.log("categoría de insumo actualizado exitosamente.");
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
              title: "Categorìa de insumo editada exitosamente."
            })
            setTimeout(() => {
              window.location.href = "/#/CatInsumos";
              fetchcategoria_insumos();
              cambiarEstadoModalEditar(false);
            }, 2000);
          } else {
            console.error(
              "Error al actualizar la categoría de insumo:",
              response.statusText
            );
            Swal.fire({
              icon: "error",

              text: "Error al actualizar la categoría de insumo",
            });
          }
        } catch (error) {
          console.error("Error al actualizar la categoría de insumo:", error);
          Swal.fire({
            icon: "error",

            text: "Error al actualizar la categoría de insumo",
          });
        }
      }
    });
  };

  const handleEstadocategoria_insumo = async (
    idcategoria_insumos,
    estadocategoria_insumos
  ) => {
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
          const nuevoEstado = estadocategoria_insumos === 1 ? 0 : 1;

          const response = await fetch(
            `https://api-luchosoft-mysql.onrender.com/compras/estadoCatInsumos/${idcategoria_insumos}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                estado_categoria_insumos: nuevoEstado,
              }),
            }
          );

          if (response.ok) {
            // Actualización exitosa, actualizar la lista de categoria_insumos
            fetchcategoria_insumos();
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
        <h1>Categoría de Insumos</h1>
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
            className={`${estilos.botonAgregar} ${estilos.rojo} bebas-neue-regular`}
          >
            <i className="fa-solid fa-plus"></i> Agregar
          </button>
        </div>
      </div>

      <div className={estilos["tabla"]}>
        <DataTable
          columns={columns}
          data={filteredcategoria_insumos}
          pagination
          paginationPerPage={6}
          highlightOnHover
          customStyles={customStyles} defaultSortField="id_categoria_productos" defaultSortAsc={true}>
        </DataTable>
      </div>

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
              <br />
              <br />
              <br />
              <div className={estilos["inputIdNombre"]}>
                <div>
                  <p id={estilos.textito}> Nombre</p>
                  <input
                    id={estilos.nombre_categoria_insumos}
                    className={`${estilos.inputfield2} ${
                      !inputValido ? estilos.inputInvalido : ""
                    } ${!inputValido2 ? estilos.inputInvalido : ""} ${
                      !inputValido3 ? estilos.inputInvalido : ""
                    }`}
                    type="text"
                    placeholder="Insertar nombre"
                    name="nombre_categoria_insumos"
                    value={categoria_insumos.nombre_categoria_insumos}
                    onChange={handleChange}
                  />
                  {!inputValido3 && (
                    <p
                      className="error"
                      style={{
                        color: "red",
                        fontSize: "10px",
                        position: "absolute",
                        marginLeft: "1px",
                      }}
                    >
                      El campo no puede estar vacío
                    </p>
                  )}
                  {!inputValido2 && !inputValido && (
                    <p
                      className="error"
                      style={{
                        color: "red",
                        fontSize: "10px",
                        position: "absolute",
                        marginLeft: "1px",
                      }}
                    >
                      No se aceptan caracteres especiales.
                    </p>
                  )}
                  {!inputValido && inputValido2 && (
                    <p
                      className="error"
                      style={{
                        color: "red",
                        fontSize: "10px",
                        position: "absolute",
                        marginLeft: "1px",
                      }}
                    >
                      Debe de contener al menos 2 letras y máximo 30.
                    </p>
                  )}
                  {!inputValido2 && inputValido && (
                    <p
                      className="error"
                      style={{
                        color: "red",
                        fontSize: "10px",
                        position: "absolute",
                        marginLeft: "1px",
                      }}
                    >
                      No se aceptan caracteres especiales.
                    </p>
                  )}
                </div>

                <br />
              </div>
            </div>
            <center>
              <div className={estilos["BotonesClientes"]}>
                <button className={estilos["azulado"]} type="submit">
                  <p>Aceptar</p>{" "}
                </button>

                <button
                  onClick={() => {
                    cambiarEstadoModalAgregar(!estadoModalAgregar);
                    setInputValido(true);
                    setInputValido2(true);
                    setInputValido3(true);
                    setCategoria_insumos1({
                      nombre_categoria_insumos: "",
                      estado_categoria_insumos: 1,
                    });
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
                <div className={estilos["inputIdNombre"]}>
                  <div id={estilos.eo}>
                    <p id={estilos.textito}> Nombre</p>
                    <input
                      id={estilos.nombre_categoria_insumos}
                      className={`${estilos.inputfield2} ${
                        !inputValido ? estilos.inputInvalido : ""
                      } ${!inputValido2 ? estilos.inputInvalido : ""} ${
                        !inputValido3 ? estilos.inputInvalido : ""
                      }`}
                      type="text"
                      placeholder="Insertar nombre"
                      name="nombre_categoria_insumos"
                      value={categoria_insumosEditar.nombre_categoria_insumos}
                      onChange={handleEditarChange}
                    />

                    {!inputValido3 && (
                      <p
                        className="error"
                        style={{
                          color: "red",
                          fontSize: "10px",
                          position: "absolute",
                          marginLeft: "1px",
                        }}
                      >
                        El campo no puede estar vacío
                      </p>
                    )}
                    {!inputValido && !inputValido2 && (
                      <p
                        className="error"
                        style={{
                          color: "red",
                          fontSize: "10px",
                          position: "absolute",
                          marginLeft: "1px",
                        }}
                      >
                        El límite es de 30 letras y no se aceptan caracteres
                        especiales.
                      </p>
                    )}
                    {inputValido && !inputValido2 && (
                      <p
                        className="error"
                        style={{
                          color: "red",
                          fontSize: "10px",
                          position: "absolute",
                          marginLeft: "1px",
                        }}
                      >
                        No se aceptan caracteres especiales.
                      </p>
                    )}
                    {!inputValido && inputValido2 && (
                      <p
                        className="error"
                        style={{
                          color: "red",
                          fontSize: "10px",
                          position: "absolute",
                          marginLeft: "1px",
                        }}
                      >
                        El límite es de 30 letras.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <center>
              <div className={estilos["BotonesClientes"]}>
                <button className={estilos["azulado"]} type="submit">
                  <p>Aceptar</p>{" "}
                </button>

                <button
                  onClick={() => {
                    cambiarEstadoModalEditar(!estadoModaleditar);
                    setInputValido(true);
                    setInputValido2(true);
                    setInputValido3(true);
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

    margin-bottom: 20px;
  }

  img {
    width: 100%;
    vertical-align: top;
    border-radius: 3px;
  }
`;
export default categoria_insumos;
