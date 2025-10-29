"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import { Input } from "@/components/Atoms/ui/input";
import { Button } from "@/components/Atoms/ui/button";
import { Badge } from "@/components/Atoms/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Atoms/ui/dialog";
import { Label } from "@/components/Atoms/ui/label";
import { Textarea } from "@/components/Atoms/ui/textarea";
import { Search, Filter, Eye, EyeOff, Edit, Trash2, RefreshCw, X, Upload, Image, BookUser, Rows } from "lucide-react";
import kynhanService from "@services/kynhan";
import { IKyNhan } from "@models/ky-nhan/entity";
import { IUpdateKyNhanRequest } from "@models/ky-nhan/request";
import { IBackendResponse } from "@models/backend";
import { ILandEntity } from "@models/land/entity";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { EnhancedPagination } from "@/components/Atoms/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select";
import useDebounce from "@hooks/useDebounce";

interface KyNhanListPageProps {
  kyNhanList: IKyNhan[];
  landList: ILandEntity[];
  initialPagination?: {
    totalItem: number;
    current: number;
    totalPage: number;
    pageSize: number;
  };
}

const KyNhanListPage = ({
  kyNhanList: initialKyNhanList,
  landList: initialLandList,
  initialPagination,
}: KyNhanListPageProps) => {
  const [kyNhans, setKyNhans] = useState<IKyNhan[]>(initialKyNhanList);
  const [landList, setLandList] = useState<ILandEntity[]>(initialLandList);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialPagination?.pageSize || 10);
  const [page, setPage] = useState<number>(initialPagination?.current || 1);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasInitialData, setHasInitialData] = useState<boolean>(!!initialKyNhanList);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    totalItem: initialPagination?.totalItem || 0,
    current: initialPagination?.current || 1,
    totalPage: initialPagination?.totalPage || 1,
    pageSize: initialPagination?.pageSize || 10,
  });

  // Edit modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingKyNhan, setEditingKyNhan] = useState<IKyNhan | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    thoiKy: "",
    chienCong: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();


  // Fetch ky-nhan data
  const fetchKyNhans = async () => {
    setIsLoading(true);
    setHasInitialData(false);
    try {
      const kyNhanResponse =
        (await kynhanService.getKyNhan(
          debouncedSearch || undefined, 
          page, 
          itemsPerPage
        )) as IBackendResponse<any>;

      if (kyNhanResponse.statusCode === 200 && kyNhanResponse.data?.results) {
        let filteredResults = kyNhanResponse.data.results;
        
        // Apply status filter on client side for now
        if (status === "active") {
          filteredResults = filteredResults.filter((kyNhan: IKyNhan) => kyNhan.active);
        } else if (status === "inactive") {
          filteredResults = filteredResults.filter((kyNhan: IKyNhan) => !kyNhan.active);
        }
        
        setKyNhans(filteredResults);
        
        // Update pagination info
        if (kyNhanResponse.data.pagination) {
          setPagination({
            totalItem: kyNhanResponse.data.pagination.totalItem,
            current: kyNhanResponse.data.pagination.current,
            totalPage: kyNhanResponse.data.pagination.totalPage,
            pageSize: kyNhanResponse.data.pagination.pageSize,
          });
        }
      } else {
        throw new Error(
          kyNhanResponse.message || "Failed to fetch ky-nhan data"
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể tải danh sách kỳ nhân");
    } finally {
      setIsLoading(false);
    }
  };

  // Update landList when prop changes
  useEffect(() => {
    setLandList(initialLandList);
  }, [initialLandList]);

  // Helper function to get land name by id
  const getLandName = (landId: number) => {
    const land = landList?.find((land) => land.id === landId);
    return land ? land.name : `Đất ID: ${landId}`;
  };

  useEffect(() => {
    // Chỉ fetch khi user đã tương tác, không fetch lần đầu khi có initialData
    if (hasUserInteracted) {
      fetchKyNhans();
    }
  }, [page, itemsPerPage, debouncedSearch, status, hasUserInteracted]);

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

  const handleRefresh = () => {
    setPage(1);
    setHasUserInteracted(true);
  };

  // Edit modal functions
  const openEditModal = (kyNhan: IKyNhan) => {
    setEditingKyNhan(kyNhan);
    setEditForm({
      name: kyNhan.name,
      thoiKy: kyNhan.thoiKy,
      chienCong: kyNhan.chienCong,
    });
    setSelectedImage(null);
    setEditModalOpen(true);
  };

  const openViewDetailModal = (kyNhan: IKyNhan) => {
    router.push(`/admin/manage-library/card-story/${kyNhan.id}`);
  };


  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingKyNhan(null);
    setEditForm({
      name: "",
      thoiKy: "",
      chienCong: "",
    });
    setSelectedImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleToggleStatus = async (kyNhan: IKyNhan) => {
    try {
      const formData = new FormData();
      formData.append("name", kyNhan.name);
      formData.append("thoiKy", kyNhan.thoiKy);
      formData.append("chienCong", kyNhan.chienCong);
      formData.append("active", (!kyNhan.active).toString());

      const response = (await kynhanService.updateKyNhan(
        kyNhan.id,
        formData
      )) as IBackendResponse<any>;

      if (response.statusCode === 200) {
        toast.success(`Đã ${!kyNhan.active ? "hiện" : "ẩn"} kỳ nhân "${kyNhan.name}"`);
        fetchKyNhans(); // Refresh data
      } else {
        throw new Error(response.message || "Cập nhật trạng thái thất bại");
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật trạng thái");
    }
  };

  const handleUpdateKyNhan = async () => {
    if (!editingKyNhan) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("thoiKy", editForm.thoiKy);
      formData.append("chienCong", editForm.chienCong);
      formData.append("active", editingKyNhan.active.toString()); // Giữ nguyên status hiện tại

      if (selectedImage) {
        formData.append("imgUrl", selectedImage);
      }

      const response = (await kynhanService.updateKyNhan(
        editingKyNhan.id,
        formData
      )) as IBackendResponse<any>;

      if (response.statusCode === 200) {
        toast.success("Cập nhật thông tin kỳ nhân thành công");
        closeEditModal();
        fetchKyNhans(); // Refresh data
      } else {
        throw new Error(response.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật thông tin kỳ nhân");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen rounded-xl bg-admin-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">
              Danh Sách Kỳ Nhân
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi tất cả kỳ nhân trong hệ thống
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-stone-600 hover:bg-stone-700"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>

        {/* Search and Filter Section */}
        <Card className="border-2 border-gray-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên, thời kỳ, chiến công..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 rounded-4xl border-gray-300"
                    color="black"
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <Button
                  variant={status === "all" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("all")}
                  className="rounded-full"
                >
                  Tất cả
                </Button>
                <Button
                  variant={status === "active" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("active")}
                  className="rounded-full"
                >
                  Hoạt động
                </Button>
                <Button
                  variant={status === "inactive" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("inactive")}
                  className="rounded-full"
                >
                  Không hoạt động
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && !hasInitialData && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600"></div>
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            {/* Results Summary */}
            <div className="text-sm text-gray-600">
              Hiển thị {kyNhans?.length} trong tổng số {pagination.totalItem}{" "}
              kỳ nhân
            </div>

            {/* KyNhan List */}
            {kyNhans?.length === 0 ? (
              <Card className="border-2 border-gray-300">
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg">Không tìm thấy kỳ nhân nào</p>
                    <p className="text-sm">
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kyNhans?.map((kyNhan) => (
                  <Card
                    key={kyNhan.id}
                    className="border-2 border-gray-300 hover:shadow-lg transition-shadow"
                  >
                    {/* Image - Now larger and moved to top */}
                    <div className="relative">
                      <div className="w-full h-48 rounded-t-lg overflow-hidden border-b border-gray-200 bg-gray-50 flex items-center justify-center">
                        {kyNhan.imgUrl && kyNhan.imgUrl.trim() ? (
                          <img
                            src={kyNhan.imgUrl}
                            alt={kyNhan.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-sm">Không có ảnh</span>
                          </div>
                        )}
                      </div>
                      {/* Status badge over image */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant={kyNhan.active ? "default" : "secondary"}
                          className={
                            kyNhan.active
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }
                        >
                          {kyNhan.active ? "Hoạt động" : "Không hoạt động"}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {kyNhan.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Info */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Thời kỳ
                          </label>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {kyNhan.thoiKy}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Chiến công
                          </label>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {kyNhan.chienCong}
                          </p>
                        </div>
                      </div>

                      {/* Metadata - Only show land name and creation date */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>
                            <span className="font-medium">Đất:</span>{" "}
                            {getLandName(kyNhan.landId)}
                          </p>
                          <p>
                            Tạo lúc:{" "}
                            {new Date(kyNhan.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`rounded-full ${kyNhan.active
                            ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                            : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                          title={kyNhan.active ? "Ẩn" : "Hiện"}
                          onClick={() => handleToggleStatus(kyNhan)}
                        >
                          {kyNhan.active ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          title="Chỉnh sửa"
                          onClick={() => openEditModal(kyNhan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          title="Xem Chi Tiết"
                          onClick={() => openViewDetailModal(kyNhan)}
                        >
                          <BookUser className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination Footer */}
            <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[100px] bg-background border-border text-foreground h-9">
                    <Rows className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {[10, 20, 30, 50].map(size => (
                      <SelectItem key={size} value={String(size)}>{size} / trang</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {pagination.totalPage > 1 && (
                <EnhancedPagination
                  currentPage={page}
                  totalPages={pagination.totalPage}
                  totalItems={pagination.totalItem}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  showItemCount={true}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Chỉnh sửa thông tin kỳ nhân</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Image Upload */}
            <div className="space-y-3">
              <Label htmlFor="image">Ảnh đại diện</Label>
              <div className="flex items-start gap-6">
                {/* Preview */}
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                  {selectedImage ? (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : editingKyNhan?.imgUrl && editingKyNhan.imgUrl.trim() ? (
                    <img
                      src={editingKyNhan.imgUrl}
                      alt={editingKyNhan.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Image className="w-8 h-8 mb-2" />
                      <span className="text-xs">Không có ảnh</span>
                    </div>
                  )}
                </div>

                {/* Upload Area */}
                <div className="flex-1">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium text-blue-600 hover:text-blue-700">
                        Nhấp để chọn ảnh
                      </span>{" "}
                      hoặc kéo thả vào đây
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {selectedImage && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-green-600 font-medium">
                        ✓ {selectedImage.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(null);
                        }}
                        className="h-6 px-2 text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Để trống nếu không muốn thay đổi ảnh
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Tên kỳ nhân *</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Nhập tên kỳ nhân"
                color="black"
              />
            </div>

            {/* Thời kỳ */}
            <div className="space-y-2">
              <Label htmlFor="thoiKy">Thời kỳ *</Label>
              <Textarea
                id="thoiKy"
                value={editForm.thoiKy}
                onChange={(e) =>
                  setEditForm({ ...editForm, thoiKy: e.target.value })
                }
                placeholder="Nhập thông tin thời kỳ"
                rows={2}
                color="black"
              />
            </div>

            {/* Chiến công */}
            <div className="space-y-2">
              <Label htmlFor="chienCong">Chiến công *</Label>
              <Textarea
                id="chienCong"
                value={editForm.chienCong}
                onChange={(e) =>
                  setEditForm({ ...editForm, chienCong: e.target.value })
                }
                placeholder="Nhập thông tin chiến công"
                rows={4}
                color="black"
              />
            </div>

          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={closeEditModal}
              disabled={isUpdating}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateKyNhan}
              disabled={
                isUpdating ||
                !editForm.name.trim() ||
                !editForm.thoiKy.trim() ||
                !editForm.chienCong.trim()
              }
              className="bg-stone-600 hover:bg-stone-700"
            >
              {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KyNhanListPage;
