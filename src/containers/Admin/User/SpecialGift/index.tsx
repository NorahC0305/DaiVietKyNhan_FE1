"use client";

import { useState } from "react";
import Image from "next/image";
import { useSpecialGifts } from "@hooks/useRewards";
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/Atoms/ui/table";
import { Button } from "@components/Atoms/ui/button";

const PAGE_SIZE = 20;

const SpecialGiftClient = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isFetching, isError, refetch } = useSpecialGifts({
        currentPage,
        pageSize: PAGE_SIZE,
    });

    const items = data?.items ?? [];
    const pagination = data?.pagination;
    const totalPages = pagination?.totalPage ?? 1;
    const totalItems = pagination?.totalItem ?? 0;

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="space-y-6">
            <Card className="border-gray-300 bg-admin-primary">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
                        Quản lý quà đặc biệt
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                        Danh sách người dùng đã nhận combo quà đặc biệt và thời điểm đổi quà.
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            Tổng số lượt đổi quà: <span className="font-semibold text-primary">{totalItems}</span>
                        </div>
                        <Button size="sm" onClick={() => refetch()} disabled={isFetching}>
                            {isFetching ? "Đang tải..." : "Tải lại"}
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Người dùng</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Quà tặng</TableHead>
                                    <TableHead>Giá trị</TableHead>
                                    <TableHead>Thời gian đổi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                            Đang tải dữ liệu...
                                        </TableCell>
                                    </TableRow>
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-red-500">
                                            Có lỗi khi tải dữ liệu. Vui lòng thử lại.
                                        </TableCell>
                                    </TableRow>
                                ) : items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                            Chưa có dữ liệu.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {(currentPage - 1) * PAGE_SIZE + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                                        {item.user?.avatar ? (
                                                            <Image
                                                                src={item.user.avatar}
                                                                alt={item.user?.name ?? "avatar"}
                                                                fill
                                                                sizes="40px"
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <span className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                                                                {item.user?.name?.[0] ?? "?"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {item.user?.name ?? "--"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">ID: {item.userId}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-700">
                                                {item.user?.email ?? "--"}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-700">
                                                <div className="font-semibold text-primary">
                                                    {item.reward?.gift ?? item.reward?.name ?? "--"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-700">
                                                {item.valuePaid ? item.valuePaid.toLocaleString("vi-VN") : "--"}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-700">
                                                {item.exchangedAt
                                                    ? new Date(item.exchangedAt).toLocaleString("vi-VN")
                                                    : "--"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                            Trang {pagination?.current ?? currentPage} / {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentPage <= 1 || isFetching}>
                                Trang trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNext}
                                disabled={currentPage >= totalPages || isFetching}
                            >
                                Trang sau
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SpecialGiftClient;