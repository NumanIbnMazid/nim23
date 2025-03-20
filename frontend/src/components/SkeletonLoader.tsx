import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="animate-pulse flex flex-col space-y-4 p-6 max-w-4xl mx-auto pt-16 md:pt-6">
      {/* Title Skeleton */}
      <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Image Skeleton */}
      <div className="h-64 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Meta Info Skeleton */}
      <div className="flex space-x-4">
        <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Paragraph Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Button Skeleton */}
      <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  );
}
