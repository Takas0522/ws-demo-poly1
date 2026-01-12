import React from 'react';

interface FormSkeletonProps {
  fields?: number;
  className?: string;
}

/**
 * FormSkeleton component for displaying loading state in forms
 */
export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 5,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, idx) => (
        <div key={idx} className="space-y-2">
          <div className="h-4 bg-gray-300 rounded animate-pulse" style={{ width: '30%' }} />
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <div className="h-10 w-32 bg-gray-300 rounded animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};
