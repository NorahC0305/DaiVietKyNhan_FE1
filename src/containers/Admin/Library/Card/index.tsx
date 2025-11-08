"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/Atoms/ui/button";
import { Input } from "@/components/Atoms/ui/input";
import { Textarea } from "@/components/Atoms/ui/textarea";
import { Label } from "@/components/Atoms/ui/label";
import { Switch } from "@/components/Atoms/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Atoms/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import { Upload, Save, X, Plus } from "lucide-react";
import kynhanService from "@services/kynhan";
import landService from "@services/land";
import { ILandEntity } from "@models/land/entity";
import { IBackendResponse } from "@models/backend";
import { IKyNhanResponseModel } from "@models/ky-nhan/response";
import { toast } from "react-toastify";

interface FormData {
  imgUrl: File | null;
  name: string;
  thoiky: string;
  chienCong: string;
  active: boolean;
  landId: number;
}

interface ValidationErrors {
  imgUrl?: string;
  name?: string;
  thoiky?: string;
  chienCong?: string;
  landId?: string;
}

const CardPage = ({ lands: initialLands }: { lands: ILandEntity[] }) => {
  const [lands, setLands] = useState<ILandEntity[]>(initialLands);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    imgUrl: null,
    name: "",
    thoiky: "",
    chienCong: "",
    active: true,
    landId: 0,
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Load lands data
  useEffect(() => {
    const fetchLands = async () => {
      setIsLoading(true);
      try {
        const response =
          (await landService.getLands()) as IBackendResponse<any>;
        if (response.statusCode === 200 && response.data?.data) {
          setLands(response.data.data);
          // Set default land if available
          if (response.data.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              landId: response.data.data[0].id,
            }));
          }
        }
      } catch (error: any) {
        toast.error(error.message || "Không thể tải danh sách đất");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLands();
  }, []);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setFormData((prev) => ({ ...prev, imgUrl: file }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Clear validation error
      if (validationErrors.imgUrl) {
        setValidationErrors((prev) => ({ ...prev, imgUrl: undefined }));
      }
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
    const imageFile = files?.find((file: File) =>
      file.type.startsWith("image/")
    );

    if (imageFile) {
      setSelectedImage(imageFile);
      setFormData((prev) => ({ ...prev, imgUrl: imageFile }));
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);

      if (validationErrors.imgUrl) {
        setValidationErrors((prev) => ({ ...prev, imgUrl: undefined }));
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.imgUrl) {
      errors.imgUrl = "Vui lòng chọn hình ảnh";
    }

    if (!formData.name.trim()) {
      errors.name = "Vui lòng nhập tên kỳ nhân";
    }

    if (!formData.thoiky.trim()) {
      errors.thoiky = "Vui lòng nhập thời kỳ";
    }

    if (!formData.chienCong.trim()) {
      errors.chienCong = "Vui lòng nhập chiến công";
    }

    if (!formData.landId || formData.landId === 0) {
      errors.landId = "Vui lòng chọn đất";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData here instead of in the service
      const submitFormData = new FormData();
      submitFormData.append("imgUrl", formData.imgUrl!);
      submitFormData.append("name", formData.name);
      submitFormData.append("thoiKy", formData.thoiky);
      submitFormData.append("chienCong", formData.chienCong);
      submitFormData.append("active", formData.active.toString());
      submitFormData.append("landId", formData.landId.toString());
      const response = (await kynhanService.createKyNhan(
        submitFormData
      )) as IKyNhanResponseModel;
      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success(response.message || "Tạo kỳ nhân thành công!");

        // Reset form
        setFormData({
          imgUrl: null,
          name: "",
          thoiky: "",
          chienCong: "",
          active: true,
          landId: lands.length > 0 ? lands[0].id : 0,
        });
        setSelectedImage(null);
        setPreviewUrl("");
        setValidationErrors({});

        // Reset file input
        const fileInput = document.getElementById("imgUrl") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi tạo kỳ nhân");
      }
    } catch (error: any) {
      toast(error.message || "Không thể tạo kỳ nhân. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear image selection
  const clearImage = () => {
    setSelectedImage(null);
    setFormData((prev) => ({ ...prev, imgUrl: null }));
    setPreviewUrl("");
    const fileInput = document.getElementById("imgUrl") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="min-h-screen rounded-xl bg-admin-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">Tạo Thẻ Kỳ Nhân</h1>
          <p className="text-gray-600">Điền thông tin để tạo mới thẻ kỳ nhân</p>
        </div>

        {/* Image Upload Section */}
        <Card className="border-2 border-gray-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Hình ảnh kỳ nhân
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
                onChange={handleImageChange}
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
            {validationErrors.imgUrl && (
              <p className="text-sm text-red-600">{validationErrors.imgUrl}</p>
            )}
          </CardContent>
        </Card>

        {/* Form Section */}
        <Card className="border-2 border-gray-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Thông tin Kỳ Nhân
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Tên kỳ nhân *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập tên kỳ nhân"
                  color="black"
                  className={`rounded-4xl border-gray-300 ${validationErrors.name ? "border-red-500" : ""
                    }`}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-600">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Thời kỳ */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Thời kỳ *
                </label>
                <Input
                  id="thoiky"
                  value={formData.thoiky}
                  onChange={(e) => handleInputChange("thoiky", e.target.value)}
                  placeholder="Nhập thời kỳ"
                  color="black"
                  className={`rounded-4xl border-gray-300 ${validationErrors.thoiky ? "border-red-500" : ""
                    }`}
                />
                {validationErrors.thoiky && (
                  <p className="text-sm text-red-600">
                    {validationErrors.thoiky}
                  </p>
                )}
              </div>

              {/* Chiến công */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Chiến công *
                </label>
                <Textarea
                  id="chienCong"
                  value={formData.chienCong}
                  onChange={(e) =>
                    handleInputChange("chienCong", e.target.value)
                  }
                  placeholder="Nhập mô tả chiến công"
                  rows={4}
                  className={`rounded-4xl border-gray-300 ${validationErrors.chienCong ? "border-red-500" : ""
                    }`}
                />
                {validationErrors.chienCong && (
                  <p className="text-sm text-red-600">
                    {validationErrors.chienCong}
                  </p>
                )}
              </div>

              {/* Land Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Đất *
                </label>
                <Select
                  value={formData.landId.toString()}
                  onValueChange={(value) =>
                    handleInputChange("landId", parseInt(value))
                  }
                >
                  <SelectTrigger
                    className={`rounded-4xl border-gray-300 ${validationErrors.landId ? "border-red-500" : ""
                      }`}
                  >
                    <SelectValue placeholder="Chọn đất">
                      {lands?.find(
                        (land: ILandEntity) => land.id === formData.landId
                      )?.name || "Chọn đất"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {lands?.map((land: ILandEntity) => (
                      <SelectItem key={land.id} value={land.id.toString()}>
                        {land.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.landId && (
                  <p className="text-sm text-red-600">
                    {validationErrors.landId}
                  </p>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    handleInputChange("active", checked)
                  }
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium text-gray-700"
                >
                  Kích hoạt
                </label>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pb-6">
          <Button
            type="button"
            variant="outline"
            className="bg-stone-50 border-stone-300"
            onClick={() => {
              setFormData({
                imgUrl: null,
                name: "",
                thoiky: "",
                chienCong: "",
                active: true,
                landId: lands.length > 0 ? lands[0].id : 0,
              });
              setSelectedImage(null);
              setPreviewUrl("");
              setValidationErrors({});
              const fileInput = document.getElementById(
                "imgUrl"
              ) as HTMLInputElement;
              if (fileInput) {
                fileInput.value = "";
              }
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
                Đang tạo...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Tạo Kỳ Nhân
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
