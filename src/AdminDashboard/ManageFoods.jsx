import React, { useEffect, useState, useCallback, memo } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য
import {
  Flame,
  Diamond,
  Star,
  Trash2,
  Edit3,
  Plus,
  CheckCircle,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Performance: fetchFoods ফাংশনটি মেমোইজ করা হয়েছে
  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('is_approved', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFoods(data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  // --- ১. এপ্রুভাল লজিক ---
  const handleApprove = async (id, name) => {
    const { error } = await supabase
      .from('foods')
      .update({ is_approved: true })
      .eq('id', id);

    if (!error) {
      setFoods(prev =>
        prev.map(f => (f.id === id ? { ...f, is_approved: true } : f)),
      );
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#1a1a1a',
        color: '#fff',
      });
      Toast.fire({
        icon: 'success',
        title: `"${name}" is now LIVE!`,
      });
    }
  };

  // --- ২. ডিলিট লজিক ---
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Exterminate Record?',
      text: `"${name}" will be removed from the boutique forever.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      cancelButtonColor: '#E65100',
      confirmButtonText: 'Confirm Deletion',
      background: '#fcf9f5',
      customClass: { popup: 'rounded-[3rem] border border-black/5 shadow-2xl' },
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('foods').delete().eq('id', id);
      if (!error) {
        setFoods(prev => prev.filter(food => food.id !== id));
        Swal.fire({
          title: 'Erased!',
          icon: 'success',
          confirmButtonColor: '#1a1a1a',
        });
      }
    }
  };

  // --- ৩. ট্যাগ আপডেট ---
  const toggleTag = async (id, field, currentValue) => {
    const { error } = await supabase
      .from('foods')
      .update({ [field]: !currentValue })
      .eq('id', id);
    if (!error) {
      setFoods(prev =>
        prev.map(f => (f.id === id ? { ...f, [field]: !currentValue } : f)),
      );
    }
  };

  return (
    <main className="p-8 space-y-10 font-sans">
      {/* SEO: Page Metadata */}
      <Helmet>
        <title>Manage Inventory | Admin Dashboard</title>
        <meta
          name="description"
          content="Review and manage boutique food inventory, approve masterpieces, and update delicacy tags."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#E65100] mb-2">
            <ShieldCheck size={16} aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Curator Control
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter italic uppercase leading-none">
            Boutique{' '}
            <span className="text-[#E65100] not-italic">Inventory.</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
            Review submissions & manage your empire
          </p>
        </div>
        <Link
          to="/admin/add-food"
          aria-label="Add a new masterpiece to inventory"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            className="bg-[#1a1a1a] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl"
          >
            <Plus size={16} aria-hidden="true" /> New Masterpiece
          </motion.button>
        </Link>
      </header>

      {/* Table Section */}
      <section
        className="bg-white rounded-[3.5rem] border border-black/5 overflow-hidden shadow-sm relative"
        aria-label="Inventory management table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fcf9f5] border-b border-black/5">
              <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th scope="col" className="p-8">
                  Delicacy
                </th>
                <th scope="col">Status</th>
                <th scope="col">Experience Tags</th>
                <th scope="col">Price</th>
                <th scope="col" className="p-8 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <AnimatePresence mode="popLayout">
                {foods.map(food => (
                  <motion.tr
                    key={food.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`border-b border-black/[0.03] transition-all group ${!food.is_approved ? 'bg-orange-50/30' : 'hover:bg-[#fcf9f5]/50'}`}
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <figure className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg bg-gray-100 shrink-0">
                          <img
                            src={food.image_url}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            alt={`Visual of ${food.name}`}
                            loading="lazy"
                            decoding="async"
                            width="56"
                            height="56"
                          />
                        </figure>
                        <div>
                          <p className="font-black text-[#1a1a1a] uppercase tracking-tight">
                            {food.name}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            {food.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* APPROVAL STATUS COLUMN */}
                    <td>
                      {food.is_approved ? (
                        <div className="flex items-center gap-2 text-green-600 font-black text-[9px] uppercase tracking-widest italic">
                          <CheckCircle size={14} aria-hidden="true" />
                          <span>Live</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-500 font-black text-[9px] uppercase tracking-widest italic animate-pulse">
                          <Clock size={14} aria-hidden="true" />
                          <span>Reviewing</span>
                        </div>
                      )}
                    </td>

                    <td>
                      <div
                        className="flex gap-2"
                        role="group"
                        aria-label="Toggle experience tags"
                      >
                        <TagButton
                          active={food.is_signature}
                          icon={<Star size={10} aria-hidden="true" />}
                          onClick={() =>
                            toggleTag(
                              food.id,
                              'is_signature',
                              food.is_signature,
                            )
                          }
                          label="Sig"
                          ariaLabel={`Toggle signature tag for ${food.name}`}
                        />
                        <TagButton
                          active={food.is_premium}
                          icon={<Diamond size={10} aria-hidden="true" />}
                          onClick={() =>
                            toggleTag(food.id, 'is_premium', food.is_premium)
                          }
                          label="Pre"
                          ariaLabel={`Toggle premium tag for ${food.name}`}
                        />
                        <TagButton
                          active={food.is_spicy}
                          icon={<Flame size={10} aria-hidden="true" />}
                          onClick={() =>
                            toggleTag(food.id, 'is_spicy', food.is_spicy)
                          }
                          label="Hot"
                          ariaLabel={`Toggle spicy tag for ${food.name}`}
                        />
                      </div>
                    </td>

                    <td
                      className="font-black text-[#E65100] italic text-lg"
                      aria-label={`Price: ${food.price_usd} dollars`}
                    >
                      ${food.price_usd}
                    </td>

                    <td className="p-8 text-right">
                      <nav
                        className="flex justify-end items-center gap-2"
                        aria-label="Item management"
                      >
                        {!food.is_approved && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(food.id, food.name)}
                            className="px-5 py-2.5 bg-[#E65100] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-orange-900/20 flex items-center gap-2"
                            aria-label={`Approve ${food.name} to go live`}
                          >
                            <Zap
                              size={12}
                              fill="currentColor"
                              aria-hidden="true"
                            />{' '}
                            Approve
                          </motion.button>
                        )}

                        <Link
                          to={`/admin/update-food/${food.id}`}
                          aria-label={`Edit details for ${food.name}`}
                        >
                          <button
                            type="button"
                            className="p-3 bg-[#fcf9f5] text-gray-400 rounded-xl hover:bg-[#1a1a1a] hover:text-white transition-all shadow-inner"
                          >
                            <Edit3 size={16} aria-hidden="true" />
                          </button>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(food.id, food.name)}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-inner border border-transparent hover:border-red-100"
                          aria-label={`Delete ${food.name} from inventory`}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </nav>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {foods.length === 0 && !loading && (
          <div
            className="py-24 text-center text-gray-300 italic uppercase tracking-widest"
            role="status"
          >
            No items in the boutique ledger.
          </div>
        )}
      </section>
    </main>
  );
};

// Performance: TagButton মেমোইজ করা হয়েছে
const TagButton = memo(({ active, icon, onClick, label, ariaLabel }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    aria-pressed={active}
    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border transition-all duration-500 ${
      active
        ? 'bg-[#1a1a1a] text-white border-black scale-105 shadow-md'
        : 'bg-white text-gray-300 border-gray-100 hover:border-gray-300'
    }`}
  >
    {icon}
    <span className="text-[8px] font-black uppercase tracking-tighter">
      {label}
    </span>
  </button>
));

TagButton.displayName = 'TagButton';

export default ManageFoods;
