"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/Atoms/ui/card";
import { Input } from "@/components/Atoms/ui/input";
import TipTapEditor from "@/components/Organisms/Tiptap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Atoms/ui/select";
import { Button } from "@/components/Atoms/ui/button";
import { Switch } from "@/components/Atoms/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Atoms/ui/dialog";
import { Plus, Trash2, Users, Check, X } from "lucide-react";
import { IKyNhanSummary } from "@models/ky-nhan/entity";
import Image from "next/image";
import { toast } from "react-toastify";
import kyNhanSummaryService from "@services/ky-nhan-summary";
import { ICreateQuestionRequest } from "@models/question/request";
import { ILandEntity } from "@models/land/entity";
import { IQuestion } from "@models/question/entity";

interface AddQuestionFormProps {
  onSubmit: (questionData: ICreateQuestionRequest) => void;
  lands: ILandEntity[];
  editQuestion?: IQuestion | null;
  onCancel?: () => void;
}

interface FormData {
  text: string;
  questionType: "TEXT_INPUT";
  allowSimilarAnswers: boolean;
  landId: number;
  kynhanSummaries: number[];
  answerOptionType: "ONE" | "TWO";
  answers: string[];
}

interface ValidationErrors {
  text?: string;
  questionType?: string;
  landId?: string;
  kynhanSummaries?: string;
  answerOptionType?: string;
  answers?: string;
}

// Constants
const INITIAL_OPTIONS: Record<string, string> = {
  A: "",
  B: "",
  C: "",
  D: "",
};

const INITIAL_OPTION_COUNT = 4;
const MIN_OPTIONS_COUNT = 2;
const OPTION_LABEL_START = 65; // ASCII code for 'A'

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({
  onSubmit,
  lands,
  editQuestion,
  onCancel,
}) => {
  // Memoized computed values
  const defaultLandId = useMemo(
    () => (lands && lands.length > 0 ? lands[0]?.id : 0),
    [lands]
  );

  const [formData, setFormData] = useState<FormData>({
    text: "",
    questionType: "TEXT_INPUT",
    allowSimilarAnswers: true,
    landId: 0,
    kynhanSummaries: [],
    answerOptionType: "ONE",
    answers: [],
  });

  const [options, setOptions] =
    useState<Record<string, string>>(INITIAL_OPTIONS);
  const [optionCount, setOptionCount] = useState(INITIAL_OPTION_COUNT);
  const [pairAnswers, setPairAnswers] = useState<{
    answer1: string[];
    answer2: string[];
  }>({
    answer1: [""],
    answer2: [""],
  });
  const [isKyNhanModalOpen, setIsKyNhanModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [kyNhanSummary, setKyNhanSummary] = useState<IKyNhanSummary[]>([]);
  const [isLoadingKyNhan, setIsLoadingKyNhan] = useState(false);

  // Initialize form with editQuestion data
  useEffect(() => {
    if (editQuestion) {
      const kynhanIds =
        editQuestion.kynhanSummaries?.map((kyNhan) => kyNhan.id) || [];
      const answers = editQuestion.answers?.map((answer) => answer.text) || [];

      // Initialize form data
      setFormData({
        text: editQuestion.text || "",
        questionType: editQuestion.questionType || "TEXT_INPUT",
        allowSimilarAnswers: editQuestion.allowSimilarAnswers || false,
        landId: editQuestion.landId || 0,
        kynhanSummaries: kynhanIds,
        answerOptionType: editQuestion.answerOptionType || "ONE",
        answers: answers,
      });

      // Initialize options based on answerOptionType
      if (editQuestion.answerOptionType === "TWO") {
        setOptions({
          answer1: answers[0] || "",
          answer2: answers[1] || "",
        });
        // Initialize pair answers for editing
        setPairAnswers({
          answer1: answers.filter((_, index) => index % 2 === 0) || [""],
          answer2: answers.filter((_, index) => index % 2 === 1) || [""],
        });
      } else if (editQuestion.allowSimilarAnswers && answers.length > 0) {
        // Initialize multiple options
        const newOptions: Record<string, string> = {};
        answers.forEach((answer, index) => {
          const label = String.fromCharCode(65 + index); // A, B, C, D...
          newOptions[label] = answer;
        });
        setOptions(newOptions);
        setOptionCount(answers.length);
      } else {
        // ONE answer
        setOptions({
          answer: answers[0] || "",
        });
        setOptionCount(1);
      }
    }
  }, [editQuestion]);

  // Fetch kỳ nhân khi landId thay đổi
  useEffect(() => {
    const fetchKyNhanByLand = async () => {
      if (formData.landId && formData.landId > 0) {
        try {
          setIsLoadingKyNhan(true);
          const response = await kyNhanSummaryService.getKyNhanWwithLand(
            formData.landId
          );

          if (response.statusCode === 200 && response.data) {
            // Handle both cases: response.data.results (pagination) or response.data (direct array)
            const kyNhanData = Array.isArray(response.data)
              ? response.data
              : response.data.results || [];

            setKyNhanSummary(kyNhanData);
            // Reset kỳ nhân đã chọn khi chuyển land (only if not editing)
            if (!editQuestion) {
              setFormData((prev) => ({
                ...prev,
                kynhanSummaries: [],
              }));
            }
          } else {
            setKyNhanSummary([]);
          }
        } catch (error) {
          console.error("Error fetching kỳ nhân:", error);
          setKyNhanSummary([]);
        } finally {
          setIsLoadingKyNhan(false);
        }
      } else {
        setKyNhanSummary([]);
      }
    };

    fetchKyNhanByLand();
  }, [formData.landId, editQuestion]);
  // Memoized values
  const selectedKyNhanSummaries = useMemo(
    () =>
      kyNhanSummary?.filter((kyNhan) =>
        formData.kynhanSummaries.includes(kyNhan.id)
      ) || [],
    [kyNhanSummary, formData.kynhanSummaries]
  );

  const sortedOptions = useMemo(
    () =>
      Object.entries(options).sort(
        ([a], [b]) => a.charCodeAt(0) - b.charCodeAt(0)
      ),
    [options]
  );

  // Event handlers with useCallback for performance
  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | boolean | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear validation error when user starts typing
      if (validationErrors[field as keyof ValidationErrors]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as keyof ValidationErrors];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const handleQuestionChange = useCallback(
    (value: string) => {
      handleInputChange("text", value);
    },
    [handleInputChange]
  );

  const handleLandChange = useCallback(
    (landIdStr: string) => {
      const landId = parseInt(landIdStr, 10);
      if (!isNaN(landId)) {
        handleInputChange("landId", landId);
      }
    },
    [handleInputChange]
  );

  const handleAnswerOptionTypeChange = useCallback(
    (value: "ONE" | "TWO") => {
      handleInputChange("answerOptionType", value);

      // When switching to ONE, reset kỳ nhân selection if more than 1 are selected
      if (value === "ONE" && formData.kynhanSummaries.length > 1) {
        setFormData((prev) => ({
          ...prev,
          answerOptionType: value,
          kynhanSummaries: prev.kynhanSummaries.slice(0, 1),
        }));
      }

      // When switching to TWO, reset kỳ nhân selection if more than 2 are selected
      if (value === "TWO" && formData.kynhanSummaries.length > 2) {
        setFormData((prev) => ({
          ...prev,
          answerOptionType: value,
          kynhanSummaries: prev.kynhanSummaries.slice(0, 2),
        }));
      }

      // When switching to TWO, initialize the two answer fields
      if (value === "TWO") {
        setOptions((prev) => ({
          answer1: prev.answer || prev.A || "",
          answer2: prev.B || "",
        }));
        setPairAnswers((prev) => ({
          answer1: [prev.answer1[0] || ""],
          answer2: [prev.answer2[0] || ""],
        }));
      }
    },
    [handleInputChange, formData.kynhanSummaries.length]
  );

  const handleOptionChange = useCallback((option: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  }, []);

  const handleAllowSimilarAnswersChange = useCallback(
    (checked: boolean) => {
      handleInputChange("allowSimilarAnswers", checked);

      if (!checked) {
        const currentAnswer = options.A || options.answer || "";
        setOptions({ answer: currentAnswer });
        setOptionCount(1);
      } else {
        const currentAnswer = options.answer || "";
        setOptions({
          A: currentAnswer,
          B: "",
          C: "",
          D: "",
        });
        setOptionCount(INITIAL_OPTION_COUNT);
      }
    },
    [options, handleInputChange]
  );

  const getOptionLabel = useCallback((index: number): string => {
    return String.fromCharCode(OPTION_LABEL_START + index);
  }, []);

  const addOption = useCallback(() => {
    const newLabel = getOptionLabel(optionCount);
    setOptions((prev) => ({
      ...prev,
      [newLabel]: "",
    }));
    setOptionCount((prev) => prev + 1);
  }, [optionCount, getOptionLabel]);

  const removeOption = useCallback(
    (optionKey: string) => {
      if (Object.keys(options).length <= MIN_OPTIONS_COUNT) return;

      setOptions((prev) => {
        const newOptions = { ...prev };
        delete newOptions[optionKey];
        return newOptions;
      });
      setOptionCount((prev) => prev - 1);
    },
    [options]
  );

  // Functions for handling pair answers
  const handlePairAnswerChange = useCallback(
    (answerType: "answer1" | "answer2", index: number, value: string) => {
      setPairAnswers((prev) => ({
        ...prev,
        [answerType]: prev[answerType].map((answer, i) =>
          i === index ? value : answer
        ),
      }));
    },
    []
  );

  const addPairAnswer = useCallback(
    (answerType: "answer1" | "answer2") => {
      setPairAnswers((prev) => ({
        ...prev,
        [answerType]: [...prev[answerType], ""],
      }));
    },
    []
  );

  const removePairAnswer = useCallback(
    (answerType: "answer1" | "answer2", index: number) => {
      if (pairAnswers[answerType].length <= 1) return;
      setPairAnswers((prev) => ({
        ...prev,
        [answerType]: prev[answerType].filter((_, i) => i !== index),
      }));
    },
    [pairAnswers]
  );

  const handleToggleKyNhanSummary = useCallback((kyNhanId: number) => {
    setFormData((prev) => {
      const newKynhanSummaries = prev.kynhanSummaries.includes(kyNhanId)
        ? prev.kynhanSummaries.filter((id) => id !== kyNhanId)
        : [...prev.kynhanSummaries, kyNhanId];

      // If answerOptionType is ONE, enforce exactly 1 selection
      if (prev.answerOptionType === "ONE") {
        if (newKynhanSummaries.length > 1) {
          return prev; // Don't allow more than 1 selection
        }
      }

      // If answerOptionType is TWO, enforce exactly 2 selections
      if (prev.answerOptionType === "TWO") {
        if (newKynhanSummaries.length > 2) {
          return prev; // Don't allow more than 2 selections
        }
      }

      return {
        ...prev,
        kynhanSummaries: newKynhanSummaries,
      };
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      text: "",
      questionType: "TEXT_INPUT",
      allowSimilarAnswers: true,
      landId: defaultLandId,
      kynhanSummaries: [],
      answerOptionType: "ONE",
      answers: [],
    });
    setOptions(INITIAL_OPTIONS);
    setOptionCount(INITIAL_OPTION_COUNT);
    setPairAnswers({
      answer1: [""],
      answer2: [""],
    });
    setValidationErrors({});
    setKyNhanSummary([]);
  }, [defaultLandId]);

  // Validation function
  const validateForm = useCallback(
    (answers: string[]): ValidationErrors => {
      const errors: ValidationErrors = {};

      if (!formData.text.trim()) {
        errors.text = "Vui lòng nhập nội dung câu hỏi";
      }

      if (!formData.questionType) {
        errors.questionType = "Vui lòng chọn loại câu hỏi";
      }

      if (!formData.landId || formData.landId <= 0) {
        errors.landId = "Vui lòng chọn danh mục";
      }

      if (!formData.kynhanSummaries || formData.kynhanSummaries.length === 0) {
        errors.kynhanSummaries = "Vui lòng chọn ít nhất một kỳ nhân";
      } else if (
        formData.answerOptionType === "ONE" &&
        formData.kynhanSummaries.length !== 1
      ) {
        errors.kynhanSummaries =
          "Vui lòng chọn chính xác 1 kỳ nhân khi chọn loại đáp án đơn lẻ";
      } else if (
        formData.answerOptionType === "TWO" &&
        formData.kynhanSummaries.length !== 2
      ) {
        errors.kynhanSummaries =
          "Vui lòng chọn chính xác 2 kỳ nhân khi chọn loại đáp án cặp đôi";
      }

      if (!answers || answers.length === 0) {
        errors.answers = "Vui lòng nhập ít nhất một đáp án";
      } else {
        const emptyAnswers = answers.filter((answer) => !answer.trim());
        if (emptyAnswers.length > 0) {
          errors.answers = "Đáp án không được để trống";
        }

        // For TWO option type, require at least 2 answers (one for each character)
        if (formData.answerOptionType === "TWO") {
          if (answers.length < 2) {
            errors.answers = "Loại đáp án cặp đôi yêu cầu ít nhất 2 đáp án (mỗi kỳ nhân ít nhất 1 đáp án)";
          } else {
            // Check if both characters have at least one answer
            const answer1Count = pairAnswers.answer1.filter(answer => answer.trim() !== "").length;
            const answer2Count = pairAnswers.answer2.filter(answer => answer.trim() !== "").length;
            
            if (answer1Count === 0 || answer2Count === 0) {
              errors.answers = "Mỗi kỳ nhân phải có ít nhất 1 đáp án";
            }
          }
        }
      }

      return errors;
    },
    [formData, pairAnswers]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        // Convert options to answers array
        let answers: string[];
        if (formData.answerOptionType === "TWO") {
          // For TWO type, combine all answers from both answer types
          const answer1List = pairAnswers.answer1.filter(
            (answer) => answer.trim() !== ""
          );
          const answer2List = pairAnswers.answer2.filter(
            (answer) => answer.trim() !== ""
          );
          // Combine all answers into one array without distinction
          answers = [...answer1List, ...answer2List];
          
          // Debug log
          console.log("Debug - pairAnswers:", pairAnswers);
          console.log("Debug - answer1List:", answer1List);
          console.log("Debug - answer2List:", answer2List);
          console.log("Debug - final answers:", answers);
        } else {
          // For other types, use the existing logic
          answers = Object.values(options).filter(
            (answer) => answer.trim() !== ""
          );
        }

        // Validate form
        const errors = validateForm(answers);
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          const firstError = Object.values(errors)[0];
          if (firstError) {
            toast.error(firstError);
          }
          return;
        }

        // Clear validation errors
        setValidationErrors({});

        // Create final data for API
        const finalData: ICreateQuestionRequest = {
          text: formData.text.trim(),
          questionType: "TEXT_INPUT",
          allowSimilarAnswers: formData.allowSimilarAnswers,
          landId: formData.landId,
          kynhanSummaries: formData.kynhanSummaries,
          answerOptionType: formData.answerOptionType,
          answers: answers.map((answer) => answer.trim()),
        };

        // Let parent component handle create/update logic
        await onSubmit(finalData);

        // Reset form only if not in edit mode
        if (!editQuestion) {
          resetForm();
        }
      } catch (error: any) {
        console.error("Error submitting question:", error);
        // Error handling and toast notifications are now handled in parent component
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      options,
      isSubmitting,
      validateForm,
      onSubmit,
      resetForm,
      editQuestion,
    ]
  );

  // Memoized callback for image error handling
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = "/placeholder-avatar.png";
    },
    []
  );

  // Memoized KyNhan selection components
  const KyNhanItem = useCallback(
    ({ kyNhan }: { kyNhan: IKyNhanSummary }) => {
      const isSelected = formData.kynhanSummaries.includes(kyNhan.id);
      const isDisabled =
        (formData.answerOptionType === "ONE" &&
          !isSelected &&
          formData.kynhanSummaries.length >= 1) ||
        (formData.answerOptionType === "TWO" &&
          !isSelected &&
          formData.kynhanSummaries.length >= 2);

      return (
        <div
          className={`relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md h-48 overflow-hidden ${isSelected
              ? "border-blue-500 bg-blue-50"
              : isDisabled
                ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          onClick={() => !isDisabled && handleToggleKyNhanSummary(kyNhan.id)}
        >
          {isSelected && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-10">
              <Check className="w-3 h-3" />
            </div>
          )}
          <div className="w-full h-full">
            <Image
              width={300}
              height={300}
              src={kyNhan.imgUrl}
              alt={kyNhan.summary}
              className="w-full h-full object-cover rounded-md"
              onError={handleImageError}
            />
          </div>
        </div>
      );
    },
    [
      formData.kynhanSummaries,
      formData.answerOptionType,
      handleToggleKyNhanSummary,
      handleImageError,
    ]
  );

  const SelectedKyNhanItem = useCallback(
    ({ kyNhan }: { kyNhan: IKyNhanSummary }) => (
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md p-2">
        <img
          src={kyNhan.imgUrl}
          alt={kyNhan.summary}
          className="w-8 h-8 object-cover rounded-full"
          onError={handleImageError}
        />
        <span className="text-xs text-gray-700 truncate flex-1">
          {kyNhan.summary.substring(0, 30)}...
        </span>
        <button
          type="button"
          onClick={() => handleToggleKyNhanSummary(kyNhan.id)}
          className="text-red-500 hover:text-red-700 ml-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    ),
    [handleToggleKyNhanSummary, handleImageError]
  );

  return (
    <Card className="border-gray-300  ">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">
              {editQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {editQuestion
                ? "Chỉnh sửa thông tin câu hỏi"
                : "Tạo câu hỏi mới cho ngân hàng câu hỏi"}
            </CardDescription>
          </div>
          {editQuestion && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              Hủy
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category, Type and Answer Option Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <Select
                value={formData.landId > 0 ? formData.landId.toString() : ""}
                onValueChange={handleLandChange}
              >
                <SelectTrigger className="w-full border-gray-300 rounded-md">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {lands?.map((land) => (
                    <SelectItem key={land.id} value={land.id.toString()}>
                      {land.name}
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
              {validationErrors.landId && (
                <p className="text-sm text-red-600 mt-1">
                  {validationErrors.landId}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại
              </label>
              <Select
                value={formData.questionType}
                onValueChange={(value) =>
                  handleInputChange("questionType", value)
                }
              >
                <SelectTrigger className="w-full border-gray-300 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem key="TEXT_INPUT" value="TEXT_INPUT">
                    Tự Luận
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại đáp án
              </label>
              <Select
                value={formData.answerOptionType}
                onValueChange={handleAnswerOptionTypeChange}
              >
                <SelectTrigger className="w-full border-gray-300 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem key="ONE" value="ONE">
                    Đơn lẻ
                  </SelectItem>
                  <SelectItem key="TWO" value="TWO">
                    Cặp đôi
                  </SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.answerOptionType && (
                <p className="text-sm text-red-600 mt-1">
                  {validationErrors.answerOptionType}
                </p>
              )}
            </div>
          </div>

          {/* KyNhan Summary Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn Kỳ Nhân
              {formData.answerOptionType === "ONE" && (
                <span className="text-sm text-blue-600 font-normal ml-2">
                  (Chọn chính xác 1 kỳ nhân cho câu hỏi đơn lẻ)
                </span>
              )}
              {formData.answerOptionType === "TWO" && (
                <span className="text-sm text-blue-600 font-normal ml-2">
                  (Chọn chính xác 2 kỳ nhân cho câu hỏi cặp đôi)
                </span>
              )}
            </label>
            <div className="flex flex-col space-y-2">
              {/* Nút để mở modal */}
              <Dialog
                open={isKyNhanModalOpen}
                onOpenChange={setIsKyNhanModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 justify-start h-auto p-3 border-1 border-gray-300 rounded-md"
                  >
                    <Users className="w-4 h-4" />
                    <span>
                      {selectedKyNhanSummaries.length > 0
                        ? `Đã chọn ${selectedKyNhanSummaries.length} kỳ nhân`
                        : "Chọn kỳ nhân"}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                  <DialogHeader>
                    <DialogTitle>Chọn Kỳ Nhân</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoadingKyNhan ? (
                      <div className="col-span-full flex items-center justify-center py-8">
                        <div className="text-gray-500">Đang tải kỳ nhân...</div>
                      </div>
                    ) : kyNhanSummary?.length > 0 ? (
                      kyNhanSummary.map((kyNhan) => (
                        <KyNhanItem key={kyNhan.id} kyNhan={kyNhan} />
                      ))
                    ) : (
                      <div className="col-span-full flex items-center justify-center py-8">
                        <div className="text-gray-500">
                          Không có kỳ nhân nào trong land này
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsKyNhanModalOpen(false)}
                    >
                      Đóng
                    </Button>
                    <Button onClick={() => setIsKyNhanModalOpen(false)}>
                      Xong ({selectedKyNhanSummaries.length})
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Hiển thị các kỳ nhân đã chọn */}
              {selectedKyNhanSummaries.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {selectedKyNhanSummaries.map((kyNhan) => (
                    <SelectedKyNhanItem key={kyNhan.id} kyNhan={kyNhan} />
                  ))}
                </div>
              )}
              {validationErrors.kynhanSummaries && (
                <p className="text-sm text-red-600 mt-1">
                  {validationErrors.kynhanSummaries}
                </p>
              )}
            </div>
          </div>

          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Câu hỏi
            </label>
            <TipTapEditor
              value={formData.text}
              onChange={handleQuestionChange}
              placeholder="Nhập nội dung câu hỏi..."
              textColor="black"
              className="w-full min-h-[120px] border-gray-300 rounded-md"
            />
            {validationErrors.text && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.text}
              </p>
            )}
          </div>

          {/* Allow Similar Answers Switch */}
          {formData.answerOptionType !== "TWO" && (
            <div className="flex items-center justify-between p-4 border-gray-300 border-1 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cho phép nhiều lựa chọn
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Bật để thêm nhiều lựa chọn, tắt để chỉ có 1 ô nhập đáp án
                </p>
              </div>
              <Switch
                checked={formData.allowSimilarAnswers}
                onCheckedChange={handleAllowSimilarAnswersChange}
              />
            </div>
          )}

          {/* Options Section */}
          <div>
            {formData.allowSimilarAnswers &&
              formData.answerOptionType !== "TWO" && (
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Các lựa chọn
                  </label>
                  <Button
                    type="button"
                    onClick={addOption}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm lựa chọn
                  </Button>
                </div>
              )}
            {formData.answerOptionType === "TWO" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Đáp án cho cặp đôi
                  <span className="text-sm text-blue-600 font-normal ml-2">
                    (Nhập đáp án tương ứng với 2 kỳ nhân đã chọn)
                  </span>
                </label>
              </div>
            )}
            <div className="space-y-4">
              {formData.answerOptionType === "TWO" ? (
                // Hiển thị nhiều ô đáp án cho cặp đôi
                <div className="space-y-6">
                  {/* Đáp án cho kỳ nhân đầu tiên */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Đáp án cho kỳ nhân đầu tiên
                      </label>
                      <Button
                        type="button"
                        onClick={() => addPairAnswer("answer1")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                        size="sm"
                      >
                        <Plus className="w-3 h-3" />
                        Thêm đáp án
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {pairAnswers.answer1.map((answer, index) => (
                        <div key={index} className="flex items-end gap-3">
                          <div className="flex-1">
                            <Input
                              placeholder={`Nhập đáp án ${index + 1} cho kỳ nhân đầu tiên...`}
                              value={answer}
                              onChange={(e) =>
                                handlePairAnswerChange("answer1", index, e.target.value)
                              }
                              className="w-full border-gray-300 border-1 rounded-md"
                              color="black"
                            />
                          </div>
                          {pairAnswers.answer1.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removePairAnswer("answer1", index)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Đáp án cho kỳ nhân thứ hai */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Đáp án cho kỳ nhân thứ hai
                      </label>
                      <Button
                        type="button"
                        onClick={() => addPairAnswer("answer2")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                        size="sm"
                      >
                        <Plus className="w-3 h-3" />
                        Thêm đáp án
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {pairAnswers.answer2.map((answer, index) => (
                        <div key={index} className="flex items-end gap-3">
                          <div className="flex-1">
                            <Input
                              placeholder={`Nhập đáp án ${index + 1} cho kỳ nhân thứ hai...`}
                              value={answer}
                              onChange={(e) =>
                                handlePairAnswerChange("answer2", index, e.target.value)
                              }
                              className="w-full border-gray-300 border-1 rounded-md"
                              color="black"
                            />
                          </div>
                          {pairAnswers.answer2.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removePairAnswer("answer2", index)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : formData.allowSimilarAnswers ? (
                // Hiển thị nhiều options với nút thêm/xóa
                sortedOptions.map(([key, value]) => (
                  <div key={key} className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lựa chọn {key}
                      </label>
                      <Input
                        placeholder={`Nhập lựa chọn ${key}...`}
                        value={value}
                        onChange={(e) =>
                          handleOptionChange(key, e.target.value)
                        }
                        className="w-full border-gray-300 border-1 rounded-md"
                        color="black"
                      />
                    </div>
                    {Object.keys(options).length > MIN_OPTIONS_COUNT && (
                      <Button
                        type="button"
                        onClick={() => removeOption(key)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md mb-2"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                // Hiển thị chỉ 1 ô nhập đáp án
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đáp án
                  </label>
                  <Input
                    placeholder="Nhập đáp án..."
                    value={options.answer || ""}
                    onChange={(e) =>
                      handleOptionChange("answer", e.target.value)
                    }
                    className="w-full border-gray-300 border-1 rounded-md"
                    color="black"
                  />
                </div>
              )}
              {validationErrors.answers && (
                <p className="text-sm text-red-600">
                  {validationErrors.answers}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium"
            >
              {isSubmitting
                ? editQuestion
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : editQuestion
                  ? "Cập nhật câu hỏi"
                  : "Tạo câu hỏi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddQuestionForm;
