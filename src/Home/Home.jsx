import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { supabase } from '../supabase/supabaseClient';
import Banner from '../Banner/Banner';
import MainSection from '../MainSection/MainSection';
import Goals from '../Goals/Goals';
import MapComponent from '../MapComponent/MapComponent';
import MenuSection from '../MenuSection/MenuSection';
import ChefsSection from '../ChefsSection/ChefsSection';
import PatronReviews from './PatronReviews';
import SpiceStory from './SpiceStory';
import VIPClub from './VIPClub';

const Home = () => {
  const [foods, setFoods] = useState([]); // ডিফল্ট খালি অ্যারে
  const [error, setError] = useState(null);

  // --- SCROLL PROGRESS BAR ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const fetchFoodsFromSupabase = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('foods')
          .select('*')
          .eq('is_approved', true)
          .order('purchase_count', { ascending: false });

        if (supabaseError) throw supabaseError;
        setFoods(data || []);
      } catch (err) {
        console.error('Supabase Error:', err.message);
        setError(err.message);
      }
    };

    fetchFoodsFromSupabase();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#fcf9f5] min-h-screen relative overflow-hidden transition-colors duration-700"
    >
      {/* --- TOP PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E65100] to-orange-400 origin-left z-[100] shadow-lg"
        style={{ scaleX }}
      />

      {/* --- 1. HERO BANNER (সাথে সাথে দেখা যাবে) --- */}
      <Banner />

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 space-y-40 py-32 relative z-10">
        {/* --- 2. SIGNATURE FOODS (শুধু এই অংশে ডাটা আসলে দেখাবে) --- */}
        <section>
          {foods.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
            >
              <MainSection foods={foods} />
            </motion.div>
          ) : (
            // যদি ডাটা লোড হতে সময় নেয়, তবে একটি ছোট সুন্দর টেক্সট বা গ্যাপ থাকবে
            <div className="h-20 flex items-center justify-center">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 animate-pulse">
                Authenticating Masterpieces...
              </p>
            </div>
          )}
        </section>

        {/* --- 3. বাকি সব সেকশন (সাথে সাথে রেন্ডার হবে) --- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Goals />
        </motion.div>

        <SpiceStory />

        <MenuSection />

        <VIPClub />

        <ChefsSection />

        <PatronReviews />

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group p-4 bg-white rounded-[4rem] shadow-2xl border border-black/5"
        >
          <div className="rounded-[3rem] overflow-hidden">
            <MapComponent />
          </div>
        </motion.div>
      </div>

      {/* Footer Decoration */}
      <div className="text-center pb-20 opacity-[0.03] select-none pointer-events-none">
        <h2 className="text-[15vw] font-black italic uppercase leading-none">
          Spice Slice.
        </h2>
      </div>
    </motion.div>
  );
};

export default Home;
