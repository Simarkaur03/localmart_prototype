import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../hooks/useQueryHooks';
import { StoreCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Home, User, ClipboardList, Loader2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomerNav from '../../components/customer/CustomerNav';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const CustomerHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const { data, isLoading, error } = useStores(page);
  const stores = data?.data || [];
  const totalCount = data?.count || 0;

  // Debounced/Filtered search (simulated debouncing with useMemo for now)
  const filteredStores = useMemo(() => {
    return stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      store.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  const totalPages = Math.ceil(totalCount / 20);

  if (error) {
    toast.error('Failed to fetch stores: ' + error.message);
  }

  return (
    <div className="mobile-container overflow-hidden flex flex-col h-full bg-white relative no-scrollbar">
      <div className="flex flex-col h-full bg-white no-scrollbar overflow-y-auto pb-20">
        {/* Header */}
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-green-600 font-black text-xl tracking-tighter uppercase">
                LOCAL MART
            </div>
            <div className="flex items-center space-x-1 text-gray-500 text-xs">
              <MapPin size={12} className="text-green-600" />
              <span className="font-bold">Raipur, Chhattisgarh</span>
            </div>
          </div>

          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search for stores or items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-green-600/20 transition-all outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Store List */}
        <div className="px-5 py-2">
          <h2 className="text-lg font-black text-gray-800 mb-4 tracking-tight">Nearby Local Mart Stores</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <StoreCardSkeleton key={i} />)}
            </div>
          ) : filteredStores.length === 0 ? (
            <EmptyState 
              type="stores" 
              title="No stores near you" 
              message="Check back soon! We are constantly onboarding new Local Mart partners."
            />
          ) : (
            <div className="space-y-4">
              {filteredStores.map(store => (
                <div 
                  key={store.id} 
                  onClick={() => navigate(`/store/${store.id}`)}
                  className="flex items-center space-x-4 p-4 rounded-3xl border border-gray-100 hover:shadow-soft transition-all cursor-pointer bg-white"
                >
                  <div className={`w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner`}>
                    {store.image_url ? (
                      <img 
                        src={`${store.image_url}?width=200&quality=80`} 
                        className="w-full h-full object-cover rounded-2xl" 
                        alt={store.name}
                      />
                    ) : '🏪'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-gray-800 leading-tight">{store.name}</h3>
                      <div className="flex items-center bg-green-50 px-2 py-0.5 rounded text-[10px] font-black text-green-700 border border-green-100 uppercase tracking-widest">
                        <Star size={10} className="mr-0.5 fill-green-600" />
                        {store.rating || 4.5}
                      </div>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">{store.category} • {store.city}</p>
                    <div className="mt-2 flex items-center">
                       <span className="text-[8px] uppercase font-black px-2 py-1 rounded bg-green-100 text-green-700 tracking-widest">Open Now</span>
                    </div>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-6 py-6 border-t border-gray-50 mt-4">
                  <button 
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="p-3 rounded-2xl bg-gray-50 text-gray-400 disabled:opacity-30 hover:bg-green-50 hover:text-green-600 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Page {page + 1} of {totalPages}</span>
                  <button 
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="p-3 rounded-2xl bg-gray-50 text-gray-400 disabled:opacity-30 hover:bg-green-50 hover:text-green-600 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CustomerNav />
    </div>
  );
};

export default CustomerHome;
