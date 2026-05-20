import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, TrendingUp, Sparkles } from 'lucide-react';
import Card from './Card';

const MainSection = ({ foods = [] }) => {
  const [showAllFoods, setShowAllFoods] = useState(false);

  // --- 1. Performance: Memoized Filtering ---
  // useMemo ব্যবহার করা হয়েছে যাতে প্রতি রেন্ডারে ফিল্টারিং লজিক রান না হয়।
  // এটি শুধুমাত্র 'foods' প্রপস পরিবর্তন হলে পুনরায় ক্যালকুলেট হবে।
  const foodsWithHighPurchaseCount = useMemo(() => {
    return foods.filter(food => Number(food.purchase_count) > 200);
  }, [foods]);

  // --- 2. Performance: Memoized Display List ---
  const displayedFoods = useMemo(() => {
    return showAllFoods
      ? foodsWithHighPurchaseCount
      : foodsWithHighPurchaseCount.slice(0, 6);
  }, [showAllFoods, foodsWithHighPurchaseCount]);

  const handleToggleShowAll = () => {
    setShowAllFoods(prev => !prev);
  };

  // Performance: এনিমেশন ভেরিয়েন্ট মেমোইজ করা হয়েছে
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
        },
      },
    }),
    [],
  );

  return (
    <section
      className="py-24 bg-[#fcf9f5] selection:bg-orange-100"
      aria-labelledby="masterpieces-heading"
    >
      <div className="container max-w-7xl mx-auto px-6">
        {/* --- SECTION HEADER --- */}
        <header className="flex flex-col items-center mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4 bg-orange-100 px-4 py-1.5 rounded-full"
          >
            <TrendingUp
              size={16}
              className="text-[#E65100]"
              aria-hidden="true"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E65100]">
              Highly Demanded
            </span>
          </motion.div>

          <h2
            id="masterpieces-heading"
            className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter leading-none"
          >
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E65100] to-orange-400">
              Masterpieces.
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-gray-500 max-w-xl text-lg font-light leading-relaxed"
          >
            A curated selection of our most loved flavors, perfectly sliced and
            spiced to ignite your culinary senses.
          </motion.p>
        </header>

        {/* --- FOODS GRID --- */}
        {/* Accessibility: aria-live ব্যবহার করা হয়েছে যাতে কন্টেন্ট চেঞ্জ হলে স্ক্রিন রিডার বুঝতে পারে */}
        <div aria-live="polite">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence mode="popLayout">
              {displayedFoods.map(food => (
                <motion.div
                  key={food.id || food._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <Card food={food} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* --- BUTTON SECTION --- */}
        <div className="flex flex-col justify-center items-center mt-20">
          {foodsWithHighPurchaseCount.length > 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div
                className="absolute -inset-1 bg-gradient-to-r from-[#E65100] to-orange-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"
                aria-hidden="true"
              ></div>
              <button
                type="button" // Best Practice: Explicit button type
                onClick={handleToggleShowAll}
                aria-expanded={showAllFoods}
                aria-label={
                  showAllFoods
                    ? 'Show fewer masterpieces'
                    : 'Show all masterpieces'
                }
                className="relative flex items-center gap-3 px-10 py-5 bg-[#1a1a1a] text-[#fcf9f5] rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#E65100] transition-all duration-500 shadow-2xl"
              >
                <Sparkles
                  size={16}
                  className="text-orange-400"
                  aria-hidden="true"
                />
                {showAllFoods
                  ? 'Show Less Masterpieces'
                  : `Reveal All Treasures (${foodsWithHighPurchaseCount.length - 6}+)`}
                {showAllFoods ? (
                  <ChevronUp size={18} aria-hidden="true" />
                ) : (
                  <ChevronDown size={18} aria-hidden="true" />
                )}
              </button>
            </motion.div>
          )}

          {!showAllFoods && (
            <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] italic">
              Explore our full heritage collection
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainSection;
