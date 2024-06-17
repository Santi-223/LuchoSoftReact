import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import AnalyticEcommerce from './AnalyticEcommerce';

const TotalCompras = () => {
  const [totalCompras, setTotalCompras] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-luchosoft-mysql.onrender.com/compras/compras/');
        const data = await response.json();
        const totalSum = data.reduce((acc, compra) => acc + parseFloat(compra.total_compra), 0);
        setTotalCompras(totalSum);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Formatear el total en pesos colombianos sin decimales
  const totalComprasFormatted = new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(totalCompras);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <AnalyticEcommerce title="Total de compras" count={totalComprasFormatted} />
    </Grid>
  );
};

export default TotalCompras;
