import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, ShoppingBag, Store } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBypass, setShowBypass] = useState(false);
  const navigate = useNavigate();
  const { fetchProfile, loginBypass } = useStore();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setShowBypass(false);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        // ALWAYS offer bypass on ANY error during prototype phase to prevent blockers
        setShowBypass(true);
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Email not confirmed yet. Click bypass below to enter.');
        }
        throw error;
      }

      await fetchProfile(data.user.id);
      toast.success('Login successful!');
      redirectUser(data.user.user_metadata?.role || 'customer');
      
    } catch (error) {
      toast.error(error.message);
      // Ensure bypass is visible even for "Invalid credentials" if the user is frustrated
      setShowBypass(true);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    try {
      const email = `${role}@localmart.com`;
      await loginBypass(email, role);
      toast.success(`Logged in as ${role.toUpperCase()}`);
      redirectUser(role);
    } catch (error) {
      toast.error('Bypass failed');
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (role) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'owner') navigate('/owner/dashboard');
    else navigate('/home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-outfit">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-premium p-12 space-y-10 border border-slate-100">
        <div className="text-center">
           <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black mx-auto mb-6 shadow-2xl shadow-indigo-100 italic">LM</div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Welcome Back</h1>
           <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">Access your neighborhood market</p>
        </div>

        {/* Quick Login Options */}
        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={() => handleQuickLogin('customer')}
             className="flex items-center justify-center space-x-2 bg-green-50 text-green-700 py-4 rounded-2xl border border-green-100 hover:bg-green-600 hover:text-white transition-all group"
           >
              <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Demo Shopper</span>
           </button>
           <button 
             onClick={() => handleQuickLogin('owner')}
             className="flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-700 py-4 rounded-2xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all group"
           >
              <Store size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Demo Seller</span>
           </button>
        </div>

        <div className="relative">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
           <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest bg-white px-4 text-slate-300">Or use email</div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.75rem] shadow-2xl transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-70"
             >
               {loading ? <Loader2 className="animate-spin" size={20} /> : <><span className="uppercase tracking-[0.2em] text-xs">Enter Market</span> <ArrowRight size={16} /></>}
             </button>

             {showBypass && (
               <button
                 type="button"
                 onClick={() => handleQuickLogin('customer')}
                 className="w-full bg-amber-50 text-amber-700 font-bold py-4 rounded-2xl border border-amber-100 flex items-center justify-center space-x-2 animate-bounce"
               >
                 <ShieldCheck size={18} />
                 <span className="text-[10px] uppercase tracking-widest">Bypass Confirmation (Demo Mode)</span>
               </button>
             )}
          </div>
        </form>

        <div className="pt-6 border-t border-slate-50 flex flex-col items-center space-y-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Not a member?{' '}
             <Link to="/signup" className="text-indigo-600 hover:underline underline-offset-4 decoration-2">Join now</Link>
           </p>
           
           <div className="flex items-center space-x-4 opacity-40 hover:opacity-100 transition-opacity">
              <Link to="/signup" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600">Login as member</Link>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
              <button onClick={() => handleQuickLogin('admin')} className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 flex items-center">
                 <ShieldCheck size={12} className="mr-1" />
                 Staff Portal
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
