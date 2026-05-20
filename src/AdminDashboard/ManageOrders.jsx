import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য
import {
  Clock,
  Truck,
  CheckCircle,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
} from 'lucide-react';
import Swal from 'sweetalert2';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Performance: fetchOrders ফাংশনটি মেমোইজ করা হয়েছে
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, foods (name, image_url)')
        .order('created_at', { ascending: false });

      if (!error) setOrders(data || []);
    } catch (err) {
      console.error('Order fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // --- ১. স্ট্যাটাস আপডেট লজিক ---
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status: newStatus } : order,
        ),
      );
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        background: '#1a1a1a',
        color: '#fff',
      });
      Toast.fire({
        icon: 'success',
        title: `Order: ${newStatus.toUpperCase()}`,
      });
    }
  };

  // --- ২. ডিলিট লজিক ---
  const handleDeleteOrder = async (id, refId) => {
    const result = await Swal.fire({
      title: 'Purge Order?',
      text: `Transaction #${refId} will be permanently erased from the boutique archive.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      cancelButtonColor: '#E65100',
      confirmButtonText: 'Yes, Delete',
      background: '#fcf9f5',
      customClass: { popup: 'rounded-[3rem] border border-black/5 shadow-2xl' },
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);
      if (!error) {
        setOrders(prev => prev.filter(o => o.id !== id));
        Swal.fire('Deleted!', 'The record has been purged.', 'success');
      }
    }
  };

  const getStatusStyle = status => {
    switch (status) {
      case 'pending':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'paid':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'processing':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-gray-50 text-gray-400';
    }
  };

  // Performance: ফিল্টার লজিক useMemo দিয়ে অপ্টিমাইজ করা হয়েছে
  const filteredOrders = useMemo(() => {
    return orders.filter(
      o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.applicant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.foods?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [orders, searchTerm]);

  return (
    <main className="space-y-10 font-sans">
      {/* SEO: Page Metadata */}
      <Helmet>
        <title>Order Management | Admin Dashboard</title>
        <meta
          name="description"
          content="Manage real-time boutique transactions, update order status, and review patron acquisitions."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter italic uppercase leading-none">
            Order <span className="text-[#E65100] not-italic">Flow.</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
            Real-time Transaction Management
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:w-72">
            <label htmlFor="order-search" className="sr-only">
              Search orders by reference or email
            </label>
            <input
              id="order-search"
              type="text"
              placeholder="Search Reference, Email..."
              className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#E65100]/30 transition-all shadow-sm text-[#1a1a1a]"
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
              size={16}
              aria-hidden="true"
            />
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            className="p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:text-[#E65100] transition-all"
            aria-label="Refresh order list"
          >
            <RefreshCw
              size={18}
              className={loading ? 'animate-spin' : ''}
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      <section
        className="bg-white rounded-[3.5rem] border border-black/5 shadow-sm overflow-hidden relative"
        aria-label="Orders management table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fcf9f5] border-b border-black/5">
              <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th scope="col" className="p-8 italic">
                  Ref ID
                </th>
                <th scope="col">Delicacy</th>
                <th scope="col">Patron Identity</th>
                <th scope="col">Value</th>
                <th scope="col">Status</th>
                <th scope="col" className="p-8 text-right">
                  Master Control
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b border-black/[0.03] transition-all group ${!order.is_approved ? 'bg-orange-50/30' : 'hover:bg-[#fcf9f5]/50'}`}
                  >
                    <td className="p-8">
                      <span className="text-[10px] font-mono text-gray-400 group-hover:text-[#E65100] transition-colors">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-4">
                        <figure className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm bg-gray-100 shrink-0">
                          <img
                            src={order.foods?.image_url}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            alt={order.foods?.name || 'Food item'}
                            loading="lazy"
                            decoding="async"
                            width="48"
                            height="48"
                          />
                        </figure>
                        <p className="font-black text-[#1a1a1a] uppercase tracking-tighter">
                          {order.foods?.name}
                        </p>
                      </div>
                    </td>
                    <td className="font-medium text-gray-500 text-xs italic">
                      {order.applicant_email}
                    </td>
                    <td
                      className="font-black text-[#E65100] italic leading-none"
                      aria-label={`Price: ${order.price_usd} dollars`}
                    >
                      ${order.price_usd}
                    </td>
                    <td>
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      <nav
                        className="flex justify-end gap-2"
                        aria-label="Order actions"
                      >
                        {order.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => updateStatus(order.id, 'paid')}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            aria-label="Mark as Paid"
                          >
                            <CheckCircle size={16} aria-hidden="true" />
                          </button>
                        )}
                        {order.status === 'paid' && (
                          <button
                            type="button"
                            onClick={() => updateStatus(order.id, 'processing')}
                            className="p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                            aria-label="Mark as Processing"
                          >
                            <RefreshCw size={16} aria-hidden="true" />
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            type="button"
                            onClick={() => updateStatus(order.id, 'delivered')}
                            className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            aria-label="Mark as Delivered"
                          >
                            <Truck size={16} aria-hidden="true" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteOrder(
                              order.id,
                              order.id.slice(0, 8).toUpperCase(),
                            )
                          }
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          aria-label="Delete order record"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm"
                          aria-label="View external details"
                        >
                          <ExternalLink size={16} aria-hidden="true" />
                        </button>
                      </nav>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && !loading && (
          <div
            className="py-32 text-center flex flex-col items-center justify-center opacity-30"
            role="status"
          >
            <Clock size={48} strokeWidth={1} aria-hidden="true" />
            <p className="mt-4 font-black uppercase tracking-[0.5em] text-xs">
              No Boutique Transactions Found
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ManageOrders;
