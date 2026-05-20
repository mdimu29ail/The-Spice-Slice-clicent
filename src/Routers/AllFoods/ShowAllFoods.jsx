// import React, { use, useState } from 'react';
// import SingleCard from './SingleCard';
// import Panna from '../../Banner/Panna';

// const ShowAllFoods = ({ foodsPromise }) => {
//   const foods = use(foodsPromise); // Suspense-based data loading
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAllFoods, setShowAllFoods] = useState(false);

//   // Filter foods by search term
//   const filteredFoods = foods.filter(food =>
//     food.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const displayedFoods = showAllFoods
//     ? filteredFoods
//     : filteredFoods.slice(0, 8);

//   const handleToggleShowAll = () => {
//     setShowAllFoods(!showAllFoods);
//   };

//   return (
//     <div>
//       <Panna searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

//       <div className="my-6">
//         <h2 className="text-4xl text-center font-bold mb-4">All Foods Here</h2>
//       </div>

//       {/* 🧾 Food Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pb-20">
//         {displayedFoods.length > 0 ? (
//           displayedFoods.map(food => <SingleCard key={food._id} food={food} />)
//         ) : (
//           <p className="text-center col-span-3 text-red-500 font-semibold">
//             No food matched your search.
//           </p>
//         )}
//       </div>

//       {/* Show More/Less Button */}
//       {filteredFoods.length > 6 && (
//         <div className="flex justify-center mt-8 mb-12">
//           <button
//             onClick={handleToggleShowAll}
//             className="px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500"
//           >
//             {showAllFoods
//               ? 'Show Less'
//               : `See All (${filteredFoods.length - 6} more)`}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowAllFoods;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SingleCard from './SingleCard';
import Panna from '../../Banner/Panna'; // আপনার ডেকোরেটিভ/সার্চ ব্যানার
import {
  Sparkles,
  ArrowDownWideNarrow,
  XCircle,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

const ShowAllFoods = ({ foods = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllFoods, setShowAllFoods] = useState(false);

  // --- ১. উন্নত ফিল্টারিং লজিক (নাম এবং ক্যাটাগরি উভয়ই সার্চ করা যাবে) ---
  const filteredFoods = foods.filter(
    food =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // শুরুতে ৮টি খাবার দেখাবে (২টি সারি)
  const displayedFoods = showAllFoods
    ? filteredFoods
    : filteredFoods.slice(0, 8);

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
      {/* --- ২. PANNA SECTION (Search & Background) --- */}
      {/* Panna কম্পোনেন্টের ভেতরেই সার্চবার এবং ডেকোরেশন থাকবে */}
      <section className="relative z-20">
        <Panna searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </section>

      {/* --- ৩. সার্চ রেজাল্ট স্ট্যাটাস --- */}
      <div className="container mx-auto px-6">
        <AnimatePresence>
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.4em] mb-10"
            >
              <Sparkles size={14} />
              Revealing {filteredFoods.length} artisanal pieces
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ৪. মাস্টারপিস গ্রিড (স্মুথ লেআউট ট্রানজিশন সহ) --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedFoods.length > 0 ? (
              displayedFoods.map((food, index) => (
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
                <XCircle size={64} strokeWidth={1} className="text-gray-400" />
                <p className="mt-6 text-xl font-black uppercase tracking-[0.4em]">
                  No Delicacies Found
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-[10px] font-bold underline uppercase tracking-widest text-[#E65100]"
                >
                  Clear Quest
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- ৫. লাক্সারি অ্যাকশন বাটন (See All) --- */}
        {filteredFoods.length > 8 && (
          <div className="flex flex-col items-center justify-center mt-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E65100] to-orange-400 rounded-full blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>

              <button
                onClick={handleToggleShowAll}
                className="relative group flex items-center gap-8 bg-[#1a1a1a] text-white px-12 py-6 rounded-full shadow-2xl hover:bg-[#E65100] transition-all duration-500"
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
                >
                  <ArrowDownWideNarrow size={18} />
                </div>
              </button>
            </motion.div>

            <p className="mt-10 text-[9px] font-black uppercase tracking-[0.6em] opacity-20">
              The Spice Slice Boutique Archive
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllFoods;
