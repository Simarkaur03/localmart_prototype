import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, ShoppingCart, Minus, Plus } from 'lucide-react';
import { POPULAR_ITEMS } from '../../MockData';

const CATEGORIES = ["All", "Dairy", "Snacks", "Beverages", "Staples"];

const CustomerStore = ({ onNavigate, onAddToCart, updateQuantity, cart }) => {
  const [activeTab, setActiveTab] = useState("All");

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getItemQuantity = (id) => {
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Header/Banner */}
        <div className="relative h-48 bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5">
            <h1 className="text-white text-2xl font-black mb-1">Sharma General Store</h1>
            <p className="text-white/80 text-xs font-medium">Grocery • Raipur</p>
          </div>
          <button 
            onClick={() => onNavigate('home')}
            className="absolute top-5 left-5 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
          >
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
        </div>

        {/* Store Info Stats */}
        <div className="flex justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-gray-800 font-bold">
              <Star size={14} className="text-yellow-500 mr-1 fill-yellow-500" />
              4.5
            </div>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Rating</span>
          </div>
          <div className="w-px h-8 bg-gray-100 self-center"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center text-gray-800 font-bold">
              <Clock size={14} className="text-primary mr-1" />
              25m
            </div>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Delivery</span>
          </div>
          <div className="w-px h-8 bg-gray-100 self-center"></div>
          <div className="flex flex-col items-center">
            <div className="text-gray-800 font-bold">₹100</div>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Min Order</span>
          </div>
        </div>

        {/* Categories Tab */}
        <div className="flex space-x-2 px-5 py-6 overflow-x-auto no-scrollbar bg-white">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === cat ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="px-5 grid grid-cols-1 gap-6">
          {POPULAR_ITEMS.concat(POPULAR_ITEMS.slice(0, 2)).map((item, idx) => {
            const qty = getItemQuantity(item.id);
            return (
              <div key={`${item.id}-${idx}`} className="flex space-x-4 items-center group">
                <div className={`w-28 h-28 ${item.bgColor} rounded-3xl flex items-center justify-center text-5xl flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform`}>
                  {item.image}
                </div>
                <div className="flex-1 py-1">
                  <h4 className="font-bold text-gray-800 mb-0.5">{item.name}</h4>
                  <p className="text-xs text-gray-400 mb-2">{item.unit}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-black text-lg text-gray-900">₹{item.price}</span>
                    
                    {qty > 0 ? (
                      <div className="flex items-center bg-primary rounded-full px-2 py-1.5 space-x-4  text-white shadow-md">
                        <button onClick={() => updateQuantity(item.id, -1)} className="hover:scale-110 transition-transform"><Minus size={16} strokeWidth={3} /></button>
                        <span className="font-black text-sm w-4 text-center">{qty}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="hover:scale-110 transition-transform"><Plus size={16} strokeWidth={3} /></button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => onAddToCart(item)}
                        className="bg-white border-2 border-primary text-primary font-bold text-xs px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Cart Button */}
      {cartCount > 0 && (
        <div className="absolute bottom-5 left-5 right-5 z-20">
          <button 
            onClick={() => onNavigate('cart')}
            className="w-full bg-primary py-4 px-6 rounded-2xl flex justify-between items-center shadow-premium ring-4 ring-white transition-transform active:scale-95 group"
          >
            <div className="flex items-center text-white">
              <div className="bg-white/20 p-2 rounded-xl mr-3 group-hover:rotate-12 transition-transform">
                <ShoppingCart size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase opacity-80 leading-none mb-1">{cartCount} ITEM{cartCount > 1 ? 'S' : ''}</p>
                <p className="font-black text-base leading-none">View Cart</p>
              </div>
            </div>
            <span className="text-white font-black text-lg">₹{cartTotal}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerStore;
