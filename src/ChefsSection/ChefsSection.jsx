import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

const chefsData = [
  {
    id: '1',
    name: 'Robert John',
    title: 'Executive Chef',
    image:
      'https://i.ibb.co/4vFbZCV/Whats-App-Image-2025-06-12-at-01-49-58-7237b35a.jpg',
    socials: { facebook: '#', twitter: '#', instagram: '#' },
  },
  {
    id: '2',
    name: 'Harnis Joe',
    title: 'Cuisine Specialist',
    image:
      'https://i.ibb.co/DfLgmMJc/Whats-App-Image-2025-06-12-at-01-49-58-6d45a8e4.jpg',
    socials: { facebook: '#', twitter: '#', instagram: '#' },
  },
  {
    id: '3',
    name: 'Merry Joe',
    title: 'Pastry Artisan',
    image:
      'https://i.ibb.co/nqfXhRth/Whats-App-Image-2025-06-12-at-01-49-59-d0cc0e02.jpg',
    socials: { facebook: '#', twitter: '#', instagram: '#' },
  },
  {
    id: '4',
    name: 'Alison Bergt',
    title: 'Kitchen Supervisor',
    image:
      'https://i.ibb.co/Z4k5jYb/Whats-App-Image-2025-06-12-at-01-50-00-25a0f839.jpg',
    socials: { facebook: '#', twitter: '#', instagram: '#' },
  },
];

const SocialIcons = {
  Facebook: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Instagram: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  Twitter: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
};

const ChefsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="py-32 bg-[#fcf9f5] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20">
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 mb-6 bg-orange-100/50 px-4 py-1.5 rounded-full"
          >
            <Sparkles size={14} className="text-[#E65100]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E65100]">
              The Masterminds
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter leading-none italic uppercase"
          >
            Culinary{' '}
            <span className="text-[#E65100] not-italic">Artisans.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-6 text-gray-400 max-w-lg text-sm font-medium uppercase tracking-widest leading-relaxed"
          >
            Our chefs are trained specifically to translate passion into every
            masterpiece served at your table.
          </motion.p>
        </div>

        {/* --- CHEFS GRID --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
        >
          {chefsData.map(chef => (
            <motion.div
              key={chef.id}
              variants={cardVariants}
              className="flex flex-col items-center group"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl border-[10px] border-white group-hover:border-[#E65100]/10 transition-all duration-700">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[#1a1a1a]/10 group-hover:bg-transparent transition-all duration-500" />

                <motion.img
                  src={chef.image}
                  alt={chef.name}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />

                {/* Social Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out backdrop-blur-sm">
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2 opacity-60">
                    Connect With Artisan
                  </p>
                  <div className="flex gap-4">
                    {['Facebook', 'Instagram', 'Twitter'].map((platform, i) => {
                      const Icon = SocialIcons[platform];
                      return (
                        <motion.a
                          key={i}
                          href="#"
                          whileHover={{
                            scale: 1.2,
                            backgroundColor: '#E65100',
                          }}
                          className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 transition-colors"
                        >
                          <Icon />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                {/* Quote Icon Badge */}
                <div className="absolute top-6 right-6 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#E65100] shadow-xl group-hover:rotate-12 transition-transform">
                  <Quote size={18} fill="currentColor" className="opacity-20" />
                </div>
              </div>

              {/* Text Info */}
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tighter leading-none mb-1 group-hover:text-[#E65100] transition-colors">
                  {chef.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] w-4 bg-[#E65100]"></div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">
                    {chef.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ChefsSection;
