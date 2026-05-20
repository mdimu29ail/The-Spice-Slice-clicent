import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য
import { supabase } from '../supabase/supabaseClient';
import { AuthContext } from '../Auth/AuthContext';
import {
  ShoppingBag,
  Eye,
  Search,
  Calendar,
  Trash2,
  ArrowRight,
  Sparkles,
  Package,
  CreditCard,
} from 'lucide-react';
import Loading from '../Loading/Loading';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const PurchaseList = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ১. ডাটা ফেচিং লজিক (Performance: useCallback ব্যবহার করা হয়েছে) ---
  const fetchMyOrders = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(
          `
          *,
          foods (id, name, image_url, category)
        `,
        )
        .eq('applicant_email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Order fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // --- ২. ডিলিট লজিক ---
  const handleDeleteOrder = async id => {
    const result = await Swal.fire({
      title: 'Erase Record?',
      text: 'This transaction will be removed from your history.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      confirmButtonText: 'Confirm',
      background: '#fcf9f5',
      customClass: { popup: 'rounded-[3rem]' },
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', id);
        if (error) throw error;

        setOrders(prev => prev.filter(o => o.id !== id));
        Swal.fire('Deleted', 'Record removed.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Could not delete record.', 'error');
      }
    }
  };

  // --- ৩. ফিল্টার লজিক (Performance: useMemo ব্যবহার করা হয়েছে) ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const nameToSearch = order.foods?.name || order.food_names || '';
      return (
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nameToSearch.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [orders, searchTerm]);

  const getStatusStyle = status => {
    switch (status) {
      case 'pending':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'delivered':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'paid':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return 'bg-gray-50 text-gray-400 border-gray-100';
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
        <span className="sr-only">Loading your orders...</span>
      </div>
    );

  return (
    <main className="space-y-10 pb-10 font-sans selection:bg-orange-100">
      {/* SEO: Page Metadata */}
      <Helmet>
        <title>My Orders | The Spice Slice Boutique</title>
        <meta
          name="description"
          content="View and track your artisanal food acquisitions and order history at The Spice Slice."
        />
      </Helmet>

      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#E65100] mb-2">
            <Sparkles size={16} aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Acquisition Ledger
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none">
            My <span className="text-[#E65100] not-italic">Orders.</span>
          </h1>
        </div>

        {/* Search Bar - Accessibility: Label added */}
        <div className="flex items-center gap-3 bg-white border border-black/5 px-6 py-3 rounded-2xl shadow-sm group focus-within:border-[#E65100]/20 transition-all">
          <label htmlFor="order-search" className="sr-only">
            Search orders
          </label>
          <Search
            size={16}
            className="text-gray-300 group-focus-within:text-[#E65100]"
            aria-hidden="true"
          />
          <input
            id="order-search"
            type="text"
            placeholder="Search Ledger..."
            className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest w-40 placeholder:text-gray-300 text-[#1a1a1a]"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* --- ORDERS LIST --- */}
      <section aria-label="Order history list">
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => {
                const isBulkOrder = !order.food_id;
                const displayName =
                  order.foods?.name || order.food_names || 'Gourmet Collection';
                const displayImage =
                  order.foods?.image_url ||
                  'https://i.ibb.co/MxBvKxGY/Chat-GPT-Image-AM.png';

                return (
                  <motion.article
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white p-8 rounded-[3rem] shadow-sm border border-black/5 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-2xl transition-all duration-500"
                  >
                    {/* 1. Identity Preview */}
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                      <figure className="relative w-24 h-24 rounded-[2rem] overflow-hidden shadow-xl shrink-0 border-2 border-white bg-[#fcf9f5] flex items-center justify-center">
                        {isBulkOrder ? (
                          <div
                            className="flex flex-col items-center text-[#E65100]"
                            aria-label="Bulk order"
                          >
                            <Package
                              size={32}
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            <span className="text-[8px] font-black uppercase mt-1">
                              Bulk
                            </span>
                          </div>
                        ) : (
                          <img
                            src={displayImage}
                            alt={`Visual of ${displayName}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            decoding="async"
                            width="96"
                            height="96"
                          />
                        )}
                      </figure>
                      <div>
                        <p className="text-[9px] font-black text-[#E65100] uppercase tracking-[0.3em] mb-1">
                          {order.foods?.category || 'Multiple Categories'}
                        </p>
                        <h2 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tighter leading-tight max-w-xs">
                          {displayName}
                        </h2>
                        <div className="flex items-center gap-3 mt-3 text-gray-400">
                          <Calendar size={12} aria-hidden="true" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                          <div
                            className="w-[1px] h-3 bg-black/5"
                            aria-hidden="true"
                          />
                          <span className="text-[9px] font-mono italic">
                            Ref: #{order.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Status & Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-10 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0">
                      <div className="text-center lg:text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                          Status
                        </p>
                        <span
                          className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                          Total Paid
                        </p>
                        <span
                          className="text-3xl font-black text-[#1a1a1a] tracking-tighter italic"
                          aria-label={`Paid ${order.price_usd} dollars`}
                        >
                          ${order.price_usd}
                        </span>
                      </div>

                      <nav className="flex gap-3" aria-label="Order actions">
                        {!isBulkOrder ? (
                          <Link
                            to={`/foods/${order.food_id}`}
                            aria-label={`View details for ${displayName}`}
                          >
                            <motion.button
                              type="button"
                              whileHover={{
                                scale: 1.1,
                                backgroundColor: '#1a1a1a',
                                color: '#fff',
                              }}
                              className="p-4 bg-[#fcf9f5] text-gray-400 rounded-2xl transition-all shadow-inner border border-transparent hover:border-black/5"
                            >
                              <Eye size={18} aria-hidden="true" />
                            </motion.button>
                          </Link>
                        ) : (
                          <div
                            className="p-4 bg-gray-50 text-gray-200 rounded-2xl cursor-not-allowed"
                            title="Bulk Order Details coming soon"
                            aria-hidden="true"
                          >
                            <CreditCard size={18} />
                          </div>
                        )}

                        <button
                          type="button"
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: '#ef4444',
                            color: '#fff',
                          }}
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-4 bg-red-50 text-red-500 rounded-2xl transition-all shadow-inner border border-transparent hover:border-red-100"
                          aria-label={`Delete order record for ${displayName}`}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </nav>
                    </div>

                    {/* Background Decoration */}
                    <div
                      className="absolute -right-4 -bottom-4 text-[6rem] font-black text-black/[0.02] italic pointer-events-none group-hover:text-orange-500/5 transition-colors"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </div>
                  </motion.article>
                );
              })
            ) : (
              <div
                className="py-32 flex flex-col items-center justify-center text-center opacity-20"
                role="status"
              >
                <ShoppingBag size={80} strokeWidth={1} aria-hidden="true" />
                <p className="mt-6 text-sm font-black uppercase tracking-[0.5em]">
                  No acquisitions recorded
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

export default PurchaseList;
