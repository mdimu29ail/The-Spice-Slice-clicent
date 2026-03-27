import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Flame } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fcf9f5] overflow-hidden">
      {/* --- ANIMATED ICON SECTION --- */}
      <div className="relative mb-8">
        {/* Floating Background Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-orange-200 blur-[50px] rounded-full"
        />

        {/* Main Icon Animation (Sizzling Effect) */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 w-24 h-24 bg-[#1a1a1a] rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <UtensilsCrossed size={40} className="text-[#E65100]" />

          {/* Animated Sparks/Flame */}
          <motion.div
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              y: [-10, -40],
            }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="absolute -top-2"
          >
            <Flame size={24} className="text-orange-500 fill-orange-500" />
          </motion.div>
        </motion.div>
      </div>

      {/* --- TEXT REVEAL ANIMATION --- */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-black tracking-[0.3em] text-[#1a1a1a] uppercase mb-2"
        >
          The <span className="text-[#E65100]">Spice</span> Slice
        </motion.h2>

        <div className="flex justify-center gap-1">
          {['S', 'I', 'Z', 'Z', 'L', 'I', 'N', 'G'].map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: index * 0.1,
              }}
              className="text-[10px] font-bold text-orange-800/60 tracking-widest"
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>

      {/* --- PROGRESS LINE --- */}
      <div className="absolute bottom-20 w-48 h-[2px] bg-black/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full bg-gradient-to-r from-transparent via-[#E65100] to-transparent"
        />
      </div>

      {/* Decorative Corner Text */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <p className="text-[10px] font-black tracking-[0.5em] text-black/10 uppercase rotate-90 origin-right">
          Preparing Perfection
        </p>
      </div>
    </div>
  );
};

export default Loading;
