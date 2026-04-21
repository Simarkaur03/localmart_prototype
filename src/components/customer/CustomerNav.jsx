import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

const CustomerNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useStore();
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { label: 'Home', icon: Home, path: '/home' },
    { label: 'Cart', icon: ShoppingCart, path: '/cart', badge: cartCount },
    { label: 'Orders', icon: ClipboardList, path: '/my-orders' },
    { label: 'Profile', icon: User, path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center p-4">
      <div className="w-[360px] bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-premium-nav border border-gray-100/50 flex justify-between items-center px-6 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center transition-all duration-300 ${isActive ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-green-600 rounded-full animate-pulse" />
              )}
              
              {item.badge > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {item.badge}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerNav;
