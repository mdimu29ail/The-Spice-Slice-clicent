import React from 'react';
import { use, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';

const NavBar = () => {
  const { user, logOut } = use(AuthContext);

  //
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light'
  );
  const handleToggle = e => {
    if (e.target.checked) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);

    const localTheme = localStorage.getItem('theme');

    document.querySelector('html').setAttribute('data-theme', localTheme);
  }, [theme]);

  // Theme context

  //

  const navigate = useNavigate();
  const links = (
    <>
      <li className="px-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'text-green-600 font-bold border-b-2 border-green-600 rounded-2xl'
              : ' hover:text-green-400 border-b-2  rounded-2xl'
          }
        >
          Home
        </NavLink>
      </li>
      <li className="px-2">
        <NavLink
          to="/allFoods"
          className={({ isActive }) =>
            isActive
              ? 'text-green-600 font-bold border-b-2 border-green-600 rounded-2xl'
              : ' hover:text-green-400 border-b-2  rounded-2xl'
          }
        >
          All Foods
        </NavLink>
      </li>
      <li className="px-2">
        <NavLink
          to="/gallery"
          className={({ isActive }) =>
            isActive
              ? 'text-green-600 font-bold border-b-2 border-green-600 rounded-2xl'
              : ' hover:text-green-400 border-b-2  rounded-2xl'
          }
        >
          Gallery
        </NavLink>
      </li>
    </>
  );

  const handleSignOut = async () => {
    try {
      await logOut();

      Swal.fire({
        icon: 'success',
        title: 'Logout successful!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      setTimeout(() => {
        navigate('/login');
      }, 1600);
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout failed',
        text: error.message,
      });
    }
  };

  return (
    <div className="navbar shadow-sm z-40 shadow-green-200 sticky top-0">
      <div className="navbar-start px-4">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {' '}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{' '}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <img
            src="https://i.ibb.co/MxBvKxGY/Chat-GPT-Image-AM.png"
            alt="  "
            className="w-10"
          />
          <a className="text-2xl font-semibold">
            <span className="font-bold text-green-500">The</span> Spice Slice
          </a>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end">
        {/*  */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full border border-green-600 flex items-center">
                {user && user.photoURL ? (
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={user.photoURL}
                  />
                ) : (
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://via.placeholder.com/150"
                  />
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li className="py-2">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-green-600 font-bold border-b-2 border-green-600 rounded-2xl'
                      : ' hover:text-green-400 border-b-2  rounded-2xl'
                  }
                >
                  dashboard
                </NavLink>
              </li>

              <li className="mt-3">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className=" hover:text-green-600 font-bold border-b-2 border-green-600 rounded-2xl"
                  >
                    LogOut
                  </button>
                ) : (
                  ''
                )}
              </li>
            </ul>
          </div>
        ) : (
          ''
        )}
        {/*  */}

        <ul className="flex gap-3 items-center ml-3">
          <li>
            {user ? (
              ''
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500"
                >
                  Login
                </Link>
              </>
            )}
          </li>

          <li>
            <div className="hidden lg:block md:hidden">
              {user && user.displayName ? (
                <span className="lg:mr-2 text-sm font-semibold">
                  {user.displayName}
                </span>
              ) : (
                ''
              )}
            </div>
          </li>
          {/* Theme Toggle Button */}

          <div className="block    border-green-500 rounded-full p-1">
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                onChange={handleToggle}
                checked={theme === 'light' ? false : true}
              />

              {/* sun icon */}
              <svg
                className="swap-on h-6 w-6 fill-current text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* moon icon */}
              <svg
                className="swap-off h-6 w-6 fill-current text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
          </div>
          {/*  */}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
