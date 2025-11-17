"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import InputAnswer from "@components/Molecules/Popup/InputAnswer";
import { Loader2 } from "lucide-react";

export default function QuestionModal({
  question,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  isAnswered = false,
}: ICOMPONENTS.QuestionModalProps) {
  const [answerText, setAnswerText] = useState("");
  const [secondAnswerText, setSecondAnswerText] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);

  // Kiểm tra câu hỏi đã trả lời đúng chưa
  const isQuestionAnswered = (question: any) => {
    return (
      question?.userAnswerLogs &&
      question.userAnswerLogs.length > 0 &&
      question.userAnswerLogs.some((log: any) => log.isCorrect === true)
    );
  };

  // Lấy câu trả lời cũ của người dùng
  const getPreviousAnswer = (question: any) => {
    if (question?.userAnswerLogs && question.userAnswerLogs.length > 0) {
      const correctAnswer = question.userAnswerLogs.find(
        (log: any) => log.isCorrect === true
      );
      const text = correctAnswer?.text;
      // Handle both string and array cases
      if (Array.isArray(text)) {
        return text[0] || "";
      }
      return text || "";
    }
    return "";
  };

  // Lấy 2 câu trả lời cũ của người dùng (cho answerOptionType: "TWO")
  const getPreviousAnswers = (question: any) => {
    if (question?.userAnswerLogs && question.userAnswerLogs.length > 0) {
      const correctAnswers = question.userAnswerLogs.filter(
        (log: any) => log.isCorrect === true
      );

      // Tìm log có text là array với nhiều phần tử (mới)
      const answerWithArray = correctAnswers.find(
        (log: any) => Array.isArray(log.text) && log.text.length > 1
      );

      if (answerWithArray && Array.isArray(answerWithArray.text)) {
        // Nếu có log với array, lấy 2 phần tử đầu
        return {
          firstAnswer: answerWithArray.text[0] || "",
          secondAnswer: answerWithArray.text[1] || "",
        };
      }

      // Fallback: giả sử câu trả lời đầu tiên là answer đầu, câu trả lời thứ 2 là answer thứ 2
      const extractText = (text: any) => {
        if (Array.isArray(text)) {
          return text[0] || "";
        }
        return text || "";
      };

      return {
        firstAnswer: extractText(correctAnswers[0]?.text),
        secondAnswer: extractText(correctAnswers[1]?.text),
      };
    }
    return { firstAnswer: "", secondAnswer: "" };
  };

  // Sử dụng prop isAnswered từ parent thay vì chỉ dựa vào server data
  const isQuestionAnsweredFromServer = question
    ? isQuestionAnswered(question)
    : false;
  const finalIsAnswered = isAnswered || isQuestionAnsweredFromServer;
  const previousAnswer = question ? getPreviousAnswer(question) : "";
  const previousAnswers = question
    ? getPreviousAnswers(question)
    : { firstAnswer: "", secondAnswer: "" };

  // Xác định xem có phải loại TWO không
  const isTwoAnswerType = question?.answerOptionType === "TWO";

  // Helper function to ensure string value
  const ensureString = (value: any): string => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value[0] || "";
    return String(value || "");
  };

  // Set câu trả lời khi modal mở
  useEffect(() => {
    if (isOpen && question && !hasInitialized) {
      if (finalIsAnswered) {
        // Set câu trả lời cũ nếu đã trả lời đúng
        if (isTwoAnswerType) {
          setAnswerText(ensureString(previousAnswers.firstAnswer));
          setSecondAnswerText(ensureString(previousAnswers.secondAnswer));
        } else {
          setAnswerText(ensureString(previousAnswer));
        }
      } else {
        // Reset về rỗng nếu chưa trả lời
        setAnswerText("");
        setSecondAnswerText("");
      }
      setHasInitialized(true);
    } else if (!isOpen) {
      // Reset khi modal đóng
      setHasInitialized(false);
    }
  }, [isOpen, question, hasInitialized]);

  // Cập nhật câu trả lời khi previous answers thay đổi (chỉ khi modal đã mở)
  useEffect(() => {
    if (isOpen && question && hasInitialized && finalIsAnswered) {
      if (isTwoAnswerType) {
        setAnswerText(ensureString(previousAnswers.firstAnswer));
        setSecondAnswerText(ensureString(previousAnswers.secondAnswer));
      } else {
        setAnswerText(ensureString(previousAnswer));
      }
    }
  }, [
    previousAnswer,
    previousAnswers,
    isTwoAnswerType,
    finalIsAnswered,
    isOpen,
    question,
    hasInitialized,
  ]);

  const handleSubmit = () => {
    if (question) {
      // Ensure we have string values before trimming
      const answerTextStr = ensureString(answerText);
      const secondAnswerTextStr = ensureString(secondAnswerText);

      // Kiểm tra validation giống như button disabled logic
      if (
        !answerTextStr.trim() ||
        isSubmitting ||
        (isTwoAnswerType && !secondAnswerTextStr.trim())
      ) {
        return;
      }

      const textArray: string[] = [];

      if (answerTextStr.trim()) {
        textArray.push(answerTextStr.trim());
      }

      if (isTwoAnswerType && secondAnswerTextStr.trim()) {
        textArray.push(secondAnswerTextStr.trim());
      }

      if (textArray.length > 0) {
        onSubmit(textArray, question.id);
      }
    }
  };

  const handleClose = () => {
    setAnswerText("");
    setSecondAnswerText("");
    setHasInitialized(false);
    onClose();
  };

  if (!question) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Dễ";
      case "medium":
        return "Trung bình";
      case "hard":
        return "Khó";
      default:
        return difficulty;
    }
  };

  // Use React Portal to render modal at root level
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal with parchment background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl sm:max-w-5xl mx-2 sm:mx-4"
          >
            {/* Parchment frame container */}
            <div className="relative w-full overflow-hidden">
              {/* Maintain 16:9 aspect ratio and render frame image */}
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/frame1.png"
                  alt="Khung giấy"
                  fill
                  priority
                  sizes="(max-width: 768px) 95vw, (max-width: 1280px) 100vw, 1280px"
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Close button */}
              <button
                className="absolute top-20 right-25 cursor-pointer p-1 sm:p-2 z-10"
                onClick={handleClose}
                aria-label="Đóng"
              >
                <span className="block relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                  <Image
                    src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763391063/Tr%E1%BB%9F_l%E1%BA%A1i_trang_tr%C6%B0%E1%BB%9Bc_t1jpaz.png"
                    alt="Đóng"
                    fill
                    sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
                    style={{ objectFit: "contain" }}
                  />
                </span>
              </button>

              {/* Content overlay INSIDE a safe area (debug border visible) */}
              <div
                className="absolute flex flex-col items-center justify-between py-2 sm:py-4"
                style={{
                  top: "12%",
                  right: "8%",
                  bottom: "15%",
                  left: "8%",
                }}
              >
                {/* Debug border for the safe content region */}
                {/* <div className="absolute inset-0 border-2 border-rose-500/70 pointer-events-none rounded-sm" /> */}

                <div className="w-full max-w-3xl mx-auto text-center space-y-2 sm:space-y-4 overflow-y-auto custom-scrollbar-thin px-2 sm:px-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#835D26] font-bd-street-sign leading-tight">
                    CÂU HỎI
                  </h2>
                  <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mx-auto max-w-full sm:max-w-2xl md:max-w-3xl px-1">
                    {/* {question.text || question.content} */}
                    <div
                      className="leading-relaxed text-lg preview-content"
                      style={{
                        // fontFamily: "Georgia, serif",
                        lineHeight: "1.8",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: question.text || question.content || "",
                      }}
                    />
                  </p>
                </div>

                {/* Answer area using InputAnswer component */}
                <div className="w-full flex flex-col items-center gap-3 sm:gap-4 mt-2 sm:mt-4">
                  {isTwoAnswerType ? (
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full justify-center">
                      <InputAnswer
                        value={answerText}
                        onChange={setAnswerText}
                        disabled={finalIsAnswered}
                        placeholder="Đáp án 1..."
                        autoFocus={!finalIsAnswered}
                        onEnter={handleSubmit}
                      />
                      <InputAnswer
                        value={secondAnswerText}
                        onChange={setSecondAnswerText}
                        disabled={finalIsAnswered}
                        placeholder="Đáp án 2..."
                        onEnter={handleSubmit}
                      />
                    </div>
                  ) : (
                    <InputAnswer
                      value={answerText}
                      onChange={setAnswerText}
                      disabled={finalIsAnswered}
                      autoFocus={!finalIsAnswered}
                      onEnter={handleSubmit}
                    />
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    {finalIsAnswered ? (
                      <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 cursor-pointer bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm sm:text-base"
                      >
                        Đóng
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={
                          !ensureString(answerText).trim() ||
                          isSubmitting ||
                          (isTwoAnswerType &&
                            !ensureString(secondAnswerText).trim())
                        }
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 cursor-pointer bg-[#835D26] text-white rounded-lg font-medium hover:bg-[#835D26]/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
                      >
                        {isSubmitting && <Loader2 className="animate-spin" />}
                        {isSubmitting ? "Đang gửi..." : "Gửi"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
