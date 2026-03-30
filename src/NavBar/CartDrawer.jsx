import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose, cartItems = [], total, removeItem }) => {
  // মোট বিল ক্যালকুলেশন
  const cartTotal =
    total ||
    cartItems.reduce(
      (acc, item) => acc + item.price_usd * (item.quantity || 1),
      0,
    );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#fcf9f5] shadow-2xl z-[70] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-[#E65100]" />
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                  Your Selection.
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={item.id}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-tight">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {item.category} x {item.quantity || 1}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-black text-[#E65100]">
                          ${(item.price_usd * (item.quantity || 1)).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={64} strokeWidth={1} className="mb-4" />
                  <p className="text-sm font-black uppercase tracking-[0.2em]">
                    Your collection is empty
                  </p>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="mt-8 pt-8 border-t border-black/5">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Total Bill
                  </span>
                  <span className="text-3xl font-black text-[#1a1a1a] tracking-tighter">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                {/* পেমেন্ট পেজে ডাটা পাঠানো হচ্ছে */}
                // ... আগের কোড
                <Link
                  to="/orderNow/checkout"
                  onClick={onClose}
                  state={{
                    // ১. পুরো কার্ট এবং মোট দাম পাঠানো হচ্ছে
                    orderData: {
                      items: cartItems,
                      total_price: total,
                    },
                    // ২. স্ট্রাইপ বা পেমেন্ট গেটওয়ের জন্য একটি সামারি অবজেক্ট
                    food: {
                      name: 'Gourmet Collection',
                      price_usd: total,
                      image_url: cartItems[0]?.image_url, // প্রথম খাবারের ছবি প্রিভিউ হিসেবে
                    },
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#E65100] transition-all"
                  >
                    Authorize Payment <ArrowRight size={18} />
                  </motion.button>
                </Link>
                // ... বাকি কোড
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
