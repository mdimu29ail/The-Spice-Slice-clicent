import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Download } from 'lucide-react';

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-[#fcf9f5] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl border border-green-100"
        >
          <CheckCircle size={64} className="text-green-500" strokeWidth={1.5} />
        </motion.div>

        <h2 className="text-6xl font-black text-[#1a1a1a] tracking-tighter leading-none mb-6">
          Order <br />{' '}
          <span className="text-[#E65100] italic">Authenticated.</span>
        </h2>

        <p className="text-gray-500 text-lg max-w-sm mx-auto mb-12 font-medium leading-relaxed">
          Your payment was successful. Our master chefs are now preparing your
          spice-slice.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/dashboard/my-orders">
            <motion.button
              whileHover={{ y: -5 }}
              className="bg-[#1a1a1a] text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl"
            >
              Track Order
            </motion.button>
          </Link>
          <button className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all">
            <Download size={16} /> Get Boutique Receipt
          </button>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-20 text-gray-400 hover:text-[#E65100] transition-colors"
        >
          <ArrowLeft size={16} />{' '}
          <span className="text-[10px] font-black uppercase tracking-widest">
            Back to Kitchen
          </span>
        </Link>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
