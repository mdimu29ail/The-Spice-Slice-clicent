import React from 'react';
import { motion } from 'framer-motion';
// cornerDownRight সরিয়ে ফেলা হয়েছে কারণ এটি ব্যবহৃত হয়নি এবং নাম ভুল ছিল
import { Flame, Leaf, Wind, Sparkles } from 'lucide-react';

const SpiceStory = () => {
  return (
    <section className="py-24 bg-[#fcf9f5] overflow-hidden font-sans">
      <div className="container mx-auto px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white rounded-[5rem] mx-2 lg:mx-0 p-10 lg:p-24 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden"
        >
          {/* --- BACKGROUND DECOR --- */}
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none select-none">
            <Flame size={500} className="text-[#E65100]" />
          </div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-orange-50 rounded-full blur-[100px] opacity-50" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* --- LEFT SIDE: CONTENT --- */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 text-[#E65100]">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  Our Heritage
                </span>
              </div>

              <h2 className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter leading-none italic uppercase">
                The Art of <br />
                <span className="text-[#E65100] not-italic">Hand-Ground.</span>
              </h2>

              <p className="text-gray-500 text-lg font-medium leading-relaxed italic border-l-4 border-orange-100 pl-8">
                We don't just cook; we curate. Every spice is hand-picked from
                organic farms and ground using traditional stone mills to
                preserve the soul of the flavor.
              </p>

              <div className="grid grid-cols-2 gap-10 pt-6">
                <div className="group cursor-default">
                  <div className="w-12 h-12 bg-[#fcf9f5] rounded-2xl flex items-center justify-center text-[#E65100] mb-4 group-hover:bg-[#1a1a1a] group-hover:text-white transition-all duration-500 shadow-sm">
                    <Leaf size={24} />
                  </div>
                  <h4 className="text-[#1a1a1a] font-black uppercase text-[10px] tracking-widest mb-1">
                    100% Organic
                  </h4>
                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-tighter">
                    Pure Earth Essence
                  </p>
                </div>

                <div className="group cursor-default">
                  <div className="w-12 h-12 bg-[#fcf9f5] rounded-2xl flex items-center justify-center text-[#E65100] mb-4 group-hover:bg-[#1a1a1a] group-hover:text-white transition-all duration-500 shadow-sm">
                    <Wind size={24} />
                  </div>
                  <h4 className="text-[#1a1a1a] font-black uppercase text-[10px] tracking-widest mb-1">
                    Fresh Aroma
                  </h4>
                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-tighter">
                    Natural Fragrance
                  </p>
                </div>
              </div>
            </motion.div>

            {/* --- RIGHT SIDE: VISUAL --- */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden border-[15px] border-[#fcf9f5] shadow-2xl relative group">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1.5 }}
                  src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=1974&auto=format&fit=crop"
                  alt="Artisanal Spices"
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#E65100]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md p-10 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-white min-w-[200px]"
              >
                <p className="text-5xl font-black text-[#1a1a1a] italic tracking-tighter leading-none mb-2">
                  24<span className="text-[#E65100]">+</span>
                </p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  Secret Blends
                </p>
                <div className="mt-4 h-1 w-12 bg-[#E65100] rounded-full" />
              </motion.div>

              <div className="absolute -top-6 -right-6 text-orange-200 animate-pulse">
                <Sparkles size={48} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SpiceStory;
