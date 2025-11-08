"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@atoms/ui/table";
import { Skeleton } from "@atoms/ui/skeleton";

const UsersTableSkeleton = () => {
    return (
        <div className="rounded-md">
            <Table>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-32 bg-gray-200" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-48 bg-gray-200" />
                            </TableCell>
                            <TableCell className="text-center">
                                <Skeleton className="h-6 w-12 mx-auto rounded-full bg-gray-200" />
                            </TableCell>
                            <TableCell className="text-center">
                                <Skeleton className="h-6 w-12 mx-auto rounded-full bg-gray-200" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-24 bg-gray-200" />
                            </TableCell>
                            <TableCell className="text-center">
                                <Skeleton className="h-6 w-20 mx-auto rounded-full bg-gray-200" />
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Skeleton className="h-8 w-8 rounded bg-gray-200" />
                                    <Skeleton className="h-8 w-8 rounded bg-gray-200" />
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
