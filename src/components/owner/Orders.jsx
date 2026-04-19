import React, { useState } from 'react';
import { Search, Filter, ArrowRight, User, MapPin, Clock } from 'lucide-react';
import { MOCK_ORDERS } from '../../MockData';

const TABS = ["All", "Pending", "Accepted", "Delivered", "Cancelled"];

const OwnerOrders = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredOrders = activeTab === "All" 
    ? MOCK_ORDERS 
    : MOCK_ORDERS.filter(o => o.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex-1 ml-64 p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Manage Orders</h1>
            <p className="text-slate-500 mt-1">Review and process your incoming orders.</p>
          </div>
          <div className="flex space-x-3">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Order ID or Customer..." 
                  className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             </div>
             <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center">
               <Filter size={18} className="mr-2" /> Filter
             </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 pb-px">
          {TABS.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center shadow-sm hover:shadow-md transition-all group">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 mr-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">ID</p>
                 <p className="text-sm font-black text-slate-900 leading-none">{order.id.split('-')[1]}</p>
              </div>

              <div className="flex-1 grid grid-cols-4 gap-4">
                 <div className="col-span-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Customer</p>
                    <div className="flex items-center space-x-2">
                       <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">
                          {order.customer[0]}
                       </div>
                       <p className="font-bold text-slate-800 text-sm">{order.customer}</p>
                    </div>
                 </div>
                 <div className="col-span-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Items Summary</p>
                    <p className="text-slate-600 text-sm truncate pr-4">{order.items}</p>
                 </div>
                 <div className="col-span-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Order Total</p>
                    <p className="font-black text-slate-900 text-sm">₹{order.total}</p>
                 </div>
                 <div className="col-span-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Time Received</p>
                    <div className="flex items-center text-slate-500 text-xs">
                       <Clock size={12} className="mr-1" />
                       {order.time}
                    </div>
                 </div>
              </div>

              <div className="flex items-center space-x-6">
                 <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                    {order.status}
                 </div>
                 
                 <div className="flex items-center space-x-2">
                    {order.status === 'Pending' ? (
                       <>
                          <button className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-100">Reject</button>
                          <button className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-green-100 transition-all border border-green-600">Accept</button>
                       </>
                    ) : (
                       <button className="text-slate-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-all">
                          <ArrowRight size={20} />
                       </button>
                    )}
                 </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-3xl p-20 flex flex-col items-center justify-center text-center opacity-60">
               <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <ClipboardList size={48} className="text-slate-200" />
               </div>
               <h3 className="text-xl font-bold text-slate-800">No orders found</h3>
               <p className="text-slate-500 text-sm mt-1">Try switching tabs or adjusting filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerOrders;
