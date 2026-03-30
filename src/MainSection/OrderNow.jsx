import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabase/supabaseClient';
import { AuthContext } from '../Auth/AuthContext';
import Loading from '../Loading/Loading';
import {
  ShieldCheck,
  ArrowLeft,
  Smartphone,
  User,
  Mail,
  CreditCard,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const OrderNow = () => {
  const { id: foodId } = useParams();
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      const { data } = await supabase
        .from('foods')
        .select('*')
        .eq('id', foodId)
        .single();
      if (data) setFood(data);
    };
    fetchFood();
  }, [foodId]);

  if (loading || !food) return <Loading />;

  // --- পেমেন্ট পেজে যাওয়ার লজিক ---
  const handleProceedToPayment = e => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const name = form.name.value;
    const number = form.number.value;

    // পেমেন্ট পেজের জন্য ডাটা অবজেক্ট তৈরি
    const orderData = {
      items: [{ ...food, quantity: 1 }], // সিঙ্গেল আইটেমকে অ্যারে হিসেবে পাঠানো হচ্ছে
      total_price: food.price_usd,
    };

    const foodSummary = {
      id: food.id,
      name: food.name,
      price_usd: food.price_usd,
      image_url: food.image_url,
      patron_name: name,
      contact_number: number,
    };

    // সরাসরি পেমেন্ট পেজে রিডাইরেক্ট (State সহ)
    navigate('/payment/checkout', {
      state: {
        orderData,
        food: foodSummary,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#fcf9f5] pt-32 pb-20 px-6 font-sans selection:bg-orange-100">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to={`/foods/${foodId}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1a1a1a] mb-12 group transition-all"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Back to Masterpiece
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* --- LEFT SIDE: ORDER SUMMARY --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-10"
          >
            <header>
              <div className="flex items-center gap-2 text-[#E65100] mb-4">
                <Sparkles size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  Authorization Suite
                </span>
              </div>
              <h2 className="text-6xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-[0.9] mb-4">
                Secure <br /> <span className="text-[#E65100]">Checkout.</span>
              </h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                Verify your identity to proceed
              </p>
            </header>

            {/* Food Preview Card */}
            <div className="bg-white p-8 rounded-[3.5rem] border border-black/5 shadow-sm relative overflow-hidden group">
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl border-2 border-[#fcf9f5]">
                  <img
                    src={food.image_url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={food.name}
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {food.category}
                  </p>
                  <h4 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight leading-none mb-2">
                    {food.name}
                  </h4>
                  <p className="text-2xl font-black text-[#E65100] italic">
                    ${food.price_usd}
                  </p>
                </div>
              </div>
              {/* Background Decor */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12">
                <CreditCard size={120} />
              </div>
            </div>

            <div className="flex items-center gap-4 text-green-600/60 px-4">
              <ShieldCheck size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                PCI DSS Security Standard Active
              </p>
            </div>
          </motion.div>

          {/* --- RIGHT SIDE: IDENTITY FORM --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 bg-white p-10 lg:p-14 rounded-[4rem] shadow-2xl border border-black/5"
          >
            <div className="mb-12">
              <h3 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tighter italic">
                Patron{' '}
                <span className="text-[#E65100] not-italic">Identity.</span>
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Step 1 of 2: Verification
              </p>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-10">
              <CheckoutInput
                label="Full Identity (Name on Card)"
                name="name"
                icon={<User size={18} />}
                defaultValue={user?.displayName}
                required
              />

              <CheckoutInput
                label="Registered Digital Identity (Email)"
                name="email"
                type="email"
                icon={<Mail size={18} />}
                defaultValue={user?.email}
                readOnly
              />

              <CheckoutInput
                label="Contact Link (Phone Number)"
                name="number"
                type="tel"
                placeholder="+880 1XXX XXXXXX"
                icon={<Smartphone size={18} />}
                required
              />

              <div className="pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-[#1a1a1a] text-[#fcf9f5] py-6 rounded-full font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#E65100] transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Processing...'
                    : 'Authorize & Proceed to Payment'}{' '}
                  <ChevronRight size={18} />
                </motion.button>
              </div>

              <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                By proceeding, you are initiating a secure transaction <br />
                within the Spice Slice Boutique network.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Styled Input ---
const CheckoutInput = ({
  label,
  name,
  icon,
  defaultValue,
  type = 'text',
  readOnly = false,
  placeholder,
  required = false,
}) => (
  <div className="group relative border-b border-black/10 focus-within:border-[#E65100] transition-all duration-500 pb-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 group-focus-within:text-[#E65100] transition-colors">
      {label}
    </label>
    <div className="flex items-center gap-4 text-[#1a1a1a]">
      <div className="text-gray-300 group-focus-within:text-[#E65100] transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        readOnly={readOnly}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-transparent outline-none text-sm font-bold placeholder:text-gray-200 ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  </div>
);

export default OrderNow;
