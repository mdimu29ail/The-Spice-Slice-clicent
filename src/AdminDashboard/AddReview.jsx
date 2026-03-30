import React, { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { motion } from 'framer-motion';
import {
  Star,
  Send,
  Camera,
  Loader2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import Swal from 'sweetalert2';

const AddReview = () => {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // --- ১. ইমেজ আপলোড লজিক ---
  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setImagePreview(URL.createObjectURL(file));

    const fileExt = file.name.split('.').pop();
    const fileName = `review-${Math.random()}.${fileExt}`;
    const filePath = `review-portraits/${fileName}`;

    try {
      // সুপাবেস স্টোরেজে আপলোড (Bucket: avatars অথবা reviews নামে বাকেট তৈরি করে নিন)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      setImageUrl(publicUrl);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Portrait Uploaded',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire('Upload Failed', err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // --- ২. রিভিউ সাবমিট লজিক ---
  const handleSubmit = async e => {
    e.preventDefault();
    if (!imageUrl)
      return Swal.fire('Wait!', 'Please upload a patron portrait.', 'warning');

    setLoading(true);
    const form = e.target;

    const reviewData = {
      name: form.name.value,
      role: form.role.value,
      review_text: form.review_text.value,
      rating: parseFloat(form.rating.value), // ডেসিমেল পয়েন্ট সাপোর্ট
      image_url: imageUrl,
    };

    const { error } = await supabase.from('reviews').insert([reviewData]);

    if (!error) {
      Swal.fire({
        title: 'Masterpiece Published',
        text: 'The patron voice is now live in the boutique.',
        icon: 'success',
        background: '#fcf9f5',
        confirmButtonColor: '#1a1a1a',
        customClass: { popup: 'rounded-[3rem]' },
      });
      form.reset();
      setImagePreview(null);
      setImageUrl('');
    } else {
      Swal.fire('Error', error.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 lg:p-12 bg-[#fcf9f5] min-h-screen font-sans">
      <header className="mb-12">
        <h2 className="text-5xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none">
          Curate{' '}
          <span className="text-[#E65100] not-italic">Patron Voice.</span>
        </h2>
        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-3">
          Publishing artisanal testimonials
        </p>
      </header>

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* --- LEFT: PORTRAIT UPLOAD (5 Columns) --- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 bg-[#1a1a1a] rounded-[4rem] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl"
        >
          <div className="relative group mb-8">
            <div className="w-48 h-48 rounded-[3.5rem] border-[10px] border-white/5 overflow-hidden shadow-2xl relative bg-white/5">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className={`w-full h-full object-cover ${isUploading && 'opacity-40 blur-sm'}`}
                  alt="Preview"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                  <ImageIcon size={48} strokeWidth={1} />
                  <p className="text-[8px] font-black uppercase mt-2 tracking-widest">
                    No Portrait
                  </p>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="animate-spin text-[#E65100]" size={32} />
                </div>
              )}
            </div>

            <label className="absolute -bottom-2 -right-2 p-4 bg-[#E65100] text-white rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-all border-4 border-[#1a1a1a]">
              <Camera size={20} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          <h4 className="text-white font-black text-xl tracking-tighter uppercase italic">
            Patron Portrait
          </h4>
          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.4em] mt-2">
            Visual Identity Verification
          </p>

          <div className="absolute -bottom-10 -left-10 text-[10rem] font-black text-white/[0.02] italic pointer-events-none rotate-12">
            STUDIO
          </div>
        </motion.div>

        {/* --- RIGHT: FORM DETAILS (7 Columns) --- */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 bg-white p-10 lg:p-14 rounded-[4rem] shadow-sm border border-black/5"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                  Patron Identity
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-6 py-4 bg-[#fcf9f5] rounded-full outline-none border border-transparent focus:border-[#E65100]/20 font-bold text-sm shadow-inner"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                  Patron Tier / Role
                </label>
                <input
                  name="role"
                  required
                  className="w-full px-6 py-4 bg-[#fcf9f5] rounded-full outline-none border border-transparent focus:border-[#E65100]/20 font-bold text-sm shadow-inner"
                  placeholder="e.g. Food Critic"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex justify-between">
                <span>Boutique Rating (0.0 - 5.0)</span>
                <span className="text-[#E65100] flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> Premium
                </span>
              </label>
              <input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                defaultValue="5.0"
                className="w-full px-6 py-4 bg-[#fcf9f5] rounded-full outline-none font-black text-[#E65100] shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                The Testimonial
              </label>
              <textarea
                name="review_text"
                required
                rows="4"
                className="w-full px-8 py-6 bg-[#fcf9f5] rounded-[2.5rem] outline-none font-bold italic text-gray-700 shadow-inner border border-transparent focus:border-orange-100 transition-all"
                placeholder="Describe the artisanal experience..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || isUploading}
              className="w-full py-6 bg-[#1a1a1a] text-white rounded-full font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#E65100] transition-all disabled:opacity-50"
            >
              {loading ? 'Synchronizing...' : 'Publish to Boutique'}{' '}
              <Send size={18} />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddReview;
