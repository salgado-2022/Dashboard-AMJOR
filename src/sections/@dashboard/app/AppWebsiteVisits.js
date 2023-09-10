import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, Box, Select, MenuItem } from '@mui/material';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { useChart } from '../../../components/chart';

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, years, ...other }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);



  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Filtra los datos en función del año seleccionado
  const filteredChartData = chartData.filter((dataItem) => {
    const dataYear = new Date(dataItem.fecha + 'T12:00:00Z').getFullYear();
    return dataYear === selectedYear;
  });

  // Preparar los datos para el gráfico
  const chartDataSeries = [{ name: 'Ventas', type: 'column', fill: 'solid', data: [] }];
  const Label = [];
  filteredChartData.forEach((dataItem) => {
    chartDataSeries[0].data.push(dataItem.valor);
    Label.push(dataItem.fecha);
  });

  const formattedChartLabels = Label.map((dateString) => {
    const date = new Date(dateString + 'T12:00:00Z');
    return format(date, 'd MMM', { locale: es });
  });

  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: formattedChartLabels,
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} `;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CardHeader title={title} subheader={subheader} />
          <Select value={selectedYear} onChange={handleYearChange}>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <ReactApexChart type="line" series={chartDataSeries} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
