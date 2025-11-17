"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAnswersSelector,
  useSetAnswer,
  useClearStorage,
} from "@/stores/entry-test/selectors";
import { Progress } from "@/components/Atoms/ui/progress";
import { ROUTES } from "@routes";
import { ITestHome } from "@models/test-home/entity";
import { TEST_ANSWER } from "@constants/test-answer";
import userTestHomeService from "@services/user-test-home";
import { toast } from "react-toastify";

// --- DỮ LIỆU THỰC TỪ API ---
// Sử dụng dữ liệu từ testHome prop thay vì hardcode

// Mapping từ API response sang UI display - Memoized for performance
const ANSWER_OPTIONS = [
  {
    id: 1,
    text: "Hoàn toàn không đồng ý",
    color: "EF493D",
    borderColor: "EF493D",
    apiValue: TEST_ANSWER.ANSWER_SCALE_TYPE.STRONGLY_DISAGREE,
  },
  {
    id: 2,
    text: "Không đồng ý",
    color: "F08D63",
    borderColor: "F08D63",
    apiValue: TEST_ANSWER.ANSWER_SCALE_TYPE.DISAGREE,
  },
  {
    id: 3,
    text: "Trung lập",
    color: "DD9800",
    borderColor: "FDBC44",
    apiValue: TEST_ANSWER.ANSWER_SCALE_TYPE.NEUTRAL,
  },
  {
    id: 4,
    text: "Đồng ý",
    color: "A5C53E",
    borderColor: "A5C53E",
    apiValue: TEST_ANSWER.ANSWER_SCALE_TYPE.AGREE,
  },
  {
    id: 5,
    text: "Hoàn toàn đồng ý",
    color: "00A63E",
    borderColor: "41821E",
    apiValue: TEST_ANSWER.ANSWER_SCALE_TYPE.STRONGLY_AGREE,
  },
] as const;

// --- COMPONENT CON: TRANG MỞ ĐẦU ---
const IntroComponent = React.memo(
  ({ onStartTest }: { onStartTest: () => void }) => (
    <div
      className="w-full max-w-2xl mx-auto bg-amber-200/50 border-3 border-[#835D26] 
  rounded-2xl p-6 text-center shadow-lg animate-fade-in"
    >
      <p className="text-[#835D26] text-lg font-bold mb-6 leading-relaxed">
        Trước khi bước vào Kỳ Giới để KHAI NHÂN MỞ ẤN, Kỳ Chủ hãy tham gia nghi
        thức Tìm Thần Bảo Hộ. Chỉ thông qua một bài kiểm tra nho nhỏ, khí chất
        của Kỳ Chủ sẽ được tự động kết nối với vị thần phù hợp trong Tứ Bất Tử
        để soi đường chỉ lối xuyên suốt hành trình.
      </p>
      <div className="flex items-center justify-center">
        <button
          onClick={onStartTest}
          className="cursor-pointer relative flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{ width: "180px", height: "50px" }}
        >
          <Image
            src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763389725/Rectangle_znlllq.png"
            alt="Tiếp tục"
            fill
            style={{ objectFit: "contain" }}
            className="absolute"
          />
          <p className="relative z-10 text-[#835D26] font-bold">Tiếp tục</p>
        </button>
      </div>
    </div>
  )
);

// --- COMPONENT CON: MÀN HÌNH CÂU HỎI ---
const QuestionComponent = React.memo(
  ({
    question,
    currentStep,
    totalQuestions,
    onNext,
    onBack,
    selectedAnswer,
    showSaved,
    progressPulse,
  }: {
    question: { id: number; text: string };
    currentStep: number;
    totalQuestions: number;
    onNext: (answerId: number) => void;
    onBack: () => void;
    selectedAnswer?: number;
    showSaved?: boolean;
    progressPulse?: boolean;
  }) => {
    const currentSelected = selectedAnswer ?? null;
    const [clickedId, setClickedId] = useState<number | null>(null);
    const [isFlashing, setIsFlashing] = useState(false);
    const [optionsDisabled, setOptionsDisabled] = useState(false);

    // Re-enable options whenever the question (step) changes, including when going back
    useEffect(() => {
      setOptionsDisabled(false);
      setClickedId(null);
      setIsFlashing(false);
    }, [currentStep]);

    const handleClick = useCallback(
      (answerId: number) => {
        if (optionsDisabled) return;
        setOptionsDisabled(true);
        setClickedId(answerId);
        setIsFlashing(true);
        setTimeout(() => {
          setIsFlashing(false);
          onNext(answerId);
          setClickedId(null);
        }, 200);
      },
      [optionsDisabled, onNext]
    );

    return (
      <div
        className="w-full max-w-4xl mx-auto border-3 bg-amber-200/50 border-[#835D26] 
    rounded-3xl p-8 shadow-lg animate-fade-in relative"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="font-bold text-[#835D26] text-lg whitespace-nowrap">
            Câu hỏi {currentStep}/{totalQuestions}
          </span>
          <div>
            <Progress
              value={(currentStep / totalQuestions) * 100}
              className={`w-72 h-2 bg-transparent border border-[#835D26] rounded-full shadow-inner [&>div]:bg-[#835D26] [&>div]:rounded-full [&>div]:transition-all [&>div]:duration-500 ${progressPulse ? "[&>div]:animate-pulse" : ""
                }`}
            />
          </div>
          <button
            onClick={onBack}
            className="cursor-pointer text-[#835D26] font-bold text-2xl hover:scale-105 rounded-full w-16 h-16 flex items-center justify-center"
          >
            <Image src="/Return 1.svg" alt="Quay lại" width={72} height={72} />
          </button>
        </div>
        {showSaved && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-white/80 border border-green-500 text-green-700 rounded-full px-3 py-1 shadow-sm">
            <span className="text-green-600">✔</span>
            <span className="text-xs font-semibold">Đã lưu</span>
          </div>
        )}

        {/* Question Text */}
        <p className="text-center text-2xl text-[#835D26] font-extrabold my-12 leading-relaxed">
          {question.text}
        </p>

        {/* Answer Options */}
        <div className="flex justify-center items-end gap-10 my-12">
          {ANSWER_OPTIONS.map((option, index) => (
            <div key={option.id} className="flex flex-col items-center w-24">
              {/* Label above the box */}
              <div
                className={`text-sm font-medium mb-3 text-center leading-tight max-w-[110px] h-10 flex items-end justify-center ${option.id === 2 || option.id === 4 ? "opacity-0" : ""
                  }`}
                style={{ color: `#${option.color}` }}
              >
                {option.text}
              </div>
              {/* Selection box */}
              <button
                onClick={() => handleClick(option.id)}
                disabled={optionsDisabled}
                className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${optionsDisabled ? `opacity-60 cursor-not-allowed` : ``
                  } ${currentSelected === option.id || clickedId === option.id
                    ? `shadow-md scale-110`
                    : `bg-white ${optionsDisabled ? `` : `hover:shadow-md hover:scale-105`
                    }`
                  }`}
                style={{ borderColor: `#${option.borderColor}` }}
              >
                {(currentSelected === option.id || clickedId === option.id) && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      className={`w-6 h-6 rounded ${isFlashing && clickedId === option.id ? "ring-2" : ""
                        }`}
                      style={{
                        backgroundColor: `#${option.borderColor}`,
                        boxShadow:
                          isFlashing && clickedId === option.id
                            ? `0 0 0 3px #${option.borderColor}55`
                            : undefined,
                      }}
                    ></div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

// --- COMPONENT CHÍNH (ROUTE) ---
export default function EntryTestPage({ testHome }: { testHome: ITestHome[] }) {
  // Memoize questions and total questions for performance
  const questions = useMemo(() => testHome || [], [testHome]);
  const TOTAL_QUESTIONS = useMemo(() => questions.length, [questions]);

  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1-TOTAL_QUESTIONS = questions
  const answers = useAnswersSelector();
  const setAnswer = useSetAnswer();
  const clearStorage = useClearStorage();
  const [showSaved, setShowSaved] = useState(false);

  // Store is already persisted; no manual hydration needed

  const handleStartTest = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const handleNextQuestion = useCallback(
    (answerId: number) => {
      setAnswer(currentStep, answerId);
      setShowSaved(true);

      // Save answer to backend (non-blocking)
      const currentQuestion = questions[currentStep - 1];
      const selectedOption = ANSWER_OPTIONS?.find((opt) => opt.id === answerId);
      const apiAnswer = selectedOption?.apiValue;

      if (currentQuestion && apiAnswer) {
        (async () => {
          try {
            const res = await userTestHomeService.saveAnswer({
              questionId: currentQuestion.id,
              answer: apiAnswer,
            });
          } catch (error) {
            console.error("Failed to save user test answer", error);
            toast.error("Không thể lưu câu trả lời. Vui lòng thử lại.");
          }
        })();
      }

      if (currentStep < TOTAL_QUESTIONS) {
        // small delay to allow flash/tick feedback
        setTimeout(() => setCurrentStep(currentStep + 1), 1000);
      } else {
        // Clear localStorage when test is completed
        clearStorage();
        // BE handles final scoring and result; just navigate to result page
        if (typeof window !== "undefined") {
          window.location.href = ROUTES.STARTER.PERSONALITY_RESULT;
        }
      }
    },
    [currentStep, questions, setAnswer, TOTAL_QUESTIONS, clearStorage]
  );

  useEffect(() => {
    if (!showSaved) return;
    const id = setTimeout(() => setShowSaved(false), 1000);
    return () => clearTimeout(id);
  }, [showSaved]);

  const handleBackQuestion = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const renderContent = useMemo(() => {
    if (currentStep === 0) {
      return <IntroComponent onStartTest={handleStartTest} />;
    }
    if (currentStep > 0 && currentStep <= TOTAL_QUESTIONS) {
      const currentQuestion = questions[currentStep - 1]; // API data is 0-indexed, but our steps are 1-indexed
      if (!currentQuestion) return null;

      return (
        <QuestionComponent
          question={{
            id: currentQuestion.id || currentStep,
            text: currentQuestion.text || "",
          }}
          currentStep={currentStep}
          totalQuestions={TOTAL_QUESTIONS}
          onNext={handleNextQuestion}
          onBack={handleBackQuestion}
          selectedAnswer={answers[currentStep]}
          showSaved={showSaved}
          progressPulse={showSaved}
        />
      );
    }
    // You can render a result component here
    return <div className="text-white text-2xl">Hoàn thành bài test!</div>;
  }, [
    currentStep,
    TOTAL_QUESTIONS,
    questions,
    handleStartTest,
    handleNextQuestion,
    handleBackQuestion,
    answers,
    showSaved,
  ]);

  // Safety check for empty testHome data
  if (!testHome || testHome.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div
          className="w-full max-w-2xl mx-auto bg-amber-200/50 border-3 border-[#835D26] 
        rounded-2xl p-6 text-center shadow-lg"
        >
          <p className="text-[#835D26] text-lg font-bold mb-6">
            Không có dữ liệu câu hỏi. Vui lòng thử lại sau.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Sử dụng key để trigger animation mỗi khi step thay đổi */}
      <div key={currentStep} className="w-full">
        {renderContent}
      </div>
    </main>
  );
}
