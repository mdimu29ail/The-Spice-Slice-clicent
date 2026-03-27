import React, { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, TrendingUp, Sparkles } from 'lucide-react';
import Card from './Card';

const MainSection = ({ foodsPromise }) => {
  const foods = use(foodsPromise);

  // Filter foods with purchase_count > 200
  const foodsWithHighPurchaseCount = foods.filter(
    food => Number(food.purchase_count) > 200,
  );

  const [showAllFoods, setShowAllFoods] = useState(false);

  const displayedFoods = showAllFoods
    ? foodsWithHighPurchaseCount
    : foodsWithHighPurchaseCount.slice(0, 6);

  const handleToggleShowAll = () => {
    setShowAllFoods(!showAllFoods);
  };

  // Animation Variants for the Grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // একে একে কার্ডগুলো আসার টাইম গ্যাপ
      },
    },
  };

  return (
    <section className="py-24 bg-[#fcf9f5] selection:bg-orange-100">
      <div className="container max-w-7xl mx-auto px-6">
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4 bg-orange-100 px-4 py-1.5 rounded-full"
          >
            <TrendingUp size={16} className="text-[#E65100]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E65100]">
              Highly Demanded
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter leading-none"
          >
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E65100] to-orange-400">
              Masterpieces.
            </span>
          </motion.h2>

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
        </div>

        {/* --- FOODS GRID WITH STAGGER ANIMATION --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {displayedFoods.map((food, index) => (
              <motion.div
                key={food._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Card food={food} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- LOAD MORE / SHOW LESS BUTTON --- */}
        <div className="flex flex-col justify-center items-center mt-20">
          {foodsWithHighPurchaseCount.length > 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="relative group"
            >
              {/* Decorative Glow behind button */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E65100] to-orange-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

              <button
                onClick={handleToggleShowAll}
                className="relative flex items-center gap-3 px-10 py-5 bg-[#1a1a1a] text-[#fcf9f5] rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#E65100] transition-all duration-500 shadow-2xl"
              >
                <Sparkles size={16} className="text-orange-400" />
                {showAllFoods
                  ? 'Show Less Masterpieces'
                  : `Reveal All Treasures (${foodsWithHighPurchaseCount.length - 6}+)`}
                {showAllFoods ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </motion.div>
          )}

          {/* Bottom helper text */}
          {!showAllFoods && (
            <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">
              Explore our full heritage collection
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainSection;
