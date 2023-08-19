import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

import Cookies from "js-cookie";
import axios from 'axios';
import { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------



export default function DashboardAppPage() {

  const [totalPedidos, setTotalPedidos] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalPedidosPendientes, setTotalPedidosPendientes] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:4000/api/admin/getinfo/totalpedidos')
      .then((response) => {
        const totalPedidos = response.data[0]?.total_pedidos;
        if (totalPedidos !== undefined) {
          setTotalPedidos(totalPedidos);
        } else {
          console.error('Datos de cantidad de pedidos no encontrados en la respuesta de la API.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener la cantidad total de pedidos:', error);
      });

      axios.get('http://localhost:4000/api/admin/getinfo/totalusuarios')
      .then((response) => {
        const totalUsuarios = response.data[0]?.total_usuarios;
        if (totalUsuarios !== undefined) {
          setTotalUsuarios(totalUsuarios);
        } else {
          console.error('Datos de cantidad de usuarios no encontrados en la respuesta de la API.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener la cantidad total de usuarios:', error);
      });

    axios.get('http://localhost:4000/api/admin/getinfo/pedidospendientes')
      .then((response) => {
        const totalPedidosPendientes = response.data[0]?.total_pedidos_pendientes;
        if (totalPedidosPendientes !== undefined) {
          setTotalPedidosPendientes(totalPedidosPendientes);
        } else {
          console.error('Datos de cantidad de total de pedidos pendientes no encontrados en la respuesta de la API.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener la cantidad total de pedidos pendientes:', error);
      });
      
    axios.get('http://localhost:4000/api/admin/getinfo/totalventas')
    .then((response) => {
      const totalVentas = response.data[0]?.suma_precios_ventas;
      if (totalVentas !== undefined) {
        setTotalVentas(totalVentas);
      } else {
        console.error('Datos de cantidad de total de ventas no encontrados en la respuesta de la API.');
      }
    })
    .catch((error) => {
      console.error('Error al obtener la cantidad total de ventas:', error);
    });

    }, [] );


  const theme = useTheme();

  const { pathname } = useLocation();
  const token = Cookies.get("token");
  const [nombre, setNombre] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    if(token) {
      axios.get(`http://localhost:4000/api/search/${token}`)
      .then((res) =>{
          const {Nombre, Nombre_Rol} = res.data[0]
          setNombre(Nombre);
          setRol(Nombre_Rol);
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <Helmet>
        <title> Dashboard | AMJOR </title>
      </Helmet>

      <Container maxWidth="xl" >
        <Typography variant="h4" sx={{ mb: 5 }} align="center">
          ¡Bienvenido {nombre} a la pestaña administrativa!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Pedidos por aceptar" total={totalPedidosPendientes} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Usuarios registrados" total={totalUsuarios} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Pedidos totales" total={totalPedidos} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Dinero de ventas" total={totalVentas} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
