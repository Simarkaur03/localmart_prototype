import React, { useState, useMemo, useCallback } from 'react';
import { useOwnerStore, useOwnerOrders } from '../../hooks/useQueryHooks';
import { orderService } from '../../lib/supabase/orderService';
import { useOrderRealtime } from '../../hooks/useOrderRealtime';
import { useStore } from '../../store/useStore';
import { Search, Filter, ArrowRight, User, MapPin, Clock, Loader2, CheckCircle2, ChevronRight, Truck, XCircle, ShoppingBag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TABS = ["All", "pending", "accepted", "out_for_delivery", "delivered", "cancelled"];

const OwnerOrders = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState("All");

  // Queries
  const { data: storeData, isLoading: storeLoading } = useOwnerStore(user?.id);
  const store = storeData?.data;

  const { 
    data: ordersData, 
    isLoading: ordersLoading, 
    refetch, 
    isRefetching 
  } = useOwnerOrders(store?.id);
  
  const orders = useMemo(() => ordersData?.data || [], [ordersData]);

  // Realtime order updates
  const handleOrderUpdate = useCallback((payload) => {
    refetch();
    if (payload.eventType === 'INSERT') {
       toast.success('New order notification!', { icon: '🛍️' });
    }
  }, [refetch]);

  useOrderRealtime(store?.id, handleOrderUpdate);

  const updateOrderStatus = async (order, newStatus) => {
    // Edge Case: If order is already cancelled by customer
    if (order.status === 'cancelled') {
       toast.error('This order was cancelled by the customer.');
       return refetch();
    }

    // Restriction: Cannot update final states
    if (['delivered', 'cancelled'].includes(order.status)) {
       toast.error('Cannot update status of a finalized order.');
       return;
    }

    try {
      const { error } = await orderService.updateOrderStatus(order.id, newStatus);
      if (error) throw new Error(error);
      toast.success(`Order marked as ${newStatus.replace(/_/g, ' ')}`);
      refetch();
    } catch (error) {
      toast.error('Status Error: ' + error.message);
    }
  };

  const filteredOrders = activeTab === "All" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const loading = storeLoading || ordersLoading;

  if (loading && !isRefetching) return (
    <div className="ml-64 p-20 flex justify-center bg-slate-50 min-h-screen">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  return (
    <div className="flex-1 ml-64 p-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Order Management</h1>
            <p className="text-slate-500 mt-2 font-medium">Fulfill your incoming orders and update delivery status.</p>
          </div>
          <div className="flex space-x-4">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Order ID or Customer..." 
                  className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-xs w-72 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             </div>
             <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
               Filter
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-[1.5rem] w-fit">
          {TABS.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
            >
              {tab.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Table/List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-32 flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm opacity-60">
               <div className="bg-slate-50 p-8 rounded-[2rem] mb-6">
                  <ShoppingBag size={56} className="text-slate-200" />
               </div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">No orders yet</h3>
               <p className="text-slate-400 font-medium mt-1">Incoming orders will appear here for you to process.</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex items-center shadow-sm hover:shadow-premium transition-all group overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-600/0 group-hover:bg-indigo-600 transition-all"></div>
                
                <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex flex-col items-center justify-center border border-slate-100 mr-8 flex-shrink-0">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 opacity-50">#ID</p>
                   <p className="text-base font-black text-slate-900 leading-none">{order.id.split('-')[0]}</p>
                </div>

                <div className="flex-1 grid grid-cols-4 gap-8">
                   <div className="col-span-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Customer Profile</p>
                      <div className="flex items-center space-x-3">
                         <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-[10px] font-black text-indigo-600">
                            {order.users?.name?.[0].toUpperCase()}
                         </div>
                         <div>
                            <p className="font-black text-slate-800 text-sm tracking-tight">{order.users?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400">{order.users?.phone}</p>
                         </div>
                      </div>
                   </div>
                   <div className="col-span-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Transaction</p>
                      <p className="font-black text-slate-900 text-base tracking-tighter mb-1">₹{order.total_amount}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.payment_method}</p>
                   </div>
                   <div className="col-span-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Delivery Particulars</p>
                      <div className="flex items-center text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                         <MapPin size={12} className="mr-2 flex-shrink-0 text-indigo-400" />
                         {order.delivery_address}
                      </div>
                   </div>
                </div>

                <div className="flex items-center space-x-10 pl-10 border-l border-slate-50">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Order Age</p>
                      <div className="flex items-center justify-end text-slate-500 text-[10px] font-black uppercase tracking-widest">
                         <Clock size={12} className="mr-1.5 text-indigo-400" />
                         {format(new Date(order.created_at), 'h:mm a')}
                      </div>
                   </div>

                   <div className="flex flex-col items-end space-y-3">
                      <div className={`px-5 py-2 rounded-full text-[10px] font-black border ${getStatusColor(order.status)} uppercase tracking-widest`}>
                         {order.status.replace(/_/g, ' ')}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                         {order.status === 'pending' && (
                            <>
                               <button onClick={() => updateOrderStatus(order, 'cancelled')} className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all" title="Reject Order"><XCircle size={18} /></button>
                               <button onClick={() => updateOrderStatus(order, 'accepted')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 uppercase tracking-widest transition-all hover:bg-indigo-700">Accept Order</button>
                            </>
                         )}
                         {order.status === 'accepted' && (
                            <button onClick={() => updateOrderStatus(order, 'out_for_delivery')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 uppercase tracking-widest transition-all hover:bg-indigo-700">Dispatched Items</button>
                         )}
                         {order.status === 'out_for_delivery' && (
                            <button onClick={() => updateOrderStatus(order, 'delivered')} className="px-6 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-green-100 uppercase tracking-widest transition-all hover:bg-green-700 underline-none">Confirm Delivery</button>
                         )}
                         {(order.status === 'delivered' || order.status === 'cancelled') && (
                            <div className="bg-slate-50 p-3 rounded-full text-slate-300">
                               <CheckCircle2 size={24} />
                            </div>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerOrders;
