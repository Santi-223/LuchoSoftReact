import React, { useState, useEffect, useRef } from 'react';

import { Outlet, Link } from "react-router-dom";
import { Table, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import estilos from './registroCompras.module.css'

function App() {
  const token = localStorage.getItem('token');
  const [insumos, setInsumos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [precio, setPrecio] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [compra, setCompra] = useState({
    id_compra: '',
    numero_compra: '',
    fecha_compra: '',
    estado_compra: 1,
    total_compra: 0,
    id_proveedor: ''
  });
  const [proveedores, setProveedores] = useState([]);
  const tableRef = useRef(null);
  const [tableRows, setTableRows] = useState([{ nombre: '', precio: '', cantidad: '', cantidad_seleccionada: 0, precio_unitario: 0 }]);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [insumosPerPage] = useState(5);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [selectedInsumos, setSelectedInsumos] = useState(new Set());
  const [formChanged, setFormChanged] = useState(false);
  // const [inputValido, setInputValido] = useState(true);
  const [inputValido2, setInputValido2] = useState(Array(tableRows.length).fill(true));


  useEffect(() => {
    fetchInsumos();
    fetchProveedores();
  }, []);

  useEffect(() => {
    if (insumos.length > 0) {
      setIsLoading(false);
    }
  }, [insumos]);

  const handleDeleteRow = (index) => {
    const updatedRows = [...tableRows];
    const deletedInsumo = updatedRows[index].nombre;
    updatedRows.splice(index, 1);
    setTableRows(updatedRows);
    const total = updatedRows.reduce((accumulator, currentValue) => {
      return accumulator + (parseFloat(currentValue.precio_total) || 0);
    }, 0);
    setPrecioTotal(total);

    setSelectedInsumos(prevSelected => {
      prevSelected.delete(deletedInsumo);
      return new Set(prevSelected);
    });
    setFormChanged(true);
  };

  const fetchInsumos = async () => {
    try {
      const response = await fetch('https://api-luchosoft-mysql.onrender.com/compras/insumos');
      if (response.ok) {
        const data = await response.json();
        const insumosConEstado1 = data.filter(insumo => insumo.estado_insumo === 1);

        const insumosConSeleccion = insumosConEstado1.map(insumo => ({ ...insumo, seleccionado: false, cantidad: 0, precio_unitario: 0 }));
        setInsumos(insumosConSeleccion);
      } else {
        console.error('Error al obtener los insumos');
      }
    } catch (error) {
      console.error('Error al obtener los insumos:', error);
    }
  };




  const fetchProveedores = async () => {
    try {
      const response = await fetch('https://api-luchosoft-mysql.onrender.com/compras/proveedores');
      if (response.ok) {
        const data = await response.json();
        // Filtrar los proveedores con estado 1
        const proveedoresConEstado1 = data.filter(proveedor => proveedor.estado_proveedor === 1);
        setProveedores(proveedoresConEstado1);
      } else {
        console.error('Error al obtener los proveedores');
      }
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
    }
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // if (name === 'numero_compra') {
    //   if (value.length > 5) {
    //     setInputValido(false);
    //   } else {
    //     setInputValido(true);
    //   }
    // }
    setCompra({ ...compra, [name]: value });
    setFormChanged(true);
  };

  const filteredInsumos = insumos.filter(insumo =>
    insumo.nombre_insumo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelectChange = (event, index) => {
    const { value } = event.target;
    if (selectedInsumos.has(value)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Este insumo ya ha sido seleccionado',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    const updatedRows = tableRows.map((row, rowIndex) => {
      if (rowIndex === index) {
        const selectedInsumo = insumos.find(insumo => insumo.nombre_insumo === value);
        return { ...row, nombre: value, insumoId: selectedInsumo.id_insumo };
      }
      return row;
    });

    setTableRows(updatedRows);
    setSelectedInsumos(prevSelected => new Set(prevSelected.add(value)));
    setFormChanged(true);
  };

  
  const handleCantidadChange = (event, index) => {
    let { value } = event.target;
    
    // Convertir el valor a un número y asegurarse de que no sea negativo
    value = parseFloat(value) >= 0 ? parseFloat(value) : 0;
    
    // Validar el formato del número
    const isValidFormat = /^\d*\.?\d*$/.test(value.toString());
    
    if (!isValidFormat) {
      setInputValido2(prevState => {
        const newState = [...prevState];
        newState[index] = false;
        return newState;
      });
    } else {
      setInputValido2(prevState => {
        const newState = [...prevState];
        newState[index] = true;
        return newState;
      });
    
      const updatedRows = tableRows.map((row, rowIndex) => {
        if (rowIndex === index) {
          const cantidad = parseFloat(value) || 0;
          const precioUnitario = parseFloat(row.precio_unitario) || 0;
          const precioTotal = (cantidad * precioUnitario).toFixed(2); // Aquí se recorta el número decimal
          return { ...row, cantidad: value, cantidad_seleccionada: cantidad, precio_total: precioTotal };
        }
        return row;
      });
    
      setTableRows(updatedRows);
    
      const total = updatedRows.reduce((accumulator, currentValue) => {
        return accumulator + (parseFloat(currentValue.cantidad_seleccionada) * parseFloat(currentValue.precio_unitario) || 0);
      }, 0);
      setPrecioTotal(total.toFixed(2)); // Recortar el precio total
      setFormChanged(true);
    }
  };
  

  

  const handleSubmitCompra = async (event, totalCompra, precio) => {
    event.preventDefault();

    if (!compra.fecha_compra || !compra.numero_compra || !compra.id_proveedor || tableRows.some(row => !row.nombre || !row.precio)) {
      // Verifica si el input es válido o si hay campos vacíos
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hay campos vacíos',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    if (tableRows.some(row => !row.cantidad)) {
      // Verifica si el input es válido o si hay campos vacíos
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Digite correctamente la cantidad',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }

    // if (!inputValido) {
    //   // Verifica si el input es válido o si hay campos vacíos
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'El número de compra no puede tener más de 5 números',
    //     confirmButtonColor: '#1F67B9',
    //   });
    //   return;
    // }
    if (!inputValido2.every(valido => valido)) {
      // Verifica si el input es válido o si hay campos vacíos
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La cantidad no puede contener caracteres',
        confirmButtonColor: '#1F67B9',
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: '',
      text: 'Compra registrada',
      showConfirmButton: false,
      timer: 2000,
    }).then(async () => {
      try {
        const totalCompra = tableRows.reduce((total, row) => total + parseFloat(row.precio_total || 0), 0);

        const responseCompra = await fetch('https://api-luchosoft-mysql.onrender.com/compras/compras', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({ ...compra, total_compra: totalCompra })
        });

        if (!responseCompra.ok) {
          console.error('Error al enviar los datos de la compra');
          return;
        }

        const compraData = await responseCompra.json();
        const idCompra = compraData.id_compra;

        console.log('Compra registrada correctamente:', compraData, "id_compra: ", idCompra);

        const insumosSeleccionados = tableRows.filter(row => row.nombre !== '').map(row => ({
          id_insumo: insumos.find(insumo => insumo.nombre_insumo === row.nombre).id_insumo,
          cantidad: parseFloat(row.cantidad_seleccionada),
          precio_unitario: row.precio_unitario
        }));

        const comprasInsumosPromises = insumosSeleccionados.map(async (insumoSeleccionado) => {
          const insumoCorrespondiente = insumos.find(insumo => insumo.id_insumo === insumoSeleccionado.id_insumo);
          const comprasInsumosData = {
            cantidad_insumo_compras_insumos: insumoSeleccionado.cantidad,
            precio_insumo_compras_insumos: insumoSeleccionado.precio_unitario,
            id_compra: idCompra,
            id_insumo: insumoSeleccionado.id_insumo
          };

          try {
            const responseComprasInsumos = await fetch('https://api-luchosoft-mysql.onrender.com/compras/compras_insumos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'token': token
              },
              body: JSON.stringify(comprasInsumosData)
            });

            if (!responseComprasInsumos.ok) {
              console.error('Error al enviar los datos de compras_insumo:', responseComprasInsumos.statusText);
            } else {
              console.log('Insumo registrado correctamente:', comprasInsumosData);
            }
          } catch (error) {
            console.error('Error al enviar los datos de compras_insumo:', error);
          }
        });

        await Promise.all(comprasInsumosPromises);
      } catch (error) {
        console.error('Error al enviar los datos:', error);
      }

      window.location.href = '/#/Compra';
    });

  };
  const handlePrecioChange = (e, index) => {
    const { value } = e.target;
    const updatedRows = tableRows.map((row, rowIndex) => {
      if (rowIndex === index) {
        return { ...row, precio: value, precio_unitario: (parseFloat(value) || 0).toFixed(2) }; // Recortar el precio unitario
      }
      return row;
    });
    setTableRows(updatedRows);
    
    const total = updatedRows.reduce((accumulator, currentValue) => {
      return accumulator + (parseFloat(currentValue.cantidad_seleccionada) * parseFloat(currentValue.precio_unitario) || 0);
    }, 0);
    
    setPrecioTotal(total.toFixed(2)); // Recortar el precio total
    setFormChanged(true);
  };
  const handleCancel = () => {
    if (formChanged) {
      Swal.fire({
        title: '¿Desea cancelar el registro de la compra?',
        text: 'Los datos ingresados se perderán.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/#/Compra';
        }
      });
    } else {
      window.location.href = '/#/Compra';
    }
  };

  if (isLoading) {
    return <div>Cargando la api, espere por favor...</div>;
  }

  const indexOfLastInsumo = currentPage * insumosPerPage;
  const indexOfFirstInsumo = indexOfLastInsumo - insumosPerPage;
  const currentInsumos = filteredInsumos.slice(indexOfFirstInsumo, indexOfLastInsumo);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredInsumos.length / insumosPerPage); i++) {
    pageNumbers.push(i);
  }

  const addTableRow = () => {
    const newRow = { nombre: '', precio: '', cantidad: '' };
    setTableRows([...tableRows, newRow]);
    setFormChanged(true);
  };

  return (
    <div className='contenido-2' style={{ overflowX: 'hidden' }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
      <form onSubmit={(event) => handleSubmitCompra(event, compra.total_compra, precio)} noValidate>
        <div className={estilos.contenido} >
          <div>
            <h1 id={estilos.titulo}>Compras</h1>
          </div>

          <div className={estilos.formulario}>

            <br />
            <div className={estilos.inputsup}>
              <div className={estilos.contenedorinput} >
                <label htmlFor="fechaCompra"> Fecha</label>
                <input
                  id="fechaCompra"
                  name="fecha_compra"
                  className={estilos.inputfield}
                  value={compra.fecha_compra}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>
              <div className={estilos.contenedorinput}>
                <label style={{ marginLeft: "30px" }} htmlFor="numeroCompra"> Número</label>
                <input
                  id="numeroCompra"
                  name="numero_compra"
                  className={`${estilos.inputfield3} 
                 `}
                  value={compra.numero_compra}
                  onChange={handleInputChange}
                  minLength={1}
                  maxLength={5}
                  type="number"
                  placeholder="000"
                  style={{ marginLeft: "30px" }}
                />
                {/* {!inputValido && <p className='error' style={{ color: 'red', fontSize: '10px', position: 'absolute', marginLeft: '27px' }}>Máximo 5 números</p>} */}
              </div>
            </div>
            <br />
            <div id="">
              <label htmlFor="proveedor"> Proveedor </label>
              <select
                id="proveedor"
                name="id_proveedor"
                className={estilos.inputfield2}
                value={compra.id_proveedor}
                onChange={handleInputChange}>
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                    {proveedor.nombre_proveedor}
                  </option>
                ))}
              </select>
            </div>
            <br />
            <div className={estilos.inputsup}>
              <div className='contenedor-input' >
                <label htmlFor="precioCompra"> Total </label>
                <input
                  id="precioCompra"
                  name="total_compra"
                  className={estilos.inputfield4}
                  value={precioTotal || ''}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="0"
                  readOnly={true}
                  style={{
                    backgroundColor: '#E4E4E4',
                    color: '#999'
                  }}
                />
              </div>
              <div className='contenedor-input'>
                <button className={estilos.azulado2} type="button" onClick={addTableRow}><center>+ Insumo</center></button>
              </div>
            </div>
            <br />
          </div>
          <hr style={{ margin: '10px 45px', borderTop: '1px solid black' }} />
          <div className={estilos.tabladetalle} style={{ overflowY: scrollEnabled ? 'scroll' : 'auto', maxHeight: '390px' }}>
            <table className="tablaDT ui celled table" style={{ width: "100%" }} ref={tableRef}>
              <thead className={estilos.theadfixed}>
                <tr>
                  <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white" }}><i className="fa-solid fa-font "></i > Nombre Insumo</th>
                  <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white" }}><i className="fa-solid fa-coins "></i> Precio</th>
                  <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white" }}><i className="fa-solid fa-coins "></i> Cantidad</th>
                  <th style={{ textAlign: "center", backgroundColor: '#1F67B9', color: "white" }}><i className="fa-solid fa-coins "></i></th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>
                      <select className={estilos.inputfieldtabla} value={row.nombre} onChange={(e) => handleSelectChange(e, index)}>
                        <option value="">Seleccione un insumo</option>
                        {filteredInsumos.map((insumo) => (
                          <option key={insumo.id_insumo} value={insumo.nombre_insumo}>
                            {insumo.nombre_insumo}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input className={estilos.inputfieldtabla} style={{ width: "100px" }} type="number" onChange={(e) => handlePrecioChange(e, index)} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        className={`${estilos.inputfieldtabla} ${(!inputValido2[index] && tableRows[index].cantidad !== '') ? estilos.inputInvalido2 : ''}`}
                        style={{ width: "100px" }}
                        type="number"
                        onChange={(e) => handleCantidadChange(e, index)}
                      />


                    </td>
                    {index !== 0 && (
                      <td style={{ textAlign: "center" }}>
                        <button className={estilos.botx} type="button" onClick={() => handleDeleteRow(index)}>X</button>
                      </td>
                    )}
                    {index === 0 && (
                      <td style={{ textAlign: "center" }}>
                        <p></p>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
        <br />
        <br />
        <div style={{ marginRight: "200px" }} className={estilos.cajaBotones}>
          <button type="submit" className={estilos.azulado3}><center>Guardar</center></button>
          <button style={{ color: "white" }} type="button" className={estilos.gris} onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
export default App;
