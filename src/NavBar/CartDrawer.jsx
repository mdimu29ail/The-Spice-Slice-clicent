import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose, cartItems = [], total, removeItem }) => {
  // Performance: useMemo ব্যবহার করে টোটাল বিল ক্যালকুলেশন অপ্টিমাইজ করা হয়েছে
  const cartTotal = useMemo(() => {
    return (
      total ||
      cartItems.reduce(
        (acc, item) => acc + item.price_usd * (item.quantity || 1),
        0,
      )
    );
  }, [cartItems, total]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur - Accessibility: aria-hidden="true" যোগ করা হয়েছে */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            aria-hidden="true"
          />

          {/* Drawer Content - Accessibility: role="dialog" এবং aria-modal যোগ করা হয়েছে */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#fcf9f5] shadow-2xl z-[70] flex flex-col p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <ShoppingBag
                  size={24}
                  className="text-[#E65100]"
                  aria-hidden="true"
                />
                <h2
                  id="cart-drawer-title"
                  className="text-2xl font-black tracking-tighter uppercase italic"
                >
                  Your Selection.
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-all"
                aria-label="Close shopping cart"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            {/* Cart Items List */}
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
                        alt={`Visual of ${item.name}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy" // Performance: Lazy loading
                        decoding="async" // Performance: Async decoding
                        width="80" // Performance: Layout shift prevention
                        height="80"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-black text-sm uppercase tracking-tight">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {item.category} x {item.quantity || 1}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-black text-[#E65100]">
                          ${(item.price_usd * (item.quantity || 1)).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div
                  className="h-full flex flex-col items-center justify-center text-center opacity-40"
                  aria-live="polite"
                >
                  <ShoppingBag
                    size={64}
                    strokeWidth={1}
                    className="mb-4"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-black uppercase tracking-[0.2em]">
                    Your collection is empty
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
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

                <Link
                  to="/orderNow/checkout"
                  onClick={onClose}
                  state={{
                    orderData: {
                      items: cartItems,
                      total_price: cartTotal,
                    },
                    food: {
                      name: 'Gourmet Collection',
                      price_usd: cartTotal,
                      image_url: cartItems[0]?.image_url,
                    },
                  }}
                  aria-label={`Proceed to checkout with total amount ${cartTotal.toFixed(2)} dollars`}
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#E65100] transition-all"
                  >
                    Authorize Payment{' '}
                    <ArrowRight size={18} aria-hidden="true" />
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
