import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';
import { Loader2 } from 'lucide-react';

// Auth Components
import LoginPage from './pages/LoginPage';
import Signup from './components/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Customer Components
import CustomerHome from './pages/customer/Home';
import CustomerStore from './pages/customer/Store';
import CustomerCart from './pages/customer/Cart';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import OrderHistory from './pages/customer/OrderHistory';
import Tracking from './pages/customer/Tracking';
import Profile from './pages/customer/Profile';

// Owner Components (Lazy Loaded)
const OwnerDashboard = lazy(() => import('./pages/owner/Dashboard'));
const OwnerOrders = lazy(() => import('./pages/owner/Orders'));
const ProductManagement = lazy(() => import('./pages/owner/Products'));
const StoreProfile = lazy(() => import('./pages/owner/Profile'));

// Admin Components (Lazy Loaded)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminStores = lazy(() => import('./pages/admin/Stores'));

// Delivery Partner Components (Lazy Loaded)
const DeliveryDashboard = lazy(() => import('./pages/delivery/Dashboard'));
const DeliveryActive = lazy(() => import('./pages/delivery/ActiveDelivery'));
const DeliveryEarnings = lazy(() => import('./pages/delivery/Earnings'));

const PageLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Local Mart Connecting...</p>
  </div>
);

function App() {
  const setUser = useStore(state => state.setUser);
  const setProfile = useStore(state => state.setProfile);
  const fetchProfile = useStore(state => state.fetchProfile);
  const setLoading = useStore(state => state.setLoading);

  useEffect(() => {
    // Initial session check
    const initAuth = async () => {
      // Safety timeout to prevent infinite loader if Supabase is unreachable
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth timeout')), 5000)
      );

      try {
        const { data: { session } } = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise
        ]);

        if (session) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Customer Routes */}
        <Route path="/home" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerHome />
          </ProtectedRoute>
        } />
        <Route path="/store/:storeId" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerStore />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerCart />
          </ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <OrderHistory />
          </ProtectedRoute>
        } />
        <Route path="/order-confirmation" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <OrderConfirmation />
          </ProtectedRoute>
        } />
        <Route path="/tracking/:orderId" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Tracking />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/owner/orders" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerOrders />
          </ProtectedRoute>
        } />
        <Route path="/owner/products" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <ProductManagement />
          </ProtectedRoute>
        } />
        <Route path="/owner/profile" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <StoreProfile />
          </ProtectedRoute>
        } />

        {/* Delivery Routes */}
        <Route path="/delivery/dashboard" element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <DeliveryDashboard />
          </ProtectedRoute>
        } />
        <Route path="/delivery/active/:orderId" element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <DeliveryActive />
          </ProtectedRoute>
        } />
        <Route path="/delivery/earnings" element={
          <ProtectedRoute allowedRoles={['delivery']}>
            <DeliveryEarnings />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminStores />
          </ProtectedRoute>
        } />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
