// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Configuración',
    path: '/dashboard/confi',
    icon: icon('setting'),
  },
  {
    title: 'Usuarios',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Clientes',
    path: '/dashboard/clientes',
    icon: icon('ic_user'),
  },
  {
    title: 'Insumos',
    path: '/dashboard/supplies',
    icon: icon('product'),
  },
  {
    title: 'Anchetas',
    path: '/dashboard/anchetas',
    icon: icon('ancheta'),
  },
  {
    title: 'Pedidos',
    path: '/dashboard/orders',
    icon: icon('ic_cart'),
  },
  {
    title:'Ventas',
    path: '/dashboard/sales',
    icon: icon('sales')
  }
];

export default navConfig;
