import React, { useEffect, useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabase/supabaseClient'; // সুপাবেস ক্লায়েন্ট ইমপোর্ট করুন
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
  ShieldCheck,
  ShoppingBag,
  Trash2,
  ArrowRight,
  User as UserIcon,
} from 'lucide-react';

const NavBar = () => {
  const { user, logOut, isAdmin } = useContext(AuthContext);
  const { cart, cartCount, cartTotal, removeFromCart } = useCart();

  const [profile, setProfile] = useState(null); // প্রোফাইল ডাটার জন্য স্টেট
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  // --- ১. প্রোফাইল ইমেজ এবং ডাটা সিঙ্ক (profiles টেবিল থেকে) ---
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', user.id)
        .single();
      if (!error) setProfile(data);
    };

    fetchProfile();

    // রিয়েল-টাইম আপডেট লিসেনার (যাতে প্রোফাইল চেঞ্জ করলে নেভবার অটো আপডেট হয়)
    const profileSubscription = supabase
      .channel('navbar-profile-sync')
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

  // --- SCROLL EFFECT ---
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
    const result = await Swal.fire({
      title: 'Signing Out?',
      text: "We'll have the spices ready for your return!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#E65100',
      cancelButtonColor: '#1a1a1a',
      confirmButtonText: 'Logout',
    });

    if (result.isConfirmed) {
      await logOut();
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-500 pt-4 px-4">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`mx-auto container transition-all duration-500 rounded-[2.5rem] ${
          scrolled
            ? 'bg-[#fcf9f5]/80 dark:bg-[#0c0c0c]/80 backdrop-blur-2xl border border-white/40 dark:border-white/5 shadow-2xl py-2 px-6 lg:max-w-6xl'
            : 'bg-transparent py-4 px-4 lg:px-8'
        }`}
      >
        <div className="flex justify-between items-center">
          {/* --- LOGO --- */}
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
              <span className="text-xl font-black tracking-tighter text-[#1a1a1a] dark:text-white uppercase italic">
                Spice<span className="text-[#E65100] not-italic">Slice</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.3em] text-[#E65100]">
                BOUTIQUE KITCHEN
              </span>
            </div>
          </Link>

          {/* --- CENTER: NAVIGATION --- */}
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
                      `relative z-10 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#4a4a4a] dark:text-gray-300 hover:text-[#E65100]'}`
                    }
                  >
                    {link.name}
                  </NavLink>
                  <AnimatePresence>
                    {hoveredLink === link.name && (
                      <motion.div
                        layoutId="hover-pill"
                        className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full"
                      />
                    )}
                  </AnimatePresence>
                  <NavLink to={link.path}>
                    {({ isActive }) =>
                      isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-[#E65100] rounded-full shadow-lg"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )
                    }
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/40 dark:bg-black/20 p-1 rounded-full border border-white/50 dark:border-white/5">
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white transition-all relative"
              >
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-[#E65100] text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>

            {user ? (
              <div className="dropdown dropdown-end">
                <motion.label
                  tabIndex={0}
                  className={`btn btn-ghost btn-circle avatar border-2 p-0.5 ${isAdmin ? 'border-orange-600 animate-pulse' : 'border-[#E65100]'}`}
                >
                  <div className="w-9 rounded-full overflow-hidden bg-gray-100">
                    {/* ফিক্সড ইমেজ সোর্স: প্রথমে প্রোফাইল টেবিল, তারপর মেটাডাটা, তারপর প্লেসহোল্ডার */}
                    <img
                      src={
                        profile?.avatar_url ||
                        user?.user_metadata?.avatar_url ||
                        'https://i.pravatar.cc/150?img=32'
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.label>
                <motion.ul
                  tabIndex={0}
                  className="mt-4 p-4 shadow-2xl menu menu-sm dropdown-content bg-[#fcf9f5] dark:bg-[#1a1a1a] rounded-[2rem] w-64 border border-black/5 dark:border-white/5"
                >
                  <div className="px-4 py-3 bg-[#E65100]/10 rounded-2xl mb-3">
                    <p className="text-[10px] font-black text-[#E65100] uppercase tracking-tighter">
                      {isAdmin ? 'Administrator' : 'Premium Patron'}
                    </p>
                    <p className="font-black truncate text-[#1a1a1a] dark:text-white text-sm">
                      {profile?.full_name || user?.displayName || user?.email}
                    </p>
                  </div>
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 py-3 font-bold text-orange-700 bg-orange-50 dark:bg-orange-950/20 rounded-xl mb-1"
                      >
                        <ShieldCheck size={18} /> Admin Control
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 py-3 font-bold dark:text-white"
                    >
                      <LayoutDashboard size={18} /> User Dashboard
                    </Link>
                  </li>
                  <div className="h-[1px] bg-black/5 dark:bg-white/5 my-2"></div>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 py-3 text-red-500 font-bold"
                    >
                      <LogOut size={18} /> Sign Out
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
                  className="bg-[#1a1a1a] text-[#fcf9f5] px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl transition-all"
                >
                  Join Us
                </motion.button>
              </Link>
            )}

            <button
              className="lg:hidden p-2 text-[#1a1a1a] dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- CART DRAWER --- */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        total={cartTotal}
        removeItem={removeFromCart}
      />

      {/* --- MOBILE OVERLAY --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 h-screen bg-[#fcf9f5] dark:bg-[#0c0c0c] z-[60] flex flex-col p-10 lg:hidden"
          >
            <div className="flex justify-between items-center mb-20">
              <span className="text-3xl font-black italic tracking-tighter uppercase dark:text-white">
                Menu.
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="dark:text-white"
              >
                <X size={32} />
              </button>
            </div>
            <ul className="flex flex-col gap-10">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-5xl font-black uppercase tracking-tighter hover:text-[#E65100] transition-colors italic dark:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-5xl font-black text-[#E65100] uppercase tracking-tighter underline underline-offset-8"
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// --- CART DRAWER SUB-COMPONENT ---
const CartDrawer = ({ isOpen, onClose, cartItems, total, removeItem }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full max-w-md bg-[#fcf9f5] dark:bg-[#0c0c0c] shadow-2xl z-[70] flex flex-col p-10"
        >
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <ShoppingBag size={24} className="text-[#E65100]" />
              <h2 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">
                Selections.
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all"
            >
              <X size={24} className="dark:text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.id} className="flex gap-5 items-center group">
                  <div className="w-20 h-20 rounded-2xl bg-gray-200 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image_url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-xs uppercase tracking-tight dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-[#E65100] font-black text-xs mt-1">
                      ${item.price_usd} x {item.quantity || 1}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <ShoppingBag size={64} className="dark:text-white" />
                <p className="mt-4 font-black uppercase tracking-widest text-xs dark:text-white">
                  Empty Basket
                </p>
              </div>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5">
              <div className="flex justify-between items-end mb-8">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Estimated Value
                </span>
                <span className="text-4xl font-black text-[#1a1a1a] dark:text-white tracking-tighter">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Link to="/payment/checkout" onClick={onClose}>
                <button className="w-full bg-[#1a1a1a] dark:bg-[#E65100] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl">
                  Authorize Payment <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default NavBar;
