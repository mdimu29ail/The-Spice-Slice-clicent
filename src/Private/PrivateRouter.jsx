import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import Loading from '../Loading/Loading';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য

const PrivateRouter = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // ১. লোডিং অবস্থা (Performance & Accessibility)
  if (loading) {
    return (
      <div role="alert" aria-busy="true" aria-live="polite">
        <Loading />
      </div>
    );
  }

  // ২. ইউজার না থাকলে লগইন পেজে রিডাইরেক্ট (Best Practices)
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ৩. ইউজার থাকলে কন্টেন্ট রেন্ডার (SEO & Accessibility)
  return (
    <React.Fragment>
      {/* SEO: প্রাইভেট পেজগুলো যাতে গুগল ইনডেক্স না করে (Security & SEO Best Practice) */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        role="main" // Accessibility: মেইন কন্টেন্ট হিসেবে চিহ্নিত করা
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </React.Fragment>
  );
};

export default PrivateRouter;
