import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Crown,
  Star,
  CheckCircle2,
} from 'lucide-react';

const VIPClub = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = e => {
    e.preventDefault();
    // সাবস্ক্রিপশন লজিক এখানে হবে
    console.log('Subscribed:', email);
  };

  return (
    <section
      className="py-32 bg-[#fcf9f5] overflow-hidden font-sans"
      aria-labelledby="vip-club-heading"
    >
      <div className="container mx-auto px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-black/5"
        >
          {/* --- BACKGROUND DECOR --- */}
          {/* Accessibility: Decorative elements hidden from screen readers */}
          <div
            className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-50 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-50/50 rounded-full blur-[80px]" />
            <h2 className="absolute bottom-10 right-10 text-[15vw] font-black text-black/[0.01] leading-none select-none italic">
              ELITE
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center relative z-10">
            {/* --- LEFT SIDE: CONTENT (7 Columns) --- */}
            <div className="lg:col-span-7 p-10 lg:p-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-[#E65100]">
                  <div
                    className="p-2 bg-orange-100 rounded-xl"
                    aria-hidden="true"
                  >
                    <Crown size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                    The Patron Circle
                  </span>
                </div>

                <h2
                  id="vip-club-heading"
                  className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter leading-[0.9] uppercase italic"
                >
                  Savor the <br />
                  <span className="text-[#E65100] not-italic text-outline-light">
                    Privilege.
                  </span>
                </h2>

                <p className="text-gray-500 text-lg font-medium max-w-md leading-relaxed italic">
                  Join our inner circle of patrons. Receive private invitations
                  to seasonal tastings and secret menu releases before the world
                  knows.
                </p>

                {/* Luxury Subscription Form */}
                <div className="pt-6">
                  <form
                    onSubmit={handleSubscribe}
                    className="relative max-w-md group"
                  >
                    <div className="relative flex items-center bg-[#fcf9f5] border border-black/5 rounded-full p-2 shadow-inner focus-within:border-[#E65100]/30 transition-all">
                      <label htmlFor="vip-email" className="pl-6 text-gray-400">
                        <Mail size={18} aria-hidden="true" />
                        <span className="sr-only">Email Address</span>
                      </label>
                      <input
                        id="vip-email"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Digital Identity (Email)"
                        className="w-full bg-transparent border-none outline-none px-4 py-4 text-[#1a1a1a] font-bold text-sm placeholder:text-gray-300"
                        aria-label="Enter your email to join the VIP club"
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#1a1a1a] text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 hover:bg-[#E65100] transition-all"
                      >
                        Join <ArrowRight size={14} aria-hidden="true" />
                      </motion.button>
                    </div>
                  </form>
                </div>

                {/* Trust Badges */}
                <div
                  className="flex flex-wrap items-center gap-8 pt-4"
                  role="list"
                >
                  <div
                    className="flex items-center gap-2 text-green-600"
                    role="listitem"
                  >
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <p className="text-[9px] font-black uppercase tracking-widest">
                      Privacy Secured
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 text-gray-400"
                    role="listitem"
                  >
                    <Sparkles
                      size={16}
                      className="text-orange-400"
                      aria-hidden="true"
                    />
                    <p className="text-[9px] font-black uppercase tracking-widest">
                      Exclusive Perks
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 text-gray-400"
                    role="listitem"
                  >
                    <ShieldCheck
                      size={16}
                      className="text-blue-400"
                      aria-hidden="true"
                    />
                    <p className="text-[9px] font-black uppercase tracking-widest">
                      Verified Boutique
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* --- RIGHT SIDE: VISUAL (5 Columns) --- */}
            <div className="lg:col-span-5 h-full min-h-[500px] relative p-10 lg:p-0">
              <div className="relative h-full w-full lg:rounded-l-[4rem] overflow-hidden shadow-2xl border-l border-white/20">
                <motion.img
                  initial={{ scale: 1.2 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 2 }}
                  // Performance: Optimized image size and quality
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop"
                  alt="Elegant dining table setting in a luxury restaurant"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block opacity-40"
                  aria-hidden="true"
                />

                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md border border-white p-10 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] text-center min-w-[220px]"
                >
                  <Star
                    className="text-[#E65100] mx-auto mb-4 fill-[#E65100]"
                    size={32}
                    aria-hidden="true"
                  />
                  <p className="text-[#1a1a1a] font-black text-3xl tracking-tighter italic uppercase leading-none">
                    Limited
                  </p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                    Membership Slots
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .text-outline-light {
          -webkit-text-stroke: 1px #e65100;
          color: transparent;
        }
      `}</style>
    </section>
  );
};

export default VIPClub;
