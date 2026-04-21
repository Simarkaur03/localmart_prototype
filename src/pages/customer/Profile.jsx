import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { userService } from '../../lib/supabase/userService';
import { MOCK_ADDRESSES } from '../../lib/mockData';
import CustomerNav from '../../components/customer/CustomerNav';
import toast from 'react-hot-toast';
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
  Navigation,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Home as HomeIcon,
  Briefcase,
  Plus
} from 'lucide-react';

const Profile = () => {
  const { user, profile, logout, updateProfile } = useStore();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('main'); // 'main', 'edit', 'addresses'
  const [loading, setLoading] = useState(false);
  
  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || ''
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await userService.updateUser(user.id, editForm);
      if (error) throw error;
      
      updateProfile(editForm);
      toast.success('Profile updated successfully!');
      setActiveView('main');
    } catch (err) {
      toast.error('Update failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: ClipboardList, label: 'My Orders', path: '/my-orders', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Navigation, label: 'Manage Addresses', action: () => setActiveView('addresses'), color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Bell, label: 'Notifications', path: '#', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Settings, label: 'Account Settings', action: () => setActiveView('edit'), color: 'text-gray-600', bg: 'bg-gray-50' },
    { icon: HelpCircle, label: 'Help & Support', path: '#', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (activeView === 'edit') {
    return (
      <div className="mobile-container flex flex-col h-full bg-white relative font-outfit">
        <div className="px-6 py-8 flex items-center border-b border-gray-100">
          <button onClick={() => setActiveView('main')} className="mr-5 p-1 hover:bg-gray-50 rounded-full transition-all">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-black text-gray-800 tracking-tighter uppercase">Edit Account</h1>
        </div>
        
        <form onSubmit={handleUpdateAccount} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="relative group">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Edit Full Name</p>
               <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-black focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all"
                  />
               </div>
            </div>

            <div className="relative group">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Update Phone Number</p>
               <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={18} />
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-black focus:ring-2 focus:ring-green-600/10 outline-none transition-all"
                  />
               </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.75rem] shadow-2xl transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <span className="uppercase tracking-[0.2em] text-xs">Save Changes</span>}
          </button>
        </form>
        <CustomerNav />
      </div>
    );
  }

  if (activeView === 'addresses') {
    return (
      <div className="mobile-container flex flex-col h-full bg-gray-50 relative font-outfit">
        <div className="bg-white px-6 py-8 flex items-center border-b border-gray-100">
          <button onClick={() => setActiveView('main')} className="mr-5 p-1 hover:bg-gray-50 rounded-full transition-all">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-black text-gray-800 tracking-tighter uppercase">Saved Addresses</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
          {/* Static Showcase Map */}
          <div className="h-64 relative overflow-hidden mb-6 group">
             <div className="absolute inset-0 bg-gray-200 animate-pulse">
                {/* Fallback pattern while map loads */}
                <div className="grid grid-cols-8 gap-4 opacity-10 rotate-12 -mt-10 -ml-10">
                   {[...Array(64)].map((_, i) => <Navigation key={i} size={48} />)}
                </div>
             </div>
             
             {/* Map Component Placeholder - Using a styled div to simulate map layout for prototype speed */}
             <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                <div className="relative w-full h-full">
                   {/* Decorative Map Elements */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 bg-green-600/20 rounded-full animate-ping"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                         <MapPin size={16} className="text-white" />
                      </div>
                   </div>
                   {/* Mock Streets */}
                   <div className="absolute top-1/4 left-0 w-full h-2 bg-white/40 skew-y-12"></div>
                   <div className="absolute top-0 left-1/3 w-2 h-full bg-white/40 -skew-x-12"></div>
                   <div className="absolute bottom-1/4 left-0 w-full h-3 bg-white/40 -skew-y-6"></div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-white/40 shadow-2xl">
                   <p className="text-[10px] font-black uppercase text-gray-800 tracking-widest leading-none mb-1">Current Zone</p>
                   <p className="text-[8px] font-black text-green-600 uppercase tracking-widest">Serviceable Area</p>
                </div>
             </div>
          </div>

          <div className="px-6 space-y-6">
            {/* Quick Add Button at Top */}
            <button 
              onClick={() => toast.success('New Address Flow Starting...')}
              className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.75rem] shadow-xl shadow-indigo-100 uppercase tracking-widest text-[10px] active:scale-95 transition-all flex items-center justify-center space-x-3 mb-8"
            >
               <Plus size={18} />
               <span>Add Another Address</span>
            </button>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 mb-4">Saved Locations</p>
              {MOCK_ADDRESSES.map((addr) => (
                <div key={addr.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start space-x-6 hover:border-indigo-600/30 transition-colors">
                  <div className={`w-12 h-12 ${addr.label === 'Home' ? 'bg-green-50 text-green-600' : addr.label === 'Office' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    {addr.label === 'Home' ? <HomeIcon size={20} /> : addr.label === 'Office' ? <Briefcase size={20} /> : <MapPin size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-black text-gray-800 text-sm uppercase tracking-widest">{addr.label}</h3>
                      {addr.is_default && (
                        <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em]">Default</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-[11px] font-bold leading-relaxed">{addr.address}</p>
                    <p className="text-gray-400 text-[10px] font-black uppercase mt-2 tracking-widest">{addr.city}</p>
                  </div>
                </div>
              ))}
              
              <button className="w-full border-2 border-dashed border-gray-200 p-8 rounded-[2.5rem] text-gray-400 font-bold flex flex-col items-center justify-center space-y-2 hover:bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all group">
                 <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-all">
                    <Plus size={20} />
                 </div>
                 <span className="text-[10px] uppercase tracking-widest font-black">Add New Address</span>
              </button>
            </div>
          </div>
        </div>
        <CustomerNav />
      </div>
    );
  }

  return (
    <div className="mobile-container flex flex-col h-full bg-white relative font-outfit no-scrollbar overflow-y-auto pb-24">
      {/* Header Profile Section */}
      <div className="bg-slate-900 pt-16 pb-12 px-8 rounded-b-[3.5rem] relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
         
         <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-1.5 mb-6">
               <div className="w-full h-full bg-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl text-white font-black shadow-inner">
                  {profile?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
               </div>
            </div>
            
            <h1 className="text-white text-3xl font-black tracking-tighter mb-1 uppercase">{profile?.name || 'Local Mart User'}</h1>
            <div className="flex items-center justify-center space-x-2 text-green-400 text-[10px] font-black uppercase tracking-[0.3em]">
               <CheckCircle2 size={12} />
               <span>{profile?.role || 'Customer'} Verified</span>
            </div>
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
              onClick={() => {
                if (item.action) return item.action();
                if (item.path !== '#') navigate(item.path);
              }}
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
               <span className="font-black uppercase tracking-[0.2em] text-xs">Sign Out</span>
            </button>
         </div>
      </div>

      <div className="text-center pb-12">
         <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">Local Mart v1.0.5 Prototype</p>
      </div>
      
      <CustomerNav />
    </div>
  );
};

export default Profile;
