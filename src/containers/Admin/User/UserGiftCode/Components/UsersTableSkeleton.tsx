"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Atoms/ui/table";
import { Skeleton } from "@/components/Atoms/ui/skeleton";

const UsersTableSkeleton: React.FC = () => {
    return (
        <div className="rounded-md border border-border bg-background">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                        <TableHead className="text-foreground font-medium">ID</TableHead>
                        <TableHead className="text-foreground font-medium">Người dùng</TableHead>
                        <TableHead className="text-foreground font-medium">Email</TableHead>
                        <TableHead className="text-foreground font-medium">Mã Code</TableHead>
                        <TableHead className="text-foreground font-medium">Tên Reward</TableHead>
                        <TableHead className="text-foreground font-medium">Trạng thái</TableHead>
                        <TableHead className="text-foreground font-medium">Ngày đổi</TableHead>
                        <TableHead className="text-foreground font-medium">Giá trị</TableHead>
                        <TableHead className="text-foreground font-medium text-center">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 })?.map((_, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="text-foreground">
                                <Skeleton className="h-4 w-8" />
                            </TableCell>
                            <TableCell className="text-foreground">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </TableCell>
                            <TableCell className="text-foreground">
                                <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell className="text-foreground">
                                <Skeleton className="h-6 w-16" />
                            </TableCell>
                            <TableCell className="text-foreground">
                                <Skeleton className="h-4 w-28" />
                            </TableCell>
                            <TableCell className="text-foreground">
                                <Skeleton className="h-6 w-20" />
                            </TableCell>
                            <TableCell className="text-foreground">
                                <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell className="text-foreground">
                                <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UsersTableSkeleton;
