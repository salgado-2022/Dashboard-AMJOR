import { Navigate, useRoutes } from 'react-router-dom';
import Cookies from 'js-cookie';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import  {ListaConfiguracion} from './pages/ConfigurationPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import OrdersPage from './pages/OrdersPage';
import DashboardAppPage from './pages/DashboardAppPage';
import SuppliesPage from './pages/SuppliesPage';
import AnchetasPage from './pages/AnchetaPage';
import { UsuariosFormulario2 } from './sections/@dashboard/user/modal/create';

function checkTokenInCookies() {
  const token = Cookies.get('token');
  return Boolean(token);
}

function AuthGuard({ children }) {
  const isTokenValid = checkTokenInCookies();

  if (!isTokenValid) {
// Si el token no es válido, redirigir al usuario a la página de inicio de sesión
    return window.location.href = "http://localhost:3000/login";
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
        { path: 'blog', element: <BlogPage /> },
        { path: 'supplies', element: <SuppliesPage /> },
        { path: 'anchetas', element: <AnchetasPage /> },
        { path: 'create', element: <UsuariosFormulario2 /> },
        { path: 'create', element: <ListaConfiguracion />}
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
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
