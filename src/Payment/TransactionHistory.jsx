import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase/supabaseClient';
import { AuthContext } from '../Auth/AuthContext';
import {
  Receipt,
  Calendar,
  CreditCard,
  Wallet,
  CheckCircle2,
  Search,
  ArrowUpRight,
  Sparkles,
  Hash,
  Download,
  Utensils,
} from 'lucide-react';
import Loading from '../Loading/Loading';

const TransactionHistory = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- SUPABASE DATA FETCHING ---
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.email) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('applicant_email', user.email)
        .eq('status', 'paid') // শুধুমাত্র সফল পেমেন্টগুলো দেখাবে
        .order('created_at', { ascending: false });

      if (!error) setTransactions(data || []);
      setLoading(false);
    };

    fetchTransactions();
  }, [user]);

  // ফিল্টার লজিক
  const filteredTxns = transactions.filter(
    t =>
      t.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.food_names?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div className="space-y-10 pb-20 px-2 md:px-0">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#E65100] mb-2">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Official Records
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none"
          >
            The <span className="text-[#E65100] not-italic">Ledger.</span>
          </motion.h2>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[9px] mt-3">
            Verified boutique transactions
          </p>
        </div>

        <div className="relative group w-full md:w-80">
          <input
            type="text"
            placeholder="Search Reference or Delicacy..."
            className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#E65100]/30 transition-all shadow-sm"
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E65100]"
            size={16}
          />
        </div>
      </header>

      {/* --- BOUTIQUE TABLE SYSTEM --- */}
      <div className="bg-white rounded-[3.5rem] border border-black/5 shadow-sm overflow-hidden relative">
        {/* Table Decor Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E65100] to-orange-200 opacity-20" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcf9f5] border-b border-black/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  <div className="flex items-center gap-2">
                    <Hash size={12} /> Ref ID
                  </div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  <div className="flex items-center gap-2">
                    <Utensils size={12} /> Masterpiece
                  </div>
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Date
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Method
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Value
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-right">
                  Receipt
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/[0.03]">
              <AnimatePresence mode="popLayout">
                {filteredTxns.length > 0 ? (
                  filteredTxns.map((txn, index) => (
                    <motion.tr
                      key={txn.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-[#fcf9f5]/50 transition-all duration-300"
                    >
                      {/* Ref ID */}
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-mono text-gray-400 group-hover:text-[#E65100] transition-colors">
                          #{txn.transaction_id?.slice(0, 10).toUpperCase()}
                        </span>
                      </td>

                      {/* Food Names */}
                      <td className="px-8 py-6">
                        <h4 className="text-sm font-black text-[#1a1a1a] uppercase tracking-tighter leading-none">
                          {txn.food_names || 'Boutique Selection'}
                        </h4>
                        <div className="flex items-center gap-1.5 text-green-600 mt-1">
                          <CheckCircle2 size={10} />
                          <span className="text-[9px] font-black uppercase tracking-widest italic">
                            Authenticated
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-8 py-6">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                          {new Date(txn.created_at).toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric', year: 'numeric' },
                          )}
                        </p>
                      </td>

                      {/* Method */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-orange-50 rounded-xl text-[#E65100] group-hover:scale-110 transition-transform">
                            {txn.payment_method === 'card' ? (
                              <CreditCard size={14} />
                            ) : (
                              <Wallet size={14} />
                            )}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">
                            {txn.payment_method}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-8 py-6">
                        <span className="text-xl font-black text-[#1a1a1a] tracking-tighter italic">
                          ${Number(txn.price_usd).toFixed(2)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-8 py-6 text-right">
                        <button className="p-3 bg-[#fcf9f5] border border-black/5 rounded-xl text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-all shadow-inner">
                          <Download size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center opacity-20">
                        <Receipt size={64} strokeWidth={1} />
                        <p className="mt-4 font-black uppercase tracking-[0.5em] text-xs">
                          No records found in the ledger
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- LUXURY FOOTER SUMMARY --- */}
      <div className="bg-[#1a1a1a] p-10 rounded-[3.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <h4 className="text-3xl font-black italic tracking-tighter">
            Boutique Portfolio.
          </h4>
          <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-[0.4em] font-medium leading-relaxed">
            Verified lifetime balance of your artisanal acquisitions.
          </p>
        </div>

        <div className="relative z-10 flex gap-12">
          <div className="text-center">
            <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Total Selection
            </p>
            <p className="text-4xl font-black text-white italic tracking-tighter leading-none">
              {transactions.length}
            </p>
          </div>
          <div className="w-[1px] h-12 bg-white/10" />
          <div className="text-center">
            <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Total Expenditure
            </p>
            <p className="text-4xl font-black text-[#E65100] italic tracking-tighter leading-none">
              $
              {transactions
                .reduce((acc, curr) => acc + Number(curr.price_usd), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Decorative Background Icon */}
        <ArrowUpRight className="absolute -right-6 -bottom-6 text-white/5 w-48 h-48 group-hover:scale-110 transition-transform duration-700" />
      </div>
    </div>
  );
};

export default TransactionHistory;
