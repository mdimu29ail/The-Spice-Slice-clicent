import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShieldCheck,
  Mail,
  Trash2,
  Search,
  Edit3,
  X,
  Camera,
  Phone,
  MapPin,
  Info,
  Save,
  Upload,
  Hash,
} from 'lucide-react';
import Swal from 'sweetalert2';
import Loading from '../Loading/Loading';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setUsers(data || []);
    setLoading(false);
  };

  const handleOpenEditModal = patron => {
    setSelectedUser(patron);
    setEditForm({
      full_name: patron.full_name || '',
      phone: patron.phone || '',
      address: patron.address || '',
      bio: patron.bio || '',
      avatar_url: patron.avatar_url || '',
    });
  };

  const handleImageUpload = async (e, userId) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fileName = `${userId}-${Date.now()}`;
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setEditForm(prev => ({ ...prev, avatar_url: publicUrl }));
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Visual Uploaded',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire('Upload Failed', err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editForm.full_name,
        phone: editForm.phone,
        address: editForm.address,
        bio: editForm.bio,
        avatar_url: editForm.avatar_url,
        updated_at: new Date(),
      })
      .eq('id', selectedUser.id);

    if (!error) {
      Swal.fire({
        title: 'Identity Refined',
        icon: 'success',
        background: '#fcf9f5',
        confirmButtonColor: '#1a1a1a',
      });
      fetchUsers();
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(
    u =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 pb-20 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#1a1a1a] tracking-tighter italic uppercase">
            Patron <span className="text-[#E65100] not-italic">Ledger.</span>
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
            Membership Directory Management
          </p>
        </div>
        <div className="relative group w-full md:w-80">
          <input
            type="text"
            placeholder="Search Identity..."
            className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:border-[#E65100]/30 transition-all shadow-sm outline-none font-bold"
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
            size={18}
          />
        </div>
      </header>

      {/* --- USERS TABLE SECTION --- */}
      <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcf9f5] border-b border-black/5">
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-2">
                  <Hash size={12} /> No.
                </div>
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Patron Identity
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Digital Identity (Email)
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Auth Tier
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Contact Link
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((patron, i) => (
                <motion.tr
                  key={patron.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-black/[0.03] hover:bg-[#fcf9f5]/50 transition-all group"
                >
                  <td className="p-8 font-mono text-gray-300 text-xs">
                    0{i + 1}
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                        <img
                          src={
                            patron.avatar_url ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${patron.full_name}`
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-black text-[#1a1a1a] uppercase tracking-tight">
                        {patron.full_name || 'Guest Patron'}
                      </span>
                    </div>
                  </td>
                  <td className="p-8 font-bold text-gray-400">
                    {patron.email}
                  </td>
                  <td className="p-8">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${patron.role === 'admin' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                    >
                      {patron.role === 'admin' && <ShieldCheck size={10} />}
                      {patron.role || 'Patron'}
                    </div>
                  </td>
                  <td className="p-8 font-black text-[#1a1a1a] italic">
                    {patron.phone || 'No Link'}
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(patron)}
                        className="p-3 bg-[#1a1a1a] text-white rounded-xl hover:bg-[#E65100] transition-all shadow-md"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic">
            No patron records found...
          </div>
        )}
      </div>

      {/* --- BOUTIQUE EDIT MODAL (FUNCTIONALITY UNCHANGED) --- */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-[#fcf9f5] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20"
            >
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-8 right-8 z-10 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-black hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              {/* Modal Left */}
              <div className="md:w-1/3 bg-[#1a1a1a] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="relative group mb-6">
                  <div className="w-32 h-32 rounded-[3rem] border-4 border-white/10 overflow-hidden shadow-2xl relative">
                    <img
                      src={
                        editForm.avatar_url || 'https://via.placeholder.com/150'
                      }
                      className={`w-full h-full object-cover ${isUploading && 'opacity-50'}`}
                      alt=""
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#E65100] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-3 bg-[#E65100] text-white rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-all border-4 border-[#1a1a1a]">
                    <Camera size={18} />
                    <input
                      type="file"
                      className="hidden"
                      onChange={e => handleImageUpload(e, selectedUser.id)}
                      accept="image/*"
                    />
                  </label>
                </div>
                <h4 className="text-white font-black text-xl tracking-tighter uppercase italic">
                  {editForm.full_name}
                </h4>
                <div className="absolute -bottom-10 -left-10 text-[8rem] font-black text-white/[0.03] italic pointer-events-none rotate-12">
                  ID
                </div>
              </div>

              {/* Modal Right */}
              <div className="flex-1 p-10 lg:p-14 bg-white relative">
                <div className="flex items-center gap-2 text-[#E65100] mb-8">
                  <Info size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    Refining Identity
                  </span>
                </div>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditInput
                      label="Patron Full Name"
                      value={editForm.full_name}
                      onChange={val =>
                        setEditForm({ ...editForm, full_name: val })
                      }
                      icon={<User size={14} />}
                    />
                    <EditInput
                      label="Contact Link (Phone)"
                      value={editForm.phone}
                      onChange={val => setEditForm({ ...editForm, phone: val })}
                      icon={<Phone size={14} />}
                    />
                  </div>
                  <EditInput
                    label="Residency (Address)"
                    value={editForm.address}
                    onChange={val => setEditForm({ ...editForm, address: val })}
                    icon={<MapPin size={14} />}
                  />
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4 block">
                      Patron Biography
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={e =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      className="w-full bg-[#fcf9f5] rounded-[2rem] p-6 text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-orange-100 transition-all min-h-[100px] shadow-inner italic"
                      placeholder="Enter history..."
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#1a1a1a] text-white py-5 rounded-full font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#E65100] transition-all"
                  >
                    Commit Changes <Save size={18} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EditInput = ({ label, value, icon, onChange }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4 block">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E65100] transition-colors">
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#fcf9f5] pl-12 pr-6 py-4 rounded-full text-sm font-black uppercase text-[#1a1a1a] outline-none border border-transparent focus:border-[#E65100]/20 transition-all shadow-inner"
      />
    </div>
  </div>
);

export default UserManagement;
