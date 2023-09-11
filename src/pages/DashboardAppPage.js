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
  const [anchetasMas, setAnchetasMas] = useState([])


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
    axios.get(`${apiUrl}/api/admin/getinfo/anchetas/masvendidas`)
      .then((res) => {
        const data = res.data;
        setAnchetasMas(data);
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
    chartData.push({ fecha: venta.fecha, valor: venta.cantidadVentas });
  });

  const years = chartLabels.map((dateString) => new Date(dateString).getFullYear()).filter((year, index, self) => self.indexOf(year) === index);

  const data = [];

  anchetasMas.forEach((ancheta) => {
    data.push({ label: ancheta.NombreAncheta, value: ancheta.Cantidad_Vendida })
  })


  console.log(data)

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
            <AppWebsiteVisits
              title="Ventas del año"
              chartLabels={chartLabels}
              chartData={chartData}
              years={years}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppConversionRates
              title="Anchetas más vendidas"
              chartData={data}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
