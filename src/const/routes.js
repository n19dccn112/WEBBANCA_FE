import ProductDetail from "../pages/detailpage/ProductDetail";
import Shop from "../pages/productpage/Shop";

import Home from "../pages/homepage/Home";
import Login from "../pages/customer/Login";
import Customer from "../pages/customer/Customer";
import Profile from "../pages/customer/Profile";
import DashBoard from "../pages/dashboard/DashBoard";
import Cart from "../pages/cart/Cart";
import CheckOut from "../pages/cart/CheckOut";
import Orders from "../pages/customer/Orders";
import Order from "../pages/customer/Order";
import IsLoveOrSeenPage from "../pages/productpage/IsLoveOrSeenPage";
import LoginAdmin from "../pages/customer/LoginAdmin";

export const routes = [
  {
    path: '/IsLoveOrSeenPage/:id',
    component: IsLoveOrSeenPage,
    name: '',
    pub: true,
    user: false,
    admin: false,
    sub: [],
  },
  {
    path: '/',
    component: Home,
    name: 'Trang chủ',
    pub: true,
    user: false,
    admin: false,
    sub: [],
  },
  {
    path: '/products/:id',
    component: ProductDetail,
    name: 'Chi tiết sản phẩm',
    pub: false,
    user: false,
    admin: false,
    sub: [],
  },
  {
    path: '/products',
    component: Shop,
    name: 'Sản phẩm',
    pub: true,
    user: false,
    admin: false,
    sub: [],
  },
  {
    path: '/productIds/:id',
    component: Shop,
    name: 'Sản phẩm id',
    pub: false,
    user: false,
    admin: false,
    sub: [],
  },
  {
    path: '/cart',
    component: Cart,
    name: 'Giỏ hàng',
    pub: false,
    user: false,
    admin: false,
    sub: [],
  },
  {
    path: '/customer',
    component: Customer,
    name: 'Khách hàng',
    pub: false,
    user: false,
    admin: false,
    sub: [],
  },
  {
    path: '/admin',
    component: LoginAdmin,
    name: 'Quản trị viên',
    pub: false,
    user: false,
    admin: false,
    sub: [],
  },
  {
    path: '/signin',
    component: Login,
    name: 'Đăng nhập',
    pub: false,
    user: false,
    admin: false,
    sub: [],
  },
  {
    path: '/checkout',
    component: CheckOut,
    name: 'Kiểm tra giỏ hàng',
    pub: false,
    user: true,
    admin: false,
    sub: [],
  },
  {
    path: '/orders',
    component: Orders,
    name: 'Tất cả đơn hàng',
    pub: false,
    user: true,
    admin: false,
    sub: [],
  },
  {
    path: '/profile',
    component: Profile,
    name: 'Hồ sơ',
    pub: false,
    user: false,
    admin: false,
    sub: [],
  },

  {
    path: '/orders/:id',
    component: Order,
    name: 'Đơn hàng',
    pub: false,
    user: false,
    admin: false,
    sub: [],
  },
  {
    path: '/dashboard',
    component: DashBoard,
    name: 'Quản lý',
    pub: false,
    user: false,
    admin: true,
    sub: [],
  },
];

