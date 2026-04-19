import React, { useState, useEffect } from 'react';
import { adminService } from '../../lib/supabase/adminService';
import { useStore } from '../../store/useStore';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  PieChart, 
  Settings, 
  FileText, 
  LayoutDashboard,
  Bell,
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Loader2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, profile, logout } = useStore();
  const [stats, setStats] = useState({
    totalStores: 0,
    totalUsers: 0,
    ordersToday: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const { data, error } = await adminService.getDashboardStats();
      if (error) throw new Error(error);
      setStats(data);
    } catch (error) {
      toast.error('Load Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Stores", value: stats.totalStores, trend: "+2 this month", icon: Store, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Users", value: stats.totalUsers, trend: "+12% growth", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Orders Today", value: stats.ordersToday, trend: "Stable velocity", icon: ShoppingBag, color: "text-green-600", bg: "bg-green-50" },
    { label: "Daily Revenue", value: `₹${stats.revenue.toFixed(0)}`, trend: "Target: ₹1L", icon: PieChart, color: "text-amber-600", bg: "bg-amber-50" }
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Loader2 className="animate-spin text-indigo-400" size={48} />
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar */}
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
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${item.name === 'Dashboard' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
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
              <button 
                onClick={logout}
                className="w-full bg-slate-700/50 py-3 rounded-xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-red-900/20 transition-all uppercase tracking-widest border border-slate-600/30"
              >
                Logout
              </button>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 rounded-l-[3.5rem] shadow-inner border-l border-white/5 mt-4 mb-4">
        {/* Top Header */}
        <header className="h-24 bg-white/50 backdrop-blur-md px-12 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Platform Dashboard</h2>
            <div className="flex items-center space-x-8">
               <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="text" placeholder="Global search..." className="bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-6 text-xs w-80 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all" />
               </div>
               <button className="relative p-3 bg-white shadow-sm border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all active:scale-95">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
            </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
           {/* Summary Stats */}
           <div className="grid grid-cols-4 gap-8">
              {statCards.map(stat => (
                <div key={stat.label} className="bg-white p-8 rounded-[3rem] shadow-premium border border-slate-100 relative group overflow-hidden hover:-translate-y-1 transition-all duration-500">
                   <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-[3] group-hover:bg-indigo-50/50 transition-transform duration-1000"></div>
                   <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 relative z-10 shadow-sm`}>
                      <stat.icon size={28} />
                   </div>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">{stat.label}</p>
                   <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{stat.value}</p>
                   <div className="flex items-center space-x-1.5 mt-3 relative z-10">
                      <TrendingUp size={12} className="text-green-500" />
                      <p className="text-green-600 text-[10px] font-black uppercase tracking-widest">{stat.trend}</p>
                   </div>
                </div>
              ))}
           </div>

           {/* Performance Row */}
           <div className="grid grid-cols-3 gap-10">
              <div className="col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-premium group">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ecosystem Growth</h3>
                    <div className="flex space-x-3 bg-slate-50 p-2 rounded-2xl">
                       <button className="px-5 py-2.5 bg-white shadow-sm text-[10px] font-black uppercase tracking-widest rounded-xl">Revenue</button>
                       <button className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Stores</button>
                    </div>
                 </div>
                 <div className="h-80 flex items-end space-x-6 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                       <PieChart size={160} className="text-slate-900" />
                    </div>
                    {[45, 60, 35, 90, 50, 75, 65, 80, 55, 70, 40, 60].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-50 border border-indigo-100 rounded-t-2xl transition-all duration-700 hover:bg-slate-900 hover:border-slate-900 group" style={{height: `${h}%`}}></div>
                    ))}
                 </div>
                 <div className="mt-10 pt-10 border-t border-slate-50 flex justify-between items-center px-4">
                    <div className="flex items-center space-x-8">
                       <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Active Partners</p>
                       </div>
                       <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-tight">Churned Users</p>
                       </div>
                    </div>
                    <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform">
                       Analysis Details <ArrowRight size={14} className="ml-2" />
                    </button>
                 </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute right-[-20%] top-[-10%] w-[60%] h-[40%] bg-indigo-500/20 blur-[100px] rounded-full"></div>
                 <div className="relative z-10 flex flex-col h-full">
                    <h3 className="text-2xl font-black text-white tracking-tight leading-tight mb-8">Ready to expand the network?</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-auto">Manage your retail partners, verify high-volume stores, and maintain platform integrity.</p>
                    
                    <div className="space-y-4 pt-10">
                       <Link to="/admin/stores" className="w-full bg-white hover:bg-indigo-50 py-5 rounded-3xl flex items-center justify-center space-x-3 transition-all active:scale-95 group">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Manage All Stores</span>
                          <CheckCircle2 size={18} className="text-indigo-600" />
                       </Link>
                       <Link to="/admin/users" className="w-full bg-white/10 hover:bg-white/20 border border-white/5 py-5 rounded-3xl flex items-center justify-center space-x-3 transition-all">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">Review Users</span>
                       </Link>
                    </div>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
