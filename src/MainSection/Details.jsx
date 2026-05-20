import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য
import { AuthContext } from '../Auth/AuthContext';
import { supabase } from '../supabase/supabaseClient';
import {
  Utensils,
  Star,
  Tag,
  Layers,
  User,
  ShoppingBag,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import Loading from '../Loading/Loading';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- SUPABASE DATA FETCHING ---
  useEffect(() => {
    const fetchFoodDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('foods')
          .select('*')
          .eq('id', id)
          .single();

        if (!error) setFood(data);
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodDetails();
  }, [id]);

  if (loading) return <Loading />;

  if (!food)
    return (
      <main
        className="h-screen flex items-center justify-center text-gray-400 font-black uppercase tracking-widest"
        role="alert"
      >
        Masterpiece Not Found.
      </main>
    );

  const available = food.is_available;
  const isOwnItem = user?.email === food.created_by_email;

  return (
    <main className="min-h-screen bg-[#fcf9f5] pt-32 pb-20 px-6 lg:px-20 relative overflow-hidden font-sans selection:bg-orange-100">
      {/* SEO: Dynamic Metadata */}
      <Helmet>
        <title>{food.name} | The Spice Slice Boutique</title>
        <meta
          name="description"
          content={
            food.description ||
            `Discover the artisanal flavors of ${food.name}. Hand-picked spices and artisanal preparation.`
          }
        />
        <meta property="og:image" content={food.image_url} />
      </Helmet>

      {/* Background Decor - Accessibility: aria-hidden */}
      <div
        className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="text-[25vw] font-black italic uppercase leading-none">
          Delicacy
        </div>
      </div>

      <article className="max-w-7xl mx-auto">
        {/* Back Navigation */}
        <Link
          to="/allFoods"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1a1a1a] transition-all mb-10 group"
          aria-label="Back to food gallery"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
            aria-hidden="true"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">
            Back to Gallery
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* --- LEFT: CINEMATIC IMAGE --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <figure className="aspect-square w-full rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white relative group">
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 1.5 }}
                src={food.image_url}
                alt={`Visual representation of ${food.name}`}
                className="w-full h-full object-cover"
                loading="eager" // Performance: হিরো ইমেজ হিসেবে দ্রুত লোড হবে
                decoding="async"
                width="600"
                height="600"
              />
              {/* Image Overlay Badges */}
              <div
                className="absolute top-10 left-10 flex gap-3"
                aria-label="Food tags"
              >
                {food.is_signature && (
                  <div className="bg-[#1a1a1a] text-white p-4 rounded-3xl shadow-2xl flex items-center gap-2">
                    <Star
                      size={16}
                      fill="#E65100"
                      className="text-[#E65100]"
                      aria-hidden="true"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Signature
                    </span>
                  </div>
                )}
                {food.discount > 0 && (
                  <div className="bg-[#E65100] text-white px-5 py-3 rounded-2xl shadow-2xl">
                    <span className="text-sm font-black italic">
                      {food.discount}% OFF
                    </span>
                  </div>
                )}
              </div>
            </figure>

            {/* Stats Summary */}
            <div
              className="mt-10 flex gap-10 px-10"
              role="group"
              aria-label="Food statistics"
            >
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Acquisitions
                </p>
                <p className="text-xl font-black text-[#1a1a1a]">
                  {food.purchase_count}+
                </p>
              </div>
              <div className="h-10 w-[1px] bg-black/5" aria-hidden="true" />
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Rating
                </p>
                <div
                  className="text-xl font-black text-[#1a1a1a] flex items-center gap-1 italic"
                  aria-label={`Rating ${food.rating || '4.9'} out of 5`}
                >
                  <Star
                    size={14}
                    fill="#E65100"
                    className="text-[#E65100]"
                    aria-hidden="true"
                  />{' '}
                  {food.rating || '4.9'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT: ARTISANAL DETAILS --- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-10"
          >
            <header>
              <div className="flex items-center gap-3 mb-4 text-[#E65100]">
                <Sparkles size={20} aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  The Artisanal Selection
                </span>
              </div>
              {/* SEO: h1 for main product title */}
              <h1 className="text-6xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none">
                {food.name}
              </h1>
            </header>

            <p className="text-gray-500 text-lg font-medium leading-relaxed italic border-l-4 border-[#E65100]/20 pl-8">
              {food.description ||
                'A masterfully spiced slice of perfection, crafted for the ultimate culinary journey. Each bite reveals the soul of traditional spices blended with modern precision.'}
            </p>

            {/* Delicacy Stats Grid */}
            <div
              className="grid grid-cols-2 gap-8 bg-white p-10 rounded-[3.5rem] border border-black/5 shadow-sm"
              role="list"
            >
              <InfoItem
                icon={<Layers size={18} aria-hidden="true" />}
                label="Category"
                value={food.category}
              />
              <InfoItem
                icon={<Utensils size={18} aria-hidden="true" />}
                label="Cuisine"
                value={food.cuisine || 'Global Fusion'}
              />
              <InfoItem
                icon={
                  <CheckCircle2
                    size={18}
                    className={available ? 'text-green-500' : 'text-red-500'}
                    aria-hidden="true"
                  />
                }
                label="Status"
                value={available ? 'In Kitchen' : 'Sold Out'}
              />
              <InfoItem
                icon={<User size={18} aria-hidden="true" />}
                label="Artisan"
                value={food.created_by_email?.split('@')[0]}
              />
            </div>

            {/* Price & Action */}
            <div className="flex flex-col sm:flex-row items-center gap-10 pt-10">
              <div
                className="flex flex-col leading-none"
                aria-label={`Price: ${food.price_usd} dollars`}
              >
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Value Amount
                </span>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-[#E65100] tracking-tighter italic">
                    ${food.price_usd}
                  </span>
                  {food.old_price_usd && (
                    <span
                      className="text-gray-300 text-xl line-through font-bold mb-1"
                      aria-label="Original price"
                    >
                      ${food.old_price_usd}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 w-full">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!available || isOwnItem}
                  onClick={() => navigate(`/orderNow/${food.id}`)}
                  className={`w-full py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl transition-all flex items-center justify-center gap-4 ${
                    !available || isOwnItem
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#1a1a1a] text-white hover:bg-[#E65100]'
                  }`}
                  aria-label={
                    isOwnItem
                      ? 'You cannot buy your own item'
                      : available
                        ? 'Authorize purchase of this masterpiece'
                        : 'Item out of stock'
                  }
                >
                  {isOwnItem
                    ? 'Your Masterpiece'
                    : available
                      ? 'Authorize Purchase'
                      : 'Exhausted Stock'}
                  <ShoppingBag size={18} aria-hidden="true" />
                </motion.button>

                {isOwnItem && (
                  <p
                    className="text-center text-[10px] font-bold text-orange-600 uppercase mt-4 tracking-widest animate-pulse"
                    aria-live="assertive"
                  >
                    Chef, you cannot buy your own creations.
                  </p>
                )}
              </div>
            </div>

            <div
              className="pt-10 flex items-center gap-3 text-green-600/50"
              aria-hidden="true"
            >
              <ShieldCheck size={16} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                End-to-End Secure Transaction
              </p>
            </div>
          </motion.div>
        </div>
      </article>
    </main>
  );
};

// --- Sub-component for Info Grid ---
const InfoItem = ({ icon, label, value }) => (
  <div className="flex flex-col gap-2" role="listitem">
    <div className="flex items-center gap-2 text-gray-300">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    <p className="text-sm font-bold text-[#1a1a1a] uppercase tracking-tight">
      {value}
    </p>
  </div>
);

export default Details;
