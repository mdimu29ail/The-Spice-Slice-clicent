// import React, { useContext, useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { supabase } from '../supabase/supabaseClient';
// import { AuthContext } from '../Auth/AuthContext';
// import {
//   ShoppingBag,
//   Eye, // ডিটেইলস এর জন্য নতুন আইকন
//   Search,
//   Calendar,
//   Trash2,
//   ArrowRight,
//   Sparkles,
// } from 'lucide-react';
// import Loading from '../Loading/Loading';
// import Swal from 'sweetalert2';
// import { Link, useNavigate } from 'react-router-dom';

// const PurchaseList = () => {
//   const { user } = useContext(AuthContext);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   // --- ১. সুপাবেস থেকে ডাটা ফেচিং ---
//   const fetchMyOrders = async () => {
//     if (!user?.email) return;
//     setLoading(true);

//     // Join Query: অর্ডারের সাথে খাবারের ID এবং তথ্য নিয়ে আসা
//     const { data, error } = await supabase
//       .from('applications')
//       .select(
//         `
//         *,
//         foods (id, name, image_url, category)
//       `,
//       )
//       .eq('applicant_email', user.email)
//       .order('created_at', { ascending: false });

//     if (!error) setOrders(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMyOrders();
//   }, [user?.email]);

//   // --- ২. অর্ডার ডিলিট/ক্যান্সেল লজিক (Supabase) ---
//   const handleDeleteOrder = async id => {
//     const result = await Swal.fire({
//       title: 'De-authorize Request?',
//       text: 'This record will be permanently removed.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#1a1a1a',
//       confirmButtonText: 'Confirm Deletion',
//     });

//     if (result.isConfirmed) {
//       try {
//         // আপনার ব্যাকএন্ডের ফুল ইউআরএল ব্যবহার করুন
//         const response = await fetch(
//           `http://localhost:3000/applications/${id}`,
//           {
//             method: 'DELETE',
//           },
//         );

//         const data = await response.json();

//         if (data.success) {
//           setOrders(prev => prev.filter(o => o.id !== id)); // স্টেট থেকে রিমুভ
//           Swal.fire('Deleted!', 'The record is gone forever.', 'success');
//         } else {
//           throw new Error(data.error);
//         }
//       } catch (error) {
//         console.error('Delete Error:', error);
//         Swal.fire('Error', 'Could not delete from server.', 'error');
//       }
//     }
//   };
//   // --- ৩. ফিল্টার লজিক ---
//   const filteredOrders = orders.filter(
//     order =>
//       order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.foods?.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const getStatusStyle = status => {
//     switch (status) {
//       case 'pending':
//         return 'bg-orange-50 text-orange-600 border-orange-100';
//       case 'delivered':
//         return 'bg-green-50 text-green-600 border-green-100';
//       case 'paid':
//         return 'bg-blue-50 text-blue-600 border-blue-100';
//       default:
//         return 'bg-gray-50 text-gray-400 border-gray-100';
//     }
//   };

//   if (loading)
//     return (
//       <div className="h-96 flex items-center justify-center">
//         <Loading />
//       </div>
//     );

//   return (
//     <div className="space-y-10 pb-10">
//       {/* --- HEADER --- */}
//       <header className="flex flex-col md:flex-row justify-between items-end gap-6">
//         <div>
//           <div className="flex items-center gap-2 text-[#E65100] mb-2">
//             <Sparkles size={16} />
//             <span className="text-[10px] font-black uppercase tracking-[0.4em]">
//               Personal Archive
//             </span>
//           </div>
//           <motion.h2
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none"
//           >
//             My <span className="text-[#E65100] not-italic">Orders.</span>
//           </motion.h2>
//           <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[9px] mt-2">
//             Tracking your artisanal acquisitions
//           </p>
//         </div>

//         {/* Search Bar */}
//         <div className="flex items-center gap-3 bg-white border border-black/5 px-6 py-3 rounded-2xl shadow-sm group focus-within:border-[#E65100]/20 transition-all">
//           <Search
//             size={16}
//             className="text-gray-300 group-focus-within:text-[#E65100]"
//           />
//           <input
//             type="text"
//             placeholder="Find masterpiece..."
//             className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest w-40 placeholder:text-gray-300"
//             onChange={e => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </header>

//       {/* --- ORDERS GRID --- */}
//       <div className="space-y-6">
//         <AnimatePresence mode="popLayout">
//           {filteredOrders.length > 0 ? (
//             filteredOrders.map((order, index) => (
//               <motion.div
//                 key={order.id}
//                 layout
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, scale: 0.95, x: -20 }}
//                 transition={{ delay: index * 0.05 }}
//                 className="group relative bg-white p-8 rounded-[3rem] shadow-sm border border-black/5 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-2xl hover:border-[#E65100]/10 transition-all duration-500"
//               >
//                 {/* 1. Masterpiece Preview */}
//                 <div className="flex items-center gap-6 w-full lg:w-auto">
//                   <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden shadow-xl shrink-0 border-2 border-white">
//                     <img
//                       src={
//                         order.foods?.image_url ||
//                         'https://via.placeholder.com/150'
//                       }
//                       alt=""
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                     />
//                   </div>
//                   <div>
//                     <p className="text-[9px] font-black text-[#E65100] uppercase tracking-[0.3em] mb-1">
//                       {order.foods?.category}
//                     </p>
//                     <h4 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tighter leading-none">
//                       {order.foods?.name}
//                     </h4>
//                     <div className="flex items-center gap-3 mt-3 text-gray-400">
//                       <Calendar size={12} />
//                       <span className="text-[9px] font-bold uppercase tracking-widest">
//                         {new Date(order.created_at).toLocaleDateString()}
//                       </span>
//                       <div className="w-[1px] h-3 bg-black/5" />
//                       <span className="text-[9px] font-mono italic">
//                         Ref: #{order.id.slice(0, 8)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 2. Status & Details & Delete Actions */}
//                 <div className="flex items-center justify-between lg:justify-end gap-10 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0">
//                   <div className="text-center lg:text-right">
//                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                       Acquisition Status
//                     </p>
//                     <span
//                       className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}
//                     >
//                       {order.status}
//                     </span>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
//                       Value Amount
//                     </p>
//                     <span className="text-3xl font-black text-[#1a1a1a] tracking-tighter italic">
//                       ${order.price_usd}
//                     </span>
//                   </div>

//                   <div className="flex gap-3">
//                     {/* --- DETAILS BUTTON --- */}
//                     <Link to={`/foods/${order.food_id}`}>
//                       <motion.button
//                         whileHover={{
//                           scale: 1.1,
//                           backgroundColor: '#1a1a1a',
//                           color: '#fff',
//                         }}
//                         className="p-4 bg-[#fcf9f5] text-gray-400 rounded-2xl transition-all shadow-inner border border-transparent hover:border-black/5"
//                       >
//                         <Eye size={18} />
//                       </motion.button>
//                     </Link>

//                     {/* --- DELETE BUTTON --- */}
//                     <motion.button
//                       whileHover={{
//                         scale: 1.1,
//                         backgroundColor: '#ef4444',
//                         color: '#fff',
//                       }}
//                       onClick={() => handleDeleteOrder(order.id)}
//                       className="p-4 bg-red-50 text-red-500 rounded-2xl transition-all shadow-inner border border-transparent hover:border-red-100"
//                     >
//                       <Trash2 size={18} />
//                     </motion.button>
//                   </div>
//                 </div>

//                 {/* Background Decoration */}
//                 <div className="absolute -right-4 -bottom-4 text-[6rem] font-black text-black/[0.02] italic pointer-events-none group-hover:text-[#E65100]/5 transition-colors">
//                   {index + 1}
//                 </div>
//               </motion.div>
//             ))
//           ) : (
//             <div className="py-32 flex flex-col items-center justify-center text-center opacity-20">
//               <ShoppingBag size={80} strokeWidth={1} />
//               <p className="mt-6 text-sm font-black uppercase tracking-[0.5em]">
//                 No acquisitions recorded
//               </p>
//               <Link
//                 to="/allFoods"
//                 className="mt-8 flex items-center gap-2 text-xs font-black uppercase border-b border-black pb-1 hover:text-[#E65100] transition-all"
//               >
//                 Begin Selection <ArrowRight size={14} />
//               </Link>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default PurchaseList;

import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // --- ১. ডাটা ফেচিং লজিক (Fix: Handling Null food_id) ---
  const fetchMyOrders = async () => {
    if (!user?.email) return;
    setLoading(true);

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

    if (!error) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyOrders();
  }, [user?.email]);

  // --- ২. ডিলিট লজিক (সরাসরি সুপাবেস ব্যবহার করা হয়েছে) ---
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
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);
      if (!error) {
        setOrders(prev => prev.filter(o => o.id !== id));
        Swal.fire('Deleted', 'Record removed.', 'success');
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const nameToSearch = order.foods?.name || order.food_names || '';
    return (
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nameToSearch.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
      <div className="h-96 flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div className="space-y-10 pb-10 font-sans">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#E65100] mb-2">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Acquisition Ledger
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none"
          >
            My <span className="text-[#E65100] not-italic">Orders.</span>
          </motion.h2>
        </div>

        <div className="flex items-center gap-3 bg-white border border-black/5 px-6 py-3 rounded-2xl shadow-sm group focus-within:border-[#E65100]/20 transition-all">
          <Search
            size={16}
            className="text-gray-300 group-focus-within:text-[#E65100]"
          />
          <input
            type="text"
            placeholder="Search Ledger..."
            className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest w-40 placeholder:text-gray-300"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* --- ORDERS LIST --- */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => {
              // যদি কার্ট থেকে কেনা হয় তবে food_names দেখাবে, নাহলে foods.name
              const isBulkOrder = !order.food_id;
              const displayName =
                order.foods?.name || order.food_names || 'Gourmet Collection';
              const displayImage =
                order.foods?.image_url ||
                'https://i.ibb.co/MxBvKxGY/Chat-GPT-Image-AM.png';

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-white p-8 rounded-[3rem] shadow-sm border border-black/5 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-2xl transition-all duration-500"
                >
                  {/* 1. Identity Preview */}
                  <div className="flex items-center gap-6 w-full lg:w-auto">
                    <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden shadow-xl shrink-0 border-2 border-white bg-[#fcf9f5] flex items-center justify-center">
                      {isBulkOrder ? (
                        <div className="flex flex-col items-center text-[#E65100]">
                          <Package size={32} strokeWidth={1.5} />
                          <span className="text-[8px] font-black uppercase mt-1">
                            Bulk
                          </span>
                        </div>
                      ) : (
                        <img
                          src={displayImage}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-[#E65100] uppercase tracking-[0.3em] mb-1">
                        {order.foods?.category || 'Multiple Categories'}
                      </p>
                      <h4 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tighter leading-tight max-w-xs">
                        {displayName}
                      </h4>
                      <div className="flex items-center gap-3 mt-3 text-gray-400">
                        <Calendar size={12} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <div className="w-[1px] h-3 bg-black/5" />
                        <span className="text-[9px] font-mono italic">
                          Ref: #{order.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Status & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-10 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0">
                    <div className="text-right">
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
                      <span className="text-3xl font-black text-[#1a1a1a] tracking-tighter italic">
                        ${order.price_usd}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {/* View Button: শুধুমাত্র সিঙ্গেল অর্ডারের জন্য কাজ করবে */}
                      {!isBulkOrder ? (
                        <Link to={`/foods/${order.food_id}`}>
                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: '#1a1a1a',
                              color: '#fff',
                            }}
                            className="p-4 bg-[#fcf9f5] text-gray-400 rounded-2xl transition-all shadow-inner"
                          >
                            <Eye size={18} />
                          </motion.button>
                        </Link>
                      ) : (
                        <div
                          className="p-4 bg-gray-50 text-gray-200 rounded-2xl cursor-not-allowed"
                          title="Bulk Order Details coming soon"
                        >
                          <CreditCard size={18} />
                        </div>
                      )}

                      <motion.button
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: '#ef4444',
                          color: '#fff',
                        }}
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-4 bg-red-50 text-red-500 rounded-2xl transition-all shadow-inner"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-20">
              <ShoppingBag size={80} strokeWidth={1} />
              <p className="mt-6 text-sm font-black uppercase tracking-[0.5em]">
                No acquisitions recorded
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PurchaseList;
