import React, { useState, useEffect } from 'react';
import { storeService } from '../../lib/supabase/storeService';
import { useStore } from '../../store/useStore';
import { 
  Store, 
  MapPin, 
  Tag, 
  Hash, 
  Loader2, 
  Save, 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  Settings,
  Power
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StoreProfile = () => {
  const { user, profile, logout } = useStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState({
    name: '',
    category: '',
    address: '',
    city: '',
    pincode: '',
    is_active: true
  });

  const fetchStore = useCallback(async () => {
    try {
      const { data, error } = await storeService.getStoreByOwner(user.id);
      if (error) throw new Error(error);
      if (data) setStore(data);
    } catch (error) {
      toast.error('Load Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) fetchStore();
  }, [user, fetchStore]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data, error } = await storeService.saveStore(user.id, store);
      if (error) throw new Error(error);
      setStore(data);
      toast.success('Store profile updated successfully!');
    } catch (error) {
      toast.error('Save Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      {/* Sidebar - Same as Dashboard */}
      <div className="w-64 bg-slate-900 h-screen text-slate-300 flex flex-col fixed left-0 top-0 z-20">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">S</div>
            <div>
              <p className="text-white font-black leading-none tracking-tight">{profile?.name || 'Owner'}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1.5">Kirana Owner</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-5 space-y-2 mt-4">
          <Link to="/owner/dashboard" className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <LayoutDashboard size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Dashboard</span>
          </Link>
          <Link to="/owner/orders" className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <ClipboardList size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Orders</span>
          </Link>
          <Link to="/owner/products" className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <Package size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Products</span>
          </Link>
          <Link to="/owner/profile" className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-900/50">
            <Settings size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Store Profile</span>
          </Link>
        </nav>
        <div className="p-6 border-t border-slate-800">
           <button onClick={logout} className="w-full bg-slate-800 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-900/40 hover:text-red-400 transition-all border border-slate-700">LOG OUT</button>
        </div>
      </div>

      <main className="flex-1 ml-64 p-12">
        <div className="max-w-4xl mx-auto space-y-12">
           <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Store Profile</h1>
              <p className="text-slate-500 mt-2 font-medium">Manage your store's public information and operational status.</p>
           </div>

           <form onSubmit={handleSave} className="space-y-10">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                 <div className="flex items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="flex items-center space-x-4">
                       <div className={`p-4 rounded-2xl ${store.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          <Power size={24} />
                       </div>
                       <div>
                          <p className="font-black text-slate-800 text-sm uppercase tracking-tight">System Status</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{store.is_active ? 'Online & Accepting Orders' : 'Offline / Closed'}</p>
                       </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setStore({...store, is_active: !store.is_active})}
                      className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${store.is_active ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-green-600 text-white shadow-lg shadow-green-100'}`}
                    >
                       {store.is_active ? 'CLOSE STORE' : 'OPEN STORE'}
                    </button>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2 col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Store Name</label>
                       <div className="relative">
                          <Store className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                          <input type="text" required value={store.name} onChange={(e) => setStore({...store, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all" placeholder="Enter store name" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Business Category</label>
                       <div className="relative">
                          <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                          <input type="text" required value={store.category} onChange={(e) => setStore({...store, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all" placeholder="e.g. Grocery / Dairy" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">City</label>
                       <div className="relative">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                          <input type="text" required value={store.city} onChange={(e) => setStore({...store, city: e.target.value})} className="w-full bg-slate-50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all" placeholder="e.g. Raipur" />
                       </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Address</label>
                       <textarea required value={store.address} onChange={(e) => setStore({...store, address: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2rem] py-5 px-8 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all h-32" placeholder="Street name, landmark, etc." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Pincode</label>
                       <div className="relative">
                          <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                          <input type="text" required value={store.pincode} onChange={(e) => setStore({...store, pincode: e.target.value})} className="w-full bg-slate-50 border-none rounded-3xl py-5 pl-14 pr-8 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all" placeholder="6-digit code" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex justify-end">
                 <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-indigo-100 flex items-center space-x-3 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                 >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>SAVE PROFILE</span>
                 </button>
              </div>
           </form>
        </div>
      </main>
    </div>
  );
};

export default StoreProfile;
