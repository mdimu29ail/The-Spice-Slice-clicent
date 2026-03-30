import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  Star,
  Flame,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const SingleCard = ({ food }) => {
  const { addToCart } = useCart();
  const available = parseInt(food.quantity) > 0;

  return (
    <motion.div
      whileHover={available ? { y: -10 } : {}}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative w-full bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-black/5 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(230,81,0,0.12)] ${!available && 'opacity-70 grayscale-[0.5]'}`}
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-64 overflow-hidden">
        {/* Availability Status Badge */}
        <div
          className={`absolute top-5 left-5 z-20 flex items-center gap-1.5 px-4 py-2 backdrop-blur-md rounded-2xl shadow-sm border ${available ? 'bg-green-500/10 text-green-600 border-green-100' : 'bg-red-500/10 text-red-600 border-red-100'}`}
        >
          {available ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          <span className="text-[9px] font-black uppercase tracking-widest">
            {available ? 'Available' : 'Sold Out'}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-5 right-5 z-20 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-black/5">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
            {food.category}
          </p>
        </div>

        <motion.img
          whileHover={available ? { scale: 1.1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          src={food.image_url}
          className="w-full h-full object-cover"
          alt={food.name}
        />

        {/* Quick Add to Cart (Only visible on hover) */}
        {available && (
          <button
            onClick={() => addToCart(food)}
            className="absolute bottom-5 right-5 z-20 w-12 h-12 bg-[#1a1a1a] text-white rounded-2xl flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#E65100]"
          >
            <ShoppingBag size={20} />
          </button>
        )}
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-black tracking-tighter uppercase leading-tight text-[#1a1a1a] group-hover:text-[#E65100] transition-colors mb-1">
              {food.name}
            </h3>
            <div className="flex items-center gap-1 text-orange-400">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-bold text-gray-400">
                4.9 Rare Selection
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end leading-none">
            <span className="text-2xl font-black text-[#1a1a1a] tracking-tighter italic">
              ${food.price_usd}
            </span>
            <span className="text-[8px] font-bold text-gray-300 uppercase mt-1">
              Net Value
            </span>
          </div>
        </div>

        {/* --- FIXED DETAILS BUTTON --- */}
        <div className="pt-6 border-t border-black/5">
          <Link to={`/foods/${food.id || food._id}`}>
            <motion.button
              whileHover={{ gap: '12px' }}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#fcf9f5] border border-black/5 hover:bg-[#1a1a1a] hover:text-white rounded-[1.5rem] transition-all duration-500 group/btn shadow-sm hover:shadow-xl"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                View Masterpiece
              </span>
              <div className="w-6 h-6 rounded-full bg-[#E65100]/10 group-hover/btn:bg-[#E65100] flex items-center justify-center transition-colors">
                <ArrowRight size={12} className="group-hover/btn:text-white" />
              </div>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Design Decoration */}
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
};

export default SingleCard;
