import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout/Layout';
import LogIn from '../Pages/LogIn';
import Register from '../Pages/Register';
import Home from '../Home/Home';
import PrivateRouter from '../Private/PrivateRouter';
import AdminRoute from '../Auth/AdminRoute';
import AllFoods from '../Routers/AllFoods/AllFoods';
import Details from '../MainSection/Details';
import GalleryPage from '../Routers/GalleryPage/GalleryPage';

// --- USER DASHBOARD COMPONENTS ---
import DashbordLayout from '../Layout/DashbordLayout';
import Dashboard from '../Dashboard/Dashboard';
import PurchaseList from '../MainSection/PurchaseList';
import ProfileCard from '../Routers/Profile';
import MyFoods from '../MyFoods/MyFoods';

// --- ADMIN DASHBOARD COMPONENTS ---
import AdminLayout from '../AdminDashboard/AdminLayout';
import AdminHome from '../AdminDashboard/AdminHome';
import ManageFoods from '../AdminDashboard/ManageFoods';
import ManageOrders from '../AdminDashboard/ManageOrders';
import UserManagement from '../AdminDashboard/UserManagement';
import AdminStats from '../AdminDashboard/AdminStats';
import AddFoods from '../Routers/AddFoods/AddFoods';
import Update from '../Routers/Update/Update';

// --- PAYMENT & ERROR ---
import OrderNow from '../MainSection/OrderNow';
import PaymentPage from '../Payment/PaymentPage';
import ErrorPage from '../Pages/ErrorPage';
import CheckoutPage from '../Payment/CheckoutPage';
import TransactionHistory from '../Payment/TransactionHistory';
import AdminPayments from '../AdminDashboard/AdminPayments';
import AddReview from '../AdminDashboard/AddReview';
import ManageLocation from '../AdminDashboard/ManageLocation';

const router = createBrowserRouter([
  // --- ১. পাবলিক রুটস ---
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <LogIn /> },
      { path: 'register', element: <Register /> },
      { path: 'allFoods', element: <AllFoods /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'foods/:id', element: <Details /> },
      {
        path: 'orderNow/:id',
        element: (
          <PrivateRouter>
            <OrderNow />
          </PrivateRouter>
        ),
      },
      {
        path: 'payment/success',
        element: (
          <PrivateRouter>
            <PaymentPage />
          </PrivateRouter>
        ),
      },
      {
        path: '/payment/checkout',
        element: (
          <PrivateRouter>
            <CheckoutPage />
          </PrivateRouter>
        ),
      },
    ],
  },

  // --- ২. ইউজার ড্যাশবোর্ড রাউটস (/dashboard) ---
  {
    path: '/dashboard',
    element: (
      <PrivateRouter>
        <DashbordLayout />
      </PrivateRouter>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'profile', element: <ProfileCard /> },
      { path: 'purchaseList', element: <PurchaseList /> },
      { path: 'myFoods', element: <MyFoods /> }, // ✅ ফিক্সড: স্লাশ সরানো হয়েছে
      { path: 'addFoods', element: <AddFoods /> }, // ✅ নতুন যোগ করা হয়েছে (ইউজার অ্যাড অপশন)
      { path: 'transactions', element: <TransactionHistory /> },
    ],
  },

  // --- ৩. অ্যাডমিন ড্যাশবোর্ড রাউটস (/admin) ---
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminHome /> },
      { path: 'manage-foods', element: <ManageFoods /> },
      { path: 'add-food', element: <AddFoods /> },

      { path: 'add-reviews', element: <AddReview /> },
      { path: 'manage-location', element: <ManageLocation /> },
      { path: 'update-food/:id', element: <Update /> },
      { path: 'manage-orders', element: <ManageOrders /> },
      {
        path: 'payments',
        element: <AdminPayments />,
      },
      { path: 'users', element: <UserManagement /> },
      { path: 'stats', element: <AdminStats /> },
    ],
  },

  // ৪. সব ভুল ইউআরএল-এর জন্য
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
