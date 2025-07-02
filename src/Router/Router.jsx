import { createBrowserRouter } from 'react-router';
import Layout from '../Layout/Layout';
import LogIn from '../Pages/LogIn';
import Register from '../Pages/Register';
import Home from '../Home/Home';
import AddFoods from '../Routers/AddFoods/AddFoods';
import PrivateRouter from '../Private/PrivateRouter';
import OrderNow from '../MainSection/OrderNow';
import PurchaseList from '../MainSection/PurchaseList';
import MyFoods from '../MyFoods/MyFoods';
import AllFoods from '../Routers/AllFoods/AllFoods';

import Table from '../MainSection/Table';
import Update from '../Routers/Update/Update';
import Details from '../MainSection/Details';
import GalleryPage from '../Routers/GalleryPage/GalleryPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout></Layout>,

    children: [
      {
        index: true,
        element: <Home></Home>,
      },

      {
        path: '/login',
        element: <LogIn></LogIn>,
      },
      {
        path: '/register',
        element: <Register></Register>,
      },
      {
        path: 'addFoods',
        element: (
          <PrivateRouter>
            <AddFoods></AddFoods>
          </PrivateRouter>
        ),
      },

      {
        path: '/foods/:id',
        element: <Details></Details>,
        loader: ({ params }) =>
          fetch(
            `https://my-assignment-11-server-lac.vercel.app/foods/${params.id}`
          ),
      },

      {
        path: '/update/:id',
        element: <Update></Update>,
      },
      {
        path: '/orderNow/:id',
        element: (
          <PrivateRouter>
            <OrderNow></OrderNow>
          </PrivateRouter>
        ),
      },
      {
        path: '/purchaseList',
        element: (
          <PrivateRouter>
            <PurchaseList></PurchaseList>
          </PrivateRouter>
        ),
      },
      {
        path: '/applications/:id',
        element: (
          <PrivateRouter>
            <Table></Table>
          </PrivateRouter>
        ),
        loader: ({ params }) =>
          fetch(
            `https://my-assignment-11-server-lac.vercel.app/applications/${params.id}`
          ),
      },

      {
        path: '/myFoods',
        element: <MyFoods></MyFoods>,
      },
      {
        path: '/allFoods',
        element: <AllFoods></AllFoods>,
      },
      {
        path: '/gallery',
        element: <GalleryPage></GalleryPage>,
      },
    ],
  },
]);
export default router;
