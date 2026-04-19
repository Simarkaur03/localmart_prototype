import React, { useState } from 'react';
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
  MoreVertical
} from 'lucide-react';
import { ADMIN_STATS } from '../../MockData';

const AdminPanel = () => {
  const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');
  const [stores, setStores] = useState([
    { id: 1, name: "Sharma General Store", owner: "Ramesh Sharma", location: "Sector 4, Raipur", status: "Active" },
    { id: 2, name: "Patel Daily Needs", owner: "Suresh Patel", location: "Main Road, Raipur", status: "Active" },
    { id: 3, name: "Aggarwal Sweets", owner: "Deepak Aggarwal", location: "Kora Circle, Raipur", status: "Inactive" },
    { id: 4, name: "The Dairy Shop", owner: "Amit Singh", location: "Model Town, Raipur", status: "Active" }
  ]);

  const toggleStatus = (id) => {
    setStores(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
    ));
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-8">
           <div className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-indigo-600 rounded-lg">
                 <LayoutDashboard size={24} />
              </div>
              <span className="text-xl font-black tracking-tight uppercase">Admin Panel</span>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Stores', icon: Store },
            { name: 'Users', icon: Users },
            { name: 'Orders', icon: ShoppingBag },
            { name: 'Reports', icon: FileText },
            { name: 'Analytics', icon: PieChart },
            { name: 'Settings', icon: Settings }
          ].map(item => (
            <button 
              key={item.name}
              onClick={() => setActiveSidebarTab(item.name)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeSidebarTab === item.name ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm tracking-wide">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-800">
           <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-3">
                 <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">A</div>
                 <div>
                    <p className="text-xs font-black text-white">Super Admin</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Platform Lead</p>
                 </div>
              </div>
              <button className="w-full bg-slate-700/50 py-2 rounded-xl text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Logout</button>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{activeSidebarTab} Overview</h2>
            <div className="flex items-center space-x-6">
               <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Global search..." className="bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-xs w-64 outline-none focus:ring-2 focus:ring-indigo-500/10" />
               </div>
               <button className="relative p-2 bg-slate-100 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
            </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
           {/* Summary Stats */}
           <div className="grid grid-cols-4 gap-6">
              {ADMIN_STATS.map(stat => (
                <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                   <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">{stat.label}</p>
                   <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{stat.value}</p>
                   <p className="text-indigo-600 text-xs font-bold mt-2 relative z-10">{stat.trend}</p>
                </div>
              ))}
           </div>

           {/* Managed Stores Table */}
           <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-premium">
              <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Registered Stores</h3>
                    <p className="text-slate-500 text-xs mt-1">Manage platform partners and their operational status.</p>
                 </div>
                 <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                    Add Partner
                 </button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Details</th>
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                          <th className="text-center py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="text-right py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {stores.map(store => (
                          <tr key={store.id} className="hover:bg-slate-50/30 transition-colors">
                             <td className="py-6 px-10">
                                <div className="flex items-center space-x-4">
                                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600 text-sm">
                                      {store.name[0]}
                                   </div>
                                   <span className="font-bold text-slate-800 text-sm">{store.name}</span>
                                </div>
                             </td>
                             <td className="py-6 px-10">
                                <span className="text-slate-600 text-sm font-medium">{store.owner}</span>
                             </td>
                             <td className="py-6 px-10">
                                <span className="text-slate-500 text-sm">{store.location}</span>
                             </td>
                             <td className="py-6 px-10 text-center">
                                <button 
                                  onClick={() => toggleStatus(store.id)}
                                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black border transition-all ${store.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}
                                >
                                   {store.status === 'Active' ? <CheckCircle2 size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                                   <span className="uppercase tracking-widest">{store.status}</span>
                                </button>
                             </td>
                             <td className="py-6 px-10 text-right">
                                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                   <MoreVertical size={18} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-10 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center">
                 <p className="text-xs text-slate-400 font-medium">Showing 4 of 28 stores</p>
                 <div className="flex space-x-2">
                    <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white transition-all cursor-not-allowed">1</button>
                    <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white transition-all">2</button>
                    <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white transition-all">3</button>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
