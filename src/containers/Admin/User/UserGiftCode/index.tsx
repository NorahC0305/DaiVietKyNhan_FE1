"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import Toolbar from "./Components/Toolbar";
import UsersTable from "./Components/UsersTable";
import UsersTableSkeleton from "./Components/UsersTableSkeleton";
import { EnhancedPagination } from "@/components/Atoms/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select";
import { Rows } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserRewardsQueryOptions, getGiftCodesQueryOptions } from "@hooks/use-user-reward-queries";

const UserGiftCode = () => {
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [selectedCode, setSelectedCode] = useState<string>("all");

    // Build query params
    const queryParams = useMemo(() => {
        // Build query string parts
        const parts: string[] = [];
        
        // Always include sort
        parts.push("sort:-id");
        
        // Add filter if code is selected
        if (selectedCode && selectedCode !== "all") {
            parts.push(`reward.code:=${selectedCode}`);
        }
        
        return {
            qs: parts.join(","),
            currentPage: page,
            pageSize: itemsPerPage,
        };
    }, [page, itemsPerPage, selectedCode]);

    // Fetch user rewards with TanStack Query
    const userRewardsQueryOptions = useMemo(
        () => getUserRewardsQueryOptions(queryParams),
        [queryParams]
    );
    const {
        data: listUserRewards,
        isLoading,
        error,
        isError,
    } = useQuery(userRewardsQueryOptions);

    // Fetch gift codes with TanStack Query
    const {
        data: giftCodes,
    } = useQuery(getGiftCodesQueryOptions("CODE"));

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(parseInt(value));
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleCodeFilter = (codeValue: string) => {
        setSelectedCode(codeValue);
        setPage(1);
    };

    const handleViewUserReward = (userReward: any) => {
        console.log("View user reward:", userReward);
        // TODO: Implement view user reward modal/page
    };

    const handleEditUserReward = (userReward: any) => {
        console.log("Edit user reward:", userReward);
        // TODO: Implement edit user reward modal/page
    };

    // Use fetched data
    const userRewardsResults = listUserRewards?.results ?? [];
    const pagination = listUserRewards?.pagination || {
        current: 1,
        pageSize: 10,
        totalPage: 0,
        totalItem: 0,
    };

    // Show error if there's an error
    if (isError && error) {
        console.error("Error fetching user rewards:", error);
    }

    return (
        <div className="space-y-6">
            <Card className="border-gray-300 bg-admin-primary">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
                        Quản lý Gift Code
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                        Theo dõi và quản lý việc đổi gift code của người dùng
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Toolbar
                        onCodeFilter={handleCodeFilter}
                        codeValue={selectedCode}
                        giftCodes={giftCodes || []}
                    />
                    {isLoading ? (
                        <UsersTableSkeleton />
                    ) : (
                        <UsersTable
                            rows={userRewardsResults}
                            onViewUserReward={handleViewUserReward}
                            onEditUserReward={handleEditUserReward}
                        />
                    )}
                </CardContent>

                <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                            <SelectTrigger className="w-[100px] bg-background border-border text-foreground h-9">
                                <Rows className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                {[10, 20, 30, 50]?.map(size => (
                                    <SelectItem key={size} value={String(size)}>{size} / trang</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {listUserRewards && (
                        <EnhancedPagination
                            currentPage={page}
                            totalPages={Math.max(1, Math.ceil((pagination?.totalItem || 0) / (itemsPerPage || 1)))}
                            totalItems={pagination?.totalItem || 0}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default UserGiftCode;
