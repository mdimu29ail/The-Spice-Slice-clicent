import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- ১. অ্যাডমিন রোল চেক (Database Driven) ---
  const fetchUserRole = async (userId, email) => {
    try {
      // প্রথমে হার্ডকোড চেক (আপনার ইমেইল)
      if (email === 'mdimu29@gmail.com') {
        setIsAdmin(true);
        return;
      }

      // প্রোফাইল টেবিল থেকে রোল চেক
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!error && data?.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // ২. বর্তমান সেশন এবং রোল ইনিশিয়ালাইজ করা
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id, session.user.email);
      }
      setLoading(false);
    };
    initAuth();

    // ৩. সেশন চেঞ্জ লিসেনার (Real-time Sync)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id, session.user.email);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- ৪. নতুন ইউজার তৈরি (Metadata সহ) ---
  const createUser = async (email, password, name) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
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

  // --- ৫. লগইন ফাংশন ---
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

  // --- ৬. গুগল লগইন ---
  const signinWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // ডেপলয়মেন্টের পর এটি কাজ করবে
      },
    });
    if (error) throw error;
    return data;
  };

  // --- ৭. লগআউট ---
  const logOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  };

  const authInfo = {
    user,
    isAdmin,
    loading,
    createUser,
    logIn,
    signinWithGoogle,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
