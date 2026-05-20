import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Loading from '../Loading/Loading';

// --- Performance: Lazy Loading (Code Splitting) ---
// এর ফলে ইউজার যে পেজে যাবে শুধু সেই পেজের কোড লোড হবে, যা ইনিশিয়াল লোড টাইম কমাবে।
const Layout = lazy(() => import('../Layout/Layout'));
const LogIn = lazy(() => import('../Pages/LogIn'));
const Register = lazy(() => import('../Pages/Register'));
const Home = lazy(() => import('../Home/Home'));
const PrivateRouter = lazy(() => import('../Private/PrivateRouter'));
const AdminRoute = lazy(() => import('../Auth/AdminRoute'));
const AllFoods = lazy(() => import('../Routers/AllFoods/AllFoods'));
const Details = lazy(() => import('../MainSection/Details'));
const GalleryPage = lazy(() => import('../Routers/GalleryPage/GalleryPage'));

// User Dashboard
const DashbordLayout = lazy(() => import('../Layout/DashbordLayout'));
const Dashboard = lazy(() => import('../Dashboard/Dashboard'));
const PurchaseList = lazy(() => import('../MainSection/PurchaseList'));
const ProfileCard = lazy(() => import('../Routers/Profile'));
const MyFoods = lazy(() => import('../MyFoods/MyFoods'));

// Admin Dashboard
const AdminLayout = lazy(() => import('../AdminDashboard/AdminLayout'));
const AdminHome = lazy(() => import('../AdminDashboard/AdminHome'));
const ManageFoods = lazy(() => import('../AdminDashboard/ManageFoods'));
const ManageOrders = lazy(() => import('../AdminDashboard/ManageOrders'));
const UserManagement = lazy(() => import('../AdminDashboard/UserManagement'));
const AdminStats = lazy(() => import('../AdminDashboard/AdminStats'));
const AdminPayments = lazy(() => import('../AdminDashboard/AdminPayments'));
const AddReview = lazy(() => import('../AdminDashboard/AddReview'));
const ManageLocation = lazy(() => import('../AdminDashboard/ManageLocation'));
const AddFoods = lazy(() => import('../Routers/AddFoods/AddFoods'));
const Update = lazy(() => import('../Routers/Update/Update'));

// Payment & Error
const OrderNow = lazy(() => import('../MainSection/OrderNow'));
const PaymentPage = lazy(() => import('../Payment/PaymentPage'));
const ErrorPage = lazy(() => import('../Pages/ErrorPage'));
const CheckoutPage = lazy(() => import('../Payment/CheckoutPage'));
const TransactionHistory = lazy(() => import('../Payment/TransactionHistory'));

// Accessibility: লোডিং স্টেটের জন্য একটি কমন র‍্যাপার
const SuspenseLayout = ({ children }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseLayout>
        <Layout />
      </SuspenseLayout>
    ),
    errorElement: (
      <SuspenseLayout>
        <ErrorPage />
      </SuspenseLayout>
    ),
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
        path: 'payment/checkout', // Best Practice: স্লাশ সরানো হয়েছে (Relative Path)
        element: (
          <PrivateRouter>
            <CheckoutPage />
          </PrivateRouter>
        ),
      },
    ],
  },

  // --- ২. ইউজার ড্যাশবোর্ড রাউটস ---
  {
    path: '/dashboard',
    element: (
      <PrivateRouter>
        <SuspenseLayout>
          <DashbordLayout />
        </SuspenseLayout>
      </PrivateRouter>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'profile', element: <ProfileCard /> },
      { path: 'purchaseList', element: <PurchaseList /> },
      { path: 'myFoods', element: <MyFoods /> },
      { path: 'addFoods', element: <AddFoods /> },
      { path: 'transactions', element: <TransactionHistory /> },
    ],
  },

  // --- ৩. অ্যাডমিন ড্যাশবোর্ড রাউটস ---
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <SuspenseLayout>
          <AdminLayout />
        </SuspenseLayout>
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminHome /> },
      { path: 'manage-foods', element: <ManageFoods /> },
      { path: 'add-food', element: <AddFoods /> },
      { path: 'add-review', element: <AddReview /> },
      { path: 'manage-location', element: <ManageLocation /> },
      { path: 'update-food/:id', element: <Update /> },
      { path: 'manage-orders', element: <ManageOrders /> },
      { path: 'payments', element: <AdminPayments /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'stats', element: <AdminStats /> },
    ],
  },

  // ৪. ওয়াইল্ডকার্ড রাউট (SEO & Best Practice)
  {
    path: '*',
    element: (
      <SuspenseLayout>
        <ErrorPage />
      </SuspenseLayout>
    ),
  },
]);

export default router;
