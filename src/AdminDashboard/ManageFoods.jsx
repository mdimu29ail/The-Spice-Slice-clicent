import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Link, useNavigate } from 'react-router-dom';

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('foods')
      .select('*')
      .order('is_approved', { ascending: true }) // পেন্ডিংগুলো আগে দেখাবে
      .order('created_at', { ascending: false });
    setFoods(data || []);
    setLoading(false);
  };

  // --- ১. এপ্রুভাল লজিক (Approve Masterpiece) ---
  const handleApprove = async id => {
    const { error } = await supabase
      .from('foods')
      .update({ is_approved: true })
      .eq('id', id);

    if (!error) {
      setFoods(foods.map(f => (f.id === id ? { ...f, is_approved: true } : f)));

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
        title: 'Masterpiece is now LIVE!',
      });
    } else {
      Swal.fire('Error', 'Could not approve at this moment.', 'error');
    }
  };

  // --- ২. ডিলিট লজিক ---
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Exterminate Record?',
      text: 'This action will remove the delicacy from the boutique forever.',
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
      setFoods(
        foods.map(f => (f.id === id ? { ...f, [field]: !currentValue } : f)),
      );
    }
  };

  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[#E65100] mb-2">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Curator Control
            </span>
          </div>
          <h2 className="text-4xl font-black text-[#1a1a1a] tracking-tighter italic uppercase leading-none">
            Boutique{' '}
            <span className="text-[#E65100] not-italic">Inventory.</span>
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
            Review submissions & manage your empire
          </p>
        </div>
        <Link to="/admin/add-food">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-[#1a1a1a] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl"
          >
            <Plus size={16} /> New Masterpiece
          </motion.button>
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3.5rem] border border-black/5 overflow-hidden shadow-sm relative">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#fcf9f5] border-b border-black/5">
            <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              <th className="p-8">delicacy</th>
              <th>Status</th>
              <th>Experience Tags</th>
              <th>Price</th>
              <th className="p-8 text-right">Actions</th>
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
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg bg-gray-100 shrink-0">
                        <img
                          src={food.image_url}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt=""
                        />
                      </div>
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
                        <CheckCircle size={14} /> Live
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-500 font-black text-[9px] uppercase tracking-widest italic animate-pulse">
                        <Clock size={14} /> Reviewing
                      </div>
                    )}
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <TagButton
                        active={food.is_signature}
                        icon={<Star size={10} />}
                        onClick={() =>
                          toggleTag(food.id, 'is_signature', food.is_signature)
                        }
                        label="Sig"
                      />
                      <TagButton
                        active={food.is_premium}
                        icon={<Diamond size={10} />}
                        onClick={() =>
                          toggleTag(food.id, 'is_premium', food.is_premium)
                        }
                        label="Pre"
                      />
                      <TagButton
                        active={food.is_spicy}
                        icon={<Flame size={10} />}
                        onClick={() =>
                          toggleTag(food.id, 'is_spicy', food.is_spicy)
                        }
                        label="Hot"
                      />
                    </div>
                  </td>

                  <td className="font-black text-[#E65100] italic text-lg">
                    ${food.price_usd}
                  </td>

                  <td className="p-8 text-right space-x-2">
                    <div className="flex justify-end items-center gap-2">
                      {/* APPROVE BUTTON (Only shows if NOT approved) */}
                      {!food.is_approved && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(food.id)}
                          className="px-5 py-2.5 bg-[#E65100] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-orange-900/20 flex items-center gap-2"
                        >
                          <Zap size={12} fill="currentColor" /> Approve
                        </motion.button>
                      )}

                      <Link to={`/admin/update-food/${food.id}`}>
                        <button className="p-3 bg-[#fcf9f5] text-gray-400 rounded-xl hover:bg-[#1a1a1a] hover:text-white transition-all shadow-inner">
                          <Edit3 size={16} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(food.id)}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-inner border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {foods.length === 0 && !loading && (
          <div className="py-24 text-center text-gray-300 italic uppercase tracking-widest">
            No items in the boutique ledger.
          </div>
        )}
      </div>
    </div>
  );
};

const TagButton = ({ active, icon, onClick, label }) => (
  <button
    onClick={onClick}
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
);

export default ManageFoods;
