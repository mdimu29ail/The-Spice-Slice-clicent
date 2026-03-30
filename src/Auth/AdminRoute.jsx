import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Loading from '../Loading/Loading';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useContext(AuthContext);
  const location = useLocation();

  // ১. লোডিং অবস্থা (Supabase থেকে সেশন চেক করার সময়)
  if (loading) {
    return <Loading />;
  }

  // ২. যদি ইউজার লগইন করা না থাকে, তবে লগইন পেজে পাঠান
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ৩. যদি ইউজার লগইন করা থাকে কিন্তু অ্যাডমিন না হয়
  if (user && !isAdmin) {
    // প্রিমিয়াম সুইট এলার্ট (Access Denied)
    Swal.fire({
      title: 'Access Denied!',
      text: 'This section is reserved for Authorized Spicers only.',
      icon: 'error',
      iconColor: '#E65100',
      confirmButtonText: 'Back to Safety',
      confirmButtonColor: '#1a1a1a',
      background: '#fcf9f5',
      customClass: {
        title: 'font-black text-2xl uppercase tracking-tighter',
        popup: 'rounded-[3rem] border border-black/5 shadow-2xl',
        confirmButton:
          'rounded-full px-10 py-4 font-bold uppercase text-xs tracking-widest',
      },
    });

    return <Navigate to="/" replace />;
  }

  // ৪. যদি ইউজার অ্যাডমিন হয়, তবে মডার্ন স্লাইড এনিমেশন সহ কন্টেন্ট দেখান
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default AdminRoute;
