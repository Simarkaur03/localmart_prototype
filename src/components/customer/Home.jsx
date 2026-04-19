import React from 'react';
import { Search, MapPin, Star, ShoppingBag, Home, User, ClipboardList } from 'lucide-react';
import { STORES, POPULAR_ITEMS } from '../../MockData';

const CustomerHome = ({ onNavigate, onAddToCart }) => {
  return (
    <div className="flex flex-col h-full bg-white no-scrollbar overflow-y-auto pb-20">
      {/* Header */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-primary font-bold text-xl uppercase tracking-tight">
            <span>Kirana Connect</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <MapPin size={14} className="text-primary" />
            <span className="font-medium">123 Main St, Raipur</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search for stores or items..." 
            className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
        </div>
      </div>

      {/* Nearby Stores */}
      <div className="px-5 py-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Nearby Stores</h2>
          <button className="text-primary text-xs font-semibold">View All</button>
        </div>
        <div className="space-y-4">
          {STORES.map(store => (
            <div 
              key={store.id} 
              onClick={() => onNavigate('store')}
              className="flex items-center space-x-4 p-3 rounded-2xl border border-gray-100 hover:shadow-soft transition-all cursor-pointer bg-white"
            >
              <div className={`w-16 h-16 rounded-xl ${store.color} flex items-center justify-center text-3xl shadow-inner`}>
                {store.image}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 leading-tight">{store.name}</h3>
                  <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-primary border border-green-100">
                    <Star size={10} className="mr-0.5 fill-primary" />
                    {store.rating}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{store.category} • {store.distance}</p>
                <div className="mt-2 flex items-center">
                   <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${store.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {store.isOpen ? 'Open' : 'Closed'}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Items */}
      <div className="px-5 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Popular Items</h2>
        <div className="grid grid-cols-2 gap-4">
          {POPULAR_ITEMS.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center">
              <div className={`w-28 h-28 ${item.bgColor} rounded-2xl flex items-center justify-center text-5xl mb-3 shadow-inner`}>
                {item.image}
              </div>
              <div className="w-full text-left">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">{item.category}</p>
                <h4 className="font-bold text-gray-800 text-sm truncate">{item.name}</h4>
                <p className="text-xs text-gray-500 mb-3">{item.unit}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">₹{item.price}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                    className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 w-[390px] border-t border-gray-100 bg-white/90 backdrop-blur-md px-6 py-3 flex justify-between items-center z-40">
        <div className="flex flex-col items-center text-primary">
          <Home size={22} className="mb-0.5" />
          <span className="text-[10px] font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-400" onClick={() => {}}>
          <Search size={22} className="mb-0.5" />
          <span className="text-[10px] font-medium">Search</span>
        </div>
        <div className="flex flex-col items-center text-gray-400" onClick={() => onNavigate('cart')}>
          <ClipboardList size={22} className="mb-0.5" />
          <span className="text-[10px] font-medium">Orders</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <User size={22} className="mb-0.5" />
          <span className="text-[10px] font-medium">Profile</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
