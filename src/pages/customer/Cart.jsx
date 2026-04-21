import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../lib/supabase/orderService';
import { productService } from '../../lib/supabase/productService';
import { paymentService } from '../../lib/supabase/paymentService';
import { useStore } from '../../store/useStore';
import CustomerNav from '../../components/customer/CustomerNav';
import { 
  ArrowLeft, 
  MapPin, 
  Trash2, 
  Minus, 
  Plus, 
  Loader2, 
  ArrowRight, 
  AlertTriangle, 
  WifiOff,
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  ShieldCheck,
  X,
  History
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const CustomerCart = () => {
  const { cart, updateCartQuantity, clearCart, profile, user } = useStore();
  const [loading, setLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [address, setAddress] = useState(profile?.default_address || '');
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const [showConflictModal, setShowConflictModal] = useState(false);
  const navigate = useNavigate();

  // Fetch historical orders
  useEffect(() => {
    if (user?.id) {
       fetchRecentOrders();
    }
  }, [user]);

  const fetchRecentOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await orderService.getOrdersByCustomer(user.id);
      if (!error && data) {
        setRecentOrders(data.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Internet connection restored!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Some features may not work.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 30;
  const taxes = subtotal * 0.05;
  const total = subtotal + deliveryFee + taxes;

  const handleRazorpayCheckout = async () => {
    setLoading(true);
    try {
      // 1. Create order on RZP via Edge Function
      const { data: rzpOrder, error: rzpError } = await paymentService.createRzpOrder(
        `ORD_${Date.now()}`, 
        total
      );
      if (rzpError) throw new Error(rzpError);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: "INR",
        name: "Local Mart",
        description: "Grocery Order",
        order_id: rzpOrder.id,
        handler: async (response) => {
          setLoading(true);
          const { data: verified, error: verifyError } = await paymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: {
              items: cart,
              customerId: user.id,
              storeId: cart[0].store_id,
              deliveryAddress: address,
              totalAmount: total,
              paymentMethod: 'razorpay'
            }
          });

          if (verifyError) throw new Error(verifyError);
          
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#16a34a', '#ffffff', '#22c55e']
          });
          
          toast.success('Payment successful & Order placed!');
          clearCart();
          fetchRecentOrders(); // Refresh history
          navigate('/order-confirmation', { state: { orderId: verified.orderId } });
        },
        prefill: {
          name: profile?.name,
          email: user?.email,
          contact: profile?.phone
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || loading || !isOnline) return;
    if (!address.trim()) return toast.error('Please enter a delivery address');

    if (paymentMethod === 'online') {
      return handleRazorpayCheckout();
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: cart,
        customerId: user.id,
        storeId: cart[0].store_id,
        deliveryAddress: address,
        totalAmount: total,
        paymentMethod: 'cod'
      };

      const { data, error } = await orderService.placeOrder(orderPayload);
      if (error) throw new Error(error);

      toast.success('Order placed successfully (COD)!');
      clearCart();
      fetchRecentOrders(); // Refresh history
      navigate('/order-confirmation', { state: { orderId: data.orderId } });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container flex flex-col h-full bg-gray-50 no-scrollbar overflow-y-auto relative pb-32">
      <div 
        aria-live="polite" 
        className={`bg-slate-900 text-white px-6 py-3 flex items-center justify-between transition-all duration-500 sticky top-0 z-[60] ${isOnline ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}
      >
        <div className="flex items-center space-x-3">
          <WifiOff size={16} className="text-red-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">You are currently offline</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="bg-white px-6 py-5 flex items-center border-b border-gray-100 sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-5 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-black text-gray-800 tracking-tighter uppercase">My Cart</h1>
      </div>

      <div className="flex-1 p-6 space-y-8">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mb-6 shadow-soft">🛒</div>
            <h2 className="text-lg font-black text-gray-800 mb-2 tracking-tight">Your cart is empty</h2>
            <p className="text-gray-400 text-xs mb-8 font-medium">Add fresh items to get started!</p>
            <button 
              onClick={() => navigate('/home')}
              className="bg-green-600 text-white font-black px-8 py-3 rounded-2xl shadow-xl shadow-green-100 uppercase tracking-widest text-[10px] active:scale-95 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Payment Method */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-5">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Method</h3>
                  <div className="flex items-center space-x-1 text-green-600">
                     <ShieldCheck size={12} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Secure</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('online')}
                    className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center space-y-2 ${paymentMethod === 'online' ? 'border-green-600 bg-green-50 shadow-inner' : 'border-gray-50 bg-gray-50/50 grayscale opacity-60'}`}
                  >
                     <CreditCard size={20} className={paymentMethod === 'online' ? 'text-green-600' : 'text-gray-400'} />
                     <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'online' ? 'text-green-700' : 'text-gray-500'}`}>Online Pay</span>
                  </button>
                  <button 
                     onClick={() => setPaymentMethod('cod')}
                     className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center space-y-2 ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50 shadow-inner' : 'border-gray-50 bg-gray-50/50 grayscale opacity-60'}`}
                  >
                     <Banknote size={20} className={paymentMethod === 'cod' ? 'text-green-600' : 'text-gray-400'} />
                     <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'cod' ? 'text-green-700' : 'text-gray-500'}`}>Pay on Delivery</span>
                  </button>
               </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-100 space-y-5">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bill Details</h3>
               <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">Item Total</span>
                  <span className="font-black text-gray-800">₹{subtotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">Delivery Fee</span>
                  <span className="font-black text-gray-800">₹{deliveryFee.toFixed(2)}</span>
               </div>
               <div className="h-px bg-gray-100 my-2"></div>
               <div className="flex justify-between items-end">
                  <div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">To Pay</span>
                     <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{total.toFixed(2)}</p>
                  </div>
                  <button 
                    disabled={loading}
                    onClick={handlePlaceOrder}
                    className="bg-green-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-green-100 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Place Order'}
                  </button>
               </div>
            </div>
          </>
        )}

        {/* Recent Orders Section */}
        <div className="pt-8 space-y-6">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center space-x-3">
                <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
                   <History size={18} />
                </div>
                <h2 className="text-lg font-black text-gray-800 tracking-tighter uppercase">Recent Orders</h2>
             </div>
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Last 5 Activities</span>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center p-12 text-green-600 opacity-40"><Loader2 className="animate-spin" size={32} /></div>
          ) : recentOrders.length === 0 ? (
            <div className="bg-white/50 p-10 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">No history yet</p>
               <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest italic">Start your journey today</p>
            </div>
          ) : (
            <div className="space-y-4">
               {recentOrders.map(order => (
                 <div key={order.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-green-600/30 transition-all">
                    <div className="flex items-center space-x-5">
                       <div className="w-14 h-14 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-inner group-hover:bg-green-50 transition-colors">
                          {order.status === 'delivered' ? '✅' : order.status === 'cancelled' ? '❌' : '📦'}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">#{order.id.split('-')[0]}</p>
                          <div className="flex items-center space-x-3">
                             <span className="text-sm font-black text-gray-800 tracking-tighter">₹{order.total_amount}</span>
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 
                                order.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
                                'bg-indigo-50 text-indigo-600 border-indigo-100'
                             }`}>
                                {order.status === 'delivered' ? 'Completed' : order.status === 'out_for_delivery' ? 'On the Way' : order.status.replace(/_/g, ' ')}
                             </span>
                          </div>
                       </div>
                    </div>
                    {['pending', 'accepted', 'out_for_delivery'].includes(order.status) && (
                       <button 
                        onClick={() => navigate(`/track/${order.id}`)}
                        className="bg-slate-900 text-white p-4 rounded-[1.25rem] shadow-xl active:scale-90 transition-all hover:bg-green-600 group/btn"
                       >
                          <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                    )}
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
      
      <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] py-10">Secured Hyperlocal Core v1.2</p>
      
      <CustomerNav />
    </div>
  );
};

export default CustomerCart;
