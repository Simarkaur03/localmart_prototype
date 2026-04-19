import React, { useState, useEffect } from 'react';
import { orderService } from '../../lib/supabase/orderService';
import { useStore } from '../../store/useStore';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  Loader2,
  LayoutDashboard,
  Store,
  Users,
  FileText,
  Settings,
  Truck,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const { logout } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchGlobalOrders();
  }, []);

  const fetchGlobalOrders = async () => {
    try {
      const { data, error } = await orderService.getAllOrders();
      if (error) throw new Error(error);
      setOrders(data);
    } catch (error) {
      toast.error('Load Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = activeTab === "All" 
    ? orders 
    : orders.filter(o => o.status === activeTab.toLowerCase().replace(/ /g, '_'));

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Loader2 className="animate-spin text-indigo-400" size={48} />
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar - Same as Dashboard */}
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
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${item.name === 'Orders' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
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
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Platform Liquidity</h2>
            <div className="flex items-center space-x-6">
               <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Global order track..." className="bg-white border text-xs py-3 pl-12 pr-6 rounded-2xl w-80 outline-none focus:ring-4 focus:ring-indigo-500/5 border-slate-100 placeholder:text-slate-400 transition-all shadow-sm" />
               </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar">
           <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-premium overflow-hidden">
              <div className="p-10 flex justify-between items-center border-b border-slate-50 bg-slate-50/20">
                 <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl">
                    {['All', 'Pending', 'Accepted', 'Delivered', 'Cancelled'].map(tab => (
                       <button 
                         key={tab}
                         onClick={() => setActiveTab(tab)}
                         className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                          {tab}
                       </button>
                    ))}
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Velocity: {orders.length} Orders</p>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead>
                       <tr className="bg-slate-50/80">
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Detail</th>
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Entity</th>
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Retail Unit</th>
                          <th className="text-center py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Ledger</th>
                          <th className="text-right py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Liquidity</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="py-8 px-10">
                                <div className="space-y-1">
                                   <p className="font-black text-slate-900 text-sm tracking-tight">{order.id.split('-')[0]}</p>
                                   <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                      <Clock size={10} className="mr-1.5" />
                                      {format(new Date(order.created_at), 'dd MMM, hh:mm a')}
                                   </div>
                                </div>
                             </td>
                             <td className="py-8 px-10">
                                <div className="flex items-center space-x-3">
                                   <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-600 text-[10px]">
                                      {order.users?.name?.[0].toUpperCase()}
                                   </div>
                                   <p className="text-slate-600 text-[11px] font-bold tracking-tight uppercase">{order.users?.name}</p>
                                </div>
                             </td>
                             <td className="py-8 px-10">
                                <div className="flex items-center space-x-3 text-slate-600">
                                   <Store size={14} className="text-indigo-400" />
                                   <p className="text-[11px] font-black tracking-tight uppercase">{order.stores?.name}</p>
                                </div>
                             </td>
                             <td className="py-8 px-10 text-center">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                   {order.status.replace(/_/g, ' ')}
                                </span>
                             </td>
                             <td className="py-8 px-10 text-right">
                                <p className="font-black text-slate-900 text-base tracking-tighter">₹{order.total_amount}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">COD Payment</p>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;
