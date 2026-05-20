import React, { useState, useContext, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Home,
  Sparkles,
  RefreshCw,
  Trash2,
  CreditCard,
  MapPin,
  ArrowLeftRight, // সুইচ আইকন
  UserCircle, // প্রোফাইল আইকন
} from 'lucide-react';
import { AuthContext } from '../Auth/AuthContext';
import { supabase } from '../supabase/supabaseClient';
import Swal from 'sweetalert2';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const { logOut, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();

  // রেসপনসিভ লজিক...
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // প্রোফাইল ডাটা ফেচিং...
  useEffect(() => {
    if (!user?.id) return;
    const fetchAdminProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data);
    };
    fetchAdminProfile();
  }, [user?.id]);

  // লগআউট ফাংশন...
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Sign Out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E65100',
      confirmButtonText: 'Yes',
      background: '#fcf9f5',
    });
    if (result.isConfirmed) {
      await logOut();
      navigate('/login');
    }
  };

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    {
      name: 'Add Food',
      path: '/admin/add-food',
      icon: <PlusCircle size={20} />,
    },
    {
      name: 'Add Reviews',
      path: '/admin/add-review',
      icon: <PlusCircle size={20} />,
    },
    {
      name: 'Manage Foods',
      path: '/admin/manage-foods',
      icon: <Utensils size={20} />,
    },
    {
      name: 'Orders Control',
      path: '/admin/manage-orders',
      icon: <ShoppingBag size={20} />,
    },
    {
      name: 'Payments',
      path: '/admin/payments',
      icon: <CreditCard size={20} />,
    },
    { name: 'Patrons', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Analytics', path: '/admin/stats', icon: <BarChart3 size={20} /> },
    {
      name: 'Manage Location',
      path: '/admin/manage-location',
      icon: <MapPin size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#fcf9f5] font-sans selection:bg-orange-100 relative">
      {/* --- SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 280 : 85,
          x: window.innerWidth <= 1024 && !isSidebarOpen ? -300 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed h-[96vh] top-[2vh] left-4 bg-[#1a1a1a] rounded-[3rem] shadow-2xl z-[60] flex flex-col p-6 border border-white/5 overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-11 h-11 bg-[#E65100] rounded-2xl flex items-center justify-center shrink-0 shadow-lg -ml-3">
            <Utensils className="text-white" size={20} />
          </div>
          {isSidebarOpen && (
            <span className="text-white font-black tracking-tighter uppercase text-xl italic whitespace-nowrap">
              Admin<span className="text-[#E65100] not-italic">.</span>
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `relative group flex items-center gap-4 -ml-1 p-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`shrink-0 transition-colors ${isActive ? 'text-[#E65100]' : ''}`}
                  >
                    {item.icon}
                  </span>
                  {isSidebarOpen && (
                    <span className="font-bold text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="admin-pill"
                      className="absolute inset-0 bg-white/5 rounded-2xl -z-10"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2 border-t border-white/5 pt-6">
          <Link
            to="/"
            className="flex items-center gap-4 p-4 text-gray-500 hover:text-[#E65100] transition-all group"
          >
            <Home size={20} className="shrink-0 -ml-3" />
            {isSidebarOpen && (
              <span className="font-bold text-[10px] uppercase tracking-[0.2em]">
                Store Front
              </span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 text-red-400/70 hover:text-red-400 rounded-2xl transition-all w-full"
          >
            <LogOut size={20} className="shrink-0 -ml-3" />
            {isSidebarOpen && (
              <span className="font-bold text-[10px] uppercase tracking-[0.2em]">
                Terminate
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarOpen && window.innerWidth > 1024 ? 'lg:ml-[310px]' : 'lg:ml-[115px]'}`}
      >
        <header className="h-24 px-6 lg:px-10 flex items-center justify-between sticky top-0 bg-[#fcf9f5]/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-3 bg-white border border-black/5 rounded-2xl shadow-sm text-[#1a1a1a]"
            >
              {isSidebarOpen && window.innerWidth <= 1024 ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
            <h2 className="hidden sm:block text-xl font-black text-[#1a1a1a] tracking-tighter uppercase italic">
              Executive{' '}
              <span className="text-[#E65100] not-italic">Suite.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* --- ✅ নতুন সুইচ বাটন: প্রোফাইলের পাশে --- */}
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-black/5 rounded-2xl shadow-sm hover:border-[#E65100]/30 group transition-all"
              >
                <ArrowLeftRight
                  size={14}
                  className="text-[#E65100] group-hover:rotate-180 transition-transform duration-500"
                />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#1a1a1a]">
                  Patron View
                </span>
              </motion.button>
            </Link>

            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-3 bg-white rounded-2xl border border-black/5 text-gray-400 hover:text-[#E65100] relative shadow-sm transition-all"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-bounce" />
              )}
            </button>

            <div className="h-10 w-[1px] bg-black/5 hidden sm:block" />

            {/* প্রোফাইল সেকশন (এখন এটি শুধুমাত্র প্রোফাইল হিসেবে কাজ করবে) */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                  Chief Curator
                </p>
                <p className="text-sm font-black text-[#1a1a1a] uppercase leading-none">
                  {profile?.full_name || user?.displayName || 'Admin'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl border-2 border-[#E65100]/20 p-1 bg-white shadow-xl overflow-hidden">
                <img
                  src={
                    profile?.avatar_url ||
                    user?.photoURL ||
                    'https://i.pravatar.cc/150'
                  }
                  className="w-full h-full object-cover rounded-xl"
                  alt="admin"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
