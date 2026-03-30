import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import router from './Router/Router.jsx';
import { RouterProvider } from 'react-router';
import AuthProvider from './Auth/AuthProvider.jsx';
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
