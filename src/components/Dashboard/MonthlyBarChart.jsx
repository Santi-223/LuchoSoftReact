import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  grid: {
    show: false
  }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function MonthlyBarChart() {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.light;

  const [series, setSeries] = useState([
    {
      data: [0, 0, 0, 0, 0, 0, 0]
    }
  ]);

  const [options, setOptions] = useState(barChartOptions);

  useEffect(() => {
    const fetchProductionOrders = async () => {
      try {
        const response = await fetch('https://api-luchosoft-mysql.onrender.com/orden/orden_produccion');
        const data = await response.json();

        // Get the start and end dates of the current week
        const now = new Date();
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Adjust to get Monday
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Sunday

        // Process the data to count the orders per day
        const ordersCount = [0, 0, 0, 0, 0, 0, 0]; // Initialize an array for each day of the week
        data.forEach(order => {
          const orderDate = new Date(order.fecha_orden);
          if (orderDate >= firstDayOfWeek && orderDate <= lastDayOfWeek) {
            let day = orderDate.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
            day = day === 0 ? 6 : day - 1; // Adjust to make Monday = 0, ..., Sunday = 6
            ordersCount[day]++;
          }
        });

        setSeries([{ data: ordersCount }]);
      } catch (err) {
        console.error('Error fetching production orders:', err);
      }
    };

    fetchProductionOrders();
  }, []);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [info],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      }
    }));
  }, [primary, info, secondary]);

  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </Box>
  );
}
