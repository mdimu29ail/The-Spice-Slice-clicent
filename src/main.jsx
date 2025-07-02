import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import router from './Router/Router.jsx';
import { RouterProvider } from 'react-router';
import AuthProvider from './Auth/AuthProvider.jsx';
import NavBar from './NavBar/NavBar.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>
);
