import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import styled from "styled-components";
import estilos from './Pedidos.module.css';
import { Link } from "react-router-dom";
import { useUserContext } from "../../UserProvider";
import { AutoComplete } from 'primereact/autocomplete';

function App() {
  const token = localStorage.getItem("token");
  const [productos, setProductos] = useState([]);
  const { usuarioLogueado } = useUserContext();
  const usuario = usuarioLogueado;
  const [isLoading, setIsLoading] = useState(true);
  const [pedido, setPedido] = useState({
    observaciones: "Mesa ",
    fecha_venta: "",
    fecha_pedido: "",
    estado_pedido: 1,
    total_venta: 0,
    total_pedido: 0,
    id_cliente: 0,
    id_usuario: usuario.id_usuario,
  });
  const [pedidoCliente, setPedidoCliente] = useState({
    id_cliente: 0
  })
  const [clientes, setClientes] = useState([]);
  const tableRef = useRef(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [tableRows, setTableRows] = useState([
    {
      nombre: "",
      precio_unitario: 0,
      cantidad: 0,
      cantidad_seleccionada: 0,
      precio_total: 0,
    },
  ]);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [formChanged, setFormChanged] = useState(false);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [inputValidoFecha, setInputValidoFecha] = useState(true);
  const [errorFecha, setErrorFecha] = useState('')
  useEffect(() => {
    fetchProductos();
    fetchClientes();
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      setIsLoading(false);
    }
  }, [productos]);

  const ultimoId = async () => {
    const response = await fetch("https://api-luchosoft-mysql.onrender.com/ventas/pedidos");
    const data = await response.json();
    const lastItem = data[data.length - 1];
    const lastId = lastItem.id_pedido;
    return lastId;
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...tableRows];
    updatedRows.splice(index, 1);
    setTableRows(updatedRows);
    const total = updatedRows.reduce((accumulator, currentValue) => {
      return accumulator + (parseFloat(currentValue.precio_total) || 0);
    }, 0);
    setPrecioTotal(total);
    setFormChanged(true);
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch("https://api-luchosoft-mysql.onrender.com/ventas2/productos");
      if (response.ok) {
        const data = await response.json();
        const productosData = data.filter(producto => producto.estado_producto === 1).map(producto => ({
          id_producto: producto.id_producto,
          nombre_producto: producto.nombre_producto,
          descripcion_producto: producto.descripcion_producto,
          estado_producto: producto.estado_producto,
          precio_producto: producto.precio_producto,
          id_categoria_producto: producto.id_categoria_producto
        }))
        setProductos(productosData);
      } else {
        throw new Error("Error al obtener los productos");
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al obtener los productos.",
      });
    }
  };
  let intervalId = null;

  const fetchClientes = async () => {
    try {
      const response = await fetch("https://api-luchosoft-mysql.onrender.com/ventas/clientes");
      if (response.ok) {
        const data = await response.json();
        const ClienteData = data.filter(cliente => cliente.estado_cliente === 1).map(cliente => ({
          id_cliente: cliente.id_cliente,
          nombre_cliente: cliente.nombre_cliente,
          telefono_cliente: cliente.telefono_cliente,
          direccion_cliente: cliente.direccion_cliente,
          cliente_frecuente: cliente.cliente_frecuente,
          estado_cliente: cliente.estado_cliente
        }))
        setClientes(prevClientes => [...prevClientes, ...ClienteData]);
      } else {
        console.error("Error al obtener los clientes");
      }
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  const startPolling = () => {
    intervalId = setInterval(fetchClientes, 20000); // Llamar a fetchClientes cada 10 segundos
  };

  const stopPolling = () => {
    clearInterval(intervalId);
  };
  const addCliente = () => {
    setClientes((prevClientes) => {
      const updatedClientes = [...prevClientes];
      setFilteredClientes(updatedClientes); // Actualizar clientes filtrados
      return updatedClientes;
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'fecha_pedido') {
      if (value.trim() === '') {
        setErrorFecha('El campo es obligatorio.');
        setInputValidoFecha(false);
      }
    }

    const parsedValue = name === "id_cliente" ? parseInt(value, 10) : value;

    setPedido((prevPedido) => ({ ...prevPedido, [name]: parsedValue }));
    setFormChanged(true);

    if (name === "fecha_pedido") {
      setPedido((prevPedido) => ({
        ...prevPedido,
        fecha_pedido: value,
        fecha_venta: value,
      }));
    }

    if (name === "total_pedido") {
      setPedido((prevPedido) => ({
        ...prevPedido,
        total_pedido: value,
        total_venta: value,
      }));
    }
  };
  const today = new Date().toISOString().split('T')[0];

  const handleSelectChange = (event, index) => {
    const { value } = event.target;
  
    // Verificar si el producto ya está seleccionado en otra fila
    const isProductAlreadySelected = tableRows.some((row, rowIndex) => {
      return rowIndex !== index && row.nombre === value;
    });
  
    if (isProductAlreadySelected) {
      Swal.fire({
        icon: 'error',
        title: 'Producto ya seleccionado',
        text: 'Este producto ya ha sido seleccionado en otra fila. Por favor, elige otro producto.',
      });
      return;
    }
  
    const selectedProducto = productos.find(
      (producto) => producto.nombre_producto === value
    );
    if (!selectedProducto) {
      return;
    }
  
    const updatedRows = tableRows.map((row, rowIndex) => {
      if (rowIndex === index) {
        return {
          ...row,
          nombre: value,
          productoId: selectedProducto.id_producto,
          precio_unitario: selectedProducto.precio_producto,
        };
      }
      return row;
    });
  
    setTableRows(updatedRows);
    setFormChanged(true);
  };

  const handleCantidadChange = (event, index) => {
    const { value } = event.target;
    const cantidad = parseFloat(value);

    if (isNaN(cantidad) || cantidad <= 0) {
      return;
    }

    const updatedRows = tableRows.map((row, rowIndex) => {
      if (rowIndex === index) {
        const precioUnitario = parseFloat(row.precio_unitario) || 0;
        const precioTotal = cantidad * precioUnitario;
        return {
          ...row,
          cantidad: value,
          cantidad_seleccionada: cantidad,
          precio_total: precioTotal,
        };
      }
      return row;
    });

    setTableRows(updatedRows);

    const total = updatedRows.reduce((accumulator, currentValue) => {
      return accumulator + (parseFloat(currentValue.precio_total) || 0);
    }, 0);

    setPrecioTotal(total);
    setFormChanged(true);
  };

  const handleAgregarProducto = () => {
    setTableRows([
      ...tableRows,
      {
        nombre: "",
        precio_unitario: 0,
        cantidad: 0,
        cantidad_seleccionada: 0,
        precio_total: 0,
      },
    ]);
  };

  const handleSubmitPedido = async (event) => {
    event.preventDefault();
    if (
      !pedido.fecha_pedido ||
      !pedido.observaciones ||
      !pedidoCliente.id_cliente ||
      tableRows.some((row) => !row.nombre || !row.cantidad)
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hay campos vacíos",
        confirmButtonColor: "#1F67B9",
      });
      return;
    }

    try {
      const detallesPedido = tableRows.map((row) => ({
        cantidad_producto: parseInt(row.cantidad),
        id_producto: productos.find(
          (producto) => producto.nombre_producto === row.nombre
        ).id_producto,
        subtotal: row.precio_unitario * row.cantidad,
      }));
      const totalPedido = tableRows.reduce(
        (total, row) => total + parseFloat(row.precio_total || 0),
        0
      );
      console.log(totalPedido);
      const responsePedido = await fetch(
        "https://api-luchosoft-mysql.onrender.com/ventas/pedidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...pedido,
            id_cliente: pedidoCliente.id_cliente,
            total_pedido: totalPedido,
            total_venta: totalPedido,
          }),
        }
      );
      if (responsePedido.ok) {
        console.log('Pedido creado exitosamente.');
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
          title: "Registro exitoso"
        });
      }

      if (!responsePedido.ok) {
        console.error("Error al enviar los datos del pedido");
        return;
      }

      const lastId = await ultimoId();

      const pedidosProductosPromises = detallesPedido.map(async (detalle) => {
        const responsePedidosProductos = await fetch(
          "https://api-luchosoft-mysql.onrender.com/ventas/pedidos_productos",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...detalle,
              fecha_pedido_producto: pedido.fecha_pedido,
              id_pedido: lastId
            }),
          }
        );

        if (!responsePedidosProductos.ok) {
          console.error(
            "Error al enviar los datos de pedidos_productos:",
            responsePedidosProductos.statusText
          );
          throw new Error("Error al enviar los datos de pedidos_productos");
        }

        const productoRegistrado = await responsePedidosProductos.json();
        console.log("Producto registrado correctamente:", productoRegistrado);
      });

      // Esperar a que todas las solicitudes de pedidos_productos se completen
      await Promise.all(pedidosProductosPromises);

      // Redirigir después de completar el proceso
      window.location.href = "/#/pedidos";
    } catch (error) {
      console.error("Error al enviar los datos del pedido:", error);
    }
  };

  const handlePrecioChange = (e, index) => {
    const { value } = e.target;
    const updatedRows = tableRows.map((row, rowIndex) => {
      if (rowIndex === index) {
        return { ...row, precio_unitario: value };
      }
      return row;
    });
    setTableRows(updatedRows);

    const total = updatedRows.reduce((accumulator, currentValue) => {
      return accumulator + (parseFloat(currentValue.precio_unitario) || 0);
    }, 0);
    setPrecioTotal(total);

    if (updatedRows.length > 6) {
      setScrollEnabled(true);
    }
    setFormChanged(true);
  };

  const searchClientes = (event) => {
    setTimeout(() => {
      stopPolling();
      let filtered;
      if (!event.query.trim().length) {
        filtered = [...clientes];
      } else {
        filtered = clientes.filter((cliente) => {
          return (
            cliente.nombre_cliente.toLowerCase().includes(event.query.toLowerCase()) ||
            cliente.id_cliente.toString().includes(event.query)
          );
        });

        // Eliminar duplicados de la lista filtrada
        filtered = Array.from(new Set(filtered.map(cliente => cliente.id_cliente))).map(id_cliente => {
          return clientes.find(cliente => cliente.id_cliente === id_cliente);
        });
      }
      setFilteredClientes(filtered);
    }, 250);
  };
  const handleClienteChange = (e) => {

    if (e.value) {

      setSelectedCliente(e.value);
      setPedidoCliente((prevPedido) => ({
        ...prevPedido,
        id_cliente: e.value.id_cliente, // Para mostrar el nombre en el campo
      }));
    }
    setFormChanged(true);
  };

  const getAvailableProducts = (selectedProducts, allProducts) => {
    return allProducts.filter(
      (producto) => !selectedProducts.includes(producto.nombre_producto)
    );
  };

  if (isLoading) {
    return <div>Cargando la API, espere por favor...</div>;
  }

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic.min.css" rel="stylesheet" />

      <div className={estilos["contenido"]}>
        <div className={estilos["tituloR"]}>
          <h1>Registrar Pedidos</h1>
        </div>
        <div id={estilos["contenedorcito"]}>
          <div className={estilos["input-containerR"]}>
            <div id={estilos["kaka"]}>
              <label htmlFor="fechaPedido">Fecha<span style={{ color: 'red' }}>*</span></label>
              <input
                id="fechaPedido"
                name="fecha_pedido"
                className={`${!inputValidoFecha ? estilos['input-field23'] : estilos['input-field']}`}
                value={pedido.fecha_pedido}
                onChange={handleInputChange}
                type="date"
                max={today}
              />
              {!inputValidoFecha && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'relative' }}>{errorFecha}</p>}
            </div>
            <div id={estilos["kaka"]}>
              <input
                id="fechaVenta"
                name="fecha_venta"
                className="input-field"
                value={pedido.fecha_venta}
                onChange={handleInputChange}
                type="date"
                hidden
              />
            </div>
            <div id={estilos["kake"]}>
              <label htmlFor="Observaciones">
                {" "}
                Observaciones <span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={pedido.observaciones}
                onChange={handleInputChange}
                type="text"
                placeholder="Observaciones"
                cols="5" rows="4"
                style={{ resize: 'none' }}
                className={estilos['textarea']}
              />
            </div>
            <div className={estilos["cliente"]}>
              <div className="clienteasosciado" style={{ display: 'flex', textAlign: 'center' }}>
                <p>
                  Cliente asociado <span style={{ color: 'red' }}> *</span>
                </p>
                <Link to={'/clientes'} target="_blank" onClick={startPolling()}>
                  <button type="button" className="fa-solid fa-plus" style={{ background: '#3e7fc9', border: 'none', borderRadius: '20px', height: '40px', width: '40px', color: 'white', marginLeft: '40px', marginTop: '-10px', marginBottom: '10px' }} >
                  </button>
                </Link>
                {/* <button style={{background: '#154360', color: 'white',height: '30px', fontSize:'12px', marginLeft: '10px', border: 'none', borderRadius: '15px', width:'70px'}}>Agregar</button> */}
              </div>
              <div className="custom-autocomplete-container">

                <AutoComplete
                  value={selectedCliente}
                  suggestions={filteredClientes}
                  completeMethod={searchClientes}
                  field="id_cliente"
                  name="id_cliente"
                  // dropdown
                  forceSelection
                  itemTemplate={(item) => (
                    <div style={{ backgroundColor: 'white' }}>{item.id_cliente}  {item.nombre_cliente}</div>
                  )}
                  onChange={handleClienteChange}
                  placeholder="Buscar cliente"
                  inputStyle={{ width: '31vh', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize:'17px' }}
                // aria-label="Clientes"
                />
              </div>
            </div>
            <div className="BotonesPedidos">
              <div id={estilos["totalpedidos"]}>
                <label htmlFor="precioPedido">
                  Total{" "}
                </label>
                <input
                  id="precioPedido"
                  name="total_pedido"
                  className={estilos["input-field2"]}
                  value={precioTotal || ""}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="0"
                  readOnly={true}
                  style={{
                    color: "#999",
                  }}
                />
                <input
                  id="precioVenta"
                  name="total_venta"
                  className="input-field4"
                  value={precioTotal || ""}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="0"
                  hidden
                />
              </div>
            </div>
          </div>
          <div className={estilos["TablaDetallePedidos"]}>
            <div className={estilos["agrPedidos"]}>
              <p>Agregar Productos</p>
              <button type="button" className="fa-solid fa-plus" style={{ background: '#3e7fc9', border: 'none', borderRadius: '20px', width: '40px', color: 'white', marginTop:'-10px', marginBottom:'10px' }} onClick={handleAgregarProducto}>
              </button>
            </div>
            <div style={{ overflowY: scrollEnabled ? 'scroll' : 'auto', height: '60vh', width: '130%' }} >
              <table
                className="ui celled table"
                style={{ border: 'none' }}
                ref={tableRef}
              >
                <thead>
                  <tr>
                    <th style={{ background: '#3e7fc9', color: 'white', textAlign: 'center' }}>
                      Nombre Producto
                    </th>
                    <th style={{ background: '#3e7fc9', color: 'white', textAlign: 'center' }}>
                      Precio
                    </th>
                    <th style={{ background: '#3e7fc9', color: 'white', textAlign: 'center' }}>
                      Cantidad
                    </th>
                    <th style={{ background: '#3e7fc9', color: 'white', textAlign: 'center' }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr key={index} className={estilos.tabladetalle}>
                      <td style={{ textAlign: "center" }}>
                        <select
                          className={estilos["input-field-tabla"]}
                          value={row.nombre}
                          onChange={(e) => handleSelectChange(e, index)}
                          style={{ width: '300px', display: 'flex', marginRight: '0px' }}
                        >
                          <option value="">Seleccione un producto</option>
                          {productos.map((producto) => (
                            <option
                              key={producto.id_producto}
                              value={producto.nombre_producto}
                            >
                              {producto.nombre_producto}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          className={estilos["input-field-tabla"]}
                          style={{ width: "90px" }}
                          type="number"
                          onChange={(e) => handlePrecioChange(e, index)}
                          value={row.precio_unitario}
                          disabled
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          className={estilos["input-field-tabla"]}
                          style={{ width: "100px" }}
                          type="number"
                          onChange={(e) => handleCantidadChange(e, index)}
                        />
                      </td>
                      {
                        index !== 0 && (
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              className={`btn btn-danger ${estilos['boton-eliminar']}`}
                              onClick={() => handleDeleteRow(index)}
                            >
                              Eliminar
                            </button>
                          </td>
                        )
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className={estilos["cajaBotonesRPedidos"]} style={{ zIndex: '2', position: 'fixed', bottom: '10px', background: 'white', width: '80%', padding: '.7em' }}>
          <button type="submit" id="can" className={`${estilos["boton-azul"]}`} disabled={!formChanged} onClick={handleSubmitPedido}>
            Guardar
          </button>
          <Link to="/pedidos">
            <button className={estilos["boton-gris"]} type="button">Cancelar</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default App;



const ContenedorBotones = styled.div`
  padding: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const Boton = styled.button`
  display: block;
  padding: 10px 30px;
  border-radius: 100px;
  color: #fff;
  border: none;
  background: #1766dc;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  transition: 0.3s ease all;
  margin-top: 20px;

  &:hover {
    background: #0066ff;
  }
`;

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
    font-size: 16px;
    margin-bottom: 11px;
  }

  img {
    width: 100%;
    vertical-align: top;
    border-radius: 3px;
  }
`;
