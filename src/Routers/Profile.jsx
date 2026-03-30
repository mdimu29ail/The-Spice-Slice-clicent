// import React, { useContext, useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Mail,
//   Phone,
//   MapPin,
//   LogOut,
//   ShieldCheck,
//   Sparkles,
//   Zap,
//   Edit3,
//   ShoppingBag,
//   Award,
//   Save,
//   X,
//   Camera,
//   Loader2,
// } from 'lucide-react';
// import { AuthContext } from '../Auth/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../supabase/supabaseClient';
// import Swal from 'sweetalert2';
// import Loading from '../Loading/Loading';

// const ProfileCard = () => {
//   const { user, logOut, isAdmin } = useContext(AuthContext);
//   const [profile, setProfile] = useState(null);
//   const [orderCount, setOrderCount] = useState(0);
//   const [totalSpent, setTotalSpent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [isUploading, setIsUploading] = useState(false);

//   // এডিটিং স্টেট
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     full_name: '',
//     phone: '',
//     address: '',
//     bio: '',
//   });

//   const navigate = useNavigate();

//   // --- ১. ডাটা ফেচিং লজিক ---
//   const fetchFullIdentity = async () => {
//     if (!user?.id) return;
//     setLoading(true);

//     try {
//       const { data: profileData } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', user.id)
//         .single();

//       const { data: orders } = await supabase
//         .from('applications')
//         .select('price_usd')
//         .eq('applicant_email', user.email);

//       if (profileData) {
//         setProfile(profileData);
//         setFormData({
//           full_name: profileData.full_name || '',
//           phone: profileData.phone || '',
//           address: profileData.address || '',
//           bio: profileData.bio || '',
//         });
//       }

//       if (orders) {
//         setOrderCount(orders.length);
//         const spent = orders.reduce(
//           (acc, curr) => acc + (Number(curr.price_usd) || 0),
//           0,
//         );
//         setTotalSpent(spent.toFixed(2));
//       }
//     } catch (err) {
//       console.error('Identity Fetch Error:', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFullIdentity();
//   }, [user]);

//   // --- ২. ইমেজ আপলোড লজিক (Supabase Storage) ---
//   const handleImageUpload = async e => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setIsUploading(true);
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${user.id}-${Date.now()}.${fileExt}`;
//     const filePath = `avatars/${fileName}`;

//     try {
//       // ১. 'avatars' বাকেটে আপলোড করা
//       const { error: uploadError } = await supabase.storage
//         .from('avatars')
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       // ২. পাবলিক ইউআরএল পাওয়া
//       const {
//         data: { publicUrl },
//       } = supabase.storage.from('avatars').getPublicUrl(filePath);

//       // ৩. প্রোফাইল টেবিলে আপডেট করা
//       const { error: updateError } = await supabase
//         .from('profiles')
//         .update({ avatar_url: publicUrl })
//         .eq('id', user.id);

//       if (updateError) throw updateError;

//       setProfile({ ...profile, avatar_url: publicUrl });

//       Swal.fire({
//         toast: true,
//         position: 'top-end',
//         icon: 'success',
//         title: 'Boutique Portrait Updated',
//         showConfirmButton: false,
//         timer: 2000,
//         background: '#1a1a1a',
//         color: '#fff',
//       });
//     } catch (err) {
//       Swal.fire('Upload Failed', err.message, 'error');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // --- ৩. প্রোফাইল টেক্সট আপডেট লজিক ---
//   const handleUpdateProfile = async () => {
//     setLoading(true);
//     try {
//       const { error } = await supabase
//         .from('profiles')
//         .update({
//           full_name: formData.full_name,
//           phone: formData.phone,
//           address: formData.address,
//           bio: formData.bio,
//           updated_at: new Date(),
//         })
//         .eq('id', user.id);

//       if (error) throw error;

//       Swal.fire({
//         title: 'Identity Refined',
//         text: 'Synchronized with Boutique Records.',
//         icon: 'success',
//         background: '#fcf9f5',
//         confirmButtonColor: '#1a1a1a',
//         customClass: { popup: 'rounded-[3rem]' },
//       });

//       setIsEditing(false);
//       fetchFullIdentity();
//     } catch (err) {
//       Swal.fire('Update Failed', err.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !profile) return <Loading />;

//   return (
//     <div className="space-y-12 pb-20 relative font-sans selection:bg-orange-100">
//       {/* Background Watermark */}
//       <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none select-none -z-10">
//         <h1 className="text-[20vw] font-black italic uppercase leading-none mt-10">
//           Identity
//         </h1>
//       </div>

//       {/* --- 1. IDENTITY HEADER CARD --- */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-[4rem] p-10 lg:p-16 shadow-sm border border-black/5 relative overflow-hidden group"
//       >
//         <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
//           {/* Avatar Area with Upload Option */}
//           <div className="relative">
//             <div className="w-48 h-48 rounded-[4.5rem] border-[12px] border-[#fcf9f5] shadow-2xl overflow-hidden relative group/avatar">
//               <img
//                 src={
//                   profile?.avatar_url ||
//                   `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`
//                 }
//                 alt="Identity"
//                 className={`w-full h-full object-cover transition-all duration-700 ${isUploading ? 'opacity-40 blur-sm' : 'group-hover/avatar:scale-110'}`}
//               />
//               {isUploading && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Loader2 className="animate-spin text-[#E65100]" size={32} />
//                 </div>
//               )}
//             </div>

//             {/* Camera Upload Button */}
//             <label className="absolute bottom-2 right-2 p-4 bg-[#1a1a1a] text-white rounded-2xl shadow-xl hover:bg-[#E65100] transition-all hover:scale-110 cursor-pointer border-4 border-white">
//               <Camera size={20} />
//               <input
//                 type="file"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 disabled={isUploading}
//               />
//             </label>
//           </div>

//           {/* Core Info */}
//           <div className="flex-1 text-center lg:text-left space-y-4">
//             <div className="flex items-center justify-center lg:justify-start gap-4">
//               <div
//                 className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${isAdmin ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'}`}
//               >
//                 {isAdmin ? (
//                   <ShieldCheck size={12} />
//                 ) : (
//                   <Zap size={12} fill="currentColor" />
//                 )}
//                 <span className="text-[10px] font-black uppercase tracking-widest">
//                   {isAdmin ? 'Executive Curator' : 'Verified Patron'}
//                 </span>
//               </div>
//             </div>

//             {isEditing ? (
//               <div className="space-y-1">
//                 <p className="text-[10px] font-black text-[#E65100] uppercase tracking-widest ml-1">
//                   Identity Name
//                 </p>
//                 <input
//                   className="text-4xl lg:text-5xl font-black text-[#1a1a1a] tracking-tighter uppercase italic bg-[#fcf9f5] border-b-2 border-[#E65100] outline-none w-full px-2"
//                   value={formData.full_name}
//                   onChange={e =>
//                     setFormData({ ...formData, full_name: e.target.value })
//                   }
//                 />
//               </div>
//             ) : (
//               <h2 className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter leading-none uppercase italic">
//                 {profile?.full_name || 'Anonymous Patron'}
//               </h2>
//             )}

//             <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-400">
//               <Mail size={16} className="text-[#E65100]" />
//               <span className="text-xs font-bold uppercase tracking-tight">
//                 {user?.email}
//               </span>
//             </div>
//           </div>

//           {/* Edit/Save Switch */}
//           <div className="flex flex-col gap-3">
//             {isEditing ? (
//               <motion.button
//                 onClick={handleUpdateProfile}
//                 whileHover={{ scale: 1.05 }}
//                 className="px-10 py-5 bg-[#E65100] text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-xl flex items-center gap-3 transition-all"
//               >
//                 Save Changes <Save size={16} />
//               </motion.button>
//             ) : (
//               <motion.button
//                 onClick={() => setIsEditing(true)}
//                 whileHover={{ scale: 1.05 }}
//                 className="px-10 py-5 bg-[#1a1a1a] text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-[#E65100] transition-all flex items-center gap-3"
//               >
//                 Refine Profile <Edit3 size={16} />
//               </motion.button>
//             )}
//           </div>
//         </div>
//       </motion.div>

//       {/* --- 2. BOUTIQUE RECORDS GRID --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//         {/* Left Side: Boutique Records */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//           className="lg:col-span-7 bg-white p-12 rounded-[3.5rem] border border-black/5 shadow-sm"
//         >
//           <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tighter italic mb-10 flex items-center gap-3">
//             <div className="w-1.5 h-6 bg-[#E65100] rounded-full" /> Boutique
//             Ledger
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12">
//             <EditableField
//               isEditing={isEditing}
//               label="Contact Link (Phone)"
//               value={formData.phone}
//               onChange={val => setFormData({ ...formData, phone: val })}
//               icon={<Phone size={16} />}
//             />

//             <EditableField
//               isEditing={isEditing}
//               label="Residency (Address)"
//               value={formData.address}
//               onChange={val => setFormData({ ...formData, address: val })}
//               icon={<MapPin size={16} />}
//             />

//             <ReadOnlyField
//               label="Boutique Member Since"
//               value={new Date(profile?.created_at).toLocaleDateString('en-US', {
//                 month: 'long',
//                 year: 'numeric',
//               })}
//               icon={<Award size={16} />}
//             />

//             <ReadOnlyField
//               label="Patron Auth Tier"
//               value={isAdmin ? 'Executive Suite' : 'Authenticated Patron'}
//               icon={<ShieldCheck size={16} />}
//             />
//           </div>

//           {/* Biography */}
//           <div className="mt-12 pt-10 border-t border-black/5">
//             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4">
//               Artisanal Biography
//             </p>
//             {isEditing ? (
//               <textarea
//                 className="w-full bg-[#fcf9f5] p-6 rounded-[2rem] text-sm font-bold uppercase outline-none border-2 border-transparent focus:border-[#E65100]/20 min-h-[150px] shadow-inner italic"
//                 value={formData.bio}
//                 onChange={e =>
//                   setFormData({ ...formData, bio: e.target.value })
//                 }
//                 placeholder="Enter your gourmet history..."
//               />
//             ) : (
//               <p className="text-sm font-medium text-gray-500 leading-relaxed italic uppercase tracking-wider">
//                 {profile?.bio ||
//                   'No biography recorded in the boutique ledger.'}
//               </p>
//             )}
//           </div>
//         </motion.div>

//         {/* Right Side: Visual Metrics (FIXED) */}
//         <div className="lg:col-span-5 space-y-8">
//           <motion.div
//             whileHover={{ y: -5 }}
//             className="bg-[#1a1a1a] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group"
//           >
//             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-8">
//               Engagement
//             </p>
//             <div className="flex justify-between items-end relative z-10">
//               <div>
//                 <h4 className="text-6xl font-black italic tracking-tighter">
//                   {orderCount}
//                 </h4>
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-[#E65100] mt-2 italic">
//                   Masterpieces Acquired
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">
//                   Portfolio Value
//                 </p>
//                 <p className="text-2xl font-black text-white italic tracking-tighter">
//                   ${totalSpent}
//                 </p>
//               </div>
//             </div>
//             <ShoppingBag
//               size={80}
//               className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-transform duration-700"
//             />
//           </motion.div>

//           <div className="bg-orange-50 p-10 rounded-[3.5rem] border border-orange-100 flex flex-col justify-between h-52 relative overflow-hidden">
//             <div className="relative z-10">
//               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E65100]">
//                 Patron Reputation
//               </p>
//               <div className="flex items-center gap-1 mt-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Sparkles
//                     key={i}
//                     size={22}
//                     className={
//                       i < 4
//                         ? 'text-[#E65100] fill-[#E65100]'
//                         : 'text-[#E65100]/30'
//                     }
//                   />
//                 ))}
//               </div>
//             </div>
//             <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter italic relative z-10">
//               Elite Contributor
//             </p>
//             <div className="absolute top-[-20px] right-[-20px] text-[100px] font-black text-orange-200/20 italic select-none">
//               VIP
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Reusable Components ---
// const EditableField = ({ isEditing, label, value, onChange, icon }) => (
//   <div className="space-y-2 group">
//     <div className="flex items-center gap-2 text-gray-300 group-focus-within:text-[#E65100] transition-colors">
//       {icon}{' '}
//       <span className="text-[10px] font-black uppercase tracking-widest">
//         {label}
//       </span>
//     </div>
//     {isEditing ? (
//       <input
//         className="w-full bg-[#fcf9f5] border-b-2 border-[#E65100] text-sm font-black uppercase outline-none pb-1 transition-all"
//         value={value}
//         onChange={e => onChange(e.target.value)}
//       />
//     ) : (
//       <p className="text-sm font-black text-[#1a1a1a] uppercase tracking-tight border-b border-black/[0.03] pb-1">
//         {value || 'Not Defined'}
//       </p>
//     )}
//   </div>
// );

// const ReadOnlyField = ({ label, value, icon }) => (
//   <div className="space-y-2 opacity-60">
//     <div className="flex items-center gap-2 text-gray-300">
//       {icon}{' '}
//       <span className="text-[10px] font-black uppercase tracking-widest">
//         {label}
//       </span>
//     </div>
//     <p className="text-sm font-black text-[#1a1a1a] uppercase tracking-tight border-b border-black/[0.03] pb-1">
//       {value}
//     </p>
//   </div>
// );

// export default ProfileCard;
import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  LogOut,
  User,
  ShieldCheck,
  Sparkles,
  Zap,
  Camera,
  Edit3,
  Save,
  X,
  Info,
} from 'lucide-react';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import Swal from 'sweetalert2';
import Loading from '../Loading/Loading';

const ProfileCard = () => {
  const { user, logOut, isAdmin } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // এডিট মোড স্টেট
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  // --- ডাটা ফেচিং ---
  const fetchProfile = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error) {
      setProfile(data);
      setEditData(data); // এডিট ফর্মের জন্য ডাটা সেট করা
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // --- আপডেট লজিক ---
  const handleUpdate = async e => {
    e.preventDefault();
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editData.full_name,
        phone: editData.phone,
        address: editData.address,
        bio: editData.bio,
        updated_at: new Date(),
      })
      .eq('id', user.id);

    if (!error) {
      setProfile(editData);
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Identity Refined!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#1a1a1a',
        color: '#fff',
      });
    } else {
      Swal.fire('Error', 'Could not update profile', 'error');
    }
  };

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: 'Signing Out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      confirmButtonText: 'Logout',
    });
    if (result.isConfirmed) {
      await logOut();
      navigate('/login');
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div className="space-y-12 pb-20 relative font-sans">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none select-none -z-10">
        <h1 className="text-[20vw] font-black italic uppercase leading-none mt-10">
          Identity
        </h1>
      </div>

      {/* --- 1. IDENTITY HEADER CARD --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[4rem] p-10 lg:p-16 shadow-sm border border-black/5 relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="relative">
            <div className="w-44 h-44 rounded-[4rem] border-[12px] border-[#fcf9f5] shadow-2xl overflow-hidden">
              <img
                src={
                  profile?.avatar_url ||
                  user?.user_metadata?.avatar_url ||
                  'https://i.pravatar.cc/150'
                }
                alt="Identity"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-3 bg-[#1a1a1a] text-white rounded-2xl shadow-xl hover:bg-[#E65100]">
              <Camera size={20} />
            </button>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${isAdmin ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}
              >
                {isAdmin ? (
                  <ShieldCheck size={12} />
                ) : (
                  <Zap size={12} fill="currentColor" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isAdmin ? 'Executive' : 'Patron'}
                </span>
              </div>
            </div>

            {isEditing ? (
              <input
                type="text"
                className="text-4xl lg:text-5xl font-black text-[#1a1a1a] border-b-2 border-[#E65100] outline-none bg-transparent w-full uppercase tracking-tighter"
                value={editData.full_name}
                onChange={e =>
                  setEditData({ ...editData, full_name: e.target.value })
                }
              />
            ) : (
              <h2 className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter leading-none uppercase italic">
                {profile?.full_name || 'Anonymous Patron'}
              </h2>
            )}

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#E65100]" />
                <span className="text-xs font-bold uppercase">
                  {user?.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#E65100]" />
                <span className="text-xs font-bold uppercase">
                  {profile?.address || 'Dhaka, BD'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit/Save Button Toggle */}
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsEditing(true)}
              className="px-10 py-5 bg-[#1a1a1a] text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-[#E65100] flex items-center gap-3"
            >
              Refine Identity <Edit3 size={16} />
            </motion.button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="p-5 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all"
              >
                <Save size={20} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-5 bg-gray-200 text-gray-600 rounded-full shadow-lg hover:bg-gray-300 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* --- 2. EDITABLE LEDGER GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div className="lg:col-span-12 bg-white p-12 rounded-[3.5rem] border border-black/5 shadow-sm">
          <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tighter italic mb-10 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#E65100] rounded-full" /> Detailed
            Ledger
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <EditableRow
              isEditing={isEditing}
              label="Registered Mobile"
              value={editData.phone}
              icon={<Phone size={16} />}
              onChange={val => setEditData({ ...editData, phone: val })}
            />
            <EditableRow
              isEditing={isEditing}
              label="Physical Residency"
              value={editData.address}
              icon={<MapPin size={16} />}
              onChange={val => setEditData({ ...editData, address: val })}
            />
          </div>

          <div className="mt-12 pt-10 border-t border-black/5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4">
              Biography
            </p>
            {isEditing ? (
              <textarea
                className="w-full bg-[#fcf9f5] p-6 rounded-3xl outline-none focus:ring-2 focus:ring-orange-100 font-medium italic"
                value={editData.bio}
                onChange={e =>
                  setEditData({ ...editData, bio: e.target.value })
                }
                rows="4"
              />
            ) : (
              <p className="text-sm font-medium text-gray-500 leading-relaxed italic uppercase tracking-wider">
                {profile?.bio || 'No biography provided.'}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- সাব-কম্পোনেন্ট: এডিটেবল রো ---
const EditableRow = ({ isEditing, label, value, icon, onChange }) => (
  <div className="space-y-2 border-b border-black/[0.03] pb-4">
    <div className="flex items-center gap-2 text-gray-300">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    {isEditing ? (
      <input
        type="text"
        className="w-full bg-[#fcf9f5] px-4 py-2 rounded-xl outline-none font-bold text-[#1a1a1a]"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    ) : (
      <p className="text-sm font-black text-[#1a1a1a] uppercase truncate">
        {value || 'Not Defined'}
      </p>
    )}
  </div>
);

export default ProfileCard;