import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Home, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="mobile-container min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8"
      >
        <CheckCircle2 size={48} />
      </motion.div>

      <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Order Placed!</h1>
      <p className="text-gray-500 font-medium mb-1">Your order has been successfully placed.</p>
      <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 mb-10">
         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Order ID</span>
         <span className="text-xs font-black text-gray-700">{orderId?.split('-')[0] || 'GEN-001'}</span>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={() => navigate('/my-orders')}
          className="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-100 flex items-center justify-center space-x-3 active:scale-95 transition-all text-xs tracking-widest"
        >
          <span>TRACK ORDER</span>
          <ArrowRight size={18} />
        </button>
        <button 
          onClick={() => navigate('/home')}
          className="w-full bg-white border-2 border-gray-100 text-gray-600 font-black py-4 rounded-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-xs tracking-widest"
        >
          <Home size={18} />
          <span>BACK TO HOME</span>
        </button>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-3xl border border-gray-100 w-full text-left">
          <div className="flex items-center space-x-3 mb-3">
             <div className="w-8 h-8 bg-white rounded-full border border-gray-100 flex items-center justify-center">🚚</div>
             <p className="font-black text-gray-800 text-sm tracking-tight">Delivery in 30-45 mins</p>
          </div>
          <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">Our partner will call you upon arrival. Please have cash ready if you chose COD.</p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
