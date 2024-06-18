import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import AnalyticEcommerce from './AnalyticEcommerce';

const TotalVentas = () => {
  const [totalVentas, setTotalVentas] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-luchosoft-mysql.onrender.com/ventas/pedidos/');
        const data = await response.json();
        const totalSum = data.reduce((acc, venta) => acc + parseFloat(venta.total_venta), 0);
        setTotalVentas(totalSum);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Formatear el total en pesos colombianos sin decimales
  const totalVentasFormatted = new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(totalVentas);

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <AnalyticEcommerce title="Total de ventas" count={totalVentasFormatted} />
    </Grid>
  );
};

export default TotalVentas;
