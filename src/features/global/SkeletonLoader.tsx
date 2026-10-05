import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse p-1">
      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-gray-200/80 dark:bg-gray-800/80 rounded-card p-5"
          />
        ))}
      </div>

      {/* Horizontal Strip skeleton */}
      <div className="h-36 bg-gray-200/80 dark:bg-gray-800/80 rounded-card p-5" />

      {/* Toolbar skeleton */}
      <div className="h-10 bg-gray-200/80 dark:bg-gray-800/80 rounded-xl" />

      {/* Table skeleton */}
      <div className="space-y-3 bg-white dark:bg-[#1E293B] p-5 rounded-card border border-gray-200 dark:border-gray-800">
        <div className="h-8 bg-gray-200/80 dark:bg-gray-800/80 rounded-lg w-full" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-12 bg-gray-100 dark:bg-gray-800/40 rounded-lg w-full"
          />
        ))}
      </div>
    </div>
  );
};
