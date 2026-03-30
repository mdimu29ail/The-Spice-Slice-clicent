import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Clock,
  Percent,
  Flame,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Card = ({ food }) => {
  const { addToCart } = useCart();
  const available = food.is_available;
  const discount = food.discount; // অ্যাডমিন থেকে আসা ডিসকাউন্ট (যেমন: ২০)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={available ? { y: -12 } : {}}
      className={`group relative w-full bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden shadow-xl border border-black/5 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(230,81,0,0.15)] ${!available && 'opacity-75 grayscale-[0.3]'}`}
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-72 overflow-hidden">
        {/* 1. DISCOUNT BADGE (Top Left) */}
        {discount > 0 && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute top-6 left-6 z-20 flex items-center gap-1.5 px-4 py-2 bg-[#E65100] text-white rounded-2xl shadow-xl border border-white/20"
          >
            <Percent size={14} strokeWidth={3} />
            <span className="text-xs font-black uppercase tracking-tighter">
              {discount}% OFF
            </span>
          </motion.div>
        )}

        {/* Bestseller Icon (Top Right) if sales are high */}
        {food.purchase_count > 200 && (
          <div className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-orange-500 shadow-lg">
            <Flame size={20} fill="currentColor" />
          </div>
        )}

        <motion.img
          whileHover={available ? { scale: 1.15 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          src={food.image_url}
          className="w-full h-full object-cover"
          alt={food.name}
        />

        {/* ADD TO CART BUTTON (Floating Right) */}
        {available && (
          <button
            onClick={() => addToCart(food)}
            className="absolute bottom-6 right-6 z-20 w-14 h-14 bg-white text-[#E65100] rounded-2xl flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#E65100] hover:text-white"
          >
            <ShoppingBag size={26} />
          </button>
        )}
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-8">
        {/* Title */}
        <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight text-[#1a1a1a] dark:text-[#fcf9f5] group-hover:text-[#E65100] transition-colors mb-2">
          {food.name}
        </h3>

        {/* 2. AVAILABILITY STATUS (Below Title) */}
        <div className="flex items-center gap-2 mb-8">
          {available ? (
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                In Stock & Fresh
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-red-500">
              <Clock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Currently Sold Out
              </span>
            </div>
          )}
          <div className="w-[1px] h-3 bg-black/10 mx-1"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
            {food.category}
          </span>
        </div>

        {/* --- BOTTOM SECTION (Price & Details Button) --- */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/5">
          {/* 3. PRICE (Bottom Left) */}
          <div className="flex flex-col leading-none">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Price
            </p>
            <span className="text-3xl font-black text-[#1a1a1a] dark:text-white tracking-tighter italic">
              ${food.price_usd}
            </span>
          </div>

          {/* 4. DETAILS BUTTON (Bottom Right) */}
          <Link to={`/foods/${food.id}`}>
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 px-8 py-4 bg-[#1a1a1a] hover:bg-[#E65100] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl"
            >
              Details <ArrowRight size={14} />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Luxury Background Detail */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </motion.div>
  );
};

export default Card;
