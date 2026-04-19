import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import { 
  Power, 
  MapPin, 
  Package, 
  TrendingUp, 
  Navigation, 
  Clock, 
  ChevronRight,
  Bell,
  LogOut,
  Boxes
} from 'lucide-react';
import toast from 'react-hot-toast';

const DeliveryDashboard = () => {
  const { user, profile, logout } = useStore();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(profile?.is_online || false);
  const [nearbyOrders, setNearbyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOnline) {
      fetchNearbyOrders();
    } else {
      setNearbyOrders([]);
    }
  }, [isOnline]);

  const fetchNearbyOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, stores(name, address, pincode)')
        .eq('status', 'accepted') // Only accepted orders are ready for pickup
        .eq('stores.pincode', profile?.pincode_serve)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNearbyOrders(data || []);
    } catch (error) {
      toast.error('Failed to load nearby deliveries');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    const nextStatus = !isOnline;
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_online: nextStatus })
        .eq('id', user.id);
      
      if (error) throw error;
      setIsOnline(nextStatus);
      toast.success(nextStatus ? "You're now Online!" : "You're now Offline.");
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAcceptDelivery = async (orderId) => {
    try {
      const { error } = await supabase
        .from('delivery_assignments')
        .insert({
          order_id: orderId,
          partner_id: user.id,
          status: 'accepted',
          accepted_at: new Date()
        });
      
      if (error) throw error;

      // Update order status to out_for_delivery
      await supabase
        .from('orders')
        .update({ 
          status: 'out_for_delivery',
          delivery_partner_id: user.id 
        })
        .eq('id', orderId);

      toast.success('Delivery Accepted!');
      navigate(`/delivery/active/${orderId}`);
    } catch (error) {
      toast.error('Could not accept delivery');
    }
  };

  return (
    <div className="mobile-container flex flex-col h-full bg-amber-50/30 no-scrollbar overflow-y-auto font-outfit">
      {/* Header */}
      <div className="bg-white px-8 py-8 flex flex-col space-y-6 rounded-b-[3.5rem] shadow-sm border-b border-amber-100/50">
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
               <div className="w-14 h-14 bg-amber-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-amber-100">
                  <Package size={28} />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Buddy {profile?.name}</h1>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mt-1">Certified Partner</p>
               </div>
            </div>
            <button onClick={logout} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-colors border border-gray-100">
               <LogOut size={20} />
            </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-amber-500 p-6 rounded-[2rem] text-white shadow-xl shadow-amber-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                 <Power size={64} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">My Status</p>
              <div className="flex items-center justify-between">
                 <span className="text-xl font-black">{isOnline ? 'Online' : 'Offline'}</span>
                 <button 
                   onClick={toggleStatus}
                   className={`w-12 h-6 rounded-full relative transition-all ${isOnline ? 'bg-white' : 'bg-amber-600'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${isOnline ? 'right-1 bg-amber-500' : 'left-1 bg-white'}`}></div>
                 </button>
              </div>
           </div>
           <div className="bg-white p-6 rounded-[2rem] border border-amber-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Today's Pay</p>
              <div className="flex items-end space-x-1">
                 <span className="text-xl font-black text-gray-900">₹0.00</span>
                 <TrendingUp className="text-green-500 mb-1" size={14} />
              </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {!isOnline ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6">
             <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-5xl shadow-xl border border-amber-50 animate-bounce">😴</div>
             <div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">You're currently Offline</h3>
                <p className="text-gray-400 text-sm font-medium px-10">Switch to Online to see deliveries available in <span className="text-amber-600 font-black">{profile?.pincode_serve}</span></p>
             </div>
             <button 
               onClick={toggleStatus}
               className="bg-amber-500 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-amber-100 uppercase tracking-widest text-xs active:scale-95 transition-all"
             >
                Go Online Now
             </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-700">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                   <Bell className="text-amber-500" size={18} />
                   <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Requests</h2>
                </div>
                <div className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-[9px] uppercase">Nearby Only</div>
             </div>

             {nearbyOrders.length === 0 ? (
               <div className="bg-white p-12 rounded-[3rem] border border-amber-100 shadow-sm text-center">
                  <Boxes className="mx-auto text-amber-200 mb-6" size={56} />
                  <p className="font-black text-gray-400 text-sm uppercase tracking-widest">No orders right now</p>
                  <p className="text-[10px] font-medium text-gray-300 mt-2">We'll alert you when a new delivery pops up!</p>
               </div>
             ) : (
               <div className="space-y-5">
                 {nearbyOrders.map(order => (
                   <div key={order.id} className="bg-white rounded-[2.5rem] border border-amber-100 shadow-sm overflow-hidden group">
                      <div className="p-7">
                         <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-4">
                               <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl border border-amber-100">🏪</div>
                               <div>
                                  <h4 className="font-black text-gray-800 text-base tracking-tight">{order.stores?.name}</h4>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.stores?.address?.substring(0, 30)}...</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Potential Pay</p>
                               <p className="text-xl font-black text-gray-900 tracking-tighter">₹45.00</p>
                            </div>
                         </div>

                         <div className="flex items-center space-x-6 bg-gray-50/50 p-4 rounded-2xl mb-8 border border-gray-100/50">
                            <div className="flex items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                               <MapPin size={12} className="mr-1.5 text-amber-500" />
                               2.4 km
                            </div>
                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                            <div className="flex items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                               <Clock size={12} className="mr-1.5 text-amber-500" />
                               15 mins
                            </div>
                         </div>

                         <button 
                           onClick={() => handleAcceptDelivery(order.id)}
                           className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl uppercase tracking-widest text-xs active:scale-95 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-slate-200"
                         >
                            <span>Accept Delivery</span>
                            <ChevronRight size={16} />
                         </button>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>

      {/* Navigation Mini */}
      <div className="bg-white/80 backdrop-blur-md px-10 py-6 flex justify-around items-center border-t border-amber-100 sticky bottom-0">
          <button className="flex flex-col items-center space-y-1 text-amber-600">
             <Navigation size={22} />
             <span className="text-[8px] font-black uppercase tracking-widest">Orders</span>
          </button>
          <button onClick={() => navigate('/delivery/earnings')} className="flex flex-col items-center space-y-1 text-gray-400">
             <TrendingUp size={22} />
             <span className="text-[8px] font-black uppercase tracking-widest">Earnings</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
             <MapPin size={22} />
             <span className="text-[8px] font-black uppercase tracking-widest">Payouts</span>
          </button>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
