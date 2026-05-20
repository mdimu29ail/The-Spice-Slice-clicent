import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { supabase } from '../../supabase/supabaseClient'; // Ensure this path is correct
import ShowAllFoods from './ShowAllFoods';
import Loading from '../../Loading/Loading';
import { Sparkles, Archive, Search, SlidersHorizontal } from 'lucide-react';

const AllFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. LUXURY SCROLL PROGRESS ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // --- 2. SUPABASE DATA ENGINE ---
  useEffect(() => {
    const fetchBoutiqueArchive = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('foods')
          .select('*')
          .eq('is_approved', true) // Only show approved masterpieces
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;
        setFoods(data || []);
      } catch (err) {
        console.error('Boutique Vault Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoutiqueArchive();
  }, []);

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#fcf9f5] pt-32 pb-20 relative overflow-hidden font-sans"
    >
      {/* --- ELITE PROGRESS INDICATOR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E65100] to-orange-400 origin-left z-[100] shadow-lg"
        style={{ scaleX }}
      />

      {/* --- BACKGROUND WATERMARK --- */}
      <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none z-0">
        <h1 className="text-[28vw] font-black italic uppercase leading-none mt-20 text-[#1a1a1a]">
          Archive
        </h1>
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        {/* --- MAIN GALLERY SECTION --- */}
        <section className="relative">
          {error ? (
            <div className="py-24 text-center bg-white rounded-[4rem] border border-red-100">
              <p className="text-red-500 font-black tracking-widest uppercase italic">
                Vault Access Interrupted: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 text-[10px] font-black uppercase underline decoration-[#E65100] underline-offset-4"
              >
                Retry Authentication
              </button>
            </div>
          ) : (
            <ShowAllFoods foods={foods} />
          )}
        </section>
      </div>

      {/* Floating Sparkle Decoration */}
      <div className="absolute bottom-20 left-10 hidden xl:block opacity-20 rotate-12">
        <Sparkles size={64} className="text-[#E65100] animate-pulse" />
      </div>
    </motion.div>
  );
};

export default AllFoods;
