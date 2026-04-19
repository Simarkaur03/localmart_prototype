import React from 'react';
import { ShoppingBag, Package, ClipboardList, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const icons = {
  stores: Store,
  products: Package,
  orders: ClipboardList,
  cart: ShoppingBag
};

export const EmptyState = ({ type = 'stores', title, message, actionText, onAction }) => {
  const Icon = icons[type] || ShoppingBag;
  
  return (
    <div className="flex flex-col items-center justify-center py-20 px-10 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-gray-200">
        <Icon size={48} />
      </div>
      <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">{title || `No ${type} found`}</h3>
      <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-[200px] mx-auto mb-8">
        {message || `We couldn't find any ${type} here. Check back later or try a different filter.`}
      </p>
      {actionText && (
        <button 
          onClick={onAction}
          className="bg-green-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-100 hover:scale-105 active:scale-95 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
