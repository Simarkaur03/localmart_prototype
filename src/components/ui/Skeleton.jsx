import React from 'react';

export const Skeleton = ({ className, width, height, rounded = 'rounded-2xl' }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${rounded} ${className}`}
      style={{ width, height }}
    ></div>
  );
};

export const StoreCardSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 rounded-3xl border border-gray-100 bg-white">
    <Skeleton width="64px" height="64px" />
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <Skeleton width="120px" height="16px" />
        <Skeleton width="40px" height="16px" rounded="rounded" />
      </div>
      <Skeleton width="180px" height="12px" />
      <Skeleton width="60px" height="12px" rounded="rounded" />
    </div>
  </div>
);

export const ProductCardSkeleton = () => (
   <div className="bg-white rounded-[2rem] border border-gray-100 p-4 space-y-4">
      <Skeleton width="100%" height="120px" />
      <Skeleton width="100px" height="16px" />
      <div className="flex justify-between items-center">
         <Skeleton width="60px" height="20px" />
         <Skeleton width="40px" height="40px" rounded="rounded-xl" />
      </div>
   </div>
);

export const OrderItemSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-gray-100 p-6 space-y-4">
    <div className="flex justify-between">
      <Skeleton width="80px" height="12px" />
      <Skeleton width="60px" height="20px" rounded="rounded-full" />
    </div>
    <div className="flex items-center space-x-3">
      <Skeleton width="32px" height="32px" rounded="rounded-xl" />
      <div className="space-y-1">
        <Skeleton width="120px" height="14px" />
        <Skeleton width="100px" height="10px" />
      </div>
    </div>
  </div>
);
