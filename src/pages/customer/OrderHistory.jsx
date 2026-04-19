import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../lib/supabase/orderService';
import { useCustomerOrders } from '../../hooks/useQueryHooks';
import { useOrderRealtime } from '../../hooks/useOrderRealtime';
import { useStore } from '../../store/useStore';
import { OrderItemSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ArrowLeft, ClipboardList, Clock, CheckCircle2, Package, Truck, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  // Queries
  const { data: ordersData, isLoading, refetch, isRefetching } = useCustomerOrders(user?.id);
  const orders = useMemo(() => ordersData?.data || [], [ordersData]);

  // Realtime updates for order status
  const handleOrderUpdate = useCallback(() => {
    refetch();
    toast.success('Order status updated!');
  }, [refetch]);

  useOrderRealtime(null, handleOrderUpdate);

  const handleCancelOrder = async (orderId, currentStatus) => {
    if (currentStatus !== 'pending') {
      return toast.error('Only pending orders can be cancelled.');
    }

    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const { error } = await orderService.updateOrderStatus(orderId, 'cancelled');
      if (error) throw new Error(error);
      toast.success('Order cancelled successfully.');
      refetch();
    } catch (error) {
      toast.error('Cancellation failed: ' + error.message);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'accepted': return { label: 'Accepted', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'out_for_delivery': return { label: 'Out for Delivery', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' };
      case 'delivered': return { label: 'Delivered', icon: Package, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' };
      case 'cancelled': return { label: 'Cancelled', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' };
      default: return { label: status, icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100' };
    }
  };

  return (
    <div className="mobile-container flex flex-col h-full bg-gray-50 no-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-5 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="mr-5 p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-black text-gray-800 tracking-tighter uppercase">Order History</h1>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {isLoading && !isRefetching ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <OrderItemSkeleton key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState 
            type="orders" 
            title="No orders yet" 
            message="Your hungry belly is waiting! Order something fresh from nearby stores."
            actionText="Browse Stores"
            onAction={() => navigate('/home')}
          />
        ) : (
          <>
            <div className="flex justify-between items-center px-2">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{orders.length} TOTAL ORDERS</p>
               {isRefetching && <Loader2 size={12} className="animate-spin text-green-600" />}
            </div>
            {orders.map(order => {
              const status = getStatusInfo(order.status);
              return (
                <div key={order.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-all cursor-pointer group">
                  <div className="p-7">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-green-50 transition-colors">🏪</div>
                            <div>
                                <p className="font-black text-gray-800 text-sm tracking-tight">{order.stores?.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{format(new Date(order.created_at), 'dd MMM, hh:mm a')}</p>
                            </div>
                        </div>
                        <div className={`${status.bg} ${status.color} ${status.border} border px-4 py-1.5 rounded-full flex items-center space-x-1.5`}>
                            <status.icon size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-[1.5rem] border border-gray-50">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Amount</p>
                            <p className="font-black text-gray-900 text-lg tracking-tighter">₹{order.total_amount}</p>
                        </div>
                        
                        {order.status === 'pending' ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id, order.status); }}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            Cancel Order
                          </button>
                        ) : (
                          <div className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
                             {order.payment_method}
                          </div>
                        )}
                      </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
