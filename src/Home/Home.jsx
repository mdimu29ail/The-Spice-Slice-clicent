import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { supabase } from '../supabase/supabaseClient';
import Banner from '../Banner/Banner';
import MainSection from '../MainSection/MainSection';
import Goals from '../Goals/Goals';
import MapComponent from '../MapComponent/MapComponent';
import MenuSection from '../MenuSection/MenuSection';
import ChefsSection from '../ChefsSection/ChefsSection';
import Loading from '../Loading/Loading';
import Panna from '../Banner/Panna'; // আপনার ডেকোরেটিভ এলিমেন্ট
import PatronReviews from './PatronReviews';
import SpiceStory from './SpiceStory';
import VIPClub from './VIPClub';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. ADVANCED SCROLL ANIMATIONS ---
  const { scrollYProgress } = useScroll();

  // Smooth Progress Bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax effect for background elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const fetchFoodsFromSupabase = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('foods')
          .select('*')
          .order('purchase_count', { ascending: false });

        if (supabaseError) throw supabaseError;
        setFoods(data || []);
      } catch (err) {
        console.error('Supabase Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodsFromSupabase();
  }, []);

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#fcf9f5] min-h-screen relative overflow-hidden transition-colors duration-700 selection:bg-orange-200"
    >
      {/* --- FLOATING DECORATIVE BACKGROUND --- */}

      {/* --- TOP SCROLL PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E65100] to-orange-400 origin-left z-[70] shadow-lg"
        style={{ scaleX }}
      />

      {/* --- 1. HERO BANNER --- */}
      <Banner />

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 space-y-40 py-32 relative z-10">
        {/* --- 2. SIGNATURE FOODS (MAIN SECTION) --- */}
        <section>
          {error ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="text-center py-24 bg-white/50 backdrop-blur-md rounded-[4rem] border border-red-100 shadow-xl"
            >
              <p className="text-red-500 font-black tracking-tighter text-2xl italic uppercase">
                Collection Interrupted.
              </p>
              <p className="text-gray-400 text-sm mt-2">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <MainSection foods={foods} />
            </motion.div>
          )}
        </section>

        {/* --- 3. BOUTIQUE GOALS --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/30 backdrop-blur-2xl rounded-[5rem] p-16 border border-white/40 shadow-sm relative overflow-hidden"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-50" />
          <Goals />
        </motion.div>

        {/* --- 4. THE MENU MASTERLIST --- */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <MenuSection />
        </motion.div>

        {/* --- 5. ARTISANAL CHEFS --- */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <ChefsSection />
        </motion.div>

        {/* --- 6. BOUTIQUE LOCATION (MAP) --- */}
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group p-4 bg-white rounded-[4rem] shadow-2xl border border-black/5"
        >
          <div className="rounded-[3rem] overflow-hidden">
            <MapComponent />
          </div>
          {/* Map Label Overlay */}
          <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl hidden md:block border border-orange-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#E65100]">
              Visit the Boutique
            </p>
            <p className="text-sm font-black text-[#1a1a1a]">
              Dhaka, Bangladesh
            </p>
          </div>
        </motion.div>
      </div>

      {/* --- 7. LARGE DECORATIVE FOOTER BRANDING --- */}
      <PatronReviews />
      <SpiceStory />
      <VIPClub />
    </motion.div>
  );
};

export default Home;
