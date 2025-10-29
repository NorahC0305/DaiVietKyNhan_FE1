"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import { Button } from "@/components/Atoms/ui/button";
import { Label } from "@/components/Atoms/ui/label";
import TipTapEditor from "@/components/Organisms/Tiptap";
import { Input } from "@/components/Atoms/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Atoms/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Atoms/ui/dialog";
import {
  Upload,
  Image,
  Plus,
  X,
  Search,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Calendar,
  User,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Save,
  ArrowLeft,
} from "lucide-react";
import { IKyNhan } from "@models/ky-nhan/entity";
import { IKyNhanResponseModel } from "@models/ky-nhan/response";
import { IKyNhanSummary } from "@models/kynhanSummary/entity";
import { IKyNhanSummaryResponseModel } from "@models/kynhanSummary/response";
import kyNhanSummaryService from "@services/ky-nhan-summary";
import kynhanService from "@services/kynhan";
import { toast } from "react-toastify";
import useDebounce from "@/hooks/useDebounce";
import { EnhancedPagination } from "@/components/Atoms/ui/pagination";

interface KyNhanSummaryPageProps {
  kyNhanList: IKyNhan[];
  initialPagination?: {
    totalItem: number;
    current: number;
    totalPage: number;
    pageSize: number;
  };
}

const KyNhanSummaryPage: React.FC<KyNhanSummaryPageProps> = ({
  kyNhanList: initialKyNhanList,
  initialPagination,
}) => {
  const [formData, setFormData] = useState({
    kyNhanId: "",
    summary: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search related states
  const [searchQuery, setSearchQuery] = useState("");
  const [kyNhanList, setKyNhanList] = useState<IKyNhan[]>(initialKyNhanList);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Pagination for KyNhan selection (simple, 9 items/page)
  const [itemsPerPage] = useState<number>(9);
  const [page, setPage] = useState<number>(initialPagination?.current || 1);
  const [pagination, setPagination] = useState({
    totalItem: initialPagination?.totalItem || initialKyNhanList?.length || 0,
    current: initialPagination?.current || 1,
    totalPage: initialPagination?.totalPage || 1,
    pageSize: initialPagination?.pageSize || 9,
  });

  // Ky Nhan Summary List states
  const [kyNhanSummaries, setKyNhanSummaries] = useState<IKyNhanSummary[]>([]);
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(false);
  const [showSummaryList, setShowSummaryList] = useState(false);

  // Edit states
  const [editingSummary, setEditingSummary] = useState<IKyNhanSummary | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Enhanced UI states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedSummaryId, setExpandedSummaryId] = useState<number | null>(
    null
  );
  const [summarySearchQuery, setSummarySearchQuery] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedSummaryForModal, setSelectedSummaryForModal] =
    useState<IKyNhanSummary | null>(null);

  // UI enhancement states
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [formValidationErrors, setFormValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Search function
  const searchKyNhan = useCallback(
    async (query: string, currentPage: number) => {
      if (!query.trim()) {
        // Load initial page when no query (still paginated)
        try {
          setIsSearching(true);
          const response = (await kynhanService.getKyNhan(
            "sort:id",
            currentPage,
            itemsPerPage
          )) as IKyNhanResponseModel;
          setKyNhanList(response.data?.results || []);
          if ((response as any).data?.pagination) {
            setPagination((response as any).data.pagination);
          }
        } catch (error) {
          setKyNhanList(initialKyNhanList);
        } finally {
          setIsSearching(false);
        }
        return;
      }

      setIsSearching(true);
      try {
        const qs = `sort:id,name:like=${encodeURIComponent(query)}`;
        const response = (await kynhanService.getKyNhan(
          qs,
          currentPage,
          itemsPerPage
        )) as IKyNhanResponseModel;
        setKyNhanList(response.data?.results || []);
        if ((response as any).data?.pagination) {
          setPagination((response as any).data.pagination);
        }
      } catch (error) {
        console.error("Error searching kỳ nhân:", error);
        toast.error("Không thể tìm kiếm kỳ nhân");
        setKyNhanList([]);
      } finally {
        setIsSearching(false);
      }
    },
    [initialKyNhanList, itemsPerPage]
  );

  // Effect to handle debounced search
  useEffect(() => {
    searchKyNhan(debouncedSearchQuery, page);
  }, [debouncedSearchQuery, page, searchKyNhan]);

  // Reset to first page when query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  // Fetch ky nhan summaries
  const fetchKyNhanSummaries = useCallback(async () => {
    setIsLoadingSummaries(true);
    try {
      const response = await kyNhanSummaryService.getKyNhanSummary();
      if (response.statusCode === 200 && response.data?.results) {
        setKyNhanSummaries(response.data.results);
      }
    } catch (error) {
      console.error("Error fetching ky nhan summaries:", error);
      toast.error("Không thể tải danh sách tóm tắt kỳ nhân");
    } finally {
      setIsLoadingSummaries(false);
    }
  }, []);

  // Load summaries when component mounts or when showSummaryList changes
  useEffect(() => {
    if (showSummaryList) {
      fetchKyNhanSummaries();
    }
  }, [showSummaryList, fetchKyNhanSummaries]);

  // Handle edit summary
  const handleEditSummary = (summary: IKyNhanSummary) => {
    setEditingSummary(summary);
    setIsEditMode(true);
    setFormData({
      kyNhanId: summary.kyNhanId.toString(),
      summary: summary.summary,
    });
    setSelectedImage(null);
    setSearchQuery("");
    setFormValidationErrors({});
    setSuccessMessage("");
    setIsFormVisible(true);

    // Scroll to form when editing
    setTimeout(() => {
      const formElement = document.querySelector("[data-form-section]");
      formElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingSummary(null);
    setIsEditMode(false);
    setFormData({
      kyNhanId: "",
      summary: "",
    });
    setSelectedImage(null);
    setSearchQuery("");
    setFormValidationErrors({});
    setSuccessMessage("");
  };

  // Enhanced UI functions
  const handleToggleExpandedSummary = (summaryId: number) => {
    setExpandedSummaryId(expandedSummaryId === summaryId ? null : summaryId);
  };

  const handleShowSummaryModal = (summary: IKyNhanSummary) => {
    setSelectedSummaryForModal(summary);
    setShowSummaryModal(true);
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryModal(false);
    setSelectedSummaryForModal(null);
  };

  // Filter summaries based on search query
  const filteredSummaries = kyNhanSummaries.filter((summary) => {
    if (!summarySearchQuery.trim()) return true;
    const relatedKyNhan =
      kyNhanList.find((k) => k.id === summary.kyNhanId) ||
      initialKyNhanList.find((k) => k.id === summary.kyNhanId);
    return (
      summary.summary
        .toLowerCase()
        .includes(summarySearchQuery.toLowerCase()) ||
      relatedKyNhan?.name
        .toLowerCase()
        .includes(summarySearchQuery.toLowerCase()) ||
      relatedKyNhan?.thoiKy
        ?.toLowerCase()
        .includes(summarySearchQuery.toLowerCase())
    );
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (formValidationErrors[field]) {
      setFormValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.kyNhanId) {
      errors.kyNhanId = "Vui lòng chọn kỳ nhân";
    }

    if (!formData.summary.trim()) {
      errors.summary = "Vui lòng nhập tóm tắt";
    } else if (formData.summary.trim().length < 10) {
      errors.summary = "Tóm tắt phải có ít nhất 10 ký tự";
    }

    if (!isEditMode && !selectedImage) {
      errors.image = "Vui lòng chọn ảnh đại diện";
    }

    setFormValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      setSelectedImage(file);

      // Clear validation error for image when user selects one
      if (formValidationErrors.image) {
        setFormValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      setSelectedImage(file);

      // Clear validation error for image when user drops one
      if (formValidationErrors.image) {
        setFormValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      // Scroll to first error field
      const firstErrorField = Object.keys(formValidationErrors)[0];
      if (firstErrorField) {
        const errorElement = document.querySelector(
          `[data-field="${firstErrorField}"]`
        );
        errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (isEditMode) {
      setIsUpdating(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      // Tạo FormData để gửi file
      const formDataToSubmit = new FormData();

      // Only append image if it's selected (for create mode or when updating with new image)
      if (selectedImage) {
        formDataToSubmit.append("imgUrl", selectedImage);
      }

      formDataToSubmit.append(
        "kyNhanId",
        parseInt(formData.kyNhanId).toString()
      );
      formDataToSubmit.append("summary", formData.summary.trim());

      let response;
      if (isEditMode && editingSummary) {
        // Update mode
        response = await kyNhanSummaryService.updateKyNhanSummary(
          editingSummary.id,
          formDataToSubmit
        );
      } else {
        // Create mode
        response = await kyNhanSummaryService.createKyNhanSummary(
          formDataToSubmit
        );
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        const action = isEditMode ? "Cập nhật" : "Thêm";
        setSuccessMessage(`${action} tóm tắt kỳ nhân thành công!`);
        toast.success(`${action} tóm tắt kỳ nhân thành công!`);

        // Reset form
        setSearchQuery("");
        setFormData({
          kyNhanId: "",
          summary: "",
        });
        setSelectedImage(null);
        setEditingSummary(null);
        setIsEditMode(false);
        setFormValidationErrors({});

        // Reset file input
        const fileInput = document.getElementById(
          "image-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Refresh summary list if it's being shown
        if (showSummaryList) {
          fetchKyNhanSummaries();
        }

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        throw new Error(response.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} kỳ nhân summary:`,
        error
      );
      const action = isEditMode ? "cập nhật" : "thêm";
      toast.error(error.message || `Không thể ${action} tóm tắt kỳ nhân`);
    } finally {
      setIsSubmitting(false);
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-admin-primary rounded-xl p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${isEditMode ? "bg-orange-100" : "bg-blue-100"
                    }`}
                >
                  {isEditMode ? (
                    <Edit className="h-6 w-6 text-orange-600" />
                  ) : (
                    <User className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {isEditMode ? "Chỉnh Sửa Tóm Tắt" : "Tóm Tắt Kỳ Nhân"}
                  </h1>
                  <p className="text-gray-600 text-sm lg:text-base">
                    {isEditMode
                      ? `Đang chỉnh sửa tóm tắt cho ${editingSummary
                        ? `ID: ${editingSummary.id}`
                        : "kỳ nhân"
                      }`
                      : "Quản lý và tạo tóm tắt cho các kỳ nhân trong hệ thống"}
                  </p>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Tổng: {kyNhanSummaries.length} tóm tắt</span>
                </div>
                {showSummaryList && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Hiển thị danh sách</span>
                  </div>
                )}
                {isEditMode && editingSummary && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span>Đang chỉnh sửa ID: {editingSummary.id}</span>
                  </div>
                )}
                {!isFormVisible && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Form đang ẩn</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Form Toggle */}
              <Button
                type="button"
                variant={isFormVisible ? "default" : "outline"}
                size="sm"
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="flex items-center gap-2"
              >
                {isFormVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {isFormVisible ? "Ẩn form" : "Hiện form"}
                </span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSummaryList(!showSummaryList);
                  if (!showSummaryList) {
                    fetchKyNhanSummaries();
                  }
                }}
                className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                {showSummaryList ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {showSummaryList ? "Ẩn danh sách" : "Xem danh sách"}
                </span>
              </Button>

              {showSummaryList && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fetchKyNhanSummaries}
                  disabled={isLoadingSummaries}
                  className="flex items-center gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoadingSummaries ? "animate-spin" : ""
                      }`}
                  />
                  <span className="hidden sm:inline">Làm mới</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">{successMessage}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSuccessMessage("")}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Enhanced Form Section */}
        {isFormVisible && (
          <Card className="border border-gray-200 shadow-lg" data-form-section>
            <CardHeader className="bg-admin-primary border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${isEditMode
                      ? "bg-orange-100 text-orange-600"
                      : "bg-blue-100 text-blue-600"
                      }`}
                  >
                    {isEditMode ? (
                      <Edit className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </div>
                  {isEditMode
                    ? "Chỉnh Sửa Tóm Tắt Kỳ Nhân"
                    : "Thêm Tóm Tắt Kỳ Nhân"}
                </CardTitle>
                {editingSummary && (
                  <div className="text-sm text-gray-500">
                    ID: {editingSummary.id}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-3" data-field="image">
                  <Label
                    htmlFor="image"
                    className="text-sm font-medium text-gray-700"
                  >
                    Ảnh đại diện {!isEditMode && "*"}
                    {isEditMode && (
                      <span className="text-xs text-gray-500 ml-1">
                        (Để trống nếu không muốn thay đổi ảnh)
                      </span>
                    )}
                  </Label>
                  {formValidationErrors.image && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{formValidationErrors.image}</span>
                    </div>
                  )}

                  {/* Upload and Preview Container */}
                  <div className="relative">
                    {selectedImage ? (
                      /* Preview with X button */
                      <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-4">
                        <div className="flex justify-center">
                          <div className="relative max-w-md">
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="Preview"
                              className="max-h-64 object-contain rounded-lg"
                            />
                            {/* Close button in top right */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                                // Reset file input
                                const fileInput = document.getElementById(
                                  "image-upload"
                                ) as HTMLInputElement;
                                if (fileInput) fileInput.value = "";
                              }}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black text-white hover:bg-gray-800 p-0 flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-sm text-green-600 font-medium">
                            ✓ {selectedImage.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Upload Area or Current Image Display */
                      <>
                        {isEditMode &&
                          editingSummary &&
                          editingSummary.imgUrl ? (
                          /* Current Image Display in Edit Mode */
                          <div className="border-2 border-solid border-gray-300 rounded-lg p-4 bg-gray-50">
                            <div className="text-center mb-3">
                              <p className="text-sm font-medium text-gray-700">
                                Ảnh hiện tại:
                              </p>
                            </div>
                            <div className="flex justify-center">
                              <div className="relative max-w-md">
                                <img
                                  src={editingSummary.imgUrl}
                                  alt="Current image"
                                  className="max-h-64 object-contain rounded-lg"
                                />
                              </div>
                            </div>
                            <div className="text-center mt-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  document
                                    .getElementById("image-upload")
                                    ?.click()
                                }
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Thay đổi ảnh
                              </Button>
                            </div>
                          </div>
                        ) : (
                          /* Upload Area */
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${isDragOver
                              ? "border-blue-400 bg-blue-50 scale-105"
                              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                              }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                          >
                            <Upload
                              className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragOver ? "text-blue-500" : "text-gray-400"
                                }`}
                            />
                            <p className="text-sm text-gray-600 mb-2">
                              <span
                                className={`font-medium transition-colors ${isDragOver
                                  ? "text-blue-700"
                                  : "text-blue-600 hover:text-blue-700"
                                  }`}
                              >
                                {isDragOver
                                  ? "Thả ảnh vào đây"
                                  : "Nhấp để chọn ảnh"}
                              </span>
                              {!isDragOver && " hoặc kéo thả vào đây"}
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Ky Nhan Selection */}
                <div className="space-y-3" data-field="kyNhanId">
                  <Label className="text-sm font-medium text-gray-700">
                    Kỳ Nhân *
                  </Label>
                  {formValidationErrors.kyNhanId && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{formValidationErrors.kyNhanId}</span>
                    </div>
                  )}

                  {formData.kyNhanId ? (
                    /* Selected Ky Nhan Display */
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                          {(() => {
                            const selectedKyNhan = kyNhanList?.find(
                              (k) => k.id.toString() === formData.kyNhanId
                            );
                            return selectedKyNhan?.imgUrl &&
                              selectedKyNhan.imgUrl.trim() ? (
                              <img
                                src={selectedKyNhan.imgUrl}
                                alt={selectedKyNhan.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Image className="w-6 h-6 text-gray-400" />
                            );
                          })()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {
                              kyNhanList?.find(
                                (k) => k.id.toString() === formData.kyNhanId
                              )?.name
                            }
                          </h3>
                          <p className="text-sm text-gray-600">
                            {
                              kyNhanList?.find(
                                (k) => k.id.toString() === formData.kyNhanId
                              )?.thoiKy
                            }
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange("kyNhanId", "")}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Thay đổi
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Ky Nhan Grid Selection */
                    <div className="space-y-4">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Tìm kiếm kỳ nhân theo tên..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          color="black"
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {isSearching && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>

                      {/* Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {kyNhanList?.length > 0 ? (
                          kyNhanList?.map((kyNhan) => (
                            <div
                              key={kyNhan.id}
                              onClick={() =>
                                handleInputChange(
                                  "kyNhanId",
                                  kyNhan.id.toString()
                                )
                              }
                              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-95"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                                {kyNhan.imgUrl && kyNhan.imgUrl.trim() ? (
                                  <img
                                    src={kyNhan.imgUrl}
                                    alt={kyNhan.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <Image className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {kyNhan.name}
                                </h4>
                                <p className="text-xs text-gray-600 truncate">
                                  {kyNhan.thoiKy}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-8 text-gray-500">
                            <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">Không có kỳ nhân nào</p>
                          </div>
                        )}
                      </div>

                      {/* Simple Pagination (9 items/page) */}
                      {pagination.totalPage > 1 && (
                        <div className="flex justify-end mt-3">
                          <EnhancedPagination
                            currentPage={page}
                            totalPages={pagination.totalPage}
                            totalItems={pagination.totalItem}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(p:number) => setPage(p)}
                            showItemCount={true}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="space-y-2" data-field="summary">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="summary"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tóm tắt *
                    </Label>
                    <span className="text-xs text-gray-500">
                      {formData.summary.length}/1000 ký tự
                    </span>
                  </div>
                  {formValidationErrors.summary && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{formValidationErrors.summary}</span>
                    </div>
                  )}
                  <TipTapEditor
                    value={formData.summary}
                    onChange={(value) => handleInputChange("summary", value)}
                    placeholder="Nhập tóm tắt kỳ nhân..."
                    className={`${formValidationErrors.summary
                      ? "border-red-300 focus-within:border-red-500 focus-within:ring-red-500"
                      : ""
                      }`}
                    textColor="black"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t -mx-6 px-6 py-4 rounded-b-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {Object.keys(formValidationErrors).length > 0 && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>
                          {Object.keys(formValidationErrors).length} lỗi cần sửa
                        </span>
                      </div>
                    )}
                    {Object.keys(formValidationErrors).length === 0 &&
                      formData.kyNhanId &&
                      formData.summary.trim() &&
                      (!isEditMode ? selectedImage : true) && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>
                            Sẵn sàng để {isEditMode ? "cập nhật" : "thêm"}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="flex gap-3">
                    {isEditMode && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                        disabled={isSubmitting || isUpdating}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2 " />
                        Hủy
                      </Button>
                    )}

                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        isUpdating ||
                        (!isEditMode && !selectedImage) ||
                        !formData.kyNhanId ||
                        !formData.summary.trim() ||
                        Object.keys(formValidationErrors).length > 0
                      }
                      className={`${isEditMode
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-blue-600 hover:bg-blue-700"
                        } text-white min-w-[140px]`}
                    >
                      {isSubmitting || isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {isEditMode ? "Đang cập nhật..." : "Đang thêm..."}
                        </>
                      ) : (
                        <>
                          {isEditMode ? (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Lưu thay đổi
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Thêm tóm tắt
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Ky Nhan Summary List Section */}
        {showSummaryList && (
          <Card className="border border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <List className="h-5 w-5 text-blue-600" />
                  </div>
                  Danh Sách Tóm Tắt Kỳ Nhân
                  <span className="text-sm font-normal text-gray-500">
                    ({filteredSummaries.length} tóm tắt)
                  </span>
                </CardTitle>

                {/* Search and Filters */}
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 bg-white rounded-lg p-1 border shadow-sm">
                    <Button
                      type="button"
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="flex items-center gap-1 text-xs px-2 py-1"
                    >
                      <Grid3X3 className="h-3 w-3" />
                      <span className="hidden sm:inline">Lưới</span>
                    </Button>
                    <Button
                      type="button"
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="flex items-center gap-1 text-xs px-2 py-1"
                    >
                      <List className="h-3 w-3" />
                      <span className="hidden sm:inline">Danh sách</span>
                    </Button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm tóm tắt..."
                      value={summarySearchQuery}
                      onChange={(e) => setSummarySearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-64 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {isLoadingSummaries ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <span className="ml-4 text-gray-600 text-lg">
                    Đang tải danh sách...
                  </span>
                </div>
              ) : filteredSummaries.length > 0 ? (
                <div
                  className={`${viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                    }`}
                >
                  {filteredSummaries.map((summary) => {
                    const relatedKyNhan =
                      kyNhanList.find((k) => k.id === summary.kyNhanId) ||
                      initialKyNhanList.find((k) => k.id === summary.kyNhanId);
                    const isExpanded = expandedSummaryId === summary.id;
                    const shouldTruncate =
                      summary.summary.length > 150 && !isExpanded;

                    return viewMode === "grid" ? (
                      /* Grid View */
                      <div
                        key={summary.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          {/* Image */}
                          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                            {summary.imgUrl ? (
                              <img
                                src={summary.imgUrl}
                                alt={relatedKyNhan?.name || "Kỳ nhân"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image className="w-8 h-8 text-gray-400" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="w-full space-y-3">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                {relatedKyNhan?.name ||
                                  `Kỳ nhân ID: ${summary.kyNhanId}`}
                              </h3>
                              {relatedKyNhan?.thoiKy && (
                                <p className="text-sm text-blue-600 font-medium">
                                  {relatedKyNhan.thoiKy}
                                </p>
                              )}
                            </div>

                            {/* Summary Text */}
                            <div className="bg-gray-50 p-4 rounded-lg max-h-32 overflow-hidden">
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {shouldTruncate
                                  ? `${summary.summary.substring(0, 150)}...`
                                  : summary.summary}
                              </p>
                              {shouldTruncate && (
                                <button
                                  type="button"
                                  className="text-blue-600 text-xs mt-2 hover:underline font-medium"
                                  onClick={() =>
                                    handleShowSummaryModal(summary)
                                  }
                                >
                                  Xem đầy đủ
                                </button>
                              )}
                            </div>

                            {/* Actions and Meta */}
                            <div className="space-y-3">
                              <div className="flex justify-center">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditSummary(summary)}
                                  className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                  Chỉnh sửa
                                </Button>
                              </div>

                              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  ID: {summary.id}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(
                                    summary.updatedAt
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* List View */
                      <div
                        key={summary.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                      >
                        <div className="flex items-start gap-6">
                          {/* Image */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                            {summary.imgUrl ? (
                              <img
                                src={summary.imgUrl}
                                alt={relatedKyNhan?.name || "Kỳ nhân"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image className="w-6 h-6 text-gray-400" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-xl mb-1">
                                  {relatedKyNhan?.name ||
                                    `Kỳ nhân ID: ${summary.kyNhanId}`}
                                </h3>
                                {relatedKyNhan?.thoiKy && (
                                  <p className="text-sm text-blue-600 font-medium">
                                    {relatedKyNhan.thoiKy}
                                  </p>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSummary(summary)}
                                className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                                Chỉnh sửa
                              </Button>
                            </div>

                            {/* Summary Text */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {shouldTruncate
                                  ? `${summary.summary.substring(0, 150)}...`
                                  : summary.summary}
                              </p>
                              {shouldTruncate && (
                                <button
                                  type="button"
                                  className="text-blue-600 text-xs mt-2 hover:underline font-medium"
                                  onClick={() =>
                                    handleShowSummaryModal(summary)
                                  }
                                >
                                  Xem đầy đủ
                                </button>
                              )}
                            </div>

                            {/* Meta info */}
                            <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                ID: {summary.id}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Cập nhật:{" "}
                                {new Date(summary.updatedAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Image className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {summarySearchQuery
                      ? "Không tìm thấy kết quả"
                      : "Chưa có tóm tắt nào"}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {summarySearchQuery
                      ? `Không tìm thấy tóm tắt nào phù hợp với từ khóa "${summarySearchQuery}"`
                      : "Hãy thêm tóm tắt đầu tiên cho kỳ nhân để bắt đầu quản lý"}
                  </p>
                  {summarySearchQuery && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSummarySearchQuery("")}
                      className="mt-4"
                    >
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Detail Modal */}
        <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                Chi Tiết Tóm Tắt Kỳ Nhân
              </DialogTitle>
            </DialogHeader>
            {selectedSummaryForModal && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                    {selectedSummaryForModal.imgUrl ? (
                      <img
                        src={selectedSummaryForModal.imgUrl}
                        alt="Kỳ nhân"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    {(() => {
                      const relatedKyNhan =
                        kyNhanList.find(
                          (k) => k.id === selectedSummaryForModal.kyNhanId
                        ) ||
                        initialKyNhanList.find(
                          (k) => k.id === selectedSummaryForModal.kyNhanId
                        );
                      return (
                        <>
                          <h3 className="font-bold text-lg text-gray-900">
                            {relatedKyNhan?.name ||
                              `Kỳ nhân ID: ${selectedSummaryForModal.kyNhanId}`}
                          </h3>
                          {relatedKyNhan?.thoiKy && (
                            <p className="text-sm text-blue-600">
                              {relatedKyNhan.thoiKy}
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Nội dung tóm tắt:
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedSummaryForModal.summary}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    ID: {selectedSummaryForModal.id} • Cập nhật:{" "}
                    {new Date(selectedSummaryForModal.updatedAt).toLocaleString(
                      "vi-VN"
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        handleEditSummary(selectedSummaryForModal);
                        setShowSummaryModal(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseSummaryModal}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default KyNhanSummaryPage;
