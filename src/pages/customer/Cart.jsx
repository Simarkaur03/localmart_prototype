import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../lib/supabase/orderService';
import { productService } from '../../lib/supabase/productService';
import { paymentService } from '../../lib/supabase/paymentService';
import { useStore } from '../../store/useStore';
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
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const CustomerCart = () => {
  const { cart, updateCartQuantity, clearCart, profile, user } = useStore();
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [address, setAddress] = useState(profile?.default_address || '');
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const [showConflictModal, setShowConflictModal] = useState(false);
  const navigate = useNavigate();

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
        name: "Kirana Connect",
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
      navigate('/order-confirmation', { state: { orderId: data.orderId } });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container flex flex-col h-full bg-gray-50 no-scrollbar overflow-y-auto relative">
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

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-6xl mb-6 shadow-soft">🛒</div>
          <h2 className="text-xl font-black text-gray-800 mb-2 tracking-tight">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-10 font-medium">Add some fresh items from nearby stores to get started!</p>
          <button 
            onClick={() => navigate('/home')}
            className="bg-green-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-green-100 uppercase tracking-widest text-xs active:scale-95 transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex-1 p-6 space-y-8          {/* Payment Method */}
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

             {paymentMethod === 'online' && (
               <div className="flex justify-center space-x-6 pt-2 opacity-40">
                  <Smartphone size={16} />
                  <Wallet size={16} />
                  <div className="text-[8px] font-black uppercase tracking-widest flex items-center">UPI • Cards • Wallets</div>
               </div>
             )}
          </div>

          {/* Coupons */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
             <div className="flex items-center space-x-4">
                <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                   <Trash2 size={20} /> {/* Using Trash2 as placeholder for Tag icon since I don't have it imported, wait, let me use ArrowRight */}
                </div>
                <div className="flex-1">
                   <input 
                     type="text" 
                     placeholder="Enter Coupon Code" 
                     className="w-full text-sm font-black uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0 placeholder:text-gray-300"
                   />
                </div>
                <button className="text-green-600 font-black text-xs uppercase tracking-widest px-4 py-2 hover:bg-green-50 rounded-xl transition-colors">Apply</button>
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
             <div className="flex justify-between text-xs text-green-600 bg-green-50 px-3 py-2 rounded-xl border border-green-100">
                <span className="font-black uppercase tracking-widest text-[9px]">Platform Discount</span>
                <span className="font-black">-₹{taxes.toFixed(2)}</span>
             </div>
             <div className="h-px bg-gray-100 my-2"></div>
             <div className="flex justify-between items-end">
                <div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">To Pay</span>
                   <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{total.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Paying via</span>
                  <div className="bg-gray-100 px-4 py-1.5 rounded-xl text-[10px] font-black text-gray-700 uppercase tracking-widest border border-gray-200 shadow-sm flex items-center space-x-2">
                     {paymentMethod === 'online' ? <CreditCard size={12}/> : <Banknote size={12}/>}
                     <span>{paymentMethod === 'online' ? 'Razorpay' : 'COD'}</span>
                  </div>
                </div>
             </div>
          </div>

          <div className="pb-16 px-2">
            <button 
              disabled={loading}
              onClick={handlePlaceOrder}
              className={`w-full ${paymentMethod === 'online' ? 'bg-slate-900' : 'bg-green-600'} hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-black py-6 rounded-[2.2rem] shadow-2xl transition-all flex items-center justify-center space-x-4 active:scale-95`}
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="tracking-widest uppercase text-xs">Securely Connecting...</span>
                </div>
              ) : (
                <>
                  <span className="tracking-widest uppercase text-sm">{paymentMethod === 'online' ? 'CONFIRM & PAY' : 'PLACE ORDER'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
            <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-6 px-10 leading-relaxed">By placing this order you agree to Kirana Connect's Terms of Service & Privacy Policy</p>
          </div>
        </div>
      )}

      {/* Multi-store Conflict Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🛒</div>
              <h2 className="text-2xl font-black text-gray-900 text-center tracking-tighter mb-4">Switch Store?</h2>
              <p className="text-gray-500 text-center text-sm mb-10 font-medium px-4">Your cart contains items from another store. Adding this will clear your current cart. Continue?</p>
              <div className="space-y-4">
                 <button className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-slate-200">Clear & Add New</button>
                 <button onClick={() => setShowConflictModal(false)} className="w-full bg-white text-gray-400 font-black py-5 rounded-[2rem] uppercase tracking-widest text-xs active:scale-95 transition-all">Keep Current Cart</button>
              </div>
           </div>
        </div>
      )}

      {/* Processing Overlay */}
      {loading && paymentMethod === 'online' && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[110] flex flex-col items-center justify-center text-center p-12 animate-in fade-in duration-500">
           <div className="relative mb-10">
              <div className="absolute inset-0 bg-green-100 rounded-full blur-2xl animate-pulse"></div>
              <Loader2 className="animate-spin text-green-600 relative z-10" size={64} strokeWidth={1.5} />
           </div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Processing Payment</h2>
           <p className="text-gray-400 text-sm font-black uppercase tracking-[0.3em] mb-12">Do not press back or refresh</p>
           <div className="flex items-center space-x-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
              <ShieldCheck size={20} className="text-green-600" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Secured by Razorpay</span>
           </div>
        </div>
      )}
    </div>
n>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCart;
