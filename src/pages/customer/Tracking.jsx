import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { supabase } from '../../lib/supabase';
import { orderService } from '../../lib/supabase/orderService';
import { ArrowLeft, Phone, ShieldCheck, Clock, MapPin, Loader2, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const options = {
  disableDefaultUI: true,
  zoomControl: false,
  styles: [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [{ weight: "2.00" }]
    },
    {
      featureType: "all",
      elementType: "geometry.stroke",
      stylers: [{ color: "#9c9c9c" }]
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [{ color: "#f2f2f2" }]
    }
  ]
};

const Tracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [partnerLocation, setPartnerLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [eta, setEta] = useState('');
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    fetchOrderDetails();
    subscribeToLocation();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, stores(name, address, id), users!delivery_partner_id(name, phone)')
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load tracking details');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToLocation = () => {
    const channel = supabase
      .channel(`tracking_${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'delivery_locations',
        filter: `order_id=eq.${orderId}`
      }, (payload) => {
        setPartnerLocation({ lat: parseFloat(payload.new.lat), lng: parseFloat(payload.new.lng) });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  // Calculate directions & ETA
  useEffect(() => {
    if (isLoaded && partnerLocation && order) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: partnerLocation,
          destination: order.delivery_address, // This needs to be geocoded or lat/lng in real app
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            setEta(result.routes[0].legs[0].duration.text);
          }
        }
      );
    }
  }, [isLoaded, partnerLocation, order]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
       <Loader2 className="animate-spin text-green-600 mb-4" size={40} />
       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-outfit">Loading secure map...</p>
    </div>
  );

  return (
    <div className="mobile-container flex flex-col h-full bg-white relative font-outfit">
      {/* Header Overlay */}
      <div className="absolute top-8 left-6 right-6 z-20 flex items-center justify-between">
         <button 
           onClick={() => navigate(-1)}
           className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 active:scale-95 transition-all text-gray-800"
         >
            <ArrowLeft size={24} />
         </button>
         <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-2xl border border-gray-100 flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Live Tracking</span>
         </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 min-h-[55%]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={partnerLocation || { lat: 19.0760, lng: 72.8777 }}
            zoom={15}
            options={options}
          >
            {partnerLocation && (
              <Marker 
                position={partnerLocation} 
                icon={{
                  url: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Delivery bike icon
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
              />
            )}
            {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />}
          </GoogleMap>
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
             <Navigation className="text-gray-300 animate-bounce" size={48} />
          </div>
        )}
      </div>

      {/* Info Bottom Sheet */}
      <div className="h-[45%] bg-white rounded-t-[3.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] -mt-10 relative z-30 p-10 overflow-hidden">
         <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-10"></div>
         
         <div className="flex items-center justify-between mb-8">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Estimated Arrival</p>
               <div className="flex items-center space-x-3">
                  <Clock className="text-green-600" size={24} />
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{eta || 'Calculating...'}</h2>
               </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 mb-2">SAFE DELIVERY</span>
               <div className="flex items-center text-amber-500">
                  <ShieldCheck size={16} className="mr-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Partner</span>
               </div>
            </div>
         </div>

         <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 flex items-center space-x-6 mb-8">
            <div className="w-16 h-16 bg-white rounded-3xl border border-gray-100 flex items-center justify-center text-3xl shadow-sm">🛵</div>
            <div className="flex-1">
               <h3 className="font-black text-gray-800 text-lg tracking-tight mb-0.5">{order?.users?.name || 'Your Partner'}</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Delivering from {order?.stores?.name}</p>
            </div>
            <a 
              href={`tel:${order?.users?.phone}`}
              className="bg-green-600 text-white p-5 rounded-3xl shadow-xl shadow-green-100 active:scale-90 transition-all"
            >
               <Phone size={24} />
            </a>
         </div>

         {/* Order Status Timeline Mini */}
         <div className="flex justify-between items-center px-4">
            <div className="flex flex-col items-center space-y-2">
               <div className="w-3 h-3 rounded-full bg-green-600 ring-4 ring-green-100"></div>
               <span className="text-[8px] font-black uppercase text-gray-400">Accepted</span>
            </div>
            <div className="h-px bg-green-200 flex-1 mx-2"></div>
            <div className="flex flex-col items-center space-y-2">
               <div className="w-3 h-3 rounded-full bg-green-600 ring-4 ring-green-100"></div>
               <span className="text-[8px] font-black uppercase text-gray-400">Picked Up</span>
            </div>
            <div className="h-px bg-gray-100 flex-1 mx-2"></div>
            <div className="flex flex-col items-center space-y-2">
               <div className="w-3 h-3 rounded-full bg-gray-200"></div>
               <span className="text-[8px] font-black uppercase text-gray-400">Arrived</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Tracking;
