import React, { useState, useEffect } from 'react';
import { userService } from '../../lib/supabase/userService';
import { useStore } from '../../store/useStore';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Loader2,
  LayoutDashboard,
  Store,
  ShoppingBag,
  FileText,
  Settings,
  Mail,
  UserCheck,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { logout } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await userService.getAllUsers();
      if (error) throw new Error(error);
      setUsers(data);
    } catch (error) {
      toast.error('Load Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Loader2 className="animate-spin text-indigo-400" size={48} />
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar - Consistent with Admin Dashboard */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col pt-8">
        <div className="px-8 mb-12">
           <div className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-900/40">
                 <LayoutDashboard size={24} />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">ADMIN PANEL</span>
           </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
            { name: 'Stores', icon: Store, path: '/admin/stores' },
            { name: 'Users', icon: Users, path: '/admin/users' },
            { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
            { name: 'Reports', icon: FileText, path: '/admin/reports' },
            { name: 'Settings', icon: Settings, path: '/admin/settings' }
          ].map(item => (
            <Link 
              key={item.name}
              to={item.path}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${item.name === 'Users' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
            >
              <item.icon size={20} />
              <span className="font-black text-xs uppercase tracking-widest">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-8 border-t border-slate-800">
           <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-black text-white shadow-xl">A</div>
                 <div>
                    <p className="text-xs font-black text-white leading-none uppercase tracking-tighter">Super Admin</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1.5 leading-none">Global Access</p>
                 </div>
              </div>
              <button onClick={logout} className="w-full bg-slate-700/50 py-3 rounded-xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-red-900/20 transition-all uppercase tracking-widest border border-slate-600/30">Logout</button>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 rounded-l-[3.5rem] shadow-inner border-l border-white/5 mt-4 mb-4">
        <header className="h-24 bg-white/50 backdrop-blur-md px-12 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Users Registry</h2>
            <div className="flex items-center space-x-6">
               <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border text-xs py-3 pl-12 pr-6 rounded-2xl w-80 outline-none focus:ring-4 focus:ring-indigo-500/5 border-slate-100 placeholder:text-slate-400 transition-all shadow-sm"
                  />
               </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar">
           <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-premium overflow-hidden">
              <div className="p-10 flex justify-between items-center border-b border-slate-50 bg-slate-50/20">
                 <div className="flex space-x-2">
                    {['All', 'Customer', 'Owner', 'Admin'].map(role => (
                       <button 
                         key={role}
                         onClick={() => setRoleFilter(role)}
                         className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleFilter === role ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
                       >
                          {role}
                       </button>
                    ))}
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Reach: {users.length} Registrations</p>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead>
                       <tr className="bg-slate-50/80">
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                          <th className="text-center py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Role</th>
                          <th className="text-center py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined On</th>
                          <th className="text-right py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredUsers.map(user => (
                          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="py-8 px-10">
                                <div className="flex items-center space-x-5">
                                   <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-sm">
                                      {user.name[0].toUpperCase()}
                                   </div>
                                   <div>
                                      <p className="font-black text-slate-900 text-sm tracking-tight">{user.name}</p>
                                      <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                         <UserCheck size={10} className="mr-1 text-green-500" />
                                         Verified Entity
                                      </div>
                                   </div>
                                </div>
                             </td>
                             <td className="py-8 px-10">
                                <div className="space-y-1">
                                   <div className="flex items-center text-slate-600 text-[11px] font-bold">
                                      <Mail size={12} className="mr-2 text-slate-300" />
                                      {user.email}
                                   </div>
                                   <p className="text-[10px] text-slate-400 font-medium ml-5">{user.phone || 'No phone'}</p>
                                </div>
                             </td>
                             <td className="py-8 px-10 text-center">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 ${
                                   user.role === 'admin' ? 'bg-slate-900 text-white' : 
                                   user.role === 'owner' ? 'bg-indigo-50 text-indigo-600' : 
                                   'bg-green-50 text-green-600'
                                }`}>
                                   {user.role}
                                </span>
                             </td>
                             <td className="py-8 px-10 text-center">
                                <div className="flex items-center justify-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                   <Calendar size={12} className="mr-2 text-slate-300" />
                                   {format(new Date(user.created_at), 'dd MMM yyyy')}
                                </div>
                             </td>
                             <td className="py-8 px-10 text-right">
                                <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                   <MoreVertical size={20} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
