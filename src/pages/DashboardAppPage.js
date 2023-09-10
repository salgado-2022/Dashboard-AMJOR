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
  const apiUrl = process.env.REACT_APP_AMJOR_API_URL;

  const [totalPedidos, setTotalPedidos] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalPedidosPendientes, setTotalPedidosPendientes] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);
  const [ventasPorMes, setVentasPorMes] = useState([]);


  useEffect(() => {
    axios.get(`${apiUrl}/api/admin/getinfo/totalpedidos`)
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

    axios.get(`${apiUrl}/api/admin/getinfo/totalusuarios`)
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

    axios.get(`${apiUrl}/api/admin/getinfo/pedidospendientes`)
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

    axios.get(`${apiUrl}/api/admin/getinfo/totalventas`)
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

    axios.get(`${apiUrl}/api/admin/getinfo/ventasmes`)
      .then((res) => {
        const data = res.data;
        setVentasPorMes(data);
      })
      .catch((error) => {
        console.error('Error al obtener los datos de ventas por mes:', error);
      });
  }, []);


  const theme = useTheme();

  const { pathname } = useLocation();
  const token = Cookies.get("token");
  const [nombre, setNombre] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get(`${apiUrl}/api/search/${token}`)
        .then((res) => {
          const { Nombre, Nombre_Rol } = res.data[0]
          setNombre(Nombre);
          setRol(Nombre_Rol);
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  console.log(ventasPorMes)


  const ventasPorMesFormateado = ventasPorMes.map((venta) => {
    const { Anio, Mes, Dia, Cantidad_Ventas } = venta;
    const fechaFormateada = `${Anio}-${Mes.toString().padStart(2, '0')}-${Dia.toString().padStart(2, '0')}`;
    return { fecha: fechaFormateada, cantidadVentas: Cantidad_Ventas };
  });

  const chartLabels = [];
  const chartData = [{ name: 'Ventas', type: 'column', fill: 'solid', data: [] }];

  // Construir chartLabels y chartData a partir de ventasPorMesFormateado
  ventasPorMesFormateado.forEach((venta) => {
    chartLabels.push(venta.fecha);
    chartData[0].data.push(venta.cantidadVentas);
  });
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
            <AppWidgetSummary title="Pedidos por aceptar" total={totalPedidosPendientes} icon={'mdi:cart'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Usuarios registrados" total={totalUsuarios} color="info" icon={'mdi:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Pedidos totales" total={totalPedidos} color="warning" icon={'solar:bag-bold'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Dinero de ventas" total={totalVentas} color="error" icon={'solar:dollar-bold'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <Typography>{chartLabels[0]}</Typography>
            <AppWebsiteVisits
              title="Ventas del mes"
              chartLabels={chartLabels}
              chartData={chartData}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppConversionRates
              title="Anchetas mas vendidas"
              chartData={[
                { label: 'Ancheta de cumpleaños', value: 400 },
                { label: 'Ancheta Navideña', value: 430 },
                { label: 'Ancheta de hallowen', value: 448 },
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
        </Grid>
      </Container>
    </>
  );
}
