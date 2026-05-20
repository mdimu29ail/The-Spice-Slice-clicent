import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  UserCircle,
  Home,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Zap,
  History,
  Sparkles,
  RefreshCw,
  Trash2,
  ShieldCheck, // অ্যাডমিন আইকনের জন্য
  ArrowRightLeft, // সুইচ আইকনের জন্য
} from 'lucide-react';
import { AuthContext } from '../Auth/AuthContext';
import { supabase } from '../supabase/supabaseClient';
import Swal from 'sweetalert2';

const DashboardLayout = () => {
  const { user, loading, logOut, isAdmin } = useContext(AuthContext); // isAdmin নেওয়া হয়েছে
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
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

  // প্রোফাইল ও নোটিফিকেশন লজিক (আগের মতোই থাকবে)...
  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user?.id]);

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: 'Wait, Patron!',
      text: 'Are you sure you want to leave the boutique?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#E65100',
      cancelButtonColor: '#1a1a1a',
      confirmButtonText: 'Yes, Sign Out',
      background: '#fcf9f5',
      customClass: { popup: 'rounded-[3rem]' },
    });
    if (result.isConfirmed) {
      await logOut();
      navigate('/');
    }
  };

  const userLinks = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      end: true,
    },
    {
      name: 'My Creations',
      path: '/dashboard/myFoods',
      icon: <UtensilsCrossed size={20} />,
    },
    {
      name: 'Order Status',
      path: '/dashboard/purchaseList',
      icon: <ShoppingBag size={20} />,
    },
    {
      name: 'The Ledger',
      path: '/dashboard/transactions',
      icon: <History size={20} />,
    },
    {
      name: 'Profile Settings',
      path: '/dashboard/profile',
      icon: <UserCircle size={20} />,
    },
  ];

  if (loading) return null;

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
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-11 h-11 bg-[#E65100] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <img
              src="https://i.ibb.co/MxBvKxGY/Chat-GPT-Image-AM.png"
              className="w-7 brightness-200"
              alt="logo"
            />
          </div>
          {isSidebarOpen && (
            <span className="text-white font-black tracking-tighter uppercase text-xl italic whitespace-nowrap">
              Patron<span className="text-[#E65100] not-italic">.</span>
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-2">
          {userLinks.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
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
                      layoutId="patron-pill"
                      className="absolute inset-0 bg-white/5 rounded-2xl -z-10"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto space-y-2 border-t border-white/5 pt-6">
          <Link
            to="/"
            className="flex items-center gap-4 p-4 text-gray-500 hover:text-[#E65100] transition-all group"
          >
            <Home size={20} className="shrink-0 -ml-3" />
            {isSidebarOpen && (
              <span className="font-bold text-[10px] uppercase tracking-[0.2em]">
                Back to Home
              </span>
            )}
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-4 p-4 text-red-400/70 hover:text-red-400 rounded-2xl transition-all w-full"
          >
            <LogOut size={20} className="shrink-0 -ml-3" />
            {isSidebarOpen && (
              <span className="font-bold text-[10px] uppercase tracking-[0.2em]">
                Sign Out
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
            <h2 className="hidden xl:block text-xl font-black text-[#1a1a1a] tracking-tighter uppercase italic">
              Patron <span className="text-[#E65100] not-italic">Suite.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* --- ✅ নতুন অ্যাডমিন বাটন (শুধুমাত্র অ্যাডমিনরা দেখবে) --- */}
            {isAdmin && (
              <Link to="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white rounded-2xl shadow-xl hover:bg-[#E65100] transition-all group"
                >
                  <ArrowRightLeft
                    size={14}
                    className="text-[#E65100] group-hover:text-white transition-colors"
                  />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Admin Panel
                  </span>
                </motion.button>
              </Link>
            )}

            {/* Notification Bell */}
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

            {/* Profile Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-1 text-[#E65100] mb-0.5">
                  <Zap size={10} fill="currentColor" />
                  <p className="text-[9px] font-black uppercase tracking-tighter">
                    Verified Patron
                  </p>
                </div>
                <p className="text-sm font-black text-[#1a1a1a] uppercase leading-none truncate max-w-[150px]">
                  {profile?.full_name || user?.displayName || 'Patron'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-[1.2rem] border-2 border-[#E65100]/20 p-1 bg-white shadow-xl overflow-hidden group">
                <img
                  src={
                    profile?.avatar_url ||
                    user?.photoURL ||
                    'https://i.pravatar.cc/150'
                  }
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                  alt="avatar"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 pt-2 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
