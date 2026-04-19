import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchProfile = useStore(state => state.fetchProfile);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profile, error: profileError } = await fetchProfile(data.user.id);
      
      if (profileError) throw profileError;

      toast.success('Login successful!');
      
      // Role-based redirect
      if (profile.role === 'customer') navigate('/home');
      else if (profile.role === 'owner') navigate('/owner/dashboard');
      else if (profile.role === 'admin') navigate('/admin/dashboard');
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-10 space-y-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Welcome Back</h1>
          <p className="text-gray-500 mt-2 font-medium">Log in to your Kirana Connect account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'LOG IN'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-black hover:text-indigo-700">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
