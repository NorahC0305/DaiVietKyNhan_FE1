"use client";

import React from "react";
import { Button } from "@atoms/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@atoms/ui/card";
import { Label } from "@atoms/ui/label";
import { Alert, AlertDescription } from "@atoms/ui/alert";
import { Checkbox } from "@atoms/ui/checkbox";
import { Textarea } from "@atoms/ui/textarea";
import { Separator } from "@atoms/ui/separator";
import { Timer, Save, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { AntdDateTimePicker } from "@atoms/ui/antd-datetime-picker";
import { getCurrentVietnamTime } from "@utils/ReleaseDateUtils";

interface ReleaseDateFormProps {
  releaseDate: ICOMPONENTS.ReleaseDateData;
  isCreatingNew: boolean;
  isLoading: boolean;
  message: ICOMPONENTS.ReleaseDateMessage | null;
  canSave: boolean;
  canDelete: boolean;
  onDateChange: (date: Date | undefined) => void;
  onDescriptionChange: (description: string) => void;
  onActiveChange: (isActive: boolean) => void;
  onSave: () => void;
  onReset: () => void;
  onDelete: () => void;
}

const ReleaseDateForm: React.FC<ReleaseDateFormProps> = React.memo(
  ({
    releaseDate,
    isCreatingNew,
    isLoading,
    message,
    canSave,
    canDelete,
    onDateChange,
    onDescriptionChange,
    onActiveChange,
    onSave,
    onReset,
    onDelete,
  }) => {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            {isCreatingNew ? "Tạo Sự Kiện Mới" : "Chỉnh Sửa Sự Kiện"}
          </CardTitle>
          <CardDescription>
            {isCreatingNew
              ? "Tạo sự kiện mới với ngày giờ, mô tả và trạng thái."
              : "Chỉnh sửa thông tin sự kiện đã chọn."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AntdDateTimePicker
            date={releaseDate?.date}
            onDateChange={(date) => { onDateChange(date); }}
            placeholder="Chọn ngày và giờ ra mắt (GMT+7)"
            minDate={getCurrentVietnamTime()}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={releaseDate?.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Ví dụ: Sự kiện ra mắt phiên bản 1.0..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="is-active"
              checked={releaseDate?.isActive}
              onCheckedChange={(checked) => onActiveChange(checked as boolean)}
            />
            <Label htmlFor="is-active" className="cursor-pointer">
              Kích hoạt thông báo ngày ra mắt
            </Label>
          </div>

          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
              className={message.type === "success" ? "bg-green-50" : ""}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Separator />

          <div className="flex gap-3">
            <Button
              onClick={onSave}
              disabled={!canSave}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? (
                "Đang lưu..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isCreatingNew ? "Tạo Mới" : "Cập Nhật"}
                </>
              )}
            </Button>

            <Button variant="outline" onClick={onReset} disabled={isLoading}>
              {isCreatingNew ? "Hủy tạo mới" : "Hủy thay đổi"}
            </Button>

            {canDelete && (
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={isLoading}
                className="ml-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

ReleaseDateForm.displayName = "ReleaseDateForm";

export default ReleaseDateForm;
