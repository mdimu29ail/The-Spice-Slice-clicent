import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';

// ইমেজগুলো আপনার প্রজেক্টের পথ অনুযায়ী ইমপোর্ট করুন
import Banner1 from '../../src/assets/img/banner-1.jpg';
import Banner2 from '../../src/assets/img/banner-2.jpg';
import Banner3 from '../../src/assets/img/banner-3.jpg';

const slides = [
  {
    id: 1,
    img: Banner1,
    title: 'A Symphony of Flavors',
    subtitle: 'AUTHENTIC & SPICY',
    description:
      'Experience the heat of hand-picked spices crafted with passion and served with perfection.',
  },
  {
    id: 2,
    img: Banner2,
    title: 'The Art of Slicing',
    subtitle: 'CULINARY MASTERY',
    description:
      'Every slice tells a story of tradition, bringing the finest tastes from our kitchen to your table.',
  },
  {
    id: 3,
    img: Banner3,
    title: 'Savor Every Moment',
    subtitle: 'EXCLUSIVE DINING',
    description:
      'Gather your loved ones for an unforgettable journey of taste at The Spice-Slice.',
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // টেক্সট এনিমেশন ভেরিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* --- FULL BACKGROUND IMAGE WITH ANIMATION --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].img}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          {/* Expensive Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-20 h-full flex flex-col justify-center px-6 lg:px-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="max-w-4xl"
          >
            {/* Subtitle with line */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-12 h-[2px] bg-[#E65100]"></div>
              <span className="text-[#fcf9f5] tracking-[0.4em] text-sm font-bold uppercase">
                {slides[current].subtitle}
              </span>
            </motion.div>

            {/* Main Title - Multi-line animation */}
            <motion.h1
              variants={itemVariants}
              className="text-6xl lg:text-9xl font-black text-white leading-[0.9] mb-8"
            >
              {slides[current].title.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-4">
                  {word === 'Spiced' ||
                  word === 'Flavors' ||
                  word === 'Slicing' ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E65100] to-orange-400 italic font-light">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </span>
              ))}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-gray-300 text-lg lg:text-xl max-w-xl mb-12 font-light leading-relaxed border-l border-white/20 pl-6"
            >
              {slides[current].description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6"
            >
              <Link to="/allFoods">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#E65100] hover:bg-orange-700 text-[#fcf9f5] px-10 py-5 rounded-full font-bold shadow-2xl flex items-center gap-3 transition-all"
                >
                  Order Now <ArrowRight size={20} />
                </motion.button>
              </Link>

              <Link to="/menu">
                <button className="px-10 py-5 rounded-full border border-white/30 text-white font-bold hover:bg-white/10 backdrop-blur-md transition-all flex items-center gap-3">
                  View Menu <UtensilsCrossed size={18} />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- PAGINATION INDICATORS (Right Side) --- */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative group flex items-center justify-end"
          >
            <span
              className={`mr-4 text-xs font-bold transition-all duration-500 ${current === i ? 'opacity-100 translate-x-0 text-white' : 'opacity-0 translate-x-4 text-white/50'}`}
            >
              0{i + 1}
            </span>
            <div
              className={`h-12 w-[2px] transition-all duration-500 ${current === i ? 'bg-[#E65100]' : 'bg-white/20 group-hover:bg-white/50'}`}
            ></div>
          </button>
        ))}
      </div>

      {/* --- SCROLL INDICATOR --- */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">
          Scroll
        </span>
      </motion.div>
    </div>
  );
};

export default Banner;
