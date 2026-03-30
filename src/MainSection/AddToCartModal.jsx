import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Star } from 'lucide-react';

const AddToCartModal = ({ isOpen, onClose, food }) => {
  const [quantity, setQuantity] = useState(1);

  if (!food) return null;

  const totalPrice = (food.price_usd * quantity).toFixed(2);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#fcf9f5] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/50"
          >
            {/* Left: Image Section */}
            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
              <img
                src={food.image_url}
                alt={food.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Details Section */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/50 hover:bg-white text-black transition-all"
              >
                <X size={20} />
              </button>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={12} className="text-orange-500 fill-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Premium Choice
                  </span>
                </div>
                <h2 className="text-3xl font-black text-[#1a1a1a] leading-tight mb-2 tracking-tighter">
                  {food.name}
                </h2>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                  {food.description ||
                    'A masterfully spiced slice of perfection, crafted for the ultimate culinary journey.'}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between bg-black/5 p-2 rounded-2xl mb-8">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="p-3 bg-white rounded-xl shadow-sm hover:text-[#E65100] transition-all"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 bg-white rounded-xl shadow-sm hover:text-[#E65100] transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Bottom Info & CTA */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="text-3xl font-black text-[#E65100] tracking-tighter">
                    ${totalPrice}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#1a1a1a] text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#E65100] transition-all shadow-xl shadow-orange-900/20"
                >
                  <ShoppingBag size={18} /> Add to Collection
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartModal;
