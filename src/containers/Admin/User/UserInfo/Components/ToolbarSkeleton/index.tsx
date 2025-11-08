"use client";

import { Skeleton } from "@atoms/ui/skeleton";

const ToolbarSkeleton = () => {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 flex items-center gap-2">
                <div className="relative w-full max-w-sm">
                    <Skeleton className="h-9 bg-gray-200 w-full" />
                </div>
                <Skeleton className="h-9 bg-gray-200 w-[140px]" />
            </div>
            <Skeleton className="h-9 bg-gray-200 w-[140px]" />
        </div>
    );
};

export default ToolbarSkeleton;
