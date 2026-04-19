import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star, X, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const ReviewModal = ({ order, on鼓, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error('Please select a rating');
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          order_id: order.id,
          customer_id: order.customer_id,
          store_id: order.store_id,
          rating,
          comment
        });
      
      if (error) throw error;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast.success('Thank you for your feedback!');
      onClose();
    } catch (error) {
      toast.error('Could not submit review. One review per order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 relative">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">⭐</div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">How was your order?</h2>
          <p className="text-gray-400 text-sm font-medium">Your feedback helps {order.stores?.name} improve their service.</p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center space-x-3 mb-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition-all duration-200"
            >
              <Star 
                size={42} 
                className={`${star <= (hover || rating) ? 'text-amber-400 fill-amber-400 scale-110' : 'text-gray-200'} transition-all`} 
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>

        {/* Comment */}
        <div className="mb-10">
           <textarea
             className="w-full bg-gray-50 border-none rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-green-100 min-h-[120px] placeholder:text-gray-300"
             placeholder="Tell us what you loved... (Optional)"
             value={comment}
             onChange={(e) => setComment(e.target.value)}
           />
        </div>

        <button 
          disabled={loading || rating === 0}
          onClick={handleSubmit}
          className="w-full bg-green-600 disabled:opacity-50 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-green-100 uppercase tracking-widest text-xs flex items-center justify-center space-x-3 active:scale-95 transition-all"
        >
           {loading ? <Loader2 className="animate-spin" size={20} /> : (
             <>
               <span>Submit Review</span>
               <Send size={16} />
             </>
           )}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
