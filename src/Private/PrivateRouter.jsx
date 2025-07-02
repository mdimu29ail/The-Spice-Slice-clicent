import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Auth/AuthContext';

const PrivateRouter = ({ children }) => {
  const { user, loading } = use(AuthContext);

  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <span className="loading loading-ring loading-xl"></span>
        <span className="loading loading-ring loading-xl"></span>
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={location.pathname}></Navigate>;
  }

  return children;
};

export default PrivateRouter;
