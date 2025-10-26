"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Atoms/ui/table";
import { Badge } from "@/components/Atoms/ui/badge";
import { Button } from "@/components/Atoms/ui/button";
import { Eye, Edit } from "lucide-react";
import { IUserReward } from "@models/user-reward/response";

interface UsersTableProps {
    rows?: IUserReward[];
    onViewUserReward: (userReward: IUserReward) => void;
    onEditUserReward: (userReward: IUserReward) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
    rows = [],
    onViewUserReward,
    onEditUserReward,
}) => {
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "default";
            case "PENDING":
                return "secondary";
            case "CANCELLED":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "Hoàn thành";
            case "PENDING":
                return "Chờ xử lý";
            case "CANCELLED":
                return "Đã hủy";
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!rows || rows.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Không có dữ liệu để hiển thị
            </div>
        );
    }

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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows?.map((userReward) => (
                        <TableRow key={userReward.id} className="hover:bg-muted/50">
                            <TableCell className="text-foreground">{userReward.id}</TableCell>
                            <TableCell className="text-foreground">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{userReward.user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-foreground">{userReward.user.email}</TableCell>
                            <TableCell className="text-foreground">
                                <Badge variant="outline" className="font-mono">
                                    {userReward.code}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-foreground">{userReward.reward.name}</TableCell>
                            <TableCell className="text-foreground">
                                <Badge variant={getStatusBadgeVariant(userReward.status)}>
                                    {getStatusText(userReward.status)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-foreground">
                                {userReward.exchangedAt ? formatDate(userReward.exchangedAt) : "-"}
                            </TableCell>
                            <TableCell className="text-foreground">
                                {userReward.valuePaid.toLocaleString()} coin
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UsersTable;
