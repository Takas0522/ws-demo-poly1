import React from 'react';

interface CardSkeletonProps {
  count?: number;
  className?: string;
  hasImage?: boolean;
}

/**
 * CardSkeleton component for displaying loading state in card layouts
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 1,
  className = '',
  hasImage = false,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${className}`}
        >
          {hasImage && (
            <div className="w-full h-48 bg-gray-200 animate-pulse" />
          )}
          <div className="p-6">
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-4" style={{ width: '70%' }} />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '90%' }} />
              <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '80%' }} />
            </div>
            <div className="mt-6 flex gap-2">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
