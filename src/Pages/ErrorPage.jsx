import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useRouteError } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Ghost, Flame, AlertTriangle, Sparkles } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();

  // Performance: Trace ID মেমোইজ করা হয়েছে যাতে প্রতি রেন্ডারে চেঞ্জ না হয়
  const traceId = useMemo(
    () => Math.random().toString(36).substring(7).toUpperCase(),
    [],
  );

  // এনিমেশন ভেরিয়েন্ট: সিজলিং ভাইব্রেশন
  const sizzleVariants = {
    animate: {
      x: [0, -1, 1, -1, 1, 0],
      y: [0, 1, -1, 1, -1, 0],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: 'mirror',
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#fcf9f5] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-orange-100">
      {/* SEO: মেটা ডাটা (Error পেজ ইনডেক্স না করা ভালো) */}
      <Helmet>
        <title>Lost in Flavor | 404 Error</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* --- BACKGROUND DECOR --- */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2 }}
          className="text-[35vw] font-black italic leading-none text-center mt-20 text-[#1a1a1a]"
        >
          404
        </motion.h1>
        {/* Floating Smoke/Steam Effect */}
        <motion.div
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="text-center relative z-10 max-w-2xl">
        {/* --- MAIN ERROR ANIMATION --- */}
        <div className="relative mb-12">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative inline-block"
          >
            {/* Floating Ghost Chef Icon */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-40 h-40 bg-white rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] flex items-center justify-center mx-auto mb-8 border border-black/5 relative group"
            >
              <Ghost
                size={80}
                className="text-[#1a1a1a] group-hover:text-[#E65100] transition-colors duration-500"
                strokeWidth={1}
              />

              {/* Sizzling Flame Badge */}
              <motion.div
                variants={sizzleVariants}
                animate="animate"
                className="absolute -top-4 -right-4 bg-[#E65100] text-white p-4 rounded-3xl shadow-xl shadow-orange-900/20"
              >
                <Flame size={24} fill="currentColor" />
              </motion.div>
            </motion.div>

            {/* Glitchy 404 Text */}
            <div className="relative inline-block">
              <h2 className="text-8xl lg:text-9xl font-black text-[#1a1a1a] tracking-tighter leading-none uppercase italic">
                Oops<span className="text-[#E65100]">.</span>
              </h2>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 text-[#E65100] translate-x-1 translate-y-1 opacity-50"
              >
                Oops.
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* --- ERROR MESSAGE --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
          role="alert"
        >
          <div className="flex items-center justify-center gap-3 text-[#E65100]">
            <AlertTriangle size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Recipe Not Found
            </span>
          </div>

          <p className="text-gray-500 font-medium text-lg lg:text-xl italic leading-relaxed max-w-md mx-auto">
            This artisanal masterpiece has been misplaced or the ingredients are
            no longer in our boutique vault.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Link to="/" aria-label="Return to the home page">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-6 bg-[#1a1a1a] text-white px-12 py-6 rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-[#E65100] transition-all duration-500"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-2 transition-transform"
                  aria-hidden="true"
                />
                Back to Kitchen
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* --- TECHNICAL FOOTER --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 text-[9px] font-bold text-gray-300 uppercase tracking-widest">
            <Sparkles size={12} />
            <span>Trace ID: {traceId}</span>
          </div>
          <p className="text-[8px] font-black text-gray-200 uppercase tracking-[0.6em]">
            The Spice Slice Boutique Archive
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default ErrorPage;
