import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Store, 
  Navigation, 
  CheckCircle2, 
  MoreVertical,
  ChevronRight,
  User,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const ActiveDelivery = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);
  const [status, setStatus] = useState('accepted'); // accepted -> picked_up -> delivered
  const [loading, setLoading] = useState(true);
  const locationInterval = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    fetchOrderDetails();
    startLocationUpdates();
    return () => {
      if (locationInterval.current) clearInterval(locationInterval.current);
    };
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, stores(name, address, lat, lng), users!customer_id(name, phone)')
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      setOrder(data);
      setStatus(data.status); // Link to DB status
    } catch (error) {
      toast.error('Failed to load active delivery details');
    } finally {
      setLoading(false);
    }
  };

  const startLocationUpdates = () => {
    if (!navigator.geolocation) return;

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentPos({ lat, lng });

          // Broadcast to DB
          await supabase.from('delivery_locations').insert({
            order_id: orderId,
            partner_id: (await supabase.auth.getUser()).data.user.id,
            lat,
            lng
          });
        },
        (err) => console.error('GPS Error:', err),
        { enableHighAccuracy: true }
      );
    };

    updateLocation();
    locationInterval.current = setInterval(updateLocation, 10000); // 10s as requested
  };

  const updateStatus = async (nextStatus) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('orders')
        .update({ status: nextStatus })
        .eq('id', orderId);
      
      if (error) throw error;

      // Also update delivery_assignments
      const assignmentStatus = nextStatus === 'delivered' ? 'delivered' : 'picked_up';
      await supabase
        .from('delivery_assignments')
        .update({ 
           status: assignmentStatus,
           [`${assignmentStatus}_at`]: new Date()
        })
        .eq('order_id', orderId);

      setStatus(nextStatus);
      toast.success(nextStatus === 'delivered' ? 'Order Delivered! Great job.' : 'Order Picked Up!');
      
      if (nextStatus === 'delivered') {
        navigate('/delivery/dashboard');
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) return <div className="p-10 text-center">Loading delivery mission...</div>;

  return (
    <div className="mobile-container flex flex-col h-full bg-white relative font-outfit">
      {/* Map Header */}
      <div className="h-[45%] relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={currentPos || { lat: 19.0760, lng: 72.8777 }}
            zoom={16}
            options={{ disableDefaultUI: true }}
          >
            {currentPos && <Marker position={currentPos} label="Me" />}
            {order?.stores && <Marker position={{ lat: parseFloat(order.stores.lat || 0), lng: parseFloat(order.stores.lng || 0) }} label="Store" />}
          </GoogleMap>
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse"></div>
        )}
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-6 bg-white p-4 rounded-3xl shadow-2xl z-20 active:scale-95"
        >
           <ArrowLeft size={24} />
        </button>
      </div>

      {/* Delivery Details */}
      <div className="flex-1 bg-white rounded-t-[3.5rem] -mt-10 relative z-30 p-10 overflow-hidden shadow-2xl">
         <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-10"></div>
         
         <div className="flex justify-between items-start mb-10">
            <div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">Active Mission</h2>
               <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-amber-600">
                  <Navigation size={12} className="mr-1" />
                  Ongoing Delivery
               </div>
            </div>
            <button className="bg-gray-50 p-4 rounded-3xl">
               <MoreVertical size={24} className="text-gray-400" />
            </button>
         </div>

         {/* Destination Cards */}
         <div className="space-y-6 mb-10">
            <div className={`flex items-start space-x-6 p-6 rounded-[2.5rem] border transition-all ${status === 'accepted' ? 'border-amber-500 bg-amber-50/30' : 'border-gray-50 bg-gray-50 opacity-40'}`}>
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-50">
                  <Store size={22} />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pickup From</p>
                  <h3 className="font-black text-gray-800 text-lg tracking-tight">{order?.stores?.name}</h3>
                  <p className="text-xs font-bold text-gray-500 mt-0.5">{order?.stores?.address}</p>
               </div>
               {status !== 'accepted' && <CheckCircle2 className="text-green-500" />}
            </div>

            <div className={`flex items-start space-x-6 p-6 rounded-[2.5rem] border transition-all ${status === 'out_for_delivery' ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-50 bg-gray-50 opacity-40'}`}>
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                  <User size={22} />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Drop To</p>
                  <h3 className="font-black text-gray-800 text-lg tracking-tight">{order?.users?.name}</h3>
                  <p className="text-xs font-bold text-gray-500 mt-0.5">{order?.delivery_address}</p>
               </div>
               <div className="flex space-x-2">
                  <button className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-green-600"><Phone size={18} /></button>
                  <button className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-indigo-600"><ExternalLink size={18} /></button>
               </div>
            </div>
         </div>

         {/* Action Button */}
         {status === 'accepted' ? (
           <button 
             onClick={() => updateStatus('out_for_delivery')}
             className="w-full bg-amber-500 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-amber-100 uppercase tracking-widest text-sm flex items-center justify-center space-x-3 active:scale-95 transition-all"
           >
              <span>Confirm Pickup</span>
              <ChevronRight size={20} />
           </button>
         ) : (
           <button 
             onClick={() => updateStatus('delivered')}
             className="w-full bg-green-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-green-100 uppercase tracking-widest text-sm flex items-center justify-center space-x-3 active:scale-95 transition-all"
           >
              <span>Confirm Delivery</span>
              <CheckCircle2 size={20} />
           </button>
         )}
      </div>
    </div>
  );
};

export default ActiveDelivery;
