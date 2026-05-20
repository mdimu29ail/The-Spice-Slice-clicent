import React, { useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য
import { supabase } from '../supabase/supabaseClient';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';
import {
  Trash2,
  Edit3,
  Eye,
  Plus,
  UtensilsCrossed,
  Package,
  Flame,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Loading from '../Loading/Loading';

const MyFoods = () => {
  const { user } = useContext(AuthContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Performance: useCallback ব্যবহার করে ফাংশন মেমোইজ করা হয়েছে
  const fetchMyFoods = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('created_by_email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFoods(data || []);
    } catch (error) {
      console.error('Error fetching foods:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchMyFoods();

    const channel = supabase
      .channel('realtime-food-sales')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'foods' },
        payload => {
          setFoods(prevFoods =>
            prevFoods.map(food =>
              food.id === payload.new.id ? payload.new : food,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMyFoods]);

  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Delete Masterpiece?',
      text: 'This artisanal creation will be permanently erased.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      cancelButtonColor: '#E65100',
      confirmButtonText: 'Confirm Deletion',
      background: '#fcf9f5',
      customClass: {
        popup: 'rounded-[2.5rem] border border-black/5 shadow-2xl',
      },
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('foods').delete().eq('id', id);
      if (!error) {
        setFoods(prev => prev.filter(food => food.id !== id));
        Swal.fire({
          title: 'Erased',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#fcf9f5',
          customClass: { popup: 'rounded-[2rem]' },
        });
      }
    }
  };

  if (loading)
    return (
      <div
        className="h-96 flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loading />
        <span className="sr-only">Loading your creations...</span>
      </div>
    );

  return (
    <main className="space-y-10 pb-10 font-sans selection:bg-orange-100">
      {/* SEO: Page Metadata */}
      <Helmet>
        <title>My Creations | The Spice Slice Boutique</title>
        <meta
          name="description"
          content="Manage and curate your personal collection of artisanal food masterpieces at The Spice Slice."
        />
      </Helmet>

      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-black/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#E65100] mb-2">
            <Sparkles size={16} aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Identity Vault
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none">
            My <span className="text-[#E65100] not-italic">Creations.</span>
          </h1>
        </div>

        <Link to="/dashboard/addFoods" aria-label="Add a new food delicacy">
          <motion.button
            type="button" // Best Practice
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1a1a1a] text-white px-8 py-4 rounded-2xl shadow-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-[#E65100] transition-all"
          >
            <Plus size={16} aria-hidden="true" /> New Delicacy
          </motion.button>
        </Link>
      </header>

      {/* --- FOODS GRID --- */}
      <section aria-label="Your food masterpieces grid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {foods.length > 0 ? (
              foods.map((food, index) => (
                <motion.article
                  key={food.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.3 },
                  }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-black/5 flex flex-col hover:shadow-2xl transition-all duration-500"
                >
                  {/* --- 1. IMAGE SECTION --- */}
                  <figure className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                      src={food.image_url}
                      alt={`Visual of ${food.name}`} // SEO: Descriptive alt
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                      loading="lazy" // Performance
                      decoding="async" // Performance
                      width="400" // Performance: Layout shift prevention
                      height="208"
                    />

                    {/* PRICE BADGE */}
                    <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl shadow-xl border border-white/40">
                      <span className="text-lg font-black text-[#1a1a1a] tracking-tighter italic">
                        ${food.price_usd.toFixed(2)}
                      </span>
                    </div>

                    {/* Live Status */}
                    <div
                      className={`absolute top-4 right-4 px-3 py-1.5 backdrop-blur-md rounded-xl shadow-lg border flex items-center gap-1.5 ${food.is_approved ? 'bg-green-500/10 text-green-600 border-green-200' : 'bg-orange-500/10 text-orange-600 border-orange-200'}`}
                    >
                      {food.is_approved ? (
                        <CheckCircle2 size={10} aria-hidden="true" />
                      ) : (
                        <Clock
                          size={10}
                          className="animate-pulse"
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-[9px] font-black uppercase tracking-tighter">
                        {food.is_approved ? 'Live' : 'Pending'}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-lg border border-white/50 shadow-sm">
                      <p className="text-[8px] font-black text-[#1a1a1a] uppercase tracking-widest">
                        {food.category}
                      </p>
                    </div>
                  </figure>

                  {/* --- 2. CONTENT SECTION --- */}
                  <div className="p-7 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tighter group-hover:text-[#E65100] transition-colors truncate mb-4">
                      {food.name}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 p-2 bg-[#fcf9f5] rounded-xl border border-black/5">
                        <Package
                          size={12}
                          className="text-blue-500"
                          aria-hidden="true"
                        />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                          {food.quantity} Stock
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#fcf9f5] rounded-xl border border-black/5">
                        <Flame
                          size={12}
                          className="text-orange-500"
                          aria-hidden="true"
                        />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                          {food.purchase_count} Sales
                        </span>
                      </div>
                    </div>

                    {/* Actions Suite */}
                    <nav
                      className="flex gap-2 pt-6 border-t border-black/5 mt-auto"
                      aria-label="Food actions"
                    >
                      <Link to={`/foods/${food.id}`} className="flex-1">
                        <button
                          type="button"
                          className="w-full py-3 bg-[#fcf9f5] text-[#1a1a1a] rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-white transition-all"
                          aria-label={`View details for ${food.name}`}
                        >
                          <Eye size={14} aria-hidden="true" /> View
                        </button>
                      </Link>

                      <Link
                        to={`/admin/update-food/${food.id}`}
                        aria-label={`Edit ${food.name}`}
                      >
                        <button
                          type="button"
                          className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <Edit3 size={16} aria-hidden="true" />
                        </button>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(food.id)}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        aria-label={`Delete ${food.name}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </motion.article>
              ))
            ) : (
              <div
                className="col-span-full py-32 flex flex-col items-center justify-center opacity-30 text-center"
                role="status"
              >
                <UtensilsCrossed
                  size={48}
                  strokeWidth={1}
                  className="mb-4"
                  aria-hidden="true"
                />
                <p className="font-black uppercase tracking-[0.5em] text-[10px]">
                  Boutique Vault Empty
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

export default MyFoods;
