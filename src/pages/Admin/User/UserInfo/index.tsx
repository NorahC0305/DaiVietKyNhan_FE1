"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import Toolbar from "./Components/Toolbar";
import ToolbarSkeleton from "./Components/ToolbarSkeleton";
import UsersTable from "./Components/UsersTable";
import UsersTableSkeleton from "./Components/UsersTableSkeleton";
import StatisticsDialog from "./Components/StatisticsDialog";
import { IMePaginationResponse } from "@models/user/response";
import { EnhancedPagination } from "@/components/Atoms/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select";
import { Rows } from "lucide-react";
import userService from "@services/user";
import useDebounce from "@hooks/useDebounce";

interface UserInfoPageProps {
  listUsers: IMePaginationResponse['data'];
  initialUsersResponse?: IMePaginationResponse;
  birthdayAndGenderStats: any;
}

const UserInfoPage = ({ listUsers: initialListUsers, birthdayAndGenderStats  }: UserInfoPageProps) => {
  const [listUsers, setListUsers] = useState<IMePaginationResponse['data']>(initialListUsers);
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500); // 500ms delay
  const [status, setStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasInitialData, setHasInitialData] = useState<boolean>(!!initialListUsers);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState<boolean>(false);

  // Fetch users data
  const fetchUsers = async () => {
    setIsLoading(true);
    setHasInitialData(false); // Đánh dấu không còn dùng initial data nữa
    try {
      const response = await userService.getUsers({
        page,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        status: status || undefined,
        sortBy,
        sortOrder,
      }) as IMePaginationResponse;
      setListUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    // Chỉ fetch khi user đã tương tác, không fetch lần đầu khi có initialData
    if (hasUserInteracted) {
      fetchUsers();
    }
  }, [page, itemsPerPage, debouncedSearch, status, sortBy, sortOrder, hasUserInteracted]);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setPage(1);
    setHasUserInteracted(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setHasUserInteracted(true);
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
    setPage(1);
    setHasUserInteracted(true);
  };

  const handleStatusFilter = (statusValue: string) => {
    setStatus(statusValue);
    setPage(1);
    setHasUserInteracted(true);
  };

  const handleViewUser = (user: any) => {
    console.log("View user:", user);
    // TODO: Implement view user modal/page
  };

  const handleEditUser = (user: any) => {
    console.log("Edit user:", user);
    // TODO: Implement edit user modal/page
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Nếu đang sort field này, đổi thứ tự
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Nếu sort field mới, set field và mặc định desc
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
    setHasUserInteracted(true);
  };

  const handleStatisticsClick = () => {
    setIsStatisticsDialogOpen(true);
  };
  //-----------------------------End-----------------------------//

  return (
    <div className="space-y-6">
      <Card className="border-gray-300 bg-admin-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
            Thông tin người dùng
          </CardTitle>
          <div className="text-sm text-gray-500">
            Quản lý và theo dõi thông tin người dùng
          </div>
        </CardHeader>
        <CardContent className="space-y-4">

          <Toolbar
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onStatisticsClick={handleStatisticsClick}
            searchValue={search}
            statusValue={status}
          />
          {isLoading && !hasInitialData ? (
            <UsersTableSkeleton />
          ) : (
            <UsersTable
              rows={listUsers?.results}
              onViewUser={handleViewUser}
              onEditUser={handleEditUser}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
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
                {[15, 30, 45, 60].map(size => (
                  <SelectItem key={size} value={String(size)}>{size} / trang</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {listUsers && (
            <EnhancedPagination
              currentPage={page}
              totalPages={Math.max(1, Math.ceil((listUsers?.pagination?.totalItem || 0) / (itemsPerPage || 1)))}
              totalItems={listUsers?.pagination?.totalItem || 0}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </CardFooter>
      </Card>

      {/* Statistics Dialog */}
      <StatisticsDialog
        open={isStatisticsDialogOpen}
        onOpenChange={setIsStatisticsDialogOpen}
        birthdayAndGenderStats={birthdayAndGenderStats}
      />
    </div>
  );
};

export default UserInfoPage;
