import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // অ্যাডমিন চেক লজিক
  const checkAdminStatus = email => {
    const adminEmails = ['drdanger219@gmail.com']; // আপনার ইমেইল এখানে দিন
    setIsAdmin(adminEmails.includes(email));
  };

  useEffect(() => {
    // বর্তমান সেশন চেক
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) checkAdminStatus(session.user.email);
      setLoading(false);
    };
    initAuth();

    // সেশন চেঞ্জ লিসেনার
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.email);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- নতুন ইউজার তৈরি (Sign Up) ---
  // createUser ফাংশনটি এভাবে পরিবর্তন করুন
  const createUser = async (email, password, name) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name, // একসাথেই নাম পাঠিয়ে দিচ্ছি
          display_name: name,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        },
      },
    });

    if (error) {
      setLoading(false);
      throw error;
    }
    return data;
  };

  // --- প্রোফাইল আপডেট (যেমন: নাম বা ছবি সেট করা) ---
  const updateUserProfile = async profileData => {
    const { data, error } = await supabase.auth.updateUser({
      data: profileData, // metadata হিসেবে নাম এবং ছবি সেভ হবে
    });
    if (error) throw error;
    return data;
  };

  // লগইন ফাংশন
  const logIn = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoading(false);
      throw error;
    }
    return data;
  };

  // গুগল লগইন
  const signinWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
    return data;
  };

  // লগআউট
  const logOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  };

  const authInfo = {
    user,
    isAdmin,
    loading,
    createUser, // এটিই Register.jsx খুঁজছে
    updateUserProfile, // এটি নাম সেভ করার জন্য
    logIn,
    signinWithGoogle,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
