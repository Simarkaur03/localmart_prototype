import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchProfile = useStore(state => state.fetchProfile);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Supabase Auth Call
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 2. Fetch Profile to get role
      const { data: profile, error: profileError } = await fetchProfile(data.user.id);
      
      // Even if profile is missing, our hardened fetchProfile provides a default
      const userRole = profile?.role || 'customer';
      
      toast.success('Login successful!');

      // 3. Post-login redirection
      if (userRole === 'customer') navigate('/home');
      else if (userRole === 'owner') navigate('/owner/dashboard');
      else if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'delivery') navigate('/delivery/dashboard');
      else navigate('/home');

    } catch (error) {
      console.error("Auth Error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-96 text-center mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Local Mart</h1>
        <p className="text-gray-500 font-medium">Hyperlocal Shopping Simplified</p>
      </div>

      <form onSubmit={handleLogin} className="p-10 bg-white shadow-premium rounded-[2.5rem] w-96 border border-gray-100">
        <h2 className="text-2xl font-black mb-8 text-center text-gray-800 tracking-tight">Welcome Back</h2>
        
        <div className="space-y-4">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-4 mt-8 rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-purple-700 shadow-xl shadow-purple-100 disabled:opacity-70 transition-all flex items-center justify-center"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Authenticating...</span>
            </span>
          ) : 'Login'}
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 font-black hover:text-purple-700">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
