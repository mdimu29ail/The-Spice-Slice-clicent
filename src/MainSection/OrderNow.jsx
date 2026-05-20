import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য
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
  CheckCircle2,
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
      try {
        const { data, error } = await supabase
          .from('foods')
          .select('*')
          .eq('id', foodId)
          .single();
        if (error) throw error;
        if (data) setFood(data);
      } catch (err) {
        console.error('Error fetching food for order:', err.message);
      }
    };
    fetchFood();
  }, [foodId]);

  // Performance: ফর্ম হ্যান্ডলার মেমোইজ করা হয়েছে
  const handleProceedToPayment = e => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const name = form.name.value;
    const number = form.number.value;

    const orderData = {
      items: [{ ...food, quantity: 1 }],
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

    navigate('/payment/checkout', {
      state: {
        orderData,
        food: foodSummary,
      },
    });
  };

  if (loading || !food) return <Loading />;

  return (
    <main className="min-h-screen bg-[#fcf9f5] pt-32 pb-20 px-6 font-sans selection:bg-orange-100">
      {/* SEO: Page Metadata */}
      <Helmet>
        <title>Checkout | {food.name} | The Spice Slice</title>
        <meta
          name="description"
          content={`Securely order ${food.name} from The Spice Slice Boutique. Verify your identity to proceed to payment.`}
        />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <Link
          to={`/foods/${foodId}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1a1a1a] mb-12 group transition-all"
          aria-label="Return to food details page"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
            aria-hidden="true"
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Back to Masterpiece
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* --- LEFT SIDE: ORDER SUMMARY --- */}
          <section
            className="lg:col-span-5 space-y-10"
            aria-labelledby="summary-heading"
          >
            <header>
              <div className="flex items-center gap-2 text-[#E65100] mb-4">
                <Sparkles size={18} aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  Authorization Suite
                </span>
              </div>
              <h2
                id="summary-heading"
                className="text-6xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-[0.9] mb-4"
              >
                Secure <br /> <span className="text-[#E65100]">Checkout.</span>
              </h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                Verify your identity to proceed
              </p>
            </header>

            {/* Food Preview Card */}
            <article className="bg-white p-8 rounded-[3.5rem] border border-black/5 shadow-sm relative overflow-hidden group">
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl border-2 border-[#fcf9f5]">
                  <img
                    src={food.image_url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={`Preview of ${food.name}`}
                    loading="eager" // Performance: হিরো এলিমেন্ট হিসেবে দ্রুত লোড হবে
                    decoding="async"
                    width="96"
                    height="96"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {food.category}
                  </p>
                  <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight leading-none mb-2">
                    {food.name}
                  </h3>
                  <p
                    className="text-2xl font-black text-[#E65100] italic"
                    aria-label={`Price: ${food.price_usd} dollars`}
                  >
                    ${food.price_usd}
                  </p>
                </div>
              </div>
              {/* Background Decor */}
              <div
                className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12"
                aria-hidden="true"
              >
                <CreditCard size={120} />
              </div>
            </article>

            <div
              className="flex items-center gap-4 text-green-600/60 px-4"
              aria-hidden="true"
            >
              <ShieldCheck size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                PCI DSS Security Standard Active
              </p>
            </div>
          </section>

          {/* --- RIGHT SIDE: IDENTITY FORM --- */}
          <section
            className="lg:col-span-7 bg-white p-10 lg:p-14 rounded-[4rem] shadow-2xl border border-black/5"
            aria-labelledby="form-heading"
          >
            <div className="mb-12">
              <h2
                id="form-heading"
                className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tighter italic"
              >
                Patron{' '}
                <span className="text-[#E65100] not-italic">Identity.</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Step 1 of 2: Verification
              </p>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-10">
              <CheckoutInput
                id="patron-name"
                label="Full Identity (Name on Card)"
                name="name"
                icon={<User size={18} aria-hidden="true" />}
                defaultValue={user?.displayName}
                required
              />

              <CheckoutInput
                id="patron-email"
                label="Registered Digital Identity (Email)"
                name="email"
                type="email"
                icon={<Mail size={18} aria-hidden="true" />}
                defaultValue={user?.email}
                readOnly
              />

              <CheckoutInput
                id="patron-phone"
                label="Contact Link (Phone Number)"
                name="number"
                type="tel"
                placeholder="+880 1XXX XXXXXX"
                icon={<Smartphone size={18} aria-hidden="true" />}
                required
              />

              <div className="pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#1a1a1a] text-[#fcf9f5] py-6 rounded-full font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#E65100] transition-all disabled:opacity-50"
                  aria-label={
                    isSubmitting
                      ? 'Processing your details'
                      : 'Authorize details and proceed to payment'
                  }
                >
                  {isSubmitting
                    ? 'Processing...'
                    : 'Authorize & Proceed to Payment'}{' '}
                  <ChevronRight size={18} aria-hidden="true" />
                </motion.button>
              </div>

              <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                By proceeding, you are initiating a secure transaction <br />
                within the Spice Slice Boutique network.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

// --- Reusable Styled Input ---
const CheckoutInput = ({
  id,
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
    <label
      htmlFor={id}
      className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 group-focus-within:text-[#E65100] transition-colors"
    >
      {label}
    </label>
    <div className="flex items-center gap-4 text-[#1a1a1a]">
      <div
        className="text-gray-300 group-focus-within:text-[#E65100] transition-colors"
        aria-hidden="true"
      >
        {icon}
      </div>
      <input
        id={id}
        type={type}
        name={name}
        defaultValue={defaultValue}
        readOnly={readOnly}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-transparent outline-none text-sm font-bold placeholder:text-gray-200 ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-required={required}
      />
    </div>
  </div>
);

export default OrderNow;
