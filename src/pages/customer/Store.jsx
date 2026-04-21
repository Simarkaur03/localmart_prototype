import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreById, useProducts } from '../../hooks/useQueryHooks';
import { useStockRealtime } from '../../hooks/useStockRealtime';
import { useStore } from '../../store/useStore';
import CustomerNav from '../../components/customer/CustomerNav';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ArrowLeft, Star, Clock, ShoppingCart, Minus, Plus, Loader2, AlertCircle, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerStore = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

  const { cart, addToCart, updateCartQuantity, clearAndAddToCart } = useStore();
  
  // Queries
  const { data: storeData, isLoading: storeLoading } = useStoreById(storeId);
  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useProducts(storeId);
  
  const store = storeData?.data;
  const products = useMemo(() => productsData?.data || [], [productsData]);

  const handleAddToCart = (product) => {
    // Check if cart has items from a different store
    if (cart.length > 0 && cart[0].store_id !== storeId) {
      setPendingProduct(product);
      setShowConflictModal(true);
      return;
    }
    addToCart(product);
    toast.success('Added to cart');
  };

  const handleSwitchStore = () => {
    if (pendingProduct) {
      clearAndAddToCart(pendingProduct);
      setPendingProduct(null);
      setShowConflictModal(false);
      toast.success('Cart updated with new store item');
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Realtime stock update
  const handleStockUpdate = useCallback(() => {
    refetchProducts();
  }, [refetchProducts]);

  useStockRealtime(storeId, handleStockUpdate);

  const getItemQuantity = (id) => {
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  const categories = useMemo(() => ["All", ...new Set(products.map(p => p.category))], [products]);
  const filteredProducts = activeTab === "All" 
    ? products 
    : products.filter(p => p.category === activeTab);

  const loading = storeLoading || productsLoading;

  if (loading && !store) return (
    <div className="mobile-container p-6 space-y-6 bg-white min-h-screen">
      <div className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
      <div className="flex justify-between py-4 border-b border-gray-100">
        <div className="w-16 h-8 bg-gray-100 rounded-xl animate-pulse" />
        <div className="w-16 h-8 bg-gray-100 rounded-xl animate-pulse" />
        <div className="w-16 h-8 bg-gray-100 rounded-xl animate-pulse" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
      </div>
    </div>
  );

  return (
    <div className="mobile-container flex flex-col h-full bg-white relative font-outfit">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Closed Store Banner */}
        {store && !store.is_active && (
          <div className="bg-red-50 p-4 border-b border-red-100 flex items-center space-x-3 sticky top-0 z-20">
            <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
            <p className="text-[10px] font-black text-red-700 uppercase tracking-widest leading-tight">
              This store is currently closed. Your cart has been saved.
            </p>
          </div>
        )}

        {/* Banner */}
        <div className="relative h-56 bg-gray-200">
          {store?.image_url && <img src={store.image_url} className="w-full h-full object-cover" alt={store.name} />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <h1 className="text-white text-3xl font-black tracking-tighter mb-1 uppercase">{store?.name}</h1>
            <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">{store?.category} • {store?.city}</p>
          </div>
          <button 
            onClick={() => navigate('/home')}
            className="absolute top-8 left-8 w-12 h-12 bg-white/95 backdrop-blur rounded-2xl flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-between px-10 py-6 border-b border-gray-50 bg-white sticky top-0 z-10 shadow-sm shadow-gray-50/50">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-gray-900 font-black text-base">
              <Star size={16} className="text-amber-400 mr-1.5 fill-amber-400" />
              {store?.rating || 'New'}
            </div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">Rating</span>
          </div>
          <div className="w-px h-8 bg-gray-100 self-center"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center text-gray-900 font-black text-base">
              <Clock size={16} className="text-green-600 mr-1.5" />
              25m
            </div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">Delivery</span>
          </div>
          <div className="w-px h-8 bg-gray-100 self-center"></div>
          <div className="flex flex-col items-center">
            <div className="text-gray-900 font-black text-base">₹100</div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">Min Order</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-3 px-8 py-8 overflow-x-auto no-scrollbar bg-white">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all active:scale-95 ${activeTab === cat ? 'bg-green-600 text-white shadow-xl shadow-green-100 border-2 border-green-600' : 'bg-gray-50 text-gray-400 border-2 border-transparent hover:bg-gray-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="px-8 space-y-10 min-h-[400px]">
           {loading ? (
             <div className="space-y-6">
                {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
             </div>
           ) : filteredProducts.length === 0 ? (
             <EmptyState 
              type="products" 
              title="No products found" 
              message="This category is currently empty. Try a different one!" 
             />
           ) : (
             filteredProducts.map(product => {
               const qty = getItemQuantity(product.id);
               const isLowStock = product.stock_qty > 0 && product.stock_qty <= 5;
               const isOutOfStock = product.stock_qty === 0;

               return (
                 <div key={product.id} className={`flex space-x-6 items-center group transition-all ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}>
                   <div className="w-32 h-32 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                      {product.image_url ? (
                        <img src={`${product.image_url}?width=300&quality=80`} className="w-full h-full object-cover" alt={product.name} />
                      ) : '🍎'}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-[9px] font-black text-white uppercase tracking-widest border border-white/40 px-3 py-1.5 rounded-xl">Sold Out</span>
                        </div>
                      )}
                      {isLowStock && !isOutOfStock && (
                         <div className="absolute top-2 right-2 bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg">Only {product.stock_qty} left</div>
                      )}
                   </div>
                   <div className="flex-1 py-1">
                      <h4 className="font-black text-gray-900 text-lg mb-0.5 tracking-tight group-hover:text-green-600 transition-colors">{product.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4">{product.unit || 'per unit'}</p>
                      
                      <div className="flex justify-between items-center">
                         <span className="font-black text-xl text-gray-900 tracking-tighter">₹{product.price}</span>
                         
                         {qty > 0 ? (
                           <div className="flex items-center bg-green-600 rounded-2xl px-3 py-2.5 space-x-5 text-white shadow-xl shadow-green-100 transition-all border-2 border-green-600">
                             <button onClick={() => updateCartQuantity(product.id, -1)} className="hover:scale-125 active:scale-90 transition-transform"><Minus size={16} strokeWidth={3} /></button>
                             <span className="font-black text-sm w-4 text-center">{qty}</span>
                             <button onClick={() => updateCartQuantity(product.id, 1)} disabled={qty >= product.stock_qty} className="hover:scale-125 active:scale-90 transition-transform disabled:opacity-30"><Plus size={16} strokeWidth={3} /></button>
                           </div>
                         ) : (
                           <button 
                             onClick={() => handleAddToCart(product)}
                             disabled={isOutOfStock || !store?.is_active}
                             className={`font-black text-[10px] px-8 py-3 rounded-2xl transition-all tracking-widest active:scale-95 border-2 ${isOutOfStock ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white border-green-600 text-green-600 hover:bg-green-600 hover:text-white shadow-xl shadow-green-50'}`}
                           >
                             ADD ITEM
                           </button>
                         )}
                      </div>
                   </div>
                 </div>
               );
             })
           )}
        </div>
      </div>

      {/* Cart Button Overlay */}
      {cartCount > 0 && (
        <div className="absolute bottom-28 left-8 right-8 z-40 animate-in slide-in-from-bottom-10 duration-500">
          <button 
            onClick={() => navigate('/cart')}
            className="w-full bg-slate-900 py-6 px-8 rounded-[2.5rem] flex justify-between items-center shadow-2xl ring-8 ring-white/80 backdrop-blur-sm transition-all active:scale-95 group"
          >
            <div className="flex items-center text-white">
              <div className="bg-green-600 p-3 rounded-2xl mr-5 group-hover:rotate-12 transition-transform shadow-lg shadow-green-900/40">
                <ShoppingCart size={22} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-green-500 tracking-widest leading-none mb-2">{cartCount} ITEMS IN CART</p>
                <div className="flex items-center">
                  <span className="font-black text-lg leading-none tracking-tight">VIEW CHECKOUT</span>
                  <ArrowTriangleRight size={16} className="ml-2 text-white/40" />
                </div>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[8px] font-black uppercase text-white/40 tracking-[0.2em] mb-1">Subtotal</p>
               <span className="text-white font-black text-2xl tracking-tighter">₹{cartTotal.toFixed(2)}</span>
            </div>
          </button>
        </div>
      )}

      {/* Multi-store Conflict Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 border border-white">
              <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 border-4 border-white shadow-xl">🛒</div>
              <h2 className="text-3xl font-black text-gray-900 text-center tracking-tighter mb-4 leading-none">Switching Stores?</h2>
              <p className="text-gray-400 text-center text-sm mb-12 font-medium px-6 leading-relaxed">Your cart already has items from <span className="text-gray-900 font-bold">another store</span>. Adding this will clear your current cart. Continue?</p>
              <div className="space-y-4">
                 <button 
                   onClick={handleSwitchStore}
                   className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] uppercase tracking-widest text-xs active:scale-95 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center space-x-3"
                 >
                    <span>Clear & Add Item</span>
                    <X size={16} className="opacity-40" />
                 </button>
                 <button 
                   onClick={() => setShowConflictModal(false)}
                   className="w-full bg-transparent text-gray-400 font-black py-4 rounded-[2rem] uppercase tracking-widest text-[10px] active:scale-95 transition-all"
                 >
                    Keep Existing Cart
                 </button>
              </div>
           </div>
        </div>
      )}
      <CustomerNav />
    </div>
  );
};

// Helper component since I don't want to import another icon
const ArrowTriangleRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default CustomerStore;
