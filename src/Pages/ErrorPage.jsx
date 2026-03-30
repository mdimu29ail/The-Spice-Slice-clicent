import React from 'react';
import { motion } from 'framer-motion';
import { Link, useRouteError } from 'react-router-dom';
import { ArrowLeft, Ghost, Flame } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-[#fcf9f5] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none">
        <h1 className="text-[30vw] font-black italic leading-none text-center mt-20">
          LOST.
        </h1>
      </div>

      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center mx-auto mb-8 border border-black/5 relative">
            <Ghost size={64} className="text-[#E65100]" strokeWidth={1} />
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-2 -right-2 bg-orange-100 text-[#E65100] p-3 rounded-2xl shadow-lg"
            >
              <Flame size={20} fill="currentColor" />
            </motion.div>
          </div>

          <h2 className="text-7xl lg:text-9xl font-black text-[#1a1a1a] tracking-tighter leading-none uppercase italic">
            404 <br /> <span className="text-[#E65100] not-italic">Error.</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs mb-12 max-w-sm mx-auto"
        >
          This masterpiece was either moved or never existed in our boutique
          collection.
        </motion.p>

        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-4 bg-[#1a1a1a] text-white px-12 py-6 rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-[#E65100] transition-all"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-2 transition-transform"
            />
            Back to Kitchen
          </motion.button>
        </Link>

        {/* Technical details (Subtle) */}
        <p className="mt-20 text-[10px] text-gray-300 font-mono italic uppercase">
          Trace ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
