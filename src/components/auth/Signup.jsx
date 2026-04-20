import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, Loader2, Store, ShoppingBag, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
    adminCode: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Admin Code Verification
    if (formData.role === 'admin' && formData.adminCode !== 'ADMIN777') {
      return toast.error('Invalid Admin Secret Code!');
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
            phone: formData.phone
          }
        }
      });

      if (error) throw error;

      toast.success('Account created successfully!');
      
      // Post-signup redirection based on role
      if (formData.role === 'customer') {
        navigate('/home');
      } else if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/owner/dashboard');
      }
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-outfit">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-premium p-12 space-y-10 border border-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Local Mart</h1>
          <p className="text-gray-400 mt-2 font-black uppercase text-[10px] tracking-[0.3em]">Join the neighborhood network</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-8">
          {/* Enhanced Role Selection */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">What's your purpose?</p>
            <div className="flex bg-gray-100 p-1.5 rounded-3xl">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'customer'})}
                className={`flex-1 flex flex-col items-center justify-center space-y-2 py-5 rounded-[1.75rem] transition-all ${formData.role === 'customer' ? 'bg-white text-green-600 shadow-xl' : 'text-gray-400 grayscale'}`}
              >
                <ShoppingBag size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest">I want to shop</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'owner'})}
                className={`flex-1 flex flex-col items-center justify-center space-y-2 py-5 rounded-[1.75rem] transition-all ${formData.role === 'owner' ? 'bg-white text-indigo-600 shadow-xl' : 'text-gray-400 grayscale'}`}
              >
                <Store size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest">I want to sell</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'admin'})}
                className={`flex-1 flex flex-col items-center justify-center space-y-2 py-5 rounded-[1.75rem] transition-all ${formData.role === 'admin' ? 'bg-white text-slate-900 shadow-xl' : 'text-gray-400 grayscale'}`}
              >
                <User size={24} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest">Admin/Staff</span>
              </button>
            </div>
          </div>

          {formData.role === 'admin' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                  <input
                    id="adminCode"
                    name="adminCode"
                    type="password"
                    placeholder="Enter Admin Secret Code"
                    required
                    value={formData.adminCode}
                    onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-black focus:ring-4 focus:ring-slate-900/5 outline-none transition-all placeholder:text-slate-300"
                  />
               </div>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center mt-3">Auth required for platform management</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
            </div>
            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Mobile Number"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${formData.role === 'customer' ? 'bg-green-600 shadow-green-100' : 'bg-indigo-600 shadow-indigo-100'} text-white font-black py-5 rounded-[1.75rem] shadow-2xl transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-70`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span className="uppercase tracking-[0.2em] text-xs">Register with Local Mart</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Already a member?{' '}
            <Link to="/login" className="text-slate-900 font-black hover:underline underline-offset-4">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
