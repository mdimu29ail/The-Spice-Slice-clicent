import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য
import { supabase } from '../../supabase/supabaseClient';
import Loading from '../../Loading/Loading';
import { Sparkles } from 'lucide-react';

// Performance: ShowAllFoods কম্পোনেন্টটি Lazy Load করা হয়েছে
const ShowAllFoods = lazy(() => import('./ShowAllFoods'));

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
  const fetchBoutiqueArchive = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('foods')
        .select('*')
        .eq('is_approved', true)
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

  useEffect(() => {
    fetchBoutiqueArchive();
  }, []);

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#fcf9f5] pt-32 pb-20 relative overflow-hidden font-sans selection:bg-orange-100">
      {/* SEO: Page Metadata */}
      <Helmet>
        <title>Full Menu Archive | The Spice Slice Boutique</title>
        <meta
          name="description"
          content="Explore the complete archive of The Spice Slice. Discover our full collection of artisanal pizzas, biryanis, and gourmet burgers."
        />
        <meta
          property="og:title"
          content="Full Menu Archive | The Spice Slice"
        />
        <meta
          property="og:description"
          content="Browse our curated collection of signature delicacies."
        />
      </Helmet>

      {/* --- ELITE PROGRESS INDICATOR --- */}
      {/* Accessibility: Progress bar roles added */}
      <motion.div
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuemin="0"
        aria-valuemax="100"
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E65100] to-orange-400 origin-left z-[100] shadow-lg"
        style={{ scaleX }}
      />

      {/* --- BACKGROUND WATERMARK --- */}
      {/* Accessibility: aria-hidden="true" added to decorative text */}
      <div
        className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <h2 className="text-[28vw] font-black italic uppercase leading-none mt-20 text-[#1a1a1a]">
          Archive
        </h2>
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        {/* --- MAIN GALLERY SECTION --- */}
        <section aria-label="Food Gallery Archive">
          {error ? (
            <div
              className="py-24 text-center bg-white rounded-[4rem] border border-red-100"
              role="alert"
            >
              <p className="text-red-500 font-black tracking-widest uppercase italic">
                Vault Access Interrupted: {error}
              </p>
              <button
                type="button"
                onClick={fetchBoutiqueArchive}
                className="mt-6 text-[10px] font-black uppercase underline decoration-[#E65100] underline-offset-4 hover:text-[#E65100] transition-colors"
                aria-label="Retry fetching food data"
              >
                Retry Authentication
              </button>
            </div>
          ) : (
            <Suspense fallback={<Loading />}>
              <ShowAllFoods foods={foods} />
            </Suspense>
          )}
        </section>
      </div>

      {/* Floating Sparkle Decoration */}
      {/* Accessibility: aria-hidden="true" added */}
      <div
        className="absolute bottom-20 left-10 hidden xl:block opacity-20 rotate-12"
        aria-hidden="true"
      >
        <Sparkles size={64} className="text-[#E65100] animate-pulse" />
      </div>
    </main>
  );
};

export default AllFoods;
