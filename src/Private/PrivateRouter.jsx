import React, { useContext } from 'react'; // 'use' এর বদলে 'useContext' ব্যবহার করুন
import { Navigate, useLocation } from 'react-router-dom'; // 'react-router' থেকে 'react-router-dom' এ পরিবর্তন
import { AuthContext } from '../Auth/AuthContext';
import Loading from '../Loading/Loading'; // আপনার মডার্ন লোডিং কম্পোনেন্ট
import { motion } from 'framer-motion';

const PrivateRouter = ({ children }) => {
  // useContext ব্যবহার করা হয়েছে যাতে 'Async Client Component' এরর না আসে
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // ১. লোডিং অবস্থা - এখানে আপনার স্লাইড করা সজলিং লোডারটি দেখাবে
  if (loading) {
    return <Loading />;
  }

  // ২. ইউজার না থাকলে লগইন পেজে রিডাইরেক্ট করা
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ৩. ইউজার থাকলে চিলড্রেন কম্পোনেন্টগুলো একটি স্মুথ এনিমেশন হয়ে আসবে
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default PrivateRouter;
