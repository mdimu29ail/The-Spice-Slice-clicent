import React, { useEffect, useState, useContext } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaUtensils,
  FaShoppingCart,
  FaUser,
} from 'react-icons/fa';
import { AuthContext } from '../Auth/AuthContext';

const DashboardLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const handleToggle = e => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  if (!loading && !user) {
    return null; // Can show a loader here instead
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 justify-between px-4">
          <div className="text-lg font-bold text-green-600">Dashboard</div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full border border-green-600 overflow-hidden">
                      <img
                        alt="User Avatar"
                        src={user.photoURL || '/default-avatar.png'}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                {user.displayName && (
                  <span className="hidden md:block text-sm font-semibold">
                    {user.displayName}
                  </span>
                )}
              </>
            )}

            {/* Theme Toggle */}
            <label className="swap swap-rotate cursor-pointer">
              <input
                type="checkbox"
                onChange={handleToggle}
                checked={theme === 'dark'}
                aria-label="Toggle dark mode"
              />
              {/* Sun Icon */}
              <svg
                className="swap-on h-6 w-6 fill-current text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71...Z" />
              </svg>
              {/* Moon Icon */}
              <svg
                className="swap-off h-6 w-6 fill-current text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1...Z" />
              </svg>
            </label>
          </div>
        </div>

        {/* Child routes render here */}
        <Outlet />
      </div>

      {/* Sidebar */}
      <div className="drawer-side bg-base-200">
        <label htmlFor="my-drawer-2" className="drawer-overlay" />

        {/* Logo */}
        <Link
          to="/"
          className="p-4 flex items-center space-x-2 border-b border-gray-300"
        >
          <div className="text-3xl font-extrabold text-green-600">🍔</div>
          <div className="text-2xl font-bold text-green-700">Foods</div>
        </Link>

        {/* Menu */}
        <ul className="menu text-base-content min-h-full w-80 p-4">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 font-bold border-b-2 border-green-600 rounded-2xl'
                  : 'hover:text-green-400 border-b-2 rounded-2xl'
              }
            >
              <FaTachometerAlt className="inline-block mr-2" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/addFoods"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 font-bold border-b-2 border-green-600 rounded-2xl'
                  : 'hover:text-green-400 border-b-2 rounded-2xl'
              }
            >
              <FaPlusCircle className="inline-block mr-2" /> Add Foods
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/myFoods"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 font-bold border-b-2 border-green-600 rounded-2xl'
                  : 'hover:text-green-400 border-b-2 rounded-2xl'
              }
            >
              <FaUtensils className="inline-block mr-2" /> My Foods
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/purchaseList"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 font-bold border-b-2 border-green-600 rounded-2xl'
                  : 'hover:text-green-400 border-b-2 rounded-2xl'
              }
            >
              <FaShoppingCart className="inline-block mr-2" /> My Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 font-bold border-b-2 border-green-600 rounded-2xl'
                  : 'hover:text-green-400 border-b-2 rounded-2xl'
              }
            >
              <FaUser className="inline-block mr-2" /> Profile
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
