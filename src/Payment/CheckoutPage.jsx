import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase/supabaseClient';
import { AuthContext } from '../Auth/AuthContext';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import {
  ShieldCheck,
  CreditCard,
  Cpu,
  Smartphone,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { clearCart } = useCart();

  const { orderData, food } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [patronName, setPatronName] = useState(user?.displayName || '');
  const [contactNumber, setContactNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!orderData || !food)
    return (
      <div className="h-screen flex items-center justify-center font-black uppercase">
        No active session.
      </div>
    );

  // --- bKash, Nagad, COD এর জন্য ডাটা সেভ লজিক ---
  const handleMFSorCOD = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const allFoodNames = orderData.items
        ? orderData.items.map(i => `${i.name} (x${i.quantity || 1})`).join(', ')
        : food.name;

      const finalData = {
        food_id: food.id || null, // সিঙ্গেল ফুড হলে আইডি, কার্ট হলে null
        applicant_email: user.email,
        patron_name: patronName,
        contact_number: contactNumber,
        zip_code: zipCode,
        price_usd: parseFloat(food.price_usd),
        payment_method: paymentMethod,
        transaction_id:
          paymentMethod === 'cod'
            ? 'COD-' + Date.now()
            : paymentMethod.toUpperCase() + '-' + Date.now(),
        status: paymentMethod === 'cod' ? 'pending' : 'paid',
        food_names: allFoodNames,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('applications').insert([finalData]);
      if (error) throw error;

      Swal.fire({
        title: 'SUCCESS',
        text: 'Order Placed Successfully!',
        icon: 'success',
        background: '#fcf9f5',
      });
      if (clearCart) clearCart();
      navigate('/dashboard/purchaseList');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f5] pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* LEFT: CARD PREVIEW */}
        <div className="lg:col-span-5 space-y-10">
          <h2 className="text-5xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none">
            Secure <br /> <span className="text-[#E65100]">Settlement.</span>
          </h2>
          <motion.div
            initial={{ rotateY: 15 }}
            className="relative w-full h-64 bg-gradient-to-br from-[#1a1a1a] to-[#2d2424] rounded-[3rem] shadow-2xl p-10 text-white overflow-hidden border border-white/10"
          >
            <div className="h-full flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-start">
                <Cpu size={40} className="text-orange-200/40" />
                <p className="text-xs font-bold uppercase text-orange-400">
                  {paymentMethod}
                </p>
              </div>
              <h4 className="text-2xl font-black uppercase truncate">
                {patronName || 'Patron'}
              </h4>
              <p className="text-3xl font-black italic text-orange-400">
                ${food.price_usd.toFixed(2)}
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: FORM */}
        <div className="lg:col-span-7 bg-white p-10 lg:p-14 rounded-[4rem] shadow-2xl border border-black/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <MethodTab
              active={paymentMethod === 'card'}
              onClick={() => setPaymentMethod('card')}
              icon={<CreditCard size={18} />}
              label="Card"
            />
            <MethodTab
              active={paymentMethod === 'bkash'}
              onClick={() => setPaymentMethod('bkash')}
              icon={<Smartphone size={18} className="text-pink-500" />}
              label="bKash"
            />
            <MethodTab
              active={paymentMethod === 'nagad'}
              onClick={() => setPaymentMethod('nagad')}
              icon={<Smartphone size={18} className="text-orange-500" />}
              label="Nagad"
            />
            <MethodTab
              active={paymentMethod === 'cod'}
              onClick={() => setPaymentMethod('cod')}
              icon={<Truck size={18} />}
              label="C.O.D"
            />
          </div>

          <AnimatePresence mode="wait">
            {paymentMethod === 'card' ? (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    orderData={orderData}
                    food={food}
                    patronName={patronName}
                    setPatronName={setPatronName}
                    zipCode={zipCode}
                    setZipCode={setZipCode}
                    contactNumber={contactNumber}
                    setContactNumber={setContactNumber}
                  />
                </Elements>
              </motion.div>
            ) : (
              <motion.form
                key="mfs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleMFSorCOD}
                className="space-y-6"
              >
                <input
                  type="text"
                  required
                  placeholder="Patron Name"
                  value={patronName}
                  onChange={e => setPatronName(e.target.value)}
                  className="w-full p-4 bg-[#fcf9f5] rounded-2xl outline-none font-bold border border-black/5"
                />
                <input
                  type="tel"
                  required
                  placeholder="Contact Number"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full p-4 bg-[#fcf9f5] rounded-2xl outline-none font-bold border border-black/5"
                />
                <input
                  type="text"
                  required
                  placeholder="ZIP Code"
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  className="w-full p-4 bg-[#fcf9f5] rounded-2xl outline-none font-bold border border-black/5"
                />
                <button
                  disabled={isSubmitting}
                  className="w-full bg-[#1a1a1a] text-white py-5 rounded-full font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#E65100] transition-all"
                >
                  {isSubmitting
                    ? 'Processing...'
                    : `Confirm ${paymentMethod.toUpperCase()}`}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const MethodTab = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${active ? 'border-[#E65100] bg-orange-50 shadow-lg' : 'border-black/5 opacity-60'}`}
  >
    <div className={active ? 'text-[#E65100]' : 'text-gray-400'}>{icon}</div>
    <span
      className={`text-[9px] font-black uppercase ${active ? 'text-[#1a1a1a]' : 'text-gray-400'}`}
    >
      {label}
    </span>
  </button>
);

export default CheckoutPage;
