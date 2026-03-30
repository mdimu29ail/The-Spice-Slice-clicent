import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import animationData from '../assets/register.json';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChefHat,
  ChevronLeft,
  UserPlus,
} from 'lucide-react';

const Register = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    // --- Boutique Validation ---
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(password)) {
      setIsSubmitting(false);
      return Swal.fire({
        title: 'Security Standard Not Met',
        text: 'Master keys must be 6+ characters, with both uppercase and lowercase letters.',
        icon: 'warning',
        confirmButtonColor: '#E65100',
        background: '#fcf9f5',
        customClass: { popup: 'rounded-[2.5rem]' },
      });
    }

    try {
      // ১. ইউজার তৈরি করা
      const result = await createUser(email, password);

      // ২. প্রোফাইল আপডেট করা (নাম সেট করা)
      if (updateUserProfile) {
        await updateUserProfile({ displayName: name });
      }

      Swal.fire({
        title: 'Identity Created',
        text: `Welcome to the boutique circle, ${name}!`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
        background: '#fcf9f5',
        customClass: { popup: 'rounded-[2.5rem]' },
      });

      navigate('/');
    } catch (error) {
      Swal.fire('Registration Error', error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f5] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-orange-100">
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-[10%] left-[5%] w-72 h-72 bg-orange-100/30 rounded-full blur-[110px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] select-none">
          <h1 className="text-[30vw] font-black italic leading-none text-[#1a1a1a]">
            HERITAGE
          </h1>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-12 z-10">
        {/* --- RIGHT SIDE: ANIMATION & TEXT --- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hidden lg:flex flex-col justify-center items-end w-1/2 p-12 text-right"
        >
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-3xl flex items-center justify-center mb-8 shadow-2xl self-end">
            <UserPlus className="text-[#E65100]" size={32} />
          </div>
          <h2 className="text-6xl font-black text-[#1a1a1a] leading-tight tracking-tighter uppercase italic mb-6">
            Join the <br />{' '}
            <span className="text-[#E65100] not-italic">Elite Circle.</span>
          </h2>
          <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-sm mb-10">
            Create your unique identity to unlock artisanal flavors and
            personalized gourmand services.
          </p>
          <div className="w-full max-w-sm opacity-70 scale-110">
            <Lottie animationData={animationData} loop={true} />
          </div>
        </motion.div>

        {/* --- LEFT SIDE: REGISTER CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[500px] bg-white/70 backdrop-blur-3xl p-10 lg:p-14 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white relative"
        >
          {/* Back Button */}
          <Link
            to="/login"
            className="absolute top-10 left-10 text-gray-300 hover:text-[#E65100] transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>

          <header className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-6">
              <Sparkles size={14} className="text-[#E65100]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E65100]">
                Patron Registration
              </span>
            </div>
            <h3 className="text-3xl font-black text-[#1a1a1a] tracking-tighter uppercase">
              New Identity.
            </h3>
          </header>

          <form onSubmit={handleRegister} className="space-y-7">
            {/* Name Input */}
            <div className="group relative border-b border-black/10 focus-within:border-[#E65100] transition-all duration-500 pb-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 group-focus-within:text-[#E65100]">
                Full Name
              </label>
              <div className="flex items-center gap-4">
                <User
                  size={18}
                  className="text-gray-300 group-focus-within:text-[#E65100] transition-colors"
                />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Master Chef / Patron"
                  className="w-full bg-transparent outline-none text-sm font-bold text-[#1a1a1a] placeholder:text-gray-200"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="group relative border-b border-black/10 focus-within:border-[#E65100] transition-all duration-500 pb-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 group-focus-within:text-[#E65100]">
                Identity (Email)
              </label>
              <div className="flex items-center gap-4">
                <Mail
                  size={18}
                  className="text-gray-300 group-focus-within:text-[#E65100] transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="patron@spiceslice.com"
                  className="w-full bg-transparent outline-none text-sm font-bold text-[#1a1a1a] placeholder:text-gray-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group relative border-b border-black/10 focus-within:border-[#E65100] transition-all duration-500 pb-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 group-focus-within:text-[#E65100]">
                Secret Key (Password)
              </label>
              <div className="flex items-center gap-4">
                <Lock
                  size={18}
                  className="text-gray-300 group-focus-within:text-[#E65100] transition-colors"
                />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-sm font-bold text-[#1a1a1a] placeholder:text-gray-200"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full bg-[#1a1a1a] text-[#fcf9f5] py-5 rounded-2xl flex items-center justify-center gap-4 shadow-2xl hover:bg-[#E65100] transition-all duration-500 disabled:opacity-50"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                {isSubmitting ? 'Creating Identity...' : 'Initialize Access'}
              </span>
              <ArrowRight size={18} />
            </motion.button>
          </form>

          {/* Login Footer */}
          <p className="mt-12 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            Already an Authorized Patron?
            <Link
              to="/login"
              className="text-[#E65100] ml-2 underline underline-offset-4 hover:text-[#1a1a1a] transition-colors font-black"
            >
              Sign In
            </Link>
          </p>

          <div className="mt-10 flex justify-center items-center gap-2 text-green-600/50">
            <ShieldCheck size={14} />
            <p className="text-[9px] font-black uppercase tracking-widest">
              Privacy Protected Portal
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
