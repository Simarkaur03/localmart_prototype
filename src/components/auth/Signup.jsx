import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, Loader2, Store, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

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

    const cleanEmail = formData.email.trim();
    const cleanPassword = formData.password.trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
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
      
      // Role-based redirect
      if (formData.role === 'customer') {
        navigate('/home');
      } else if (formData.role === 'owner') {
        // Direct to store setup for sellers as requested
        navigate('/owner/profile');
      } else {
        navigate('/admin/dashboard');
      }
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-outfit">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-premium p-12 space-y-10 border border-slate-100">
        <div className="text-center">
           <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black mx-auto mb-6 shadow-2xl shadow-indigo-100 italic">LM</div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Join Local Mart</h1>
           <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">Start your neighborhood journey</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-8">
          {/* Main Role Selection (Shop or Sell) */}
          <div className="space-y-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">I am here to...</p>
             <div className="flex bg-slate-50 p-2 rounded-[2rem]">
               <button
                 type="button"
                 onClick={() => setFormData({...formData, role: 'customer'})}
                 className={`flex-1 flex flex-col items-center justify-center space-y-2 py-6 rounded-[1.75rem] transition-all ${formData.role === 'customer' ? 'bg-white text-green-600 shadow-xl' : 'text-slate-300 grayscale'}`}
               >
                 <ShoppingBag size={24} strokeWidth={2.5} />
                 <span className="text-[10px] font-black uppercase tracking-widest leading-none">Shop Items</span>
               </button>
               <button
                 type="button"
                 onClick={() => setFormData({...formData, role: 'owner'})}
                 className={`flex-1 flex flex-col items-center justify-center space-y-2 py-6 rounded-[1.75rem] transition-all ${formData.role === 'owner' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-300 grayscale'}`}
               >
                 <Store size={24} strokeWidth={2.5} />
                 <span className="text-[10px] font-black uppercase tracking-widest leading-none">Sell Items</span>
               </button>
             </div>
          </div>

          {formData.role === 'admin' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-slate-900 p-6 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10"></div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Staff Verification Required</p>
               <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                  <input
                    type="password"
                    placeholder="Staff Access Code"
                    value={formData.adminCode}
                    onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
                    className="w-full bg-slate-800 border-none rounded-xl py-4 pl-12 pr-4 text-sm text-white font-black focus:ring-2 focus:ring-white/10 outline-none"
                  />
               </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 outline-none transition-all"
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 outline-none transition-all"
              />
            </div>
            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                type="tel"
                placeholder="Mobile Number"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 outline-none transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                type="password"
                placeholder="Create Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${formData.role === 'customer' ? 'bg-green-600' : formData.role === 'owner' ? 'bg-indigo-600' : 'bg-slate-900'} text-white font-black py-5 rounded-[1.75rem] shadow-2xl transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-70`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><span className="uppercase tracking-[0.2em] text-xs">Register Now</span> <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="pt-6 border-t border-slate-50 flex flex-col items-center space-y-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Already a member?{' '}
             <Link to="/login" className="text-slate-900 hover:underline underline-offset-4 decoration-2">Log In</Link>
           </p>
           
           <div className="flex items-center space-x-4 opacity-40 hover:opacity-100 transition-opacity">
              <Link to="/login" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600">Login as member</Link>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
              <button onClick={() => setFormData({...formData, role: 'admin'})} className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 flex items-center">
                 <ShieldCheck size={12} className="mr-1" />
                 Staff Join Portal
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
