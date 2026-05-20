import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase/supabaseClient';
import {
  Star,
  Flame,
  Diamond,
  ChevronRight,
  Zap,
  UtensilsCrossed,
  Camera,
} from 'lucide-react';
import Loading from '../Loading/Loading';
import { useNavigate } from 'react-router-dom';

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('All Masterpieces');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = [
    {
      name: 'All Masterpieces',
      filter: 'all',
      icon: <UtensilsCrossed size={14} />,
    },
    { name: '🔥 Signature', filter: 'is_signature', icon: <Star size={14} /> },
    { name: '💎 Premium', filter: 'is_premium', icon: <Diamond size={14} /> },
    { name: '🌶️ Spicy', filter: 'is_spicy', icon: <Flame size={14} /> },
    { name: '🍕 Pizza', filter: 'Pizza', type: 'category' },
    { name: '🍛 Biryani', filter: 'Biryani', type: 'category' },
    { name: '🍔 Burger', filter: 'Burger', type: 'category' },
    { name: '🍹 Drinks', filter: 'Drinks', type: 'category' },
  ];

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('foods').select('*');
      if (!error && data) {
        setMenuItems(data);
      }
      setLoading(false);
    };
    fetchMenuData();
  }, []);

  const getFilteredItems = () => {
    const currentTab = tabs.find(t => t.name === activeTab);
    if (currentTab.filter === 'all') return menuItems;
    if (currentTab.type === 'category') {
      return menuItems.filter(item => item.category === currentTab.filter);
    }
    return menuItems.filter(item => item[currentTab.filter] === true);
  };

  const filteredItems = getFilteredItems();

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <section className="py-24 bg-[#fcf9f5] relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-10 left-10 opacity-[0.02] pointer-events-none select-none">
        <h2 className="text-[12vw] font-black leading-none uppercase italic text-[#1a1a1a]">
          Archive
        </h2>
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        {/* --- SECTION HEADER --- */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Zap size={14} className="text-[#E65100] fill-[#E65100]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#E65100]">
              Boutique Selection
            </span>
          </motion.div>
          <h2 className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter italic uppercase leading-none">
            Signature{' '}
            <span className="text-[#E65100] not-italic">Treasures.</span>
          </h2>
        </div>

        {/* --- LUXURY TAB NAVIGATION --- */}
        <div className="flex justify-center mb-20 overflow-x-auto pb-6 no-scrollbar">
          <div className="flex bg-white/80 backdrop-blur-xl p-2 rounded-[2rem] border border-black/5 shadow-2xl min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`relative px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all duration-500 rounded-full
                  ${activeTab === tab.name ? 'text-white' : 'text-gray-400 hover:text-black'}
                `}
              >
                <span className="relative z-10">{tab.name}</span>
                {activeTab === tab.name && (
                  <motion.div
                    layoutId="menuTabPill"
                    className="absolute inset-0 bg-[#1a1a1a] rounded-full shadow-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- MENU LIST GRID --- */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {filteredItems.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-12"
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => navigate(`/foods/${item.id}`)}
                    className="group flex gap-6 items-center border-b border-black/5 pb-8 hover:border-[#E65100]/30 transition-all cursor-pointer"
                  >
                    {/* --- SMALL BOUTIQUE IMAGE --- */}
                    <div className="relative w-20 h-20 lg:w-24 lg:h-24 shrink-0 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl group-hover:rotate-3 transition-transform duration-500">
                      <img
                        src={item.image_url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={item.name}
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    </div>

                    {/* --- CONTENT AREA --- */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight group-hover:text-[#E65100] transition-colors leading-none">
                              {item.name}
                            </h3>
                            {item.is_spicy && (
                              <Flame
                                size={14}
                                className="text-red-500 fill-red-500 animate-pulse"
                              />
                            )}
                          </div>
                          <p className="text-gray-400 text-[10px] font-bold leading-relaxed italic uppercase tracking-wider line-clamp-1">
                            {item.description ||
                              'Artisanal preparation with boutique spices.'}
                          </p>
                        </div>

                        {/* Price Area */}
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-xl font-black text-[#1a1a1a] tracking-tighter italic">
                            ${item.price_usd}
                          </span>
                          {item.old_price_usd && (
                            <span className="text-[10px] text-gray-300 line-through font-bold italic tracking-tighter">
                              ${item.old_price_usd}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tags Bar */}
                      <div className="flex gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {item.is_signature && (
                          <span className="text-[8px] font-black uppercase text-[#E65100] tracking-widest border border-[#E65100]/20 px-2 py-0.5 rounded-md">
                            Signature
                          </span>
                        )}
                        {item.is_premium && (
                          <span className="text-[8px] font-black uppercase text-blue-500 tracking-widest border border-blue-100 px-2 py-0.5 rounded-md">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 opacity-20"
              >
                <UtensilsCrossed size={64} strokeWidth={1} />
                <p className="mt-4 font-black uppercase tracking-[0.4em] text-xs">
                  Selection coming soon
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- VIEW ALL ACTION --- */}
        <div className="mt-24 flex justify-center">
          <motion.button
            onClick={() => navigate('/allFoods')}
            whileHover={{ scale: 1.05 }}
            className="group flex items-center gap-6 bg-[#1a1a1a] text-white px-10 py-5 rounded-full shadow-2xl hover:bg-[#E65100] transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Explore Full Archive
            </span>
            <ChevronRight
              size={18}
              className="group-hover:translate-x-2 transition-transform"
            />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
