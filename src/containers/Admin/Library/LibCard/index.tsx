"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/Atoms/ui/card";
import { Input } from "@/components/Atoms/ui/input";
import { Textarea } from "@/components/Atoms/ui/textarea";
import { Button } from "@/components/Atoms/ui/button";
import { Label } from "@/components/Atoms/ui/label";
import { Upload, Plus, Save, X, Edit, Trash2, Eye, Search, Rows } from "lucide-react";
import { toast } from "react-toastify";
import libcardService from "@services/mo-ta-ky-nhan";
import kynhanService from "@services/kynhan";
import { IKyNhan } from "@models/ky-nhan/entity";
import { IKyNhanResponseModel } from "@models/ky-nhan/response";
import { IMoTaKyNhan } from "@models/mo-ta-ky-nhan/entity";
import { IMoTaKyNhanListResponseModel } from "@models/mo-ta-ky-nhan/response";
import { EnhancedPagination } from "@/components/Atoms/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Atoms/ui/select";

interface FormData {
  ten?: string;
  danhHieu?: string;
  namSinhNamMat?: string;
  queQuan?: string;
  xuatThan?: string;
  khoiNghia?: string;
  nguoiDongHanh?: string;
  phuQuan?: string;
  chienCong?: string;
  dinhCao?: string;
  ketCuc?: string;
  kyNhanId?: number;
}

const LibCardPage = () => {
  const [formData, setFormData] = useState<FormData>({
    ten: "",
    danhHieu: "",
    namSinhNamMat: "",
    queQuan: "",
    xuatThan: "",
    khoiNghia: "",
    nguoiDongHanh: "",
    phuQuan: "",
    chienCong: "",
    dinhCao: "",
    ketCuc: "",
    kyNhanId: undefined,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kynhans, setKynhans] = useState<IKyNhan[]>([]);
  const [isLoadingKynhans, setIsLoadingKynhans] = useState(false);

  // New state for list management
  const [listView, setListView] = useState(true); // true for list, false for form
  const [moTaKyNhanList, setMoTaKyNhanList] = useState<IMoTaKyNhan[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [editingItem, setEditingItem] = useState<IMoTaKyNhan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const delayInputTimeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(delayInputTimeout);
  }, [searchTerm]);

  // Fetch Ky Nhans on component mount
  useEffect(() => {
    const fetchKynhans = async () => {
      setIsLoadingKynhans(true);
      try {
        const response =
          (await kynhanService.getKyNhan("sort:id", 1, 1000)) as IKyNhanResponseModel;
        if (response.data?.results) {
          setKynhans(response.data.results);
        }
      } catch (error) {
        console.error("Error fetching kynhans:", error);
      } finally {
        setIsLoadingKynhans(false);
      }
    };

    fetchKynhans();
  }, []);

  // Fetch mo ta ky nhan list
  const fetchMoTaKyNhanList = async () => {
    setIsLoadingList(true);
    try {
      const qsString = debouncedSearch
        ? `sort:id,ten:like=${encodeURIComponent(debouncedSearch)}`
        : "sort:id";
      const response = (await libcardService.getMoTaKyNhanList({
        currentPage,
        pageSize,
        sort: qsString,
      })) as IMoTaKyNhanListResponseModel;

      if (response.data?.results) {
        setMoTaKyNhanList(response.data.results);
        setTotalPages(response.data.pagination.totalPage);
        setTotalItems(response.data.pagination.totalItem);
      }
    } catch (error) {
      console.error("Error fetching mo ta ky nhan list:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách");
    } finally {
      setIsLoadingList(false);
    }
  };

  // Load list on mount and when page/search changes
  useEffect(() => {
    if (listView) {
      fetchMoTaKyNhanList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listView, currentPage, debouncedSearch, pageSize]);

  const handleItemsPerPageChange = (value: string) => {
    setPageSize(parseInt(value));
    setCurrentPage(1);
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle image upload button click
  const handleImageUpload = () => {
    const input = document.getElementById("imgUrl") as HTMLInputElement;
    input?.click();
  };

  // Handle drag and drop
  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleImageDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-blue-50", "border-blue-400");
  };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-blue-50", "border-blue-400");
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-blue-50", "border-blue-400");

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      setSelectedFile(imageFile);
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
    }
  };

  // Clear image selection
  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    const fileInput = document.getElementById("imgUrl") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Reset form to default state
  const resetForm = () => {
    setFormData({
      ten: "",
      danhHieu: "",
      namSinhNamMat: "",
      queQuan: "",
      xuatThan: "",
      khoiNghia: "",
      nguoiDongHanh: "",
      phuQuan: "",
      chienCong: "",
      dinhCao: "",
      ketCuc: "",
      kyNhanId: undefined,
    });
    clearImage();
    setEditingItem(null);
  };

  // Load data for editing
  const loadItemForEdit = (item: IMoTaKyNhan) => {
    setEditingItem(item);
    setFormData({
      ten: item.ten || "",
      danhHieu: item.danhHieu || "",
      namSinhNamMat: item.namSinhNamMat || "",
      queQuan: item.queQuan || "",
      xuatThan: item.xuatThan || "",
      khoiNghia: item.khoiNghia || "",
      nguoiDongHanh: item.nguoiDongHanh || "",
      phuQuan: item.phuQuan || "",
      chienCong: item.chienCong || "",
      dinhCao: item.dinhCao || "",
      ketCuc: item.ketCuc || "",
      kyNhanId: item.kyNhanId,
    });

    // Set preview for existing image if available
    if (item.imgUrl) {
      setPreviewUrl(item.imgUrl);
    }

    setListView(false);
  };

  // Handle delete item
  const handleDeleteItem = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa mô tả kỳ nhân này?")) {
      return;
    }

    try {
      await libcardService.deleteMoTaKyNhan(id);
      toast.success("Xóa thành công!");
      fetchMoTaKyNhanList();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Có lỗi xảy ra khi xóa");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // For create mode, require image
    if (!editingItem && !selectedFile) {
      toast.error("Vui lòng chọn hình ảnh");
      return;
    }

    if (
      !formData.ten ||
      !formData.danhHieu ||
      !formData.kyNhanId ||
      formData.kyNhanId === 0
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    setIsSubmitting(true);
    try {
      // Tạo FormData để gửi đến service
      const submitFormData = new FormData();

      // Append file only if a new one is selected
      if (selectedFile) {
        submitFormData.append("imgUrl", selectedFile);
      }

      // Append required fields
      submitFormData.append("ten", formData.ten || "");
      submitFormData.append("danhHieu", formData.danhHieu || "");

      // Append optional fields
      submitFormData.append("namSinhNamMat", formData.namSinhNamMat || "");
      submitFormData.append("queQuan", formData.queQuan || "");
      submitFormData.append("xuatThan", formData.xuatThan || "");
      submitFormData.append("khoiNghia", formData.khoiNghia || "");
      submitFormData.append("nguoiDongHanh", formData.nguoiDongHanh || "");
      submitFormData.append("phuQuan", formData.phuQuan || "");
      submitFormData.append("chienCong", formData.chienCong || "");
      submitFormData.append("dinhCao", formData.dinhCao || "");
      submitFormData.append("ketCuc", formData.ketCuc || "");
      submitFormData.append("kyNhanId", (formData.kyNhanId || 0).toString());

      if (editingItem) {
        // Update existing item
        await libcardService.updateMoTaKyNhan(editingItem.id, submitFormData);
        toast.success("Cập nhật mô tả kỳ nhân thành công!");
      } else {
        // Create new item
        await libcardService.createLibCard(submitFormData);
        toast.success("Tạo mô tả kỳ nhân thành công!");
      }

      // Reset form and go back to list
      resetForm();
      setListView(true);
      fetchMoTaKyNhanList();
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Có lỗi xảy ra khi lưu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen rounded-xl bg-admin-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {listView
                  ? "Quản lý Mô tả Kỳ nhân"
                  : editingItem
                  ? "Chỉnh sửa Mô tả Kỳ nhân"
                  : "Tạo Mô tả Kỳ nhân Mới"}
              </h1>
              <p className="text-gray-600">
                {listView
                  ? "Quản lý danh sách mô tả kỳ nhân"
                  : "Điền thông tin để tạo/cập nhật mô tả kỳ nhân"}
              </p>
            </div>
            {listView && (
              <Button
                onClick={() => {
                  resetForm();
                  setListView(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm mới
              </Button>
            )}
          </div>
        </div>

        {listView ? (
          /* List View */
          <div className="space-y-6">
            {/* Search and filters */}
            <Card className="border-2 border-gray-300">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Tìm kiếm theo tên, danh hiệu..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        color="black"
                        className="pl-10 rounded-4xl border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* List */}
            <Card className="border-2 border-gray-300">
              <CardContent className="p-0">
                {isLoadingList ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : moTaKyNhanList.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Không có dữ liệu
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hình ảnh
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Danh hiệu
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quê quán
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày tạo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {moTaKyNhanList.map((item) => {
                          const relatedKyNhan = kynhans.find(
                            (k) => k.id === item.kyNhanId
                          );
                          return (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                  src={item.imgUrl}
                                  alt={item.ten}
                                  className="h-20 w-20 rounded-full object-cover border border-gray-200"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.ten}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {relatedKyNhan?.name ||
                                    `Kỳ nhân ID: ${item.kyNhanId}`}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {item.danhHieu}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {item.queQuan}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadItemForEdit(item)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Select value={String(pageSize)} onValueChange={handleItemsPerPageChange}>
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
              {totalPages > 1 && (
                <EnhancedPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  showItemCount={true}
                />
              )}
            </div>
          </div>
        ) : (
          /* Form View */
          <div className="space-y-6">
            <div className="flex justify-start">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setListView(true);
                }}
                className="mb-4"
              >
                <X className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Button>
            </div>

            {/* Image Upload Section */}
            <Card className="border-2 border-gray-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Thông tin hình ảnh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  onClick={handleImageUpload}
                  onDragOver={handleImageDragOver}
                  onDragEnter={handleImageDragEnter}
                  onDragLeave={handleImageDragLeave}
                  onDrop={handleImageDrop}
                  className="border-2 border-dashed border-gray-300 rounded-4xl p-8 text-center cursor-pointer hover:border-gray-400 transition-colors relative"
                >
                  <input
                    id="imgUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto max-h-64 rounded-lg border border-yellow-500"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Nhấp để tải lên hoặc kéo thả hình ảnh
                      </p>
                      <Button
                        className="rounded-full border-gray-300"
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm hình ảnh
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Form Section */}
            <Card className="border-2 border-gray-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Thông tin LibCard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Tên (bắt buộc)
                      </label>
                      <Input
                        id="ten"
                        value={formData.ten || ""}
                        onChange={(e) =>
                          handleInputChange("ten", e.target.value)
                        }
                        placeholder="Nhập tên kỳ nhân"
                        color="black"
                        className="rounded-4xl border-gray-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Chọn Kỳ Nhân (bắt buộc)
                      </label>
                      <Select
                        value={
                          formData.kyNhanId && formData.kyNhanId > 0
                            ? formData.kyNhanId.toString()
                            : ""
                        }
                        onValueChange={(value) =>
                          handleInputChange("kyNhanId", parseInt(value))
                        }
                        disabled={isLoadingKynhans}
                      >
                        <SelectTrigger
                          className="border-gray-300 h-13 w-full [&>span]:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          style={{ borderRadius: "2rem" }}
                        >
                          <SelectValue
                            placeholder={
                              isLoadingKynhans ? "Đang tải..." : "Chọn kỳ nhân"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 w-[var(--radix-select-trigger-width)] min-w-full">
                          {kynhans.map((kynhan) => (
                            <SelectItem
                              key={kynhan.id}
                              value={kynhan.id.toString()}
                              className="w-full p-0"
                            >
                              <div className="flex items-center gap-3 py-2 px-2 w-full">
                                {kynhan.imgUrl && kynhan.imgUrl.trim() ? (
                                  <img
                                    src={kynhan.imgUrl}
                                    alt={kynhan.name}
                                    className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full border border-gray-200 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">
                                      ?
                                    </span>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm whitespace-normal">
                                    {kynhan.name}
                                  </div>
                                  <div className="text-xs text-gray-500 whitespace-normal break-words">
                                    {kynhan.thoiKy}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.kyNhanId && formData.kyNhanId > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">
                              Đã chọn:
                            </span>
                            {(() => {
                              const selectedKynhan = kynhans.find(
                                (k) => k.id === formData.kyNhanId
                              );
                              return selectedKynhan ? (
                                <div className="flex items-center gap-3">
                                  {selectedKynhan.imgUrl &&
                                  selectedKynhan.imgUrl.trim() ? (
                                    <img
                                      src={selectedKynhan.imgUrl}
                                      alt={selectedKynhan.name}
                                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                                      <span className="text-xs text-gray-400">
                                        ?
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium text-gray-800">
                                      {selectedKynhan.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {selectedKynhan.thoiKy}
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title and Birth/Death */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Danh hiệu (bắt buộc)
                    </label>
                    <Input
                      id="danhHieu"
                      value={formData.danhHieu || ""}
                      onChange={(e) =>
                        handleInputChange("danhHieu", e.target.value)
                      }
                      placeholder="Nhập danh hiệu"
                      color="black"
                      className="rounded-4xl border-gray-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Năm sinh - Năm mất
                    </label>
                    <Input
                      id="namSinhNamMat"
                      value={formData.namSinhNamMat || ""}
                      onChange={(e) =>
                        handleInputChange("namSinhNamMat", e.target.value)
                      }
                      placeholder="Nhập thông tin năm sinh và năm mất"
                      color="black"
                      className="rounded-4xl border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Quê quán
                    </label>
                    <Input
                      id="queQuan"
                      value={formData.queQuan || ""}
                      onChange={(e) =>
                        handleInputChange("queQuan", e.target.value)
                      }
                      placeholder="Nhập quê quán"
                      color="black"
                      className="rounded-4xl border-gray-300"
                    />
                  </div>

                  {/* Background Information */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Xuất thân
                    </label>
                    <Textarea
                      id="xuatThan"
                      value={formData.xuatThan || ""}
                      onChange={(e) =>
                        handleInputChange("xuatThan", e.target.value)
                      }
                      placeholder="Nhập thông tin xuất thân"
                      rows={3}
                      className="rounded-4xl border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Sự nghiệp
                    </label>
                    <Textarea
                      id="khoiNghia"
                      value={formData.khoiNghia || ""}
                      onChange={(e) =>
                        handleInputChange("khoiNghia", e.target.value)
                      }
                      placeholder="Nhập thông tin về sự nghiệp"
                      rows={3}
                      className="rounded-4xl border-gray-300"
                    />
                  </div>

                  {/* Relationships */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Người đồng hành
                      </label>
                      <Input
                        id="nguoiDongHanh"
                        value={formData.nguoiDongHanh || ""}
                        onChange={(e) =>
                          handleInputChange("nguoiDongHanh", e.target.value)
                        }
                        placeholder="Nhập thông tin người đồng hành"
                        color="black"
                        className="rounded-4xl border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phu quân/Phu nhân
                      </label>
                      <Input
                        id="phuQuan"
                        value={formData.phuQuan || ""}
                        onChange={(e) =>
                          handleInputChange("phuQuan", e.target.value)
                        }
                        placeholder="Nhập thông tin phu quân/phu nhân"
                        color="black"
                        className="rounded-4xl border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Achievements and Events */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Chiến công
                    </label>
                    <Textarea
                      id="chienCong"
                      value={formData.chienCong || ""}
                      onChange={(e) =>
                        handleInputChange("chienCong", e.target.value)
                      }
                      placeholder="Nhập thông tin về các chiến công"
                      rows={3}
                      className="rounded-4xl border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Vai trò
                    </label>
                    <Textarea
                      id="dinhCao"
                      value={formData.dinhCao || ""}
                      onChange={(e) =>
                        handleInputChange("dinhCao", e.target.value)
                      }
                      placeholder="Nhập thông tin về vai trò"
                      rows={3}
                      className="rounded-4xl border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Kết cục
                    </label>
                    <Textarea
                      id="ketCuc"
                      value={formData.ketCuc || ""}
                      onChange={(e) =>
                        handleInputChange("ketCuc", e.target.value)
                      }
                      placeholder="Nhập thông tin về kết cục"
                      rows={3}
                      className="rounded-4xl border-gray-300"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pb-6">
              <Button
                variant="outline"
                className="bg-stone-50 border-stone-300"
                onClick={() => {
                  resetForm();
                  setListView(true);
                }}
              >
                Hủy
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
                className="bg-stone-600 hover:bg-stone-700"
                onClick={() => {
                  const form = document.querySelector("form");
                  if (form) {
                    form.requestSubmit();
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingItem ? "Đang cập nhật..." : "Đang tạo..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingItem ? "Cập nhật" : "Tạo mới"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibCardPage;
