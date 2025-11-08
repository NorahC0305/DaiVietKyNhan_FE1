'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import Toolbar from './Components/Toolbar';
import LettersTable from './Components/LettersTable';
import LetterDetailDialog from './Components/LetterDetailDialog';
import { ILetterEntity } from '@models/letter/entity';
import { useUpdateLetter, useUpdateLetterStatus, getLetterQueryOptions } from '@hooks/use-letter-queries';
import { useQuery } from '@tanstack/react-query';

const LetterPage = () => {
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

    // Dialog state
    const [selectedLetter, setSelectedLetter] = useState<ILetterEntity | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const selectedLetterIdRef = useRef<number | null>(null);

    // Build query string
    const queryParams = useMemo(() => {
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

        return {
            qs: parts.join(",") || undefined,
            currentPage,
            pageSize,
        };
    }, [currentPage, pageSize, fromUserId, status, isFirstPublic, sortBy, sortOrder]);

    // Create query options based on current params
    const lettersQueryOptions = useMemo(() => getLetterQueryOptions(queryParams), [queryParams]);

    // Use TanStack Query to fetch letters
    // When queryParams match defaultParams (initial state), 
    // TanStack Query will hydrate from the prefetched SSR data
    const {
        data: lettersData,
        isLoading,
        error,
        isError,
        refetch,
    } = useQuery(lettersQueryOptions);
    console.log(lettersData);

    // Update letter mutation
    const updateLetterMutation = useUpdateLetter();
    const { isPending: isUpdating } = updateLetterMutation;

    // Bulk update letter status mutation
    const updateLetterStatusMutation = useUpdateLetterStatus();
    const { isPending: isUpdatingStatus } = updateLetterStatusMutation;

    // Use fetched data
    const listLetters = lettersData?.results ?? [];
    const pagination = lettersData?.pagination || {
        current: 1,
        pageSize: 10,
        totalPage: 0,
        totalItem: 0,
    };

    // Sync selectedLetter ID ref when it changes
    useEffect(() => {
        if (selectedLetter) {
            selectedLetterIdRef.current = selectedLetter.id;
        } else {
            selectedLetterIdRef.current = null;
        }
    }, [selectedLetter?.id]);

    // Update selected letter from query data when listLetters changes (for optimistic updates)
    useEffect(() => {
        if (selectedLetterIdRef.current && listLetters.length > 0 && isDetailDialogOpen) {
            const updatedLetter = listLetters.find(l => l.id === selectedLetterIdRef.current);
            if (updatedLetter) {
                setSelectedLetter(prev => {
                    if (!prev || prev.id !== updatedLetter.id) return prev;
                    // Only update if there are actual changes
                    const hasChanges =
                        updatedLetter.from !== prev.from ||
                        updatedLetter.to !== prev.to ||
                        updatedLetter.content !== prev.content ||
                        updatedLetter.status !== prev.status;
                    return hasChanges ? updatedLetter : prev;
                });
            }
        }
    }, [listLetters, isDetailDialogOpen]);

    // Show error toast if there's an error
    useEffect(() => {
        if (isError && error) {
            console.error("Error fetching letters:", error);
        }
    }, [isError, error]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const handleFromUserIdChange = (value: string) => {
        setFromUserId(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleIsFirstPublicChange = (value: string) => {
        setIsFirstPublic(value);
        setCurrentPage(1);
    };

    const handleSortChange = (newSortBy: string, newSortOrder: string) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(1);
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
            await updateLetterMutation.mutateAsync({
                letterId,
                data,
            });
            // Close dialog and reset edit mode on success
            setIsDetailDialogOpen(false);
            setIsEditMode(false);
            // Note: Data will be automatically updated via TanStack Query's optimistic update and refetch
        } catch (error) {
            // Error is already handled in the mutation's onError
            // Don't close dialog on error so user can retry
            console.error("Failed to save letter:", error);
        }
    };

    const handleBulkStatusUpdate = async (letters: Array<{ letterId: number; fromUserId: number }>, status: string) => {
        try {
            await updateLetterStatusMutation.mutateAsync({
                letters,
                status,
            });
            // Note: Data will be automatically updated via TanStack Query's optimistic update and refetch
        } catch (error) {
            // Error is already handled in the mutation's onError
            console.error("Failed to update letter status:", error);
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
                        rows={listLetters}
                        onViewLetter={handleViewLetter}
                        onEditLetter={handleEditLetter}
                        onSort={handleTableSort}
                        sortBy={sortBy}
                        sortOrder={sortOrder as 'asc' | 'desc'}
                        isLoading={isLoading}
                        onBulkStatusUpdate={handleBulkStatusUpdate}
                        isUpdatingStatus={isUpdatingStatus}
                        pagination={{
                            currentPage: pagination.current,
                            totalPages: pagination.totalPage,
                            totalItems: pagination.totalItem,
                            pageSize: pagination.pageSize,
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
                isSaving={isUpdating}
            />
        </div>
    );
}

export default LetterPage