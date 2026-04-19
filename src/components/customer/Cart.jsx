import React from 'react';
import { ArrowLeft, MapPin, Trash2, Minus, Plus } from 'lucide-react';

const CustomerCart = ({ onNavigate, cart, updateQuantity }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 25;
  const taxes = subtotal * 0.05;
  const total = subtotal + deliveryFee + taxes;

  return (
    <div className="flex flex-col h-full bg-gray-50 no-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => onNavigate('store')} className="mr-4 p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-black text-gray-800">Checkout</h1>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cart is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
          <button 
            onClick={() => onNavigate('home')}
            className="bg-primary text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:bg-primary-dark transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex-1 p-5 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Delivery Address</h3>
                <button className="text-primary text-xs font-bold">CHANGE</button>
             </div>
             <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                   <p className="font-bold text-gray-800">Home</p>
                   <p className="text-xs text-gray-500 leading-relaxed">123 Main St, Sector 4, Raipur, Chhattisgarh, 492001</p>
                </div>
             </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-5 border-b border-gray-50">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Items</h3>
             </div>
             <div className="divide-y divide-gray-50">
                {cart.map(item => (
                  <div key={item.id} className="p-5 flex items-center space-x-4">
                    <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm leading-tight">{item.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">₹{item.price} • {item.unit}</p>
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-xl px-2 py-1 space-x-3">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500"><Minus size={14} strokeWidth={3} /></button>
                      <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-primary"><Plus size={14} strokeWidth={3} /></button>
                    </div>
                    <div className="text-right min-w-[50px]">
                      <p className="font-bold text-gray-900 text-sm">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white p-6 rounded-3xl shadow-premium border border-gray-100 space-y-4">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Bill Summary</h3>
             <div className="flex justify-between text-sm">
                <span className="text-gray-500">Item Total</span>
                <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-semibold text-gray-800">₹{deliveryFee.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-500">Taxes & Charges</span>
                <span className="font-semibold text-gray-800">₹{taxes.toFixed(2)}</span>
             </div>
             <div className="h-px bg-gray-100 my-2"></div>
             <div className="flex justify-between text-lg">
                <span className="font-black text-gray-800 uppercase tracking-tighter">To Pay</span>
                <span className="font-black text-gray-900">₹{total.toFixed(2)}</span>
             </div>
          </div>

          <div className="pb-10">
            <button 
              className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center space-x-3 active:scale-95"
              onClick={() => alert("Order Placed Successfully!")}
            >
              <span>PLACE ORDER</span>
              <div className="bg-white/20 px-2 py-0.5 rounded text-xs">₹{total.toFixed(0)}</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCart;
