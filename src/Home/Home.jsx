import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainSection from '../MainSection/MainSection';
import Banner from '../Banner/Banner';
import Goals from '../Goals/Goals';
import MapComponent from '../MapComponent/MapComponent';
import MenuSection from '../MenuSection/MenuSection';
import ChefsSection from '../ChefsSection/ChefsSection';
import Loading from '../Loading/Loading';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API Fetch inside useEffect to avoid "Failed to Fetch" crash
    fetch('https://spice-slice-server-lac.vercel.app/foods')
      .then(res => {
        if (!res.ok) throw new Error('Server not responding');
        return res.json();
      })
      .then(data => {
        setFoods(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#fafafa] dark:bg-[#0c0c0c] transition-colors duration-500"
    >
      <Banner />

      <div className="w-11/12 mx-auto space-y-24 py-20">
        {/* Main Section with Animation Wrapper */}
        <section>
          {error ? (
            <div className="text-center py-10 text-red-500">
              Failed to load foods. Please check your connection.
            </div>
          ) : (
            <MainSection foods={foods}></MainSection>
          )}
        </section>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <Goals />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <MenuSection />
        </motion.div>

        <ChefsSection />

        <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
          <MapComponent />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
