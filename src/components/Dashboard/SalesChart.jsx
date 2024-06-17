import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from '../MainCard';
import ReactApexChart from 'react-apexcharts';

const SalesChart = ({ salesData }) => {
  const theme = useTheme();
  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));

  const options = {
    chart: {
      type: 'bar',
      height: 430,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: xsDown ? '60%' : '30%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 8,
      colors: ['transparent']
    },
    xaxis: {
      categories: salesData.labels
    },
    yaxis: {
      title: {
        text: '$ (COP)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter(val) {
          return `$ ${val.toLocaleString()} COP`;
        }
      }
    },
    legend: {
      show: true
    },
    grid: {
      borderColor: theme.palette.divider
    },
    colors: [theme.palette.success.main, theme.palette.error.main],
    responsive: [
      {
        breakpoint: 600,
        options: {
          yaxis: {
            show: false
          }
        }
      }
    ]
  };

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1.5}>
            <Typography variant="h6" color="secondary">
              
            </Typography>
          </Stack>
        </Stack>
        <Box id="chart" sx={{ bgcolor: 'transparent' }}>
          <ReactApexChart options={options} series={salesData.series} type="bar" height={360} />
        </Box>
      </Box>
    </MainCard>
  );
};

export default SalesChart;
