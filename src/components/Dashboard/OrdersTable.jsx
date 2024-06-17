import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// project import
import Dot from '../Dot';

// Create data function
function createData(id_cliente, nombre_cliente, telefono_cliente, direccion_cliente) {
  return { id_cliente, nombre_cliente, telefono_cliente, direccion_cliente };
}

// Head cells for the table
const headCells = [
  { id: 'id_cliente', align: 'left', disablePadding: false, label: 'ID Cliente' },
  { id: 'nombre_cliente', align: 'left', disablePadding: false, label: 'Nombre' },
  { id: 'telefono_cliente', align: 'left', disablePadding: false, label: 'Teléfono' },
  { id: 'direccion_cliente', align: 'left', disablePadding: false, label: 'Dirección' },
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function FrequentCustomersTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas/clientes/');
        const data = await response.json();
        const frequentCustomers = data.filter((customer) => customer.cliente_frecuente === 1)
                                      .map((customer) => createData(customer.id_cliente, customer.nombre_cliente, customer.telefono_cliente, customer.direccion_cliente));
        setRows(frequentCustomers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead />
          <TableBody>
            {rows.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id_cliente}>
                <TableCell>
                  <Link color="secondary"> {row.id_cliente}</Link>
                </TableCell>
                <TableCell>{row.nombre_cliente}</TableCell>
                <TableCell>{row.telefono_cliente}</TableCell>
                <TableCell>{row.direccion_cliente}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.any,
  orderBy: PropTypes.string,
};

OrderTableHead.defaultProps = {
  order: 'asc',
  orderBy: 'id_cliente',
};
