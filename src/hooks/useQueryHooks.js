import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../lib/supabase/storeService';
import { productService } from '../lib/supabase/productService';
import { orderService } from '../lib/supabase/orderService';
import { userService } from '../lib/supabase/userService';

/**
 * CUSTOMER HOOKS
 */

export const useStores = (page = 0) => {
  return useQuery({
    queryKey: ['stores', page],
    queryFn: () => storeService.getStores(page),
    staleTime: 60 * 1000,
  });
};

export const useStoreById = (storeId) => {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getStoreById(storeId),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProducts = (storeId) => {
  return useQuery({
    queryKey: ['products', storeId],
    queryFn: () => productService.getProducts(storeId),
    enabled: !!storeId,
    staleTime: 60 * 1000,
  });
};

export const useCustomerOrders = (customerId) => {
  return useQuery({
    queryKey: ['orders', 'customer', customerId],
    queryFn: () => orderService.getOrdersByCustomer(customerId),
    enabled: !!customerId,
    staleTime: 0, // Always fresh
  });
};

/**
 * OWNER HOOKS
 */

export const useOwnerStore = (ownerId) => {
  return useQuery({
    queryKey: ['store', 'owner', ownerId],
    queryFn: () => storeService.getStoreByOwner(ownerId),
    enabled: !!ownerId,
  });
};

export const useOwnerOrders = (storeId) => {
  return useQuery({
    queryKey: ['orders', 'store', storeId],
    queryFn: () => orderService.getOrdersByStore(storeId),
    enabled: !!storeId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

/**
 * ADMIN HOOKS
 */

export const useAllStores = () => {
  return useQuery({
    queryKey: ['admin', 'stores'],
    queryFn: () => storeService.getAllStores(),
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => userService.getAllUsers(),
  });
};
