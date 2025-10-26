"use client";

import React from "react";
import { Skeleton } from "@/components/Atoms/ui/skeleton";

const ToolbarSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                {/* Search Input Skeleton */}
                <Skeleton className="h-10 w-full max-w-md" />

                {/* Code Filter Skeleton */}
                <Skeleton className="h-10 w-[200px]" />

                {/* Status Filter Skeleton */}
                <Skeleton className="h-10 w-[150px]" />
            </div>
        </div>
    );
};

export default ToolbarSkeleton;
