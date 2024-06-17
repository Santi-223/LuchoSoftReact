import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SalesChart from './SalesChart';

const status = [
  { value: 'today', label: 'Hoy' },
  { value: 'month', label: 'Este mes' },
  { value: 'year', label: 'Este año' },
];

const SaleReportCard = () => {
  const [value, setValue] = useState('today');
  const [salesData, setSalesData] = useState({ labels: [], series: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comprasResponse, ventasResponse] = await Promise.all([
          fetch('https://api-luchosoft-mysql.onrender.com/compras/compras/'),
          fetch('https://api-luchosoft-mysql.onrender.com/ventas/pedidos/'),
        ]);

        const comprasData = await comprasResponse.json();
        const ventasData = await ventasResponse.json();

        const filteredCompras = filterDataByTime(comprasData, 'fecha_compra', value);
        const filteredVentas = filterDataByTime(ventasData, 'fecha_venta', value);

        const labels = generateLabels(filteredCompras, filteredVentas, value);

        const totalCompras = labels.map(label => calculateTotalForLabel(filteredCompras, label, 'fecha_compra', 'total_compra'));
        const totalVentas = labels.map(label => calculateTotalForLabel(filteredVentas, label, 'fecha_venta', 'total_venta'));

        setSalesData({
          labels,
          series: [
            { name: 'Total Compras', data: totalCompras },
            { name: 'Total Ventas', data: totalVentas }
          ]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [value]);

  const filterDataByTime = (data, dateKey, range) => {
    const now = new Date();
    return data.filter(item => {
      const itemDate = new Date(item[dateKey]);
      if (range === 'today') {
        return itemDate.toDateString() === now.toDateString();
      } else if (range === 'month') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      } else if (range === 'year') {
        return itemDate.getFullYear() === now.getFullYear();
      }
      return false;
    });
  };

  const generateLabels = (compras, ventas, range) => {
    const dates = new Set([...compras.map(item => item.fecha_compra), ...ventas.map(item => item.fecha_venta)]);
    const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
    if (range === 'today') {
      return sortedDates.map(date => new Date(date).toLocaleTimeString());
    } else if (range === 'month' || range === 'year') {
      return sortedDates.map(date => new Date(date).toLocaleDateString());
    }
    return [];
  };

  const calculateTotalForLabel = (data, label, dateKey, valueKey) => {
    return data.reduce((acc, item) => {
      const itemDate = new Date(item[dateKey]).toLocaleDateString();
      if (itemDate === label) {
        return acc + parseFloat(item[valueKey]);
      }
      return acc;
    }, 0);
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Reporte de ventas</Typography>
        </Grid>
        <Grid item>
          <TextField
            id="standard-select-currency"
            size="small"
            select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' } }}
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <SalesChart salesData={salesData} />
    </>
  );
};

export default SaleReportCard;
