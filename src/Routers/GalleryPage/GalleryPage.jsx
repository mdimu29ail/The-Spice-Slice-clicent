import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import {
  Maximize2,
  Sparkles,
  Camera,
  ArrowUpRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { supabase } from '../../supabase/supabaseClient';
import { AuthContext } from '../../Auth/AuthContext';
import Loading from '../../Loading/Loading';
import AddGalleryImage from './AddGalleryImage';
import Swal from 'sweetalert2';

const GalleryPage = () => {
  const [index, setIndex] = useState(-1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { isAdmin } = useContext(AuthContext);

  // --- ১. ডাটা ফেচিং ফাংশন ---
  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error('Fetch Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- ২. রিয়েল-টাইম সাবস্ক্রিপশন (Auto Update) ---
  useEffect(() => {
    fetchImages();

    // Supabase Realtime লিসেনার সেটআপ
    const galleryChannel = supabase
      .channel('live-gallery-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery' },
        payload => {
          if (payload.eventType === 'INSERT') {
            setImages(prev => [payload.new, ...prev]);
          }
          if (payload.eventType === 'DELETE') {
            setImages(prev => prev.filter(img => img.id !== payload.old.id));
          }
          if (payload.eventType === 'UPDATE') {
            setImages(prev =>
              prev.map(img => (img.id === payload.new.id ? payload.new : img)),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(galleryChannel);
    };
  }, []);

  // --- ৩. ডিলিট লজিক ---
  const handleDelete = async id => {
    const confirm = await Swal.fire({
      title: 'Remove Masterpiece?',
      text: 'This visual will be purged from the live archive.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      cancelButtonColor: '#E65100',
      confirmButtonText: 'Delete Forever',
      background: '#fcf9f5',
      customClass: { popup: 'rounded-[3rem] border border-black/5 shadow-2xl' },
    });

    if (confirm.isConfirmed) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) {
        Swal.fire('Error', 'Deletion failed.', 'error');
      } else {
        // Realtime থাকার কারণে ম্যানুয়ালি স্টেট আপডেট করার প্রয়োজন নেই, অটো হবে।
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          background: '#1a1a1a',
          color: '#fff',
        });
        Toast.fire({ icon: 'success', title: 'Masterpiece Removed' });
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#fcf9f5] pt-32 pb-20 px-6 lg:px-20 relative overflow-hidden font-sans selection:bg-orange-100">
      {/* --- BACKGROUND WATERMARK --- */}
      <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none z-0">
        <h1 className="text-[25vw] font-black italic uppercase leading-none mt-10">
          Archive
        </h1>
      </div>

      <div className="container mx-auto relative z-10">
        {/* --- HEADER SECTION --- */}
        <header className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-6"
            >
              <Camera size={18} className="text-[#E65100]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
                Visual Portfolio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl lg:text-9xl font-black text-[#1a1a1a] tracking-tighter leading-none italic uppercase"
            >
              Artisanal{' '}
              <span className="text-[#E65100] not-italic underline decoration-1 underline-offset-8">
                Gallery.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 text-gray-500 text-lg font-medium leading-relaxed max-w-lg border-l-4 border-[#E65100]/20 pl-8 italic"
            >
              Explore the fire, spice, and precision of our boutique kitchen
              through our curated visual archive.
            </motion.p>
          </div>

          {/* Admin Action */}
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdminOpen(true)}
              className="bg-[#1a1a1a] text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:bg-[#E65100] transition-all"
            >
              <Plus size={18} /> Add masterpiece
            </motion.button>
          )}
        </header>

        {/* --- GRID SECTION (Fixed Aspect Ratio) --- */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {images.map((image, i) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                whileHover={{ y: -10 }}
                className="relative group cursor-pointer aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white transition-all duration-500"
              >
                {/* Fixed Square Image */}
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-in-out"
                  onClick={() => setIndex(i)}
                />

                {/* Admin Delete Action */}
                {isAdmin && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(image.id);
                    }}
                    className="absolute top-6 right-6 bg-red-500 text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20 shadow-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {/* Luxury Hover Text */}
                <div
                  onClick={() => setIndex(i)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 backdrop-blur-[2px]"
                >
                  <p className="text-[10px] font-black text-[#E65100] uppercase tracking-[0.3em] mb-2">
                    {image.category || 'Boutique'}
                  </p>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                    {image.title}{' '}
                    <ArrowUpRight size={20} className="text-white/40" />
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- EMPTY STATE --- */}
        {images.length === 0 && !loading && (
          <div className="py-40 text-center opacity-20">
            <Camera size={80} strokeWidth={1} className="mx-auto mb-4" />
            <p className="text-sm font-black uppercase tracking-[0.5em]">
              The archive is currently empty
            </p>
          </div>
        )}

        {/* --- LIGHTBOX --- */}
        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={images.map(img => ({ src: img.src }))}
          index={index}
        />
      </div>

      {/* --- ADMIN MODAL --- */}
      {isAdminOpen && (
        <AddGalleryImage
          onClose={() => setIsAdminOpen(false)}
          onRefresh={fetchImages} // Fallback for browsers with slow realtime sync
        />
      )}
    </div>
  );
};

export default GalleryPage;
