import React from 'react';

const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-slate-200 animate-pulse rounded-xl ${className}`}
        />
      ))}
    </>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-in fade-in">
    <Skeleton className="h-48 w-full rounded-[2.5rem]" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-32 rounded-3xl" count={3} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-6">
        <Skeleton className="h-40 rounded-[2rem]" count={3} />
      </div>
      <div className="lg:col-span-4 space-y-6">
        <Skeleton className="h-64 rounded-[2rem]" />
        <Skeleton className="h-40 rounded-[2rem]" />
      </div>
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className="space-y-4 animate-in fade-in">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-24" />
    </div>
    <Skeleton className="h-24 w-full rounded-2xl" count={5} />
  </div>
);

const DetailSkeleton = () => (
  <div className="space-y-8 animate-in fade-in">
    <Skeleton className="h-64 w-full rounded-[2.5rem]" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-96 rounded-[2rem]" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-[2rem]" />
        <Skeleton className="h-48 rounded-[2rem]" />
      </div>
    </div>
  </div>
);

export { Skeleton, DashboardSkeleton, ListSkeleton, DetailSkeleton };
