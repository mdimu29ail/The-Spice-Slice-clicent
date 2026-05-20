import React, { useState, useEffect, memo } from 'react';
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

// Performance: React.memo ব্যবহার করা হয়েছে যাতে অপ্রয়োজনীয় রি-রেন্ডার না হয়
const Table = memo(({ applications = [] }) => {
  const [lists, setLists] = useState(applications);

  useEffect(() => {
    setLists(applications);
  }, [applications]);

  const handleDelete = async (id, foodName) => {
    const result = await Swal.fire({
      title: 'De-authorize Request?',
      text: `Order for "${foodName || 'this item'}" will be permanently removed.`,
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
        .eq('id', id);

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
      {/* Accessibility: Decorative element hidden from screen readers */}
      <div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E65100] to-orange-300 opacity-20"
        aria-hidden="true"
      />

      <div className="overflow-x-auto">
        <table
          className="min-w-full text-left border-collapse"
          aria-label="Orders and Applications Ledger"
        >
          <thead>
            <tr className="bg-[#fcf9f5] border-b border-black/5">
              <th
                scope="col"
                className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Hash size={12} aria-hidden="true" /> Ref
                </div>
              </th>
              <th
                scope="col"
                className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Utensils size={12} aria-hidden="true" /> Delicacy
                </div>
              </th>
              <th
                scope="col"
                className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={12} aria-hidden="true" /> Date
                </div>
              </th>
              <th
                scope="col"
                className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <CreditCard size={12} aria-hidden="true" /> Value
                </div>
              </th>
              <th
                scope="col"
                className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-right"
              >
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
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>

                    {/* Food Details */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                          <img
                            src={list.foods?.image_url}
                            alt={list.foods?.name || 'Food item'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy" // Performance
                            decoding="async" // Performance
                            width="48" // Performance: Layout shift prevention
                            height="48"
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
                      <time
                        dateTime={list.created_at}
                        className="text-xs font-bold text-gray-500"
                      >
                        {new Date(list.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
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
                          aria-hidden="true"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <span className="sr-only">Status: </span>
                          {list.status}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right">
                      <motion.button
                        type="button" // Best Practice
                        whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(list.id, list.foods?.name)}
                        className="p-3 text-red-400 rounded-xl transition-colors inline-flex items-center justify-center border border-transparent hover:border-red-100"
                        aria-label={`Delete order for ${list.foods?.name || 'this item'}`}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan="6" className="py-20 text-center">
                    <div
                      className="flex flex-col items-center justify-center opacity-20"
                      role="status"
                    >
                      <ShoppingBag
                        size={64}
                        strokeWidth={1}
                        aria-hidden="true"
                      />
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
});

Table.displayName = 'Table';

export default Table;
