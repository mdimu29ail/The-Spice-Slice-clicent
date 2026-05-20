import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, CheckCircle2, Loader2, ImagePlus } from 'lucide-react';
import { supabase } from '../../supabase/supabaseClient';
import Swal from 'sweetalert2';

const AddGalleryImage = ({ onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const file = form.image.files[0];
    const title = form.title.value;
    const category = form.category.value;

    try {
      // ১. ইমেজ আপলোড করা (Storage Bucket: gourmet-gallery)
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gourmet-gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // ২. পাবলিক ইউআরএল পাওয়া
      const {
        data: { publicUrl },
      } = supabase.storage.from('gourmet-gallery').getPublicUrl(fileName);

      // ৩. ডাটাবেসে সেভ করা (Table: gallery)
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([{ src: publicUrl, title, category }]);

      if (dbError) throw dbError;

      // ৪. সফল হওয়ার পর মেসেজ
      Swal.fire({
        title: 'Masterpiece Archived',
        text: 'The visual art has been added to the boutique gallery.',
        icon: 'success',
        background: '#fcf9f5',
        confirmButtonColor: '#1a1a1a',
        customClass: { popup: 'rounded-[3rem] shadow-2xl' },
      });

      // ✅ এরর ফিক্স: যদি onRefresh ফাংশন হিসেবে পাঠানো হয় তবেই কল করবে
      if (typeof onRefresh === 'function') {
        onRefresh();
      }

      onClose(); // মোডাল বন্ধ করা
    } catch (err) {
      console.error('Upload Error:', err.message);
      Swal.fire({
        title: 'Boutique Error',
        text: err.message || 'Failed to archive the artwork.',
        icon: 'error',
        confirmButtonColor: '#E65100',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#fcf9f5] w-full max-w-lg rounded-[3.5rem] p-10 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 hover:bg-black/5 rounded-full transition-all"
        >
          <X size={24} />
        </button>

        <header className="mb-8">
          <div className="flex items-center gap-2 text-[#E65100] mb-2">
            <ImagePlus size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Visual Curation
            </span>
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
            Add <span className="text-[#E65100] not-italic">Visual Art.</span>
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Artwork Title
            </label>
            <input
              name="title"
              placeholder="The Flame Prep..."
              className="w-full bg-white border border-black/5 rounded-2xl p-5 outline-none focus:border-[#E65100]/20 transition-all font-bold text-sm shadow-inner"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Art Category
            </label>
            <input
              name="category"
              placeholder="e.g. Signature, Atmosphere"
              className="w-full bg-white border border-black/5 rounded-2xl p-5 outline-none focus:border-[#E65100]/20 transition-all font-bold text-sm shadow-inner"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Visual File
            </label>
            <div
              className={`border-2 border-dashed ${fileSelected ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'} p-8 rounded-[2rem] text-center transition-all group`}
            >
              <input
                type="file"
                name="image"
                className="hidden"
                id="file-upload"
                accept="image/*"
                required
                onChange={e => setFileSelected(e.target.files[0]?.name)}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                {fileSelected ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="text-green-500 mb-2" size={32} />
                    <span className="text-[10px] font-black uppercase text-green-600 truncate max-w-[200px]">
                      {fileSelected}
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload
                      className="text-[#E65100] group-hover:scale-110 transition-transform"
                      size={32}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Select High-Res Image
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white py-5 rounded-full font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:bg-[#E65100] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Archiving...</span>
              </>
            ) : (
              <>
                <span>Confirm Archive</span>
                <CheckCircle2 size={16} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGalleryImage;
