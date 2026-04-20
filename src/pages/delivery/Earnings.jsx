import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ChevronRight, 
  Award,
  Wallet,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const mockData = [
  { day: 'Mon', amount: 450 },
  { day: 'Tue', amount: 320 },
  { day: 'Wed', amount: 580 },
  { day: 'Thu', amount: 210 },
  { day: 'Fri', amount: 890 },
  { day: 'Sat', amount: 1200 },
  { day: 'Sun', amount: 950 },
];

const Earnings = () => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const fetchEarnings = async () => {
    // In real app, query delivery_assignments with partner_id and status='delivered'
    // Sum the earnings column
    setEarnings(mockData);
    setTotalEarnings(mockData.reduce((acc, curr) => acc + curr.amount, 0));
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <div className="mobile-container flex flex-col h-full bg-slate-50 no-scrollbar overflow-y-auto font-outfit">
      {/* Header */}
      <div className="bg-slate-900 px-8 pt-12 pb-24 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
         <div className="flex justify-between items-center mb-10 relative z-10">
            <button 
              onClick={() => navigate('/delivery/dashboard')}
              className="bg-white/10 backdrop-blur-md p-4 rounded-3xl text-white active:scale-90 transition-all"
            >
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-white font-black text-xs uppercase tracking-[0.3em]">Earnings Hub</h1>
            <button className="bg-indigo-500 p-4 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
               <Wallet size={20} />
            </button>
         </div>

         <div className="relative z-10">
            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-2">Current Balance</p>
            <div className="flex items-baseline space-x-3">
               <span className="text-white text-5xl font-black tracking-tighter">₹{totalEarnings.toLocaleString()}</span>
               <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black flex items-center">
                  <ArrowUpRight size={12} className="mr-1" />
                  +12%
               </div>
            </div>
         </div>
      </div>

      {/* Chart Section */}
      <div className="mx-6 -mt-16 bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 relative z-20">
         <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-gray-900 tracking-tight">Weekly Performance</h3>
            <div className="bg-slate-50 px-4 py-2 rounded-xl flex items-center space-x-2 border border-slate-100">
               <Calendar size={14} className="text-slate-400" />
               <span className="text-[10px] font-black text-slate-500 uppercase">This Week</span>
            </div>
         </div>

         <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={earnings}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#0f172a' }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 8, 8]} barSize={20}>
                     {earnings.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 5 ? '#6366f1' : '#f1f5f9'} />
                     ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Incentives */}
      <div className="px-8 py-10 space-y-8">
         <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900 tracking-tight text-lg">Incentives</h3>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">View All</button>
         </div>

         <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <Award className="mb-6 opacity-40" size={32} />
            <h4 className="text-xl font-black tracking-tight mb-2">Weekend Warrior</h4>
            <p className="text-indigo-100 text-xs font-medium mb-8 leading-relaxed">Complete <span className="text-white font-black underline decoration-indigo-300">20 deliveries</span> this weekend to earn extra ₹500.</p>
            
            <div className="space-y-3">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>Progress</span>
                  <span>14/20</span>
               </div>
               <div className="w-full h-2 bg-indigo-700 rounded-full overflow-hidden">
                  <div className="w-[70%] h-full bg-white rounded-full"></div>
               </div>
            </div>
         </div>

         {/* Recent Payouts */}
         <div className="space-y-5">
            <h3 className="font-black text-gray-900 tracking-tight text-lg">Recent Payouts</h3>
            {[1, 2].map(i => (
               <div key={i} className="bg-white p-6 rounded-[2.5rem] flex items-center justify-between border border-slate-100 shadow-sm">
                  <div className="flex items-center space-x-5">
                     <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                        <TrendingUp size={20} />
                     </div>
                     <div>
                        <p className="font-black text-gray-800 text-sm tracking-tight">Weekly Settlement</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">April 14 - April 20</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-black text-gray-900 tracking-tighter">₹4,890</p>
                     <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">Paid Out</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Earnings;
