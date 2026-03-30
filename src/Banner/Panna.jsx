import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Star,
  Sparkles,
  ArrowRight,
  Play,
} from 'lucide-react';

const foodItems = [
  {
    id: '1',
    mainImg: 'https://i.ibb.co/VW0mh7qs/Sushi-Platter.jpg',
    title: 'The Oceanic',
    subtitle: 'SUSHI MASTERPIECE',
    tagline: 'Slices of pure artisanal perfection from the deep blue.',
  },
  {
    id: '2',
    mainImg: 'https://i.ibb.co/b5vrr5XW/Chicken-Roast.jpg',
    title: 'Golden Roast',
    subtitle: 'HERB INFUSED',
    tagline: 'Hand-ground spices meet slow-roasted organic chicken.',
  },
  {
    id: '3',
    mainImg: 'https://i.ibb.co/xSFGDQgd/Margherita-Pizza.jpg',
    title: 'Flame Slice',
    subtitle: 'NEAPOLITAN HEART',
    tagline: 'Fire-blasted crust with our signature spicy tomato fusion.',
  },
  {
    id: '4',
    mainImg: 'https://i.ibb.co/FbqkNB4f/Panta-Ilish.jpg',
    title: 'Heritage Soul',
    subtitle: 'BENGALI TRADITION',
    tagline: 'The absolute classic, served with a boutique spicy twist.',
  },
];

const FoodBanner = ({ searchTerm, setSearchTerm }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // ৫ সেকেন্ড পর পর অটো চেঞ্জ লজিক
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === foodItems.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleThumbnailClick = index => setCurrent(index);

  return (
    <section className="relative w-full min-h-[700px] lg:h-[90vh] bg-[#fcf9f5] overflow-hidden flex items-center pt-20 lg:pt-0">
      {/* --- BACKGROUND DECORATIVE TEXT --- */}
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
        <motion.h2
          key={current}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2 }}
          className="text-[25vw] font-black italic uppercase tracking-tighter text-[#1a1a1a]"
        >
          {foodItems[current].title}
        </motion.h2>
      </div>

      <div className="container mx-auto px-6 lg:px-20 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* --- LEFT: CONTENT & SEARCH --- */}
          <div className="w-full lg:w-5/12 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                  <Sparkles size={16} className="text-[#E65100]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
                    Masterpiece Selection
                  </span>
                </div>

                <h1 className="text-6xl lg:text-8xl font-black text-[#1a1a1a] leading-[0.85] tracking-tighter uppercase italic mb-4">
                  {foodItems[current].title} <br />
                  <span className="text-[#E65100] not-italic">
                    {foodItems[current].subtitle}
                  </span>
                </h1>

                <p className="text-gray-500 text-lg font-medium leading-relaxed italic mb-10 border-l-4 border-[#E65100]/20 pl-6 max-w-sm mx-auto lg:mx-0">
                  {foodItems[current].tagline}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Premium Floating Search */}
            <div className="relative max-w-md mx-auto lg:mx-0 group">
              <div className="absolute inset-0 bg-[#E65100]/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-white border border-black/5 p-2 rounded-3xl shadow-2xl">
                <div className="p-3 text-gray-400 group-focus-within:text-[#E65100] transition-colors">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Find your flavor treasure..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm font-bold placeholder:text-gray-300"
                />
                <button
                  onClick={() => navigate('/allFoods')}
                  className="bg-[#1a1a1a] text-white p-3 rounded-2xl hover:bg-[#E65100] transition-all"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8">
              <Link to="/allFoods">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#1a1a1a] text-[#fcf9f5] px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl"
                >
                  Explore Menu
                </motion.button>
              </Link>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#E65100] transition-colors">
                <Play size={14} fill="currentColor" /> Watch Crafting
              </button>
            </div>
          </div>

          {/* --- CENTER: MAIN ANIMATED PLATE --- */}
          <div className="relative w-full lg:w-6/12 flex justify-center items-center h-[400px] lg:h-[600px]">
            {/* Pulsing Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[350px] h-[350px] lg:w-[550px] lg:h-[550px] border border-dashed border-[#E65100]/30 rounded-full"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.2, rotate: 45 }}
                transition={{
                  duration: 1,
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                }}
                className="relative z-10 w-[320px] h-[320px] lg:w-[500px] lg:h-[500px]"
              >
                <div className="absolute inset-0 border-[16px] border-white rounded-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
                  <motion.img
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    src={foodItems[current].mainImg}
                    alt="Artisanal Food"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Rating Badge */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-white p-5 rounded-[2rem] shadow-2xl border border-orange-50 hidden lg:block"
                >
                  <div className="flex items-center gap-1 text-[#E65100] mb-1">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-tighter text-[#1a1a1a]">
                    5.0 Patron Rating
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* --- RIGHT: VERTICAL THUMBNAIL NAV --- */}
          <div className="flex flex-row lg:flex-col gap-5 justify-center">
            {foodItems.map((food, index) => (
              <motion.div
                key={food.id}
                whileHover={{
                  scale: 1.1,
                  x: window.innerWidth > 1024 ? -10 : 0,
                }}
                onClick={() => handleThumbnailClick(index)}
                className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-[1.5rem] overflow-hidden cursor-pointer border-2 transition-all p-1
                  ${current === index ? 'border-[#E65100] shadow-2xl' : 'border-transparent opacity-40 grayscale hover:grayscale-0'}`}
              >
                <img
                  src={food.thumbImg}
                  alt="thumb"
                  className="w-full h-full object-cover rounded-xl"
                />
                {current === index && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E65100] rounded-full"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action for Buy Now (Modern Side-action) */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
        <motion.button
          whileHover={{ x: -10 }}
          className="w-14 h-14 bg-white border border-black/5 rounded-2xl shadow-xl flex items-center justify-center text-[#1a1a1a] hover:bg-[#E65100] hover:text-white transition-all"
        >
          <ShoppingBag size={22} />
        </motion.button>
        <motion.button
          whileHover={{ x: -10 }}
          className="w-14 h-14 bg-white border border-black/5 rounded-2xl shadow-xl flex items-center justify-center text-[#E65100]"
        >
          <span className="font-black text-xs leading-none">HOT</span>
        </motion.button>
      </div>
    </section>
  );
};

export default FoodBanner;
