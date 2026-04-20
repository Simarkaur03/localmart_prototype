import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight, 
  ClipboardList, 
  HelpCircle, 
  LogOut, 
  Settings,
  Bell,
  Navigation
} from 'lucide-react';

const Profile = () => {
  const { user, profile, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: ClipboardList, label: 'My Orders', path: '/my-orders', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Navigation, label: 'Manage Addresses', path: '#', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Bell, label: 'Notifications', path: '#', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Settings, label: 'Account Settings', path: '#', color: 'text-gray-600', bg: 'bg-gray-50' },
    { icon: HelpCircle, label: 'Help & Support', path: '#', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="mobile-container flex flex-col h-full bg-white relative font-outfit no-scrollbar overflow-y-auto pb-24">
      {/* Header Profile Section */}
      <div className="bg-slate-900 pt-16 pb-12 px-8 rounded-b-[3.5rem] relative overflow-hidden shadow-2xl">
         {/* Decorative elements */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
         
         <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-1.5 mb-6 group transition-all">
               <div className="w-full h-full bg-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl text-white font-black shadow-inner">
                  {profile?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
               </div>
            </div>
            
            <h1 className="text-white text-3xl font-black tracking-tighter mb-1 uppercase">{profile?.name || 'Local Mart User'}</h1>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] font-inter">Verified {profile?.role || 'Customer'}</p>
         </div>
      </div>

      {/* Info Cards */}
      <div className="px-6 -mt-8 relative z-20">
         <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 space-y-6">
            <div className="flex items-center space-x-5 group">
               <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                  <Mail size={20} />
               </div>
               <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Email Address</p>
                  <p className="font-black text-gray-800 text-sm truncate">{user?.email}</p>
               </div>
            </div>

            <div className="h-px bg-gray-50 mx-4"></div>

            <div className="flex items-center space-x-5 group">
               <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-all">
                  <Phone size={20} />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Mobile Number</p>
                  <p className="font-black text-gray-800 text-sm">{profile?.phone || '+91 99999 99999'}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Menu Options */}
      <div className="p-8 mt-4 space-y-3">
         <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 mb-6">Preferences & Activity</h2>
         
         {menuItems.map((item, index) => (
            <button 
              key={index}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 rounded-3xl transition-all border border-transparent hover:border-gray-100 group"
            >
               <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                     <item.icon size={20} />
                  </div>
                  <span className="font-black text-gray-800 text-xs uppercase tracking-widest">{item.label}</span>
               </div>
               <ChevronRight size={18} className="text-gray-300 mr-2 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
            </button>
         ))}

         <div className="pt-8 px-2">
            <button 
               onClick={handleLogout}
               className="w-full bg-red-50 text-red-600 p-6 rounded-[2rem] flex items-center justify-center space-x-4 border border-red-100 group transition-all hover:bg-red-600 hover:text-white"
            >
               <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
               <span className="font-black uppercase tracking-[0.2em] text-xs">Sign Out from Local Mart</span>
            </button>
         </div>
      </div>

      <div className="text-center pb-12">
         <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">Local Mart v1.0.4 Prototype</p>
      </div>
    </div>
  );
};

export default Profile;
