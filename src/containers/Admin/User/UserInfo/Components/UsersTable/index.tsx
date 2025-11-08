"use client";

import { Badge } from "@atoms/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@atoms/ui/table";
import { Button } from "@atoms/ui/button";
import { Skeleton } from "@atoms/ui/skeleton";
import LucideIcon from "@atoms/LucideIcon";
import { COLORS } from "@constants/colors";
import { IMePaginationResponse } from "@models/user/response";
import { USER } from "@constants/user";
import { formatDate } from "@utils/Date";

export type SortField = 'name' | 'email' | 'coin' | 'point' | 'createdAt' | 'status';
export type SortDirection = 'asc' | 'desc';

interface Props {
  rows: NonNullable<IMePaginationResponse['data']>['results'] | undefined;
  onViewUser?: (user: any) => void;
  onEditUser?: (user: any) => void;
  onSort?: (field: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const UsersTable = ({ rows, onViewUser, onEditUser, onSort, sortBy, sortOrder }: Props) => {
  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="text-left cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => onSort?.('name')}
            >
              <div className="flex items-center gap-1">
                Người dùng
                {sortBy === 'name' && (
                  <LucideIcon
                    name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    iconSize={16}
                    iconColor={COLORS.TEXT.DARK}
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="text-left cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => onSort?.('email')}
            >
              <div className="flex items-center gap-1">
                Email
                {sortBy === 'email' && (
                  <LucideIcon
                    name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    iconSize={16}
                    iconColor={COLORS.TEXT.DARK}
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="text-center cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => onSort?.('coin')}
            >
              <div className="flex items-center justify-center gap-1">
                Xu
                {sortBy === 'coin' && (
                  <LucideIcon
                    name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    iconSize={16}
                    iconColor={COLORS.TEXT.DARK}
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="text-center cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => onSort?.('point')}
            >
              <div className="flex items-center justify-center gap-1">
                Điểm số
                {sortBy === 'point' && (
                  <LucideIcon
                    name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    iconSize={16}
                    iconColor={COLORS.TEXT.DARK}
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="text-center cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => onSort?.('createdAt')}
            >
              <div className="flex items-center justify-center gap-1">
                Ngày tham gia
                {sortBy === 'createdAt' && (
                  <LucideIcon
                    name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    iconSize={16}
                    iconColor={COLORS.TEXT.DARK}
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="text-center cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => onSort?.('status')}
            >
              <div className="flex items-center justify-center gap-1">
                Trạng thái
                {sortBy === 'status' && (
                  <LucideIcon
                    name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    iconSize={16}
                    iconColor={COLORS.TEXT.DARK}
                  />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows?.map((u) => {
            const initials = u.name
              ?.split(" ")
              ?.map((w) => w[0])
              ?.join("");
            return (
              <TableRow key={u.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-gray-900">{u.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-900">{u.email}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-[#D86D38]/20 text-white border-0">
                    {u.coin}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-[#D86D38]/20 text-white border-0">
                    {u.point}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-900">{formatDate(u.createdAt)}</TableCell>
                <TableCell className="text-center">
                  {u.status === USER.USER_STATUS.ACTIVE && (
                    <Badge variant="outline" className="bg-[#d16834] text-white border-0">
                      {USER.USER_STATUS.ACTIVE ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 text-gray-600">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewUser?.(u)}
                      title="Xem thông tin"
                    >
                      <LucideIcon name="Eye" iconSize={20} iconColor={COLORS.TEXT.DARK} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEditUser?.(u)}
                      title="Chỉnh sửa"
                    >
                      <LucideIcon name="Pencil" iconSize={20} iconColor={COLORS.TEXT.DARK} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;


