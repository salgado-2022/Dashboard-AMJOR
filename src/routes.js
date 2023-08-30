import { Navigate, useRoutes } from 'react-router-dom';
import Cookies from 'js-cookie';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import UserPage from './pages/UserPage';
import ListaConfiguracion from './pages/ConfigurationPage';
import Page404 from './pages/Page404';
import OrdersPage from './pages/OrdersPage';
import DashboardAppPage from './pages/DashboardAppPage';
import SuppliesPage from './pages/SuppliesPage';
import AnchetasPage from './pages/AnchetaPage';
import { AddAncheta } from './sections/@dashboard/anchetas/addAncheta';
import { EditAncheta } from './sections/@dashboard/anchetas/editAncheta';
import { ConfiFormulario } from './sections/@dashboard/configuracion/modal/crearte';

const apiUrl = process.env.REACT_APP_AMJOR_LANDING_URL

function checkTokenInCookies() {
  const token = Cookies.get('token');
  return Boolean(token);
}
function AuthGuard({ children }) {
  const isTokenValid = checkTokenInCookies();

  if (!isTokenValid) {
// Si el token no es válido, redirigir al usuario a la página de inicio de sesión
    return window.location.href = `${apiUrl}`;
  }

  return children;
}

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'supplies', element: <SuppliesPage /> },
        { path: 'anchetas', element: <AnchetasPage /> },
        { path: 'anchetas/crearancheta', element: <AddAncheta /> },
        { path: 'anchetas/editarancheta', element: <EditAncheta /> },
        { path: 'confi', element: <ListaConfiguracion />},
        { path: 'crearte', element: <ConfiFormulario/>}, 
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return <AuthGuard>{routes}</AuthGuard>;
}
