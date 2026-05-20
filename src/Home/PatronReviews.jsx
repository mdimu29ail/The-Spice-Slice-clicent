import React, { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, Quote, CheckCircle2, Sparkles } from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';

const PatronReviews = () => {
  const [reviews, setReviews] = useState([]);
  const prefersReducedMotion = useReducedMotion(); // Accessibility: ব্যবহারকারীর মোশন সেনসিটিভিটি চেক করে

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
    };
    fetchReviews();
  }, []);

  // Performance: useMemo ব্যবহার করে লিস্ট ক্যালকুলেশন অপ্টিমাইজ করা হয়েছে
  const extendedList = useMemo(
    () =>
      reviews.length > 0
        ? [...reviews, ...reviews, ...reviews, ...reviews]
        : [],
    [reviews],
  );

  if (reviews.length === 0) return null;

  // এনিমেশন সেটিংস (Accessibility: prefersReducedMotion হলে এনিমেশন স্লো বা বন্ধ হবে)
  const marqueeTransition = duration => ({
    ease: 'linear',
    duration: prefersReducedMotion ? duration * 2 : duration,
    repeat: Infinity,
  });

  return (
    <section
      className="py-32 bg-[#fcf9f5] overflow-hidden relative min-h-screen"
      aria-labelledby="reviews-heading"
    >
      {/* Background Watermark - Accessibility: aria-hidden="true" যোগ করা হয়েছে */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none"
        aria-hidden="true"
      >
        <h2 className="text-[25vw] font-black italic uppercase leading-none">
          Voices
        </h2>
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        {/* --- SECTION HEADER --- */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles size={14} className="text-[#E65100]" aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#E65100]">
              Testimonials
            </span>
          </motion.div>
          <h2
            id="reviews-heading"
            className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter italic uppercase leading-none"
          >
            Patron <span className="text-[#E65100] not-italic">Voices.</span>
          </h2>
        </div>

        {/* --- TRIPLE COLUMN VERTICAL MARQUEE --- */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[700px] relative"
          role="region"
          aria-label="Patron reviews marquee"
        >
          {/* COLUMN 1: TOP TO BOTTOM */}
          <div className="relative h-full overflow-hidden rounded-[3rem]">
            <motion.div
              className="flex flex-col gap-8"
              animate={{ y: ['-50%', '0%'] }}
              transition={marqueeTransition(25)}
            >
              {extendedList.map((rev, i) => (
                <ReviewCard key={`col1-${i}`} rev={rev} />
              ))}
            </motion.div>
          </div>

          {/* COLUMN 2: BOTTOM TO TOP (Very Slow) */}
          <div className="relative h-full overflow-hidden rounded-[3rem]">
            <motion.div
              className="flex flex-col gap-8"
              animate={{ y: ['0%', '-50%'] }}
              transition={marqueeTransition(60)}
            >
              {extendedList.map((rev, i) => (
                <ReviewCard key={`col2-${i}`} rev={rev} />
              ))}
            </motion.div>
          </div>

          {/* COLUMN 3: BOTTOM TO TOP (Fast Speed) */}
          <div className="relative h-full overflow-hidden rounded-[3rem]">
            <motion.div
              className="flex flex-col gap-8"
              animate={{ y: ['0%', '-50%'] }}
              transition={marqueeTransition(20)}
            >
              {extendedList.map((rev, i) => (
                <ReviewCard key={`col3-${i}`} rev={rev} />
              ))}
            </motion.div>
          </div>

          {/* Gradient Overlays */}
          <div
            className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fcf9f5] via-[#fcf9f5]/90 to-transparent z-20 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#fcf9f5] via-[#fcf9f5]/90 to-transparent z-20 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

// --- REUSABLE REVIEW CARD COMPONENT ---
const ReviewCard = ({ rev }) => (
  <div className="w-full bg-white p-10 rounded-[3rem] border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-700 relative group">
    <Quote
      className="absolute top-8 right-8 text-orange-100 group-hover:text-[#E65100]/20 transition-colors"
      size={36}
      aria-hidden="true"
    />

    {/* Accessibility: স্ক্রিন রিডারের জন্য রেটিং টেক্সট */}
    <div
      className="flex items-center gap-1 mb-6"
      aria-label={`Rated ${rev.rating} out of 5 stars`}
    >
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={12}
          fill={index < Math.floor(rev.rating) ? '#E65100' : 'transparent'}
          className={
            index < Math.floor(rev.rating) ? 'text-[#E65100]' : 'text-gray-200'
          }
          aria-hidden="true"
        />
      ))}
    </div>

    <p className="text-gray-500 italic font-medium leading-relaxed mb-8 text-sm">
      "{rev.review_text}"
    </p>

    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#fcf9f5] shadow-xl bg-[#fcf9f5] flex items-center justify-center shrink-0">
        {rev.image_url ? (
          <img
            src={rev.image_url}
            alt={`${rev.name}'s portrait`}
            className="w-full h-full object-cover"
            loading="lazy" // Performance: Lazy loading
            decoding="async" // Performance: Async decoding
          />
        ) : (
          <span
            className="text-lg font-black text-[#E65100]"
            aria-hidden="true"
          >
            {rev.name[0]}
          </span>
        )}
      </div>
      <div className="overflow-hidden">
        <h4 className="font-black text-[#1a1a1a] uppercase text-[11px] flex items-center gap-1 truncate">
          {rev.name}
          <CheckCircle2
            size={12}
            className="text-blue-500 shrink-0"
            aria-label="Verified Patron"
          />
        </h4>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">
          {rev.role}
        </p>
      </div>
    </div>
  </div>
);

export default PatronReviews;
