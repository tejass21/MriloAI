
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonResponse = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Answer Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-5 rounded-full bg-gray-800"></div>
        <Skeleton className="h-5 w-20 bg-gray-800" />
      </div>
      
      {/* Answer Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-800" />
        <Skeleton className="h-4 w-[90%] bg-gray-800" />
        <Skeleton className="h-4 w-[85%] bg-gray-800" />
        <Skeleton className="h-4 w-[70%] bg-gray-800" />
      </div>
      
      {/* Source Section */}
      <div className="flex items-center gap-2 mt-6 mb-3">
        <Skeleton className="h-4 w-4 bg-gray-800" />
        <Skeleton className="h-5 w-24 bg-gray-800" />
      </div>
      
      {/* Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-start">
              <div className="mr-2 mt-0.5 flex-shrink-0">
                <div className="h-5 w-5 rounded-full bg-gray-700"></div>
              </div>
              <div className="flex flex-col w-full">
                <Skeleton className="h-4 w-[80%] bg-gray-700 mb-1" />
                <Skeleton className="h-3 w-full bg-gray-700 mb-1" />
                <Skeleton className="h-3 w-[90%] bg-gray-700 mb-1" />
                <div className="flex items-center mt-1 gap-1">
                  <Skeleton className="h-3 w-3 rounded-full bg-gray-700" />
                  <Skeleton className="h-3 w-[60%] bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
