"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import { Skeleton } from "@/components/Atoms/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/Atoms/ui/alert-dialog";
import SummaryCards from "./Components/SummaryCards";
import SearchFilters from "./Components/Toolbar";
import AddQuestionForm from "./Components/AddQuestionForm";
import QuestionsTable from "./Components/QuestionsTable";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useGetQuestionById,
  useQuestions,
  useQuestionStats,
  UIQuestion,
} from "@hooks/use-question-queries";
import questionService from "@services/question";
import { IDeleteQuestionResponse } from "@models/question/response";
import { ICreateQuestionRequest } from "@models/question/request";
import { IQuestion } from "@models/question/entity";
import { ILandEntity } from "@models/land/entity";

const QuestionBankPage = ({ lands }: { lands: ILandEntity[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLandId, setSelectedLandId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();

  // Fetch questions data using the hook with server-side pagination and filters
  const {
    data: pagedQuestions = [],
    rawData: rawQuestions = [],
    isLoading,
    error,
    refetch,
    pagination: bePagination,
  } = useQuestions({
    currentPage: currentPage,
    pageSize: pageSize,
    search: searchTerm || undefined,
    landId: selectedLandId !== null ? String(selectedLandId) : undefined,
  });
  // Fetch editing question data
  const { data: editingQuestion, isLoading: isLoadingEditQuestion } =
    useGetQuestionById(editingQuestionId);

  // Prefer using already-fetched full question (with answers) to avoid extra request
  const editingQuestionFromList = useMemo(() => {
    if (!editingQuestionId) return null;
    const found = rawQuestions.find((q: any) => q?.id === editingQuestionId);
    return found || null;
  }, [editingQuestionId, rawQuestions]);
  // Fetch questions statistics from BE
  const {
    data: questionStats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuestionStats();

  // Rely on BE pagination directly; no client-side syncing

  // Use statistics from BE instead of calculating
  const totalQuestions = questionStats?.countQuestion || 0;
  const averageCorrectRate = questionStats?.rateCorrect || 0;

  // Handle mutation errors with toast notification
  useEffect(() => {
    if (createQuestionMutation.error) {
      console.error("Failed to create question:", createQuestionMutation.error);
    }
  }, [createQuestionMutation.error]);

  const handleAddQuestion = async (questionData: ICreateQuestionRequest) => {
    try {
      if (editingQuestionId) {
        // Update existing question
        await updateQuestionMutation.mutate(editingQuestionId, questionData, {
          onSuccess: () => {
            setShowAddForm(false);
            setEditingQuestionId(null);
            refetch();
            refetchStats();
          },
        });
      } else {
        // Create new question
        await createQuestionMutation.mutate(questionData, {
          onSuccess: () => {
            setShowAddForm(false);
            refetch();
            refetchStats();
          },
        });
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleView = (id: string) => {
    console.log("View question:", id);
  };

  const handleEdit = (id: string) => {
    setEditingQuestionId(Number(id));
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setShowAddForm(false);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteQuestionId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteQuestionId) return;

    try {
      const response = (await questionService.deleteQuestion(
        Number(deleteQuestionId)
      )) as IDeleteQuestionResponse;
      if (response.statusCode === 200) {
        toast.success(response.message);

        // Refetch data từ server để cập nhật UI
        refetch();
        refetchStats();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Không thể xóa câu hỏi");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteQuestionId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteQuestionId(null);
  };
console.log(bePagination);
  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    console.log("Page size changing from", pageSize, "to", size);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-300 bg-admin-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
            Ngân hàng câu hỏi
          </CardTitle>
          <div className="text-sm text-gray-500">
            Quản lý và theo dõi ngân hàng câu hỏi
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <SearchFilters
            searchTerm={searchTerm}
            selectedLandId={selectedLandId || undefined}
            onSearchChange={setSearchTerm}
            onLandIdChange={(value: string) =>
              setSelectedLandId(value === "all" ? null : Number(value))
            }
            onAddQuestion={() => {
              setEditingQuestionId(null);
              setShowAddForm(!showAddForm);
            }}
            lands={lands}
          />

          {/* Summary Cards */}
          <SummaryCards
            totalQuestions={totalQuestions}
            averageCorrectRate={averageCorrectRate}
            isLoading={isLoadingStats}
          />

          {/* Add Question Form */}
          {showAddForm && (
            <AddQuestionForm
              onSubmit={handleAddQuestion}
              lands={lands || []}
              editQuestion={
                editingQuestion
                  ? { ...(editingQuestionFromList || {}), ...editingQuestion }
                  : editingQuestionFromList || null
              }
              onCancel={handleCancelEdit}
            />
          )}

          {/* Questions Table */}
          <QuestionsTable
            key={`questions-table-${currentPage}-${pageSize}`}
            lands={lands}
            questions={pagedQuestions}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
            error={error}
            pagination={{
              currentPage: bePagination?.current ?? currentPage,
              totalPages: bePagination?.totalPage ?? totalPages,
              totalItems: bePagination?.totalItem ?? totalItems,
              pageSize: bePagination?.pageSize ?? pageSize,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa câu hỏi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={"cursor-pointer"}
              onClick={handleCancelDelete}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionBankPage;
