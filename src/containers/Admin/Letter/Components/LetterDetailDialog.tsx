"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/Atoms/ui/dialog";
import { Input } from "@/components/Atoms/ui/input";
import { Textarea } from "@/components/Atoms/ui/textarea";
import { Button } from "@/components/Atoms/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/Atoms/ui/select";
import { Label } from "@/components/Atoms/ui/label";
import { Badge } from "@/components/Atoms/ui/badge";
import { Card, CardContent } from "@/components/Atoms/ui/card";
import { ILetterEntity } from "@models/letter/entity";
import { LETTER_ENUMS } from "@constants/letter";
import { Edit, Save, X, User, Mail, Calendar, FileText, Shield, CheckCircle2 } from "lucide-react";

interface LetterDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    letter: ILetterEntity | null;
    onSave: (letterId: number, data: { from: string; to: string; content: string; status: string }) => Promise<void>;
    initialEditMode?: boolean;
    isSaving?: boolean;
}

const LetterDetailDialog: React.FC<LetterDetailDialogProps> = ({
    open,
    onOpenChange,
    letter,
    onSave,
    initialEditMode = false,
    isSaving: externalIsSaving = false,
}) => {
    const [isEditMode, setIsEditMode] = useState(initialEditMode);
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        content: "",
        status: LETTER_ENUMS.LETTER_STATUS.PUBLIC,
    });
    const [isSaving, setIsSaving] = useState(false);

    // Use external isSaving if provided, otherwise use internal state
    const isActuallySaving = externalIsSaving || isSaving;

    useEffect(() => {
        if (letter && open) {
            setFormData({
                from: letter.from || "",
                to: letter.to || "",
                content: letter.content || "",
                status: letter.status || LETTER_ENUMS.LETTER_STATUS.PUBLIC,
            });
            setIsEditMode(initialEditMode);
        }
    }, [letter, initialEditMode, open]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!letter) return;

        // Only use internal state if external isSaving is not provided
        if (!externalIsSaving) {
            setIsSaving(true);
        }
        try {
            await onSave(letter.id, formData);
            setIsEditMode(false);
        } catch (error) {
            console.error("Error saving letter:", error);
        } finally {
            if (!externalIsSaving) {
                setIsSaving(false);
            }
        }
    };

    const handleCancel = () => {
        if (letter) {
            setFormData({
                from: letter.from || "",
                to: letter.to || "",
                content: letter.content || "",
                status: letter.status || LETTER_ENUMS.LETTER_STATUS.PUBLIC,
            });
        }
        setIsEditMode(false);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case LETTER_ENUMS.LETTER_STATUS.PUBLIC:
                return "default";
            case LETTER_ENUMS.LETTER_STATUS.PENDING:
                return "secondary";
            case LETTER_ENUMS.LETTER_STATUS.REMOVE:
                return "destructive";
            default:
                return "outline";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case LETTER_ENUMS.LETTER_STATUS.PUBLIC:
                return "Công khai";
            case LETTER_ENUMS.LETTER_STATUS.PENDING:
                return "Chờ duyệt";
            case LETTER_ENUMS.LETTER_STATUS.REMOVE:
                return "Đã xóa";
            default:
                return status;
        }
    };

    const formatDate = (dateString: string | Date) => {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!letter) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isEditMode ? 'bg-orange-100' : 'bg-blue-100'}`}>
                                {isEditMode ? (
                                    <Edit className="h-5 w-5 text-orange-600" />
                                ) : (
                                    <FileText className="h-5 w-5 text-blue-600" />
                                )}
                            </div>
                            <DialogTitle className="text-xl font-bold text-gray-800">
                                {isEditMode ? "Chỉnh sửa thư" : "Chi tiết thư"}
                            </DialogTitle>
                        </div>
                        {!isEditMode && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditMode(true)}
                                className="flex items-center gap-2 bg-white hover:bg-gray-50"
                            >
                                <Edit className="h-4 w-4" />
                                Sửa
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="px-6 py-6">

                    {isEditMode ? (
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Thông tin cơ bản */}
                            <Card className="border-gray-200 shadow-sm">
                                <CardContent className="pt-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-gray-600" />
                                        Thông tin thư
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="from" className="text-sm font-medium text-gray-700">
                                                Từ <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="from"
                                                value={formData.from}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, from: e.target.value })
                                                }
                                                placeholder="Tên người gửi"
                                                required
                                                className="bg-white"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="to" className="text-sm font-medium text-gray-700">
                                                Đến <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="to"
                                                value={formData.to}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, to: e.target.value })
                                                }
                                                placeholder="Tên người nhận"
                                                required
                                                className="bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                                            Nội dung <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="content"
                                            value={formData.content}
                                            onChange={(e) =>
                                                setFormData({ ...formData, content: e.target.value })
                                            }
                                            placeholder="Nội dung thư..."
                                            rows={12}
                                            required
                                            className="resize-none bg-white"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Trạng thái */}
                            <Card className="border-gray-200 shadow-sm">
                                <CardContent className="pt-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-gray-600" />
                                        Trạng thái
                                    </h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                            Trạng thái thư
                                        </Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, status: value as any })
                                            }
                                        >
                                            <SelectTrigger id="status" className="bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={LETTER_ENUMS.LETTER_STATUS.PENDING}>
                                                    {getStatusText(LETTER_ENUMS.LETTER_STATUS.PENDING)}
                                                </SelectItem>
                                                <SelectItem value={LETTER_ENUMS.LETTER_STATUS.PUBLIC}>
                                                    {getStatusText(LETTER_ENUMS.LETTER_STATUS.PUBLIC)}
                                                </SelectItem>
                                                <SelectItem value={LETTER_ENUMS.LETTER_STATUS.REMOVE}>
                                                    {getStatusText(LETTER_ENUMS.LETTER_STATUS.REMOVE)}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isActuallySaving}
                                    className="flex items-center gap-2 min-w-[100px]"
                                >
                                    <X className="h-4 w-4" />
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isActuallySaving || !formData.from.trim() || !formData.to.trim() || !formData.content.trim()}
                                    className="bg-stone-600 hover:bg-stone-700 flex items-center gap-2 min-w-[120px]"
                                >
                                    <Save className="h-4 w-4" />
                                    {isActuallySaving ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {/* Thông tin cơ bản */}
                            <Card className="border-gray-200 shadow-sm">
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-blue-600" />
                                        Thông tin thư
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                ID
                                            </Label>
                                            <div className="text-base font-semibold text-gray-900">#{letter.id}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Người gửi
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                {letter.fromUser?.avatar && (
                                                    <img
                                                        src={letter.fromUser.avatar}
                                                        alt={letter.fromUser.name}
                                                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                                                    />
                                                )}
                                                <span className="text-base font-medium text-gray-900">
                                                    {letter.fromUser?.name || `User ${letter.fromUserId}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                Từ
                                            </Label>
                                            <div className="text-base text-gray-900 font-medium">{letter.from || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                Đến
                                            </Label>
                                            <div className="text-base text-gray-900 font-medium">{letter.to || "-"}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Nội dung */}
                            <Card className="border-gray-200 shadow-sm">
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-green-600" />
                                        Nội dung
                                    </h3>
                                    <div className="whitespace-pre-wrap bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200 min-h-[250px] max-h-[400px] overflow-y-auto text-gray-800 leading-relaxed">
                                        {letter.content}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Trạng thái và thông tin khác */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="border-gray-200 shadow-sm">
                                    <CardContent className="pt-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-purple-600" />
                                            Trạng thái
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Trạng thái thư
                                                </Label>
                                                <div className="mt-2">
                                                    <Badge variant={getStatusBadgeVariant(letter.status)} className="text-sm py-1 px-3">
                                                        {getStatusText(letter.status)}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Lần đầu công khai
                                                </Label>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Badge variant={letter.isFirstPublic ? "default" : "outline"} className="text-sm py-1 px-3">
                                                        {letter.isFirstPublic ? "Có" : "Không"}
                                                    </Badge>
                                                    {letter.isFirstPublic && (
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-gray-200 shadow-sm">
                                    <CardContent className="pt-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-orange-600" />
                                            Thời gian
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Ngày tạo
                                                </Label>
                                                <div className="text-sm text-gray-900 font-medium mt-2">
                                                    {formatDate(letter.createdAt)}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Ngày cập nhật
                                                </Label>
                                                <div className="text-sm text-gray-900 font-medium mt-2">
                                                    {formatDate(letter.updatedAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LetterDetailDialog;

