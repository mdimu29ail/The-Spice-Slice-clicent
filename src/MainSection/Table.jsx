import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase/supabaseClient';
import Swal from 'sweetalert2';
import {
  Trash2,
  ShoppingBag,
  Hash,
  CreditCard,
  Utensils,
  Calendar,
} from 'lucide-react';

const Table = ({ applications = [] }) => {
  const [lists, setLists] = useState(applications);

  // প্রপস আপডেট হলে স্টেট আপডেট করা
  useEffect(() => {
    setLists(applications);
  }, [applications]);

  // --- SUPABASE DELETE LOGIC ---
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'De-authorize Request?',
      text: 'This order log will be permanently removed from the ledger.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      cancelButtonColor: '#E65100',
      confirmButtonText: 'Confirm Deletion',
      background: '#fcf9f5',
      customClass: {
        popup: 'rounded-[3rem] border border-black/5 shadow-2xl',
        confirmButton:
          'rounded-full px-8 py-3 uppercase text-[10px] font-black tracking-widest',
        cancelButton:
          'rounded-full px-8 py-3 uppercase text-[10px] font-black tracking-widest',
      },
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id); // Supabase uses 'id', not '_id'

      if (!error) {
        setLists(prev => prev.filter(item => item.id !== id));
        Swal.fire({
          title: 'Removed',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#fcf9f5',
          customClass: { popup: 'rounded-[2rem]' },
        });
      } else {
        Swal.fire('Error', 'Transaction could not be deleted.', 'error');
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-[3rem] shadow-sm border border-black/5 overflow-hidden my-12 relative">
      {/* Table Header Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E65100] to-orange-300 opacity-20" />

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcf9f5] border-b border-black/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                <div className="flex items-center gap-2">
                  <Hash size={12} /> Ref
                </div>
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                <div className="flex items-center gap-2">
                  <Utensils size={12} /> Delicacy
                </div>
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={12} /> Date
                </div>
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                <div className="flex items-center gap-2">
                  <CreditCard size={12} /> Value
                </div>
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                Status
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/[0.03]">
            <AnimatePresence mode="popLayout">
              {lists.length > 0 ? (
                lists.map((list, index) => (
                  <motion.tr
                    key={list.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-[#fcf9f5]/50 transition-all duration-300"
                  >
                    {/* Index / ID */}
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-mono text-gray-300">
                        0{index + 1}
                      </span>
                    </td>

                    {/* Food Details */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                          <img
                            src={list.foods?.image_url}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#1a1a1a] uppercase tracking-tight">
                            {list.foods?.name}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            {list.foods?.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-gray-500">
                        {new Date(list.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-[#1a1a1a] tracking-tighter italic">
                        ${list.price_usd?.toFixed(2)}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${list.status === 'pending' ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                          {list.status}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(list.id)}
                        className="p-3 text-red-400 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                      <ShoppingBag size={64} strokeWidth={1} />
                      <p className="mt-4 font-black uppercase tracking-[0.5em] text-xs">
                        Ledger is empty
                      </p>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
