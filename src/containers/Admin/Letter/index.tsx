'use client';

import React, { useState, useEffect, useCallback } from 'react'
import { ILetterResponseModel } from '@models/letter/response';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import Toolbar from './Components/Toolbar';
import LettersTable from './Components/LettersTable';
import LetterDetailDialog from './Components/LetterDetailDialog';
import letterService from '@services/letter';
import { toast } from 'react-toastify';
import { ILetterEntity } from '@models/letter/entity';
import { IBackendResponse } from '@models/backend';
import { LETTER_ENUMS } from '@constants/letter';

interface LetterPageProps {
    letters: ILetterResponseModel['data'];
}

const LetterPage = ({ letters: initialLetters }: LetterPageProps) => {
    const [listLetters, setListLetters] = useState<ILetterEntity[]>(
        initialLetters?.results || []
    );
    const [pagination, setPagination] = useState({
        current: initialLetters?.pagination?.current || 1,
        pageSize: initialLetters?.pagination?.pageSize || 10,
        totalPage: initialLetters?.pagination?.totalPage || 0,
        totalItem: initialLetters?.pagination?.totalItem || 0,
    });

    // Filter states
    const [fromUserId, setFromUserId] = useState<string>("");
    const [status, setStatus] = useState<string>("all");
    const [isFirstPublic, setIsFirstPublic] = useState<string>("all");

    // Sort states
    const [sortBy, setSortBy] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<string>("desc");

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasInitialData, setHasInitialData] = useState<boolean>(!!initialLetters);
    const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

    // Dialog state
    const [selectedLetter, setSelectedLetter] = useState<ILetterEntity | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    // Fetch letters data
    const fetchLetters = useCallback(async () => {
        setIsLoading(true);
        setHasInitialData(false);
        try {
            const parts: string[] = [];

            // Add sorting
            const sortPrefix = sortOrder === "desc" ? "-" : "";
            parts.push(`sort:${sortPrefix}${sortBy}`);

            // Add status filter
            if (status && status !== "all") {
                parts.push(`status=${status}`);
            }

            // Add isFirstPublic filter
            if (isFirstPublic && isFirstPublic !== "all") {
                parts.push(`isFirstPublic=${isFirstPublic}`);
            }

            // Add fromUserId filter
            if (fromUserId && fromUserId.trim() !== "") {
                parts.push(`fromUserId=${fromUserId.trim()}`);
            }

            const qs = parts.join(",");
            const response = await letterService.getLetters(
                qs || undefined,
                currentPage,
                pageSize
            ) as ILetterResponseModel;

            if (response.statusCode === 200 && response.data) {
                setListLetters(response.data.results || []);
                if (response.data.pagination) {
                    setPagination({
                        current: response.data.pagination.current,
                        pageSize: response.data.pagination.pageSize,
                        totalPage: response.data.pagination.totalPage,
                        totalItem: response.data.pagination.totalItem,
                    });
                }
            } else {
                throw new Error(response.message || "Failed to fetch letters");
            }
        } catch (error: any) {
            console.error("Error fetching letters:", error);
            toast.error(error.message || "Không thể tải danh sách thư");
            setListLetters([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, fromUserId, status, isFirstPublic, sortBy, sortOrder]);

    useEffect(() => {
        if (hasUserInteracted) {
            fetchLetters();
        }
    }, [fetchLetters, hasUserInteracted]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setHasUserInteracted(true);
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1);
        setHasUserInteracted(true);
    };

    const handleFromUserIdChange = (value: string) => {
        setFromUserId(value);
        setCurrentPage(1);
        setHasUserInteracted(true);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setCurrentPage(1);
        setHasUserInteracted(true);
    };

    const handleIsFirstPublicChange = (value: string) => {
        setIsFirstPublic(value);
        setCurrentPage(1);
        setHasUserInteracted(true);
    };

    const handleSortChange = (newSortBy: string, newSortOrder: string) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(1);
        setHasUserInteracted(true);
    };

    const handleTableSort = (field: string) => {
        if (sortBy === field) {
            // Nếu đang sort field này, đổi thứ tự
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Nếu sort field mới, set field và mặc định desc
            setSortBy(field);
            setSortOrder('desc');
        }
        setCurrentPage(1);
        setHasUserInteracted(true);
    };

    const handleViewLetter = (letter: ILetterEntity) => {
        setSelectedLetter(letter);
        setIsEditMode(false);
        setIsDetailDialogOpen(true);
    };

    const handleEditLetter = (letter: ILetterEntity) => {
        setSelectedLetter(letter);
        setIsEditMode(true);
        setIsDetailDialogOpen(true);
    };

    const handleSaveLetter = async (letterId: number, data: { from: string; to: string; content: string; status: string }) => {
        try {
            const response = await letterService.updateLetter(letterId, data) as IBackendResponse<any>;
            if (response.statusCode === 200 || response.statusCode === 201) {
                toast.success("Cập nhật thư thành công!");
                // Refresh data
                if (hasUserInteracted) {
                    fetchLetters();
                } else {
                    // Update local state if using initial data
                    setListLetters(prev =>
                        prev.map(letter =>
                            letter.id === letterId
                                ? { ...letter, ...data, status: data.status as typeof letter.status }
                                : letter
                        )
                    );
                }
            } else {
                throw new Error(response.message || "Cập nhật thư thất bại");
            }
        } catch (error: any) {
            console.error("Error updating letter:", error);
            toast.error(error.message || "Không thể cập nhật thư");
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-gray-300 bg-admin-primary">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
                        Quản lý thư gửi hậu thế
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                        Quản lý và theo dõi các lá thư gửi tới các vị Kỳ Nhân
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Toolbar
                        fromUserId={fromUserId}
                        status={status}
                        isFirstPublic={isFirstPublic}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onFromUserIdChange={handleFromUserIdChange}
                        onStatusChange={handleStatusChange}
                        onIsFirstPublicChange={handleIsFirstPublicChange}
                        onSortChange={handleSortChange}
                    />
                    <LettersTable
                        rows={hasInitialData ? initialLetters?.results || listLetters : listLetters}
                        onViewLetter={handleViewLetter}
                        onEditLetter={handleEditLetter}
                        onSort={handleTableSort}
                        sortBy={sortBy}
                        sortOrder={sortOrder as 'asc' | 'desc'}
                        isLoading={isLoading && !hasInitialData}
                        pagination={{
                            currentPage: hasInitialData ? initialLetters?.pagination?.current || pagination.current : pagination.current,
                            totalPages: hasInitialData ? initialLetters?.pagination?.totalPage || pagination.totalPage : pagination.totalPage,
                            totalItems: hasInitialData ? initialLetters?.pagination?.totalItem || pagination.totalItem : pagination.totalItem,
                            pageSize: hasInitialData ? initialLetters?.pagination?.pageSize || pagination.pageSize : pagination.pageSize,
                            onPageChange: handlePageChange,
                            onPageSizeChange: handlePageSizeChange,
                        }}
                    />
                </CardContent>
            </Card>

            {/* Letter Detail Dialog */}
            <LetterDetailDialog
                open={isDetailDialogOpen}
                onOpenChange={(open) => {
                    setIsDetailDialogOpen(open);
                    if (!open) {
                        setIsEditMode(false);
                    }
                }}
                letter={selectedLetter}
                onSave={handleSaveLetter}
                initialEditMode={isEditMode}
            />
        </div>
    );
}

export default LetterPage