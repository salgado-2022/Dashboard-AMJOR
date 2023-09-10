import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';
import { Select, MenuItem } from '@mui/material';
import { Grid } from '@mui/material';


import { format } from 'date-fns';
import es from 'date-fns/locale/es'; // Importa el locale en español


// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, ...other }) {
  const currentYear = new Date().getFullYear();


  // Formatear las fechas
  const formattedChartLabels = chartLabels.map((dateString) => {
    const date = new Date(dateString + 'T12:00:00Z'); // Establece la hora a las 12:00 PM en UTC
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
        <Grid container alignItems="center">
          <Grid item xs={8}>
            <CardHeader title={title} subheader={subheader} />
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <Select            >
              <MenuItem >2023</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );

}