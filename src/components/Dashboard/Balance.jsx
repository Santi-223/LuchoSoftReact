import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import AnalyticEcommerce from './AnalyticEcommerce';

const Balance = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total ventas
        const ventasResponse = await fetch('https://api-luchosoft-mysql.onrender.com/ventas/pedidos/');
        const ventasData = await ventasResponse.json();
        // Filtrar pedidos por estado 3
        const filteredData = ventasData.filter(venta => venta.estado_pedido == 3);
        const totalVentas = filteredData.reduce((acc, venta) => acc + parseFloat(venta.total_venta), 0);

        // Fetch total compras
        const comprasResponse = await fetch('https://api-luchosoft-mysql.onrender.com/compras/compras/');
        const comprasData = await comprasResponse.json();
        const totalCompras = comprasData.reduce((acc, compra) => acc + parseFloat(compra.total_compra), 0);

        // Calculate balance
        const calculatedBalance = totalVentas - totalCompras;
        setBalance(calculatedBalance);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Formatear el balance en pesos colombianos sin decimales
  const balanceFormatted = new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(balance);

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <AnalyticEcommerce title="Balance" count={balanceFormatted} />
    </Grid>
  );
};

export default Balance;
