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

  // রেসপনসিভ সাইডবার লজিক
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- ১. প্রোফাইল ডাটা সিঙ্ক ---
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

    const profileSubscription = supabase
      .channel('admin-profile-sync')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        payload => {
          setProfile(payload.new);
        },
      )
      .subscribe();
    return () => supabase.removeChannel(profileSubscription);
  }, [user?.id]);

  // --- ২. রিয়েল-টাইম নোটিফিকেশন ---
  useEffect(() => {
    const fetchInitialNotifs = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*, hidden_notifications!left(user_id)')
        .is('hidden_notifications.user_id', null)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setNotifications(data);
    };
    fetchInitialNotifs();
    const notifChannel = supabase
      .channel('admin-db-notifs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        payload => {
          setNotifications(prev => [payload.new, ...prev]);
        },
      )
      .subscribe();
    return () => supabase.removeChannel(notifChannel);
  }, [user?.id]);

  const handleHideNotif = async id => {
    const { error } = await supabase
      .from('hidden_notifications')
      .insert([{ user_id: user.id, notification_id: id }]);
    if (!error) setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- ৩. ফিক্সড লগআউট ফাংশন (With Confirmation) ---
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Signing Out?',
      text: 'Are you sure you want to leave the executive suite?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E65100',
      cancelButtonColor: '#1a1a1a',
      confirmButtonText: 'Yes, Logout',
      background: '#fcf9f5',
      customClass: { popup: 'rounded-[3rem] border border-black/5 shadow-2xl' },
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
      {/* --- MOBILE OVERLAY --- */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

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
          <div className="w-11 h-11 bg-[#E65100] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <Utensils className="text-white" size={20} />
          </div>
          {isSidebarOpen && (
            <span className="text-white font-black tracking-tighter uppercase text-xl italic">
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
              onClick={() => window.innerWidth <= 1024 && setSidebarOpen(false)}
              className={({ isActive }) =>
                `relative group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${isActive ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white'}`
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

        {/* --- SIDEBAR FOOTER (Back to Home & Logout) --- */}
        <div className="mt-auto space-y-2 border-t border-white/5 pt-6">
          <Link
            to="/"
            className="flex items-center gap-4 p-4 text-gray-500 hover:text-[#E65100] transition-all group"
          >
            <Home
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            {isSidebarOpen && (
              <span className="font-bold text-[10px] uppercase tracking-[0.2em]">
                Back to Home
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all w-full"
          >
            <LogOut size={20} className="shrink-0" />
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
            <div className="hidden md:flex items-center gap-3 bg-white border border-black/5 px-6 py-3 rounded-2xl shadow-sm w-80 group focus-within:border-[#E65100]/30 transition-all">
              <Search
                size={18}
                className="text-gray-300 group-focus-within:text-[#E65100]"
              />
              <input
                type="text"
                placeholder="Search Boutique Data..."
                className="bg-transparent outline-none text-xs font-bold uppercase tracking-widest w-full placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            {/* Notification Bell (Same as before) */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-3 bg-white rounded-2xl border border-black/5 text-gray-400 hover:text-[#E65100] relative shadow-sm transition-all"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-bounce" />
                )}
              </button>
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-4 w-80 bg-white border border-black/5 rounded-[2rem] shadow-2xl p-6 z-[100]"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]">
                        System Alerts
                      </h4>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">
                        {notifications.length} New
                      </span>
                    </div>
                    <div className="space-y-4 max-h-80 overflow-y-auto no-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            className="flex gap-4 p-3 hover:bg-[#fcf9f5] rounded-2xl transition-all border-b border-black/[0.03] last:border-0 group/item"
                          >
                            <div
                              className={`p-2 rounded-xl shrink-0 ${notif.type === 'ADD' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}
                            >
                              {notif.type === 'ADD' ? (
                                <Sparkles size={14} />
                              ) : (
                                <RefreshCw size={14} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-bold text-[#1a1a1a] leading-tight mb-1">
                                {notif.message}
                              </p>
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                                {new Date(
                                  notif.created_at,
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleHideNotif(notif.id)}
                              className="opacity-0 group-hover/item:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center opacity-20">
                          <Bell size={40} className="mx-auto mb-2" />
                          <p className="text-[10px] font-black uppercase tracking-widest">
                            No Alerts
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-10 w-[1px] bg-black/5" />

            {/* Dynamic Profile Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                  Chief Administrator
                </p>
                <p className="text-sm font-black text-[#1a1a1a] uppercase">
                  {profile?.full_name || user?.displayName || 'Admin'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl border-2 border-orange-500/20 p-1 bg-white shadow-sm overflow-hidden group">
                <img
                  src={
                    profile?.avatar_url ||
                    user?.photoURL ||
                    'https://i.pravatar.cc/150?img=33'
                  }
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
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
