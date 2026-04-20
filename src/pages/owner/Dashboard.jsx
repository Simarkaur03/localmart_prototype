import React, { useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOwnerStore, useOwnerOrders, useProducts } from '../../hooks/useQueryHooks';
import { useOrderRealtime } from '../../hooks/useOrderRealtime';
import { useStore } from '../../store/useStore';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  Store, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const { user, profile, logout } = useStore();
  const navigate = useNavigate();

  // Queries
  const { data: storeData, isLoading: storeLoading } = useOwnerStore(user?.id);
  const store = storeData?.data;

  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useOwnerOrders(store?.id);
  const orders = ordersData?.data || [];

  const { data: productsData, isLoading: productsLoading } = useProducts(store?.id);
  const productsCount = productsData?.data?.length || 0;

  // Realtime order updates
  const handleOrderUpdate = useCallback((payload) => {
    refetchOrders();
    if (payload.eventType === 'INSERT') {
       toast.success('New Order Received!', { icon: '🛍️' });
    }
  }, [refetchOrders]);

  useOrderRealtime(store?.id, handleOrderUpdate);

  // Stats Calculation
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return orders.reduce((acc, order) => {
      const orderDate = new Date(order.created_at);
      if (orderDate >= today) {
        acc.todayOrders++;
        if (order.status === 'delivered') {
          acc.delivered++;
          acc.revenue += parseFloat(order.total_amount);
        }
        if (order.status === 'pending') acc.pending++;
      }
      return acc;
    }, { todayOrders: 0, revenue: 0, pending: 0, delivered: 0 });
  }, [orders]);

  const loading = storeLoading || ordersLoading || (store && productsLoading);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  if (!store) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 text-center">
       <div className="bg-white p-10 rounded-[3rem] shadow-premium max-w-md border border-slate-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
             <Store size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">No Store Found</h2>
          <p className="text-slate-500 font-medium mb-8">You haven't registered your store yet. Create one to start selling!</p>
          <button 
            onClick={() => navigate('/owner/profile')}
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs"
          >
            Register My Store
          </button>
       </div>
    </div>
  );

  const statCards = [
    { label: "Today's Orders", value: stats.todayOrders, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Revenue", value: `₹${stats.revenue.toFixed(2)}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Delivered", value: stats.delivered, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" }
  ];

  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      {/* Sidebar - Fixed */}
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
          <Link to="/owner/dashboard" className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-900/50">
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
          <Link to="/owner/profile" className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <Settings size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Store Profile</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-800">
           <button 
            onClick={logout}
            className="w-full bg-slate-800 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-900/40 hover:text-red-400 transition-all border border-slate-700"
           >
            LOG OUT
           </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Welcome back, {profile?.name || 'Sharma Ji'}</h1>
              <p className="text-slate-500 mt-2 font-medium">Viewing real-time operations for <span className="font-black text-indigo-600 uppercase tracking-tighter">{store.name}</span></p>
            </div>
            <div className="flex space-x-3">
               <Link to="/owner/profile" className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center uppercase tracking-widest">
                 <Store size={18} className="mr-2" /> Update Store
               </Link>
               <Link to="/owner/products" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center uppercase tracking-widest">
                 <Plus size={18} className="mr-2" /> Add Product
               </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-8">
            {statCards.map(stat => (
              <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 border-b-4 hover:border-indigo-600 transition-all group">
                 <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                   <stat.icon size={28} />
                 </div>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* No Products Prompt */}
          {productsCount === 0 && (
             <div className="bg-amber-50 border-2 border-dashed border-amber-200 p-8 rounded-[3rem] flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                   <Package size={32} />
                </div>
                <div>
                   <h3 className="text-lg font-black text-slate-900 tracking-tight">Your store is empty!</h3>
                   <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">Add your first product to start receiving orders. Stores with products get 10x more visibility.</p>
                </div>
                <Link to="/owner/products" className="bg-amber-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all">
                   Add My First Product ➔
                </Link>
             </div>
          )}

          {/* Middle Section */}
          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-2 space-y-8">
               <div className="flex justify-between items-center px-4">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">Performance Summary</h2>
                 <div className="flex space-x-2 bg-slate-200/50 p-1 rounded-xl">
                    <button className="px-4 py-2 bg-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">Sales</button>
                    <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Orders</button>
                 </div>
               </div>
               <div className="h-96 bg-white rounded-[3rem] border border-slate-100 flex items-center justify-center relative overflow-hidden shadow-sm">
                  <div className="absolute inset-0 bg-slate-50/30 flex flex-col items-center justify-center pointer-events-none">
                     <BarChart3 size={64} className="text-slate-100 mb-4" />
                     <p className="text-slate-300 font-black uppercase tracking-[0.2em] text-xs">Live Analytics</p>
                  </div>
                  <div className="flex items-end space-x-6 h-48 absolute bottom-12">
                     {[35, 65, 40, 85, 60, 75, 50].map((h, i) => (
                       <div key={i} className="w-14 bg-indigo-100 rounded-2xl transition-all hover:bg-indigo-600" style={{height: `${h}%`}}></div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight px-2">Store Status</h2>
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tight">Store Visibility</p>
                        <p className="text-xs text-slate-400 font-medium">Is your store open to customers?</p>
                     </div>
                     <div className={`w-14 h-8 rounded-full p-1 transition-all flex ${store.is_active ? 'bg-green-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                        <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
                     </div>
                  </div>
                  
                  <div className="h-px bg-slate-50"></div>

                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Management</p>
                     <Link to="/owner/products" className="w-full flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-indigo-600 transition-all group">
                        <div className="flex items-center space-x-4">
                           <Package className="text-indigo-600" size={20} />
                           <span className="font-black text-xs uppercase tracking-tight text-slate-700">Inventory</span>
                        </div>
                        <CheckCircle2 size={16} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </Link>
                     <Link to="/owner/orders" className="w-full flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-indigo-600 transition-all group">
                        <div className="flex items-center space-x-4">
                           <ClipboardList className="text-indigo-600" size={20} />
                           <span className="font-black text-xs uppercase tracking-tight text-slate-700">All Orders</span>
                        </div>
                        <CheckCircle2 size={16} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </Link>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
