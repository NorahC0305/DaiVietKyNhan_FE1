"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/Atoms/ui/button";
import { Input } from "@/components/Atoms/ui/input";
import { Label } from "@/components/Atoms/ui/label";
import { COLORS } from "@constants/colors";
import userService from "@services/user";
import { IUpdateUserPointsRequest } from "@models/user/request";
import { IPointChangeLogData } from "@models/user/response";
import { toast } from "react-toastify";

interface EditFormProps {
  editingLog?: IPointChangeLogData | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditForm = ({ editingLog, onSuccess, onCancel }: EditFormProps) => {
  const [formData, setFormData] = useState<IUpdateUserPointsRequest>({
    userId: 0,
    reason: "",
    newPoint: 0,
    newCoin: 0,
    newHeart: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when editing log is provided
  useEffect(() => {
    if (editingLog) {
      // Initialize from the CURRENT user's values, not the historical log values.
      // The POST will create a new record; we never mutate old logs.
      setFormData({
        userId: editingLog.userId,
        reason: editingLog.reason,
        newPoint: editingLog.user.point,
        newCoin: editingLog.user.coin,
        newHeart: editingLog.user.heart,
      });
    } else {
      setFormData({
        userId: 0,
        reason: "",
        newPoint: 0,
        newCoin: 0,
        newHeart: 0,
      });
    }
  }, [editingLog]);

  const handleInputChange = React.useCallback((
    field: keyof IUpdateUserPointsRequest,
    value: string | number
  ) => {
    const numericFields = new Set(['userId', 'newPoint', 'newCoin', 'newHeart']);
    
    setFormData((prev) => ({
      ...prev,
      [field]: numericFields.has(field) ? Number(value) || 0 : value,
    }));
  }, []);

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.userId) {
      toast.error("Vui lòng chọn người dùng");
      return;
    }

    if (!formData.reason.trim()) {
      toast.error("Vui lòng nhập lý do thay đổi");
      return;
    }

    if (formData.newPoint < 0 || formData.newCoin < 0 || formData.newHeart < 0) {
      toast.error("Giá trị không được âm");
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.updateUserPoints(formData);
      toast.success("Cập nhật thành công!");
      onSuccess?.();

      // Reset form if not editing
      if (!editingLog) {
        setFormData({
          userId: 0,
          reason: "",
          newPoint: 0,
          newCoin: 0,
          newHeart: 0,
        });
      }
    } catch (error) {
      console.error("Error updating user points:", error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingLog, onSuccess]);

  return (
    <div className="rounded-lg border border-gray-300 bg-admin-primary p-4 space-y-4">
      <div>
        <p className="text-lg font-bold text-gray-700">
          {editingLog ? "Chỉnh sửa thông tin" : "Chỉnh sửa điểm số"}
        </p>
        <p className="text-sm font-medium text-gray-700">
          {editingLog
            ? `Đang chỉnh sửa cho ${editingLog.user.name}`
            : "Chỉnh sửa điểm số, coin và heart cho người dùng"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {editingLog && (
          <div className="p-3 bg-blue-50 rounded-md border border-blue-200 space-y-2">
            <div className="text-xs text-blue-700">
              Bạn đang chỉnh giá trị HIỆN TẠI của người dùng. Lưu sẽ tạo BẢN GHI MỚI, không sửa log cũ.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700">Điểm hiện tại:</span>
                <span className="ml-2 text-blue-600">{editingLog.user.point}</span>
                <div className="text-[11px] text-gray-500 mt-1">Bản ghi gần nhất: {editingLog.snapshotPoint} → {editingLog.newPoint}</div>
              </div>
              <div>
                <span className="font-medium text-blue-700">Coin hiện tại:</span>
                <span className="ml-2 text-blue-600">{editingLog.user.coin.toLocaleString()}</span>
                <div className="text-[11px] text-gray-500 mt-1">Bản ghi gần nhất: {editingLog.snapshotCoin.toLocaleString()} → {editingLog.newCoin.toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-blue-700">Heart hiện tại:</span>
                <span className="ml-2 text-blue-600">{editingLog.user.heart}</span>
                <div className="text-[11px] text-gray-500 mt-1">Bản ghi gần nhất: {editingLog.snapshotHeart} → {editingLog.newHeart}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="userId">ID Người dùng</Label>
            <Input
              id="userId"
              type="number"
              placeholder="Nhập ID người dùng"
              value={formData.userId || ""}
              onChange={(e) => handleInputChange("userId", e.target.value)}
              className="bg-transparent hover:bg-gray-100"
              disabled={!!editingLog}
              color="black"
            />
          </div>

          <div>
            <Label htmlFor="newPoint">Điểm số mới</Label>
            <Input
              id="newPoint"
              type="number"
              placeholder="Nhập điểm số"
              value={formData.newPoint || ""}
              onChange={(e) => handleInputChange("newPoint", e.target.value)}
              className="bg-transparent hover:bg-gray-100"
              min="0"
              color="black"
            />
          </div>

          <div>
            <Label htmlFor="newCoin">Coin mới</Label>
            <Input
              id="newCoin"
              type="number"
              placeholder="Nhập số coin"
              value={formData.newCoin || ""}
              onChange={(e) => handleInputChange("newCoin", e.target.value)}
              className="bg-transparent hover:bg-gray-100"
              min="0"
              color="black"
            />
          </div>

          <div>
            <Label htmlFor="newHeart">Heart mới</Label>
            <Input
              id="newHeart"
              type="number"
              placeholder="Nhập số heart"
              value={formData.newHeart || ""}
              onChange={(e) => handleInputChange("newHeart", e.target.value)}
              className="bg-transparent hover:bg-gray-100"
              min="0"
              color="black"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="reason">Lý do thay đổi</Label>
          <Input
            id="reason"
            placeholder="Nhập lý do thay đổi..."
            value={formData.reason}
            onChange={(e) => handleInputChange("reason", e.target.value)}
            className="bg-transparent hover:bg-gray-100"
            color="black"
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            style={{ backgroundColor: COLORS.BACKGROUND.ORANGE }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>

          {editingLog && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditForm;
