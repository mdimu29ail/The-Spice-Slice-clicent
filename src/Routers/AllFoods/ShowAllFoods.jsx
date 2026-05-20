import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SingleCard from './SingleCard';
import Panna from '../../Banner/Panna';
import { Sparkles, ArrowDownWideNarrow, XCircle } from 'lucide-react';

const ShowAllFoods = ({ foods = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllFoods, setShowAllFoods] = useState(false);

  // --- 1. Performance: Memoized Filtering ---
  // useMemo ব্যবহার করা হয়েছে যাতে প্রতি রেন্ডারে ফিল্টারিং লজিক রান না হয়, শুধুমাত্র searchTerm বা foods চেঞ্জ হলে হবে।
  const filteredFoods = useMemo(() => {
    return foods.filter(
      food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.category?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, foods]);

  // --- 2. Performance: Memoized Display List ---
  const displayedFoods = useMemo(() => {
    return showAllFoods ? filteredFoods : filteredFoods.slice(0, 8);
  }, [showAllFoods, filteredFoods]);

  const handleToggleShowAll = () => {
    setShowAllFoods(!showAllFoods);
  };

  // এনিমেশন ভেরিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Search Region */}
      <section role="search" aria-label="Food search">
        <Panna searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </section>

      <div className="container mx-auto px-6">
        {/* --- 3. Accessibility: ARIA Live Region for Search Results --- */}
        <div className="min-h-[40px]" aria-live="polite" role="status">
          <AnimatePresence>
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.4em] mb-10"
              >
                <Sparkles size={14} aria-hidden="true" />
                Revealing {filteredFoods.length} artisanal pieces
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- 4. Masterpiece Grid --- */}
        <section aria-label="Food items grid">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {displayedFoods.length > 0 ? (
                displayedFoods.map(food => (
                  <motion.div
                    key={food.id || food._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <SingleCard food={food} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-30"
                >
                  <XCircle
                    size={64}
                    strokeWidth={1}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                  <h2 className="mt-6 text-xl font-black uppercase tracking-[0.4em]">
                    No Delicacies Found
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-[10px] font-bold underline uppercase tracking-widest text-[#E65100] hover:text-[#1a1a1a] transition-colors"
                    aria-label="Clear search and show all foods"
                  >
                    Clear Quest
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* --- 5. Luxury Action Button --- */}
        {filteredFoods.length > 8 && (
          <div className="flex flex-col items-center justify-center mt-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div
                className="absolute -inset-1 bg-gradient-to-r from-[#E65100] to-orange-400 rounded-full blur opacity-10 group-hover:opacity-30 transition duration-1000"
                aria-hidden="true"
              ></div>

              <button
                type="button"
                onClick={handleToggleShowAll}
                className="relative group flex items-center gap-8 bg-[#1a1a1a] text-white px-12 py-6 rounded-full shadow-2xl hover:bg-[#E65100] transition-all duration-500"
                aria-expanded={showAllFoods}
                aria-label={
                  showAllFoods
                    ? 'Show fewer items'
                    : `Show all ${filteredFoods.length} items`
                }
              >
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                    {showAllFoods ? 'Curate' : 'Expand'}
                  </span>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors uppercase">
                    {showAllFoods
                      ? 'Show Limited Selection'
                      : `Reveal All ${filteredFoods.length} Pieces`}
                  </span>
                </div>
                <div
                  className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-700 ${showAllFoods ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <ArrowDownWideNarrow size={18} />
                </div>
              </button>
            </motion.div>

            <p className="mt-10 text-[9px] font-black uppercase tracking-[0.6em] opacity-20 italic">
              The Spice Slice Boutique Archive
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllFoods;
