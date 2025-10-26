"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import Toolbar from "./Components/Toolbar";
import ToolbarSkeleton from "./Components/ToolbarSkeleton";
import UsersTable from "./Components/UsersTable";
import UsersTableSkeleton from "./Components/UsersTableSkeleton";
import { IUserRewardPaginationResponse, IRewardCodeResponse } from "@models/user-reward/response";
import { EnhancedPagination } from "@/components/Atoms/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select";
import { Rows } from "lucide-react";
import userRewardService from "@services/user-reward";
import useDebounce from "@hooks/useDebounce";

interface UserGiftCodeProps {
    giftCodes: IRewardCodeResponse;
    initialUserRewardsResponse?: IUserRewardPaginationResponse;
}

const UserGiftCode = ({ giftCodes, initialUserRewardsResponse }: UserGiftCodeProps) => {
    const [listUserRewards, setListUserRewards] = useState<IUserRewardPaginationResponse['data']>(
        initialUserRewardsResponse?.data || {
            results: [],
            pagination: {
                current: 1,
                pageSize: 10,
                totalPage: 0,
                totalItem: 0
            }
        }
    );
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [selectedCode, setSelectedCode] = useState<string>("all");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasInitialData, setHasInitialData] = useState<boolean>(!!initialUserRewardsResponse);
    const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

    // Fetch user rewards data
    const fetchUserRewards = async () => {
        setIsLoading(true);
        setHasInitialData(false); // Đánh dấu không còn dùng initial data nữa
        try {
            // Build query string for filtering
            let queryString = "";
            if (selectedCode && selectedCode !== "all") {
                queryString += `reward.code:=${selectedCode}`;
            }

            const response = await userRewardService.getUserRewards({
                currentPage: page,
                pageSize: itemsPerPage,
                qs: queryString || undefined,
            }) as IUserRewardPaginationResponse;
            setListUserRewards(response.data);
        } catch (error) {
            console.error("Error fetching user rewards:", error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        // Chỉ fetch khi user đã tương tác, không fetch lần đầu khi có initialData
        if (hasUserInteracted) {
            fetchUserRewards();
        }
    }, [page, itemsPerPage, selectedCode, hasUserInteracted]);

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(parseInt(value));
        setPage(1);
        setHasUserInteracted(true);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setHasUserInteracted(true);
    };

    const handleCodeFilter = (codeValue: string) => {
        setSelectedCode(codeValue);
        setPage(1);
        setHasUserInteracted(true);
    };

    const handleViewUserReward = (userReward: any) => {
        console.log("View user reward:", userReward);
        // TODO: Implement view user reward modal/page
    };

    const handleEditUserReward = (userReward: any) => {
        console.log("Edit user reward:", userReward);
        // TODO: Implement edit user reward modal/page
    };
    //-----------------------------End-----------------------------//

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
                        giftCodes={giftCodes?.data || []}
                    />
                    {isLoading && !hasInitialData ? (
                        <UsersTableSkeleton />
                    ) : (
                        <UsersTable
                            rows={listUserRewards?.results}
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
                            totalPages={Math.max(1, Math.ceil((listUserRewards?.pagination?.totalItem || 0) / (itemsPerPage || 1)))}
                            totalItems={listUserRewards?.pagination?.totalItem || 0}
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
