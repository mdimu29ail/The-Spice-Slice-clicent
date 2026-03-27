import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Flame, ArrowRight } from 'lucide-react';

const Card = ({ food }) => {
  const isAvailable = parseInt(food.quantity) > 0;

  return (
    <motion.div
      whileHover={{ y: -12 }}
      className="group relative w-full max-w-[400px] bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(230,81,0,0.15)] transition-all duration-500 border border-black/5"
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-64 overflow-hidden">
        {/* Floating Badge (Hot/Spicy) */}
        {parseInt(food.purchase_count) > 200 && (
          <div className="absolute top-5 left-5 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
            <Flame size={14} className="text-[#E65100]" fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">
              Bestseller
            </span>
          </div>
        )}

        {/* Availability Badge */}
        <div
          className={`absolute top-5 right-5 z-20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${isAvailable ? 'bg-green-100/90 text-green-700' : 'bg-red-100/90 text-red-700'}`}
        >
          {isAvailable ? 'Available' : 'Out of Stock'}
        </div>

        {/* Main Food Image with Zoom Effect */}
        <motion.img
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          src={food.image_url}
          alt={food.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-black text-[#1a1a1a] dark:text-[#fcf9f5] leading-tight tracking-tighter mb-1">
              {food.name}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              {food.cuisine || 'Signature Spice'}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-[#E65100] tracking-tighter">
              ${food.price_usd}
            </span>
            <div className="flex items-center gap-1 text-orange-400 mt-1">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-bold text-gray-500">4.9</span>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="w-full h-[1px] bg-black/5 dark:bg-white/5 my-6"></div>

        {/* --- BUTTONS --- */}
        <div className="flex items-center gap-3">
          <Link to={`/foods/${food._id}`} className="flex-1">
            <motion.button
              whileHover={{ x: 5 }}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#1a1a1a] hover:bg-[#E65100] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl"
            >
              Details <ArrowRight size={14} />
            </motion.button>
          </Link>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-orange-100 text-[#E65100] rounded-2xl hover:bg-[#E65100] hover:text-white transition-all duration-300"
          >
            <ShoppingBag size={20} />
          </motion.button>
        </div>
      </div>

      {/* Hover Background Pattern */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </motion.div>
  );
};

export default Card;
