import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, Sparkles, ChevronRight } from 'lucide-react';

const Goals = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <section
      className="bg-[#fcf9f5] py-24 lg:py-32 overflow-hidden font-sans"
      aria-labelledby="goals-heading"
    >
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* --- LEFT SIDE: THE BIG VISION IMAGE --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full lg:w-1/2 relative group"
          >
            {/* Accessibility: Decorative border hidden from screen readers */}
            <div
              className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-[#E65100]/20 rounded-tl-[4rem] group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700"
              aria-hidden="true"
            />

            <div className="relative h-[500px] lg:h-[700px] w-full rounded-[4rem] rounded-tr-none overflow-hidden shadow-2xl">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5 }}
                src="https://i.ibb.co/Q7mwcDJz/h4-img-01.jpg"
                alt="Interior of The Spice Slice boutique restaurant showing artisanal heritage decor"
                className="h-full w-full object-cover"
                loading="lazy" // Performance: Lazy loading
                decoding="async" // Performance: Async decoding
                width="800" // Performance: Layout shift prevention
                height="1000"
              />
              {/* Image Overlay Label */}
              <div className="absolute bottom-10 right-0 bg-[#1a1a1a] text-white px-10 py-6 rounded-l-full shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E65100]">
                  Est. 2024
                </p>
                <p className="text-xl font-black italic tracking-tighter">
                  Artisanal Heritage.
                </p>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT SIDE: MISSION & SCHEDULE --- */}
          <div className="w-full lg:w-1/2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Header */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3 mb-6"
              >
                <Target
                  className="text-[#E65100]"
                  size={20}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
                  Our Essence
                </span>
              </motion.div>

              <h2
                id="goals-heading"
                className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter leading-none italic uppercase mb-8"
              >
                <motion.span variants={fadeInUp} className="block">
                  Defining the
                </motion.span>
                <motion.span
                  variants={fadeInUp}
                  className="text-[#E65100] not-italic"
                >
                  Spice Standard.
                </motion.span>
              </h2>

              <motion.p
                variants={fadeInUp}
                className="text-gray-500 text-lg font-medium leading-relaxed mb-10 max-w-xl"
              >
                Our goal is to redefine flavor boundaries. We connect food
                connoisseurs with artisanal cuisines, blending local traditions
                with modern culinary precision to create every slice as a
                masterpiece.
              </motion.p>

              <motion.button
                variants={fadeInUp}
                whileHover={{ x: 10 }}
                className="group flex items-center gap-4 bg-[#1a1a1a] text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#E65100] transition-all shadow-xl"
                aria-label="Read the full story about our goals and mission"
              >
                The Full Story{' '}
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </motion.button>

              {/* SCHEDULE SECTION (AS SUB-CARD) */}
              <motion.div
                variants={fadeInUp}
                className="mt-20 flex flex-col sm:flex-row items-center gap-10 bg-white p-8 rounded-[3rem] shadow-sm border border-black/5"
              >
                <div className="w-40 h-40 flex-shrink-0 rounded-3xl overflow-hidden shadow-lg">
                  <img
                    src="https://i.ibb.co/Y4LNTsXT/h5-img4.jpg"
                    alt="Chef preparing hand-ground spices in the kitchen"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                    decoding="async"
                    width="160"
                    height="160"
                  />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-4 text-[#E65100]">
                    <Clock size={16} aria-hidden="true" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">
                      Spice Schedule
                    </h3>
                  </div>
                  <div
                    className="space-y-2"
                    role="list"
                    aria-label="Opening hours"
                  >
                    <div
                      className="flex justify-between border-b border-black/5 pb-1"
                      role="listitem"
                    >
                      <span className="text-xs font-bold text-gray-400 uppercase">
                        Mon – Thu
                      </span>
                      <span className="text-sm font-black text-[#1a1a1a]">
                        10am – 1am
                      </span>
                    </div>
                    <div
                      className="flex justify-between border-b border-black/5 pb-1"
                      role="listitem"
                    >
                      <span className="text-xs font-bold text-gray-400 uppercase">
                        Fri – Sat
                      </span>
                      <span className="text-sm font-black text-[#1a1a1a]">
                        10am – 2am
                      </span>
                    </div>
                    <div className="flex justify-between" role="listitem">
                      <span className="text-xs font-bold text-gray-400 uppercase">
                        Sunday
                      </span>
                      <span className="text-sm font-black text-[#E65100]">
                        10am – 5pm
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Background Text (Floating) */}
      <div
        className="absolute top-[10%] left-0 opacity-[0.03] select-none pointer-events-none hidden lg:block"
        aria-hidden="true"
      >
        <h2 className="text-[20vw] font-black leading-none uppercase italic">
          Mission.
        </h2>
      </div>
    </section>
  );
};

export default Goals;
