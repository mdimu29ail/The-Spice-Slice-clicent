import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';

const Layout = () => {
  return (
    <div className="">
      <NavBar></NavBar>
      <div className="h-full min-h-screen">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Layout;
