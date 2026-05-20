import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  Star,
  Flame,
  CheckCircle2,
  XCircle,
  Diamond,
  Zap,
  Percent,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const SingleCard = ({ food }) => {
  const { addToCart } = useCart();

  // Performance: quantity চেক করা হয়েছে
  const available = useMemo(() => parseInt(food.quantity) > 0, [food.quantity]);

  // Performance: ডিসকাউন্ট ক্যালকুলেশন মেমোইজ করা হয়েছে
  const discount = useMemo(() => {
    return food.old_price_usd
      ? Math.round(
          ((food.old_price_usd - food.price_usd) / food.old_price_usd) * 100,
        )
      : 0;
  }, [food.old_price_usd, food.price_usd]);

  return (
    <motion.div
      whileHover={available ? { y: -12 } : {}}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative w-full bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-black/5 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(230,81,0,0.12)] ${!available && 'opacity-75 grayscale-[0.4]'}`}
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-72 overflow-hidden bg-gray-100">
        {/* Discount Badge */}
        {discount > 0 && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute top-5 left-5 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-[#E65100] text-white rounded-xl shadow-lg border border-white/20"
          >
            <Percent size={12} strokeWidth={3} aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {discount}% OFF
            </span>
          </motion.div>
        )}

        {/* Status & Category */}
        <div className="absolute top-5 right-5 z-20 flex flex-col items-end gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-md rounded-full border shadow-sm ${available ? 'bg-green-500/10 text-green-600 border-green-100' : 'bg-red-500/10 text-red-600 border-red-100'}`}
          >
            {available ? (
              <CheckCircle2 size={10} aria-hidden="true" />
            ) : (
              <XCircle size={10} aria-hidden="true" />
            )}
            <span className="text-[8px] font-black uppercase tracking-widest">
              {available ? 'Available' : 'Sold Out'}
            </span>
          </div>
          <div className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-lg border border-black/5">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
              {food.category}
            </p>
          </div>
        </div>

        <motion.img
          whileHover={available ? { scale: 1.15 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          src={food.image_url}
          className="w-full h-full object-cover transition-transform duration-700"
          alt={`Artisanal dish: ${food.name}`} // SEO: Descriptive alt text
          loading="lazy" // Performance: Lazy loading
          decoding="async" // Performance: Async decoding
          width="400" // Performance: Layout shift prevention
          height="300"
        />

        {available && (
          <button
            type="button"
            onClick={() => addToCart(food)}
            className="absolute bottom-6 right-6 z-20 w-14 h-14 bg-[#1a1a1a] text-white rounded-2xl flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#E65100] scale-90 group-hover:scale-100"
            aria-label={`Add ${food.name} to cart`} // Accessibility: ARIA label
          >
            <ShoppingBag size={24} aria-hidden="true" />
          </button>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        />
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <div className="flex gap-2 mb-2">
              {food.is_signature && (
                <Flame
                  size={14}
                  className="text-orange-500 fill-orange-500"
                  aria-hidden="true"
                />
              )}
              {food.is_premium && (
                <Diamond
                  size={14}
                  className="text-blue-500 fill-blue-500"
                  aria-hidden="true"
                />
              )}
              {food.is_spicy && (
                <Zap
                  size={14}
                  className="text-red-500 fill-red-500 animate-pulse"
                  aria-hidden="true"
                />
              )}
            </div>

            <h3 className="text-2xl font-black tracking-tighter uppercase leading-none text-[#1a1a1a] group-hover:text-[#E65100] transition-colors mb-2">
              {food.name}
            </h3>

            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-0.5 text-orange-400"
                aria-label={`Rating: ${food.rating || '4.9'} stars`}
              >
                <Star size={10} fill="currentColor" aria-hidden="true" />
                <span className="text-[10px] font-black text-[#1a1a1a]">
                  {food.rating || '4.9'}
                </span>
              </div>
              <div className="w-[1px] h-3 bg-black/10" aria-hidden="true" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                Artisanal
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end leading-none">
            {food.old_price_usd && (
              <span
                className="text-[10px] font-bold text-gray-300 line-through mb-1 italic"
                aria-label="Original price"
              >
                ${food.old_price_usd}
              </span>
            )}
            <span
              className="text-3xl font-black text-[#1a1a1a] tracking-tighter italic"
              aria-label="Current price"
            >
              ${food.price_usd}
            </span>
          </div>
        </div>

        {/* --- LUXURY DETAILS BUTTON --- */}
        <div className="pt-6 border-t border-black/5">
          <Link
            to={`/foods/${food.id || food._id}`}
            aria-label={`View details for ${food.name}`} // Accessibility
          >
            <motion.button
              type="button"
              whileHover={{ x: 5 }}
              className="w-full flex items-center justify-between px-8 py-5 bg-[#fcf9f5] hover:bg-[#1a1a1a] rounded-2xl transition-all duration-500 group/btn shadow-sm"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1a1a1a] group-hover/btn:text-white transition-colors duration-500">
                Acquire Masterpiece
              </span>
              <ArrowRight
                size={16}
                className="text-[#E65100] group-hover/btn:text-white group-hover/btn:translate-x-2 transition-all duration-500"
                aria-hidden="true"
              />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Decorative Background ID */}
      <div
        className="absolute -bottom-4 -right-4 text-8xl font-black text-black/[0.02] italic pointer-events-none group-hover:text-orange-500/5 transition-colors"
        aria-hidden="true"
      >
        {food.id?.slice(-2).toUpperCase() || 'SS'}
      </div>
    </motion.div>
  );
};

export default SingleCard;
