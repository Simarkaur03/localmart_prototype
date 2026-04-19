import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  PackagePlus, 
  Store, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Package, 
  Clock, 
  CheckCircle2,
  Plus
} from 'lucide-react';

const OwnerDashboard = ({ currentScreen, onNavigate }) => {
  const stats = [
    { label: "Today's Orders", value: "12", icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Revenue", value: "₹4,820", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending", value: "3", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Delivered", value: "9", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" }
  ];

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 min-h-screen text-slate-300 flex flex-col fixed left-0 top-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">S</div>
            <div>
              <p className="text-white font-bold leading-none">Sharma Ji</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Store Owner</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${currentScreen === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold text-sm">Dashboard</span>
          </button>
          <button 
            onClick={() => onNavigate('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${currentScreen === 'orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <ClipboardList size={20} />
            <span className="font-semibold text-sm">Orders</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all">
            <Package size={20} />
            <span className="font-semibold text-sm">Products</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all">
            <BarChart3 size={20} />
            <span className="font-semibold text-sm">Analytics</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all">
            <Settings size={20} />
            <span className="font-semibold text-sm">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button className="w-full bg-slate-800 py-3 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">LOGOUT</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-10 bg-slate-50 min-h-screen">
        {currentScreen === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Welcome back, Sharma Ji</h1>
                <p className="text-slate-500 mt-1">Here's what's happening at <span className="font-bold text-slate-800 uppercase tracking-tighter">Sharma General Store</span> today.</p>
              </div>
              <div className="flex space-x-3">
                 <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center">
                   <Store size={18} className="mr-2" /> Update Store
                 </button>
                 <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center">
                   <Plus size={18} className="mr-2" /> Add Product
                 </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-premium transition-all">
                   <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                     <stat.icon size={24} />
                   </div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                   <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Middle Section: Chart and Recent Activity */}
            <div className="grid grid-cols-3 gap-10">
              <div className="col-span-2 space-y-6">
                 <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold text-slate-900">Sales this week</h2>
                   <select className="bg-transparent border-none text-sm font-bold text-indigo-600 outline-none">
                     <option>Last 7 Days</option>
                     <option>Last 30 Days</option>
                   </select>
                 </div>
                 <div className="h-80 bg-white rounded-[2rem] border border-slate-100 flex items-center justify-center relative overflow-hidden shadow-sm group">
                    <div className="absolute inset-0 bg-slate-50/50 flex flex-col items-center justify-center">
                       <BarChart3 size={48} className="text-slate-200 mb-4" />
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Analytics Visualization</p>
                    </div>
                    {/* Mock chart bars */}
                    <div className="flex items-end space-x-4 h-40 absolute bottom-10">
                       {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                         <div key={i} className="w-10 bg-indigo-100 rounded-t-lg transition-all group-hover:bg-indigo-600" style={{height: `${h}%`}}></div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                 <div className="space-y-4">
                    <button className="w-full flex items-center space-x-4 bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group shadow-sm text-left">
                       <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <PackagePlus size={24} />
                       </div>
                       <div>
                         <p className="font-bold text-slate-900">Inventory</p>
                         <p className="text-xs text-slate-500">Update stock levels</p>
                       </div>
                    </button>
                    <button className="w-full flex items-center space-x-4 bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group shadow-sm text-left">
                       <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <ClipboardList size={24} />
                       </div>
                       <div>
                         <p className="font-bold text-slate-900">Reports</p>
                         <p className="text-xs text-slate-500">Generate P&L</p>
                       </div>
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
