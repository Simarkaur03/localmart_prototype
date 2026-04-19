import React, { useState, useEffect } from 'react';
import { storeService } from '../../lib/supabase/storeService';
import { useStore } from '../../store/useStore';
import { 
  Store, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ArrowRight,
  LayoutDashboard,
  Users,
  ShoppingBag,
  FileText,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminStores = () => {
  const { logout, profile } = useStore();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const { data, error } = await storeService.getAllStores();
      if (error) throw new Error(error);
      setStores(data);
    } catch (error) {
      toast.error('Load Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStoreStatus = async (id, currentStatus) => {
    const previousStores = stores;
    const newStatus = !currentStatus;
    
    // Optimistic UI
    setStores(stores.map(s => s.id === id ? { ...s, is_active: newStatus } : s));

    try {
      const { error } = await storeService.updateStoreStatus(id, newStatus);
      if (error) throw new Error(error);
      toast.success('Operational status updated');
    } catch (error) {
      setStores(previousStores); // Rollback
      toast.error('Update Error: ' + error.message);
    }
  };

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Loader2 className="animate-spin text-indigo-400" size={48} />
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar - Same as Admin Dashboard */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col pt-8">
        <div className="px-8 mb-12">
           <div className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-900/40">
                 <LayoutDashboard size={24} />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">ADMIN PANEL</span>
           </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
            { name: 'Stores', icon: Store, path: '/admin/stores' },
            { name: 'Users', icon: Users, path: '/admin/users' },
            { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
            { name: 'Reports', icon: FileText, path: '/admin/reports' },
            { name: 'Settings', icon: Settings, path: '/admin/settings' }
          ].map(item => (
            <Link 
              key={item.name}
              to={item.path}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${item.name === 'Stores' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
            >
              <item.icon size={20} />
              <span className="font-black text-xs uppercase tracking-widest">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-8 border-t border-slate-800">
           <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-black text-white shadow-xl">A</div>
                 <div>
                    <p className="text-xs font-black text-white leading-none uppercase tracking-tighter">Super Admin</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1.5 leading-none">Global Access</p>
                 </div>
              </div>
              <button onClick={logout} className="w-full bg-slate-700/50 py-3 rounded-xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-red-900/20 transition-all uppercase tracking-widest border border-slate-600/30">Logout</button>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 rounded-l-[3.5rem] shadow-inner border-l border-white/5 mt-4 mb-4">
        <header className="h-24 bg-white/50 backdrop-blur-md px-12 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Manage Global Partners</h2>
            <div className="flex items-center space-x-6">
               <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search stores..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border text-xs py-3 pl-12 pr-6 rounded-2xl w-80 outline-none focus:ring-4 focus:ring-indigo-500/5 border-slate-100 placeholder:text-slate-400 transition-all shadow-sm"
                  />
               </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar">
           <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-premium overflow-hidden">
              <div className="p-10 flex justify-between items-center border-b border-slate-50 bg-slate-50/20">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Partners Ledger</h3>
                    <p className="text-slate-400 font-medium text-xs mt-1">Audit and manage the operational status of all registered retail units.</p>
                 </div>
                 <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
                    ONBOARD NEW STORE
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead>
                       <tr className="bg-slate-50/80">
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Unit</th>
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ownership & Contact</th>
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Geography</th>
                          <th className="text-center py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Status</th>
                          <th className="text-right py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredStores.map(store => (
                          <tr key={store.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="py-8 px-10">
                                <div className="flex items-center space-x-5">
                                   <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-slate-200">
                                      {store.name[0]}
                                   </div>
                                   <div>
                                      <p className="font-black text-slate-900 text-sm tracking-tight">{store.name}</p>
                                      <p className="text-[10px] text-indigo-400 font-black tracking-widest uppercase mt-1">{store.category}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="py-8 px-10">
                                <p className="text-slate-600 text-[11px] font-bold tracking-tight">{store.users?.email}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">Verified Partner</p>
                             </td>
                             <td className="py-8 px-10">
                                <p className="text-slate-900 text-[11px] font-black uppercase tracking-tight">{store.city}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">{store.pincode}</p>
                             </td>
                             <td className="py-8 px-10 text-center">
                                <button 
                                  onClick={() => toggleStoreStatus(store.id, store.is_active)}
                                  className={`inline-flex items-center px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${store.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                                >
                                   {store.is_active ? <CheckCircle2 size={12} className="mr-2" /> : <XCircle size={12} className="mr-2" />}
                                   <span className="tracking-[0.1em]">{store.is_active ? 'Active' : 'Suspended'}</span>
                                </button>
                             </td>
                             <td className="py-8 px-10 text-right">
                                <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                   <MoreVertical size={20} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-10 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center px-12">
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Displaying {filteredStores.length} of {stores.length} Platform Entities</p>
                 <div className="flex space-x-3">
                    <button className="px-6 py-3 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-not-allowed">Previous</button>
                    <button className="px-6 py-3 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-white transition-all">Next Page</button>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminStores;
