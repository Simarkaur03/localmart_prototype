import React, { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOwnerStore, useProducts } from '../../hooks/useQueryHooks';
import { productService } from '../../lib/supabase/productService';
import ImageUpload from '../../components/common/ImageUpload';
import { useStore } from '../../store/useStore';
import { 
  Plus, 
  Search, 
  Package, 
  Trash2, 
  Edit3, 
  Loader2, 
  CircleOff, 
  CheckCircle2,
  X,
  LayoutDashboard,
  ClipboardList,
  Settings,
  Store,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const { user, profile, logout } = useStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: '',
    stock_qty: '',
    image_url: '',
    is_available: true
  });

  // Queries
  const { data: storeData, isLoading: storeLoading } = useOwnerStore(user?.id);
  const store = storeData?.data;

  const { data: productsData, isLoading: productsLoading } = useProducts(store?.id);
  const products = useMemo(() => productsData?.data || [], [productsData]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoadingAction(true);

    try {
      const { error } = await productService.createProduct({
        ...formData,
        store_id: store.id,
        price: parseFloat(formData.price),
        stock_qty: parseInt(formData.stock_qty)
      });

      if (error) throw new Error(error);
      
      toast.success('Product added successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', category: '', price: '', unit: '', stock_qty: '', image_url: '', is_available: true });
      queryClient.invalidateQueries(['products', store.id]);
    } catch (error) {
      toast.error('Add failed: ' + error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const toggleAvailability = async (productId, currentStatus) => {
    try {
      const { error } = await productService.updateProduct(productId, { is_available: !currentStatus });
      if (error) throw new Error(error);
      toast.success('Status updated');
      queryClient.invalidateQueries(['products', store.id]);
    } catch (error) {
      toast.error('Update failed: ' + error.message);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await productService.deleteProduct(productId);
      if (error) throw new Error(error);
      
      toast.success('Product deleted');
      queryClient.invalidateQueries(['products', store.id]);
    } catch (error) {
      toast.error('Deletion failed: ' + error.message);
    }
  };
   
  const loading = storeLoading || productsLoading;

  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      {/* Sidebar - Same as Dashboard */}
      <div className="w-64 bg-slate-900 h-screen text-slate-300 flex flex-col fixed left-0 top-0 z-20">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">S</div>
            <div>
              <p className="text-white font-black leading-none tracking-tight">{profile?.name || 'Owner'}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1.5">Kirana Owner</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-5 space-y-2 mt-4">
          <Link to="/owner/dashboard" className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <LayoutDashboard size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Dashboard</span>
          </Link>
          <Link to="/owner/orders" className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <ClipboardList size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Orders</span>
          </Link>
          <Link to="/owner/products" className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-900/50">
            <Package size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Products</span>
          </Link>
          <Link to="/owner/profile" className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <Settings size={20} />
            <span className="font-black text-xs uppercase tracking-widest">Store Profile</span>
          </Link>
        </nav>
        <div className="p-6 border-t border-slate-800">
           <button onClick={logout} className="w-full bg-slate-800 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-900/40 hover:text-red-400 transition-all border border-slate-700">LOG OUT</button>
        </div>
      </div>

      <main className="flex-1 ml-64 p-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Inventory Management</h1>
              <p className="text-slate-500 mt-2 font-medium">Add new items and manage your store's digital shelf.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center uppercase tracking-widest"
            >
              <Plus size={18} className="mr-2" /> Add New Product
            </button>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                <div className="relative">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="text" placeholder="Search inventory..." className="bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-xs w-80 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: {products.length} Products</p>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full">
                   <thead>
                      <tr className="bg-slate-50/50">
                         <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                         <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                         <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price / Unit</th>
                         <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level</th>
                         <th className="text-center py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                         <th className="text-right py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {loading ? (
                        <tr><td colSpan="6" className="py-20 text-center"><Loader2 className="animate-spin inline text-indigo-600" size={32} /></td></tr>
                      ) : products.length === 0 ? (
                        <tr><td colSpan="6" className="py-20 text-center opacity-40"><Package size={48} className="mx-auto mb-4" /><p className="font-black uppercase tracking-widest text-xs">Shelf is empty</p></td></tr>
                      ) : (
                        products.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="py-8 px-10 uppercase tracking-tight">
                               <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                                     {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : '🍎'}
                                  </div>
                                  <span className="font-black text-slate-800 text-sm">{p.name} <span className="text-[10px] text-slate-400 ml-1">v1.0</span></span>
                               </div>
                            </td>
                            <td className="py-8 px-10">
                               <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                  {p.category}
                               </span>
                            </td>
                            <td className="py-8 px-10">
                               <p className="font-black text-slate-900 text-base tracking-tighter">₹{p.price}</p>
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Per {p.unit}</span>
                            </td>
                            <td className="py-8 px-10">
                               <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 rounded-full ${p.stock_qty < 10 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                  <span className="font-black text-slate-700 text-sm tracking-tighter">{p.stock_qty} <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest ml-1">Left</span></span>
                               </div>
                            </td>
                            <td className="py-8 px-10 text-center">
                               <button 
                                onClick={() => toggleAvailability(p.id, p.is_available)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${p.is_available ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}
                               >
                                  {p.is_available ? 'Available' : 'Out of Stock'}
                               </button>
                            </td>
                            <td className="py-8 px-10 text-right">
                               <div className="flex items-center justify-end space-x-2">
                                  <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                                  <button onClick={() => deleteProduct(p.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                               </div>
                            </td>
                          </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 relative border border-slate-100 overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full"></div>
              
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors z-10"><X size={24} /></button>
              
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8 relative z-10">New Product</h2>
              
              <form onSubmit={handleAddProduct} className="space-y-6 relative z-10">
                 <div className="space-y-4">
                    <ImageUpload 
                       bucket="product-images" 
                       path={`store-${store?.id}`} 
                       onUploadComplete={(url) => setFormData({...formData, image_url: url})} 
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1 col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Product Name</label>
                          <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all font-bold" placeholder="e.g. Fresh Milk" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category</label>
                          <input type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all font-bold" placeholder="e.g. Dairy" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Unit</label>
                          <input type="text" required value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all font-bold" placeholder="e.g. 1 Litre" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Price (₹)</label>
                          <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all font-bold" placeholder="0.00" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Stock Qty</label>
                          <input type="number" required value={formData.stock_qty} onChange={(e) => setFormData({...formData, stock_qty: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all font-bold" placeholder="0" />
                       </div>
                    </div>
                 </div>
                 
                 <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-indigo-100 transition-all uppercase tracking-widest text-xs disabled:opacity-70 mt-4"
                 >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'ADD TO INVENTORY'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
