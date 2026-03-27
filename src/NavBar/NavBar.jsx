import React, { useEffect, useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Moon,
  Sun,
  ShoppingCart,
} from 'lucide-react';

const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Theme Logic
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Scroll effect for "Floating Island" look
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Foods', path: '/allFoods' },
    { name: 'Gallery', path: '/gallery' },
  ];

  const handleSignOut = async () => {
    await logOut();
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    });
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-500 pt-4 px-4">
      {/* --- MAIN CONTAINER --- */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`mx-auto container  transition-all duration-500 rounded-[2rem] ${
          scrolled
            ? 'bg-[#fcf9f5]/70 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-2 px-6 lg:max-w-5xl'
            : 'bg-transparent py-4 px-4 lg:px-8'
        }`}
      >
        <div className="flex justify-between items-center">
          {/* --- LOGO WITH PULSE ANIMATION --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              className="w-10 h-10 bg-[#E65100] rounded-2xl flex items-center justify-center shadow-lg"
            >
              <img
                src="https://i.ibb.co/MxBvKxGY/Chat-GPT-Image-AM.png"
                alt="Logo"
                className="w-6 h-6 brightness-200"
              />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter text-[#f7f2e9] dark:text-white uppercase">
                Spice<span className="text-[#E65100]">Slice</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.3em] text-[#E65100]">
                BOUTIQUE KITCHEN
              </span>
            </div>
          </Link>

          {/* --- CENTER: NAV LINKS WITH FLOATING INDICATOR --- */}
          <nav className="hidden lg:flex items-center bg-black/5 dark:bg-white/5 p-1.5 rounded-full relative">
            <ul className="flex items-center">
              {navLinks.map(link => (
                <li
                  key={link.name}
                  className="relative px-6 py-2"
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative z-10 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                        isActive
                          ? 'text-white'
                          : 'text-[#4a4a4a] dark:text-gray-300 hover:text-[#E65100]'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>

                  {/* Active Link Highlight */}
                  <NavLink to={link.path}>
                    {({ isActive }) =>
                      isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-[#E65100] rounded-full shadow-lg shadow-orange-500/30"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )
                    }
                  </NavLink>

                  {/* Hover Highlight */}
                  <AnimatePresence>
                    {hoveredLink === link.name && (
                      <motion.div
                        layoutId="hover-pill"
                        className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </nav>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="flex items-center gap-3">
            {/* Theme & Search/Cart Icons */}
            <div className="flex items-center bg-white/40 dark:bg-black/20 p-1 rounded-full border border-white/50">
              {/* <button
                onClick={handleToggle}
                className="p-2 rounded-full hover:bg-white text-[#E65100] transition-all"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button> */}
              <button className="p-2 rounded-full hover:bg-white text-[#1a1a1a] transition-all">
                <ShoppingCart size={18} />
              </button>
            </div>

            {/* Auth/User Section */}
            {user ? (
              <div className="dropdown dropdown-end">
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar border-2 border-[#E65100] p-0.5"
                >
                  <div className="w-9 rounded-full">
                    <img
                      src={user?.photoURL || 'https://via.placeholder.com/150'}
                      alt="Avatar"
                    />
                  </div>
                </motion.label>
                <motion.ul
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  tabIndex={0}
                  className="mt-4 p-3 shadow-2xl menu menu-sm dropdown-content bg-[#fcf9f5] dark:bg-[#1a1a1a] rounded-3xl w-60 border border-black/5"
                >
                  <div className="px-4 py-3 bg-[#E65100]/10 rounded-2xl mb-2">
                    <p className="text-[10px] font-bold text-[#E65100] uppercase tracking-tighter">
                      Premium Member
                    </p>
                    <p className="font-black truncate text-[#1a1a1a] dark:text-white">
                      {user?.displayName}
                    </p>
                  </div>
                  <li>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 py-3 font-bold"
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 py-3 text-red-500 font-bold"
                    >
                      <LogOut size={18} /> Log Out
                    </button>
                  </li>
                </motion.ul>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: '#E65100',
                    color: '#fff',
                  }}
                  className="bg-[#1a1a1a] text-[#fcf9f5] px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl transition-all"
                >
                  Join Us
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[#1a1a1a] dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- MOBILE OVERLAY MENU --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 h-screen bg-[#fcf9f5] dark:bg-[#0c0c0c] z-[60] flex flex-col p-10 lg:hidden"
          >
            <div className="flex justify-between items-center mb-20">
              <span className="text-2xl font-black">MENU</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>
            <ul className="flex flex-col gap-8">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-5xl font-black hover:text-[#E65100] transition-colors uppercase tracking-tighter"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
