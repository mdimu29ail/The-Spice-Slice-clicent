import React, { useEffect, useState, lazy, Suspense } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য
import { supabase } from '../supabase/supabaseClient';

// --- COMPONENTS IMPORT ---
import Banner from '../Banner/Banner';
import MainSection from '../MainSection/MainSection';
import Goals from '../Goals/Goals';

// Performance: নিচের সেকশনগুলো Lazy Load করা হয়েছে যাতে প্রথম লোডিং ফাস্ট হয় (LCP improve)
const MapComponent = lazy(() => import('../MapComponent/MapComponent'));
const MenuSection = lazy(() => import('../MenuSection/MenuSection'));
const ChefsSection = lazy(() => import('../ChefsSection/ChefsSection'));
const PatronReviews = lazy(() => import('./PatronReviews'));
const SpiceStory = lazy(() => import('./SpiceStory'));
const VIPClub = lazy(() => import('./VIPClub'));

const Home = () => {
  const [foods, setFoods] = useState([]);
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
        setError(err.message);
      }
    };

    fetchFoodsFromSupabase();
  }, []);

  return (
    <React.Fragment>
      {/* SEO: মেটা ট্যাগ এবং টাইটেল অপ্টিমাইজেশন */}
      <Helmet>
        <title>The Spice Slice | Authentic Boutique Restaurant</title>
        <meta
          name="description"
          content="Experience the finest hand-ground spices and artisanal masterpieces at The Spice Slice. Order your favorite signature pizza, biryani, and burgers."
        />
        <meta
          name="keywords"
          content="restaurant, spicy food, boutique kitchen, pizza, biryani, gourmet"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#fcf9f5] min-h-screen relative overflow-hidden transition-colors duration-700"
      >
        {/* Accessibility: Progress bar এর জন্য ARIA label যোগ করা হয়েছে */}
        <motion.div
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuemin="0"
          aria-valuemax="100"
          className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E65100] to-orange-400 origin-left z-[100] shadow-lg"
          style={{ scaleX }}
        />

        {/* 1. HERO BANNER */}
        <header>
          <Banner />
        </header>

        {/* MAIN CONTENT CONTAINER */}
        <main className="max-w-[1400px] mx-auto px-6 lg:px-12 space-y-40 py-32 relative z-10">
          {/* 2. SIGNATURE FOODS */}
          <section aria-labelledby="signature-foods-heading">
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
              <div
                className="h-20 flex items-center justify-center"
                aria-live="polite"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 animate-pulse">
                  Authenticating Masterpieces...
                </p>
              </div>
            )}
          </section>

          {/* 3. GOALS SECTION */}
          <section>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Goals />
            </motion.div>
          </section>

          {/* Performance: Lazy loaded components wrapped in Suspense */}
          <Suspense fallback={<div className="h-20" />}>
            <section>
              <SpiceStory />
            </section>
            <section>
              <MenuSection />
            </section>
            <section>
              <VIPClub />
            </section>
            <section>
              <ChefsSection />
            </section>
            <section>
              <PatronReviews />
            </section>

            <section className="relative group p-4 bg-white rounded-[4rem] shadow-2xl border border-black/5">
              <div className="rounded-[3rem] overflow-hidden">
                <MapComponent />
              </div>
            </section>
          </Suspense>
        </main>

        {/* SEO & Branding: Semantic footer tag */}
        <footer className="text-center pb-20 opacity-[0.03] select-none pointer-events-none">
          <h2 className="text-[15vw] font-black italic uppercase leading-none">
            Spice Slice.
          </h2>
        </footer>
      </motion.div>
    </React.Fragment>
  );
};

export default Home;
