import React, { useState, useEffect, useContext } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { AuthContext } from '../Auth/AuthContext';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import {
  User,
  CreditCard,
  MapPin,
  Smartphone,
  Sparkles,
  Loader2,
} from 'lucide-react';

const CheckoutForm = ({
  orderData,
  food,
  patronName,
  setPatronName,
  zipCode,
  setZipCode,
  contactNumber,
  setContactNumber,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (food?.price_usd > 0) {
      fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: food.price_usd }),
      })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret))
        .catch(err => console.error('Stripe Secret Error:', err));
    }
  }, [food]);

  const handleSubmit = async event => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret || isProcessing) return;
    setIsProcessing(true);

    try {
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: { name: patronName, email: user?.email },
          },
        });

      if (confirmError) throw new Error(confirmError.message);

      if (paymentIntent.status === 'succeeded') {
        const allFoodNames = orderData.items
          ? orderData.items
              .map(i => `${i.name} (x${i.quantity || 1})`)
              .join(', ')
          : food.name;

        const finalOrder = {
          food_id: food.id || null,
          applicant_email: user.email,
          patron_name: patronName,
          contact_number: contactNumber,
          zip_code: zipCode,
          price_usd: parseFloat(food.price_usd),
          payment_method: 'card',
          transaction_id: paymentIntent.id,
          status: 'paid',
          food_names: allFoodNames,
          created_at: new Date().toISOString(),
        };

        const { error: dbError } = await supabase
          .from('applications')
          .insert([finalOrder]);
        if (dbError) throw dbError;

        Swal.fire({
          title: 'AUTHENTICATED',
          text: 'Payment Successful!',
          icon: 'success',
          background: '#fcf9f5',
        });
        if (clearCart) clearCart();
        navigate('/dashboard/purchaseList');
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <User
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
            size={16}
          />
          <input
            type="text"
            required
            placeholder="Cardholder Name"
            value={patronName}
            onChange={e => setPatronName(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#fcf9f5] rounded-2xl outline-none font-bold border border-black/5"
          />
        </div>
        <div className="relative">
          <Smartphone
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
            size={16}
          />
          <input
            type="tel"
            required
            placeholder="Contact Number"
            value={contactNumber}
            onChange={e => setContactNumber(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#fcf9f5] rounded-2xl outline-none font-bold border border-black/5"
          />
        </div>
        <div className="p-4 bg-[#fcf9f5] border border-black/5 rounded-2xl shadow-inner">
          <CardNumberElement
            options={{ style: { base: { fontSize: '16px' } } }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#fcf9f5] border border-black/5 rounded-2xl shadow-inner">
            <CardExpiryElement />
          </div>
          <div className="p-4 bg-[#fcf9f5] border border-black/5 rounded-2xl shadow-inner">
            <CardCvcElement />
          </div>
        </div>
        <div className="relative">
          <MapPin
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
            size={16}
          />
          <input
            type="text"
            required
            placeholder="ZIP Code"
            value={zipCode}
            onChange={e => setZipCode(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#fcf9f5] rounded-2xl outline-none font-bold border border-black/5"
          />
        </div>
      </div>
      <button
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full bg-[#1a1a1a] text-white py-5 rounded-full font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#E65100] transition-all flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            Authorize Payment <Sparkles size={16} />
          </>
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
