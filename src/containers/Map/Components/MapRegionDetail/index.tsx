"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Components
import QuestionModal from "@components/Molecules/Popup/QuestionModal";
import WrongAnswer from "@components/Molecules/Popup/WrongAnswer";
import IncompleteRegion from "@components/Molecules/Popup/IncompleteRegion";
import KyNhanResult, { KyNhan } from "@components/Molecules/Popup/KyNhanResult";

// Services
import userAnswerLogService from "@services/user-answer-log";
import landService from "@services/land";

// Context
import { useUserDataContextSafe } from "@contexts/UserDataContext";

// Types
import type { IUserAnswerLogRequest } from "@models/user-answer-log/request";
import type { IUserSkipQuestionByCoinsRequest } from "@models/user-answer-log/request";
import type { ILandWithUserQuestionResponseModel } from "@models/land/response";
import type { IQuestion } from "@models/question/entity";
import type { IUserAnswerLog } from "@models/user-answer-log/entity";
import CompleteLand from "@components/Molecules/Popup/CompleteLand";

// Extended question type with user answer logs from API response
interface IQuestionWithUserLogs extends IQuestion {
  userAnswerLogs?: Array<{
    id: number;
    text: string[];
    isCorrect: boolean;
  }>;
}

// Constants
const DEBUG_HOTSPOTS = false;

// Types for component state
interface KyNhanResultData {
  summary: string;
  points: number;
}

interface ModalState {
  isQuestionModalOpen: boolean;
  isWrongAnswerModalOpen: boolean;
  isKyNhanResultModalOpen: boolean;
  isIncompleteRegionOpen: boolean;
  isSubmittingAnswer: boolean;
}

export default function FixedScrollsPageResponsive({
  slug,
  backgroundImage,
  scrollPositions,
  landId,
  questions: questionsWithUser,
  answeredQuestionIds,
}: ICOMPONENTS.MapRegionDetailProps) {
  const router = useRouter();
  
  // Get user data context for refreshing user data after actions
  const context = useUserDataContextSafe();
  const refreshUserData = context?.refreshUserData || null;

  // Modal states
  const [modalState, setModalState] = useState<ModalState>({
    isQuestionModalOpen: false,
    isWrongAnswerModalOpen: false,
    isKyNhanResultModalOpen: false,
    isIncompleteRegionOpen: false,
    isSubmittingAnswer: false,
  });

  // Data states
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestionWithUserLogs | null>(null);
  const [questions, setQuestions] = useState<IQuestionWithUserLogs[]>(questionsWithUser || []);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set(answeredQuestionIds || [])
  );
  const [kyNhanSummaries, setKyNhanSummaries] = useState<KyNhan[]>([]);
  const [kyNhanResultData, setKyNhanResultData] = useState<KyNhanResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [landData, setLandData] = useState<ILandWithUserQuestionResponseModel['data'] | null>(null);

  // Modal handlers
  const updateModalState = useCallback((updates: Partial<ModalState>) => {
    setModalState(prev => ({ ...prev, ...updates }));
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isQuestionModalOpen: false,
      isWrongAnswerModalOpen: false,
      isKyNhanResultModalOpen: false,
      isIncompleteRegionOpen: false,
    }));
    setSelectedQuestion(null);
  }, []);

  const openIncompleteRegion = useCallback(() => {
    updateModalState({ isIncompleteRegionOpen: true });
  }, [updateModalState]);

  // Helper functions
  const checkStartDate = useCallback((startDate: Date | string | null | undefined) => {
    if (!startDate) return true;

    const date = startDate instanceof Date ? startDate : new Date(startDate);
    const currentDate = new Date();

    if (currentDate < date) {
      toast.warning(
        `Khu vực này sẽ được mở vào ngày ${date.toLocaleDateString('vi-VN')}`
      );
      return false;
    }
    return true;
  }, []);

  const extractAnsweredQuestionIds = useCallback((questions: IQuestionWithUserLogs[]): number[] => {
    return questions
      .filter(question =>
        question.userAnswerLogs?.some(log => log.isCorrect === true)
      )
      .map(question => question.id);
  }, []);

  // API fetch effect
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!landId) return;

    let isMounted = true;

    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await landService.getQuestionsWithUser(landId) as ILandWithUserQuestionResponseModel;

        if (!isMounted) return;

        if (response?.statusCode === 409) {
          setResponseMessage(response.message || null);
          openIncompleteRegion();
          return;
        }

        if (response?.statusCode === 200 && response?.data) {
          setLandData(response.data);

          // Check start date
          if (!checkStartDate(response.data.startDate)) {
            return;
          }

          setQuestions(response.data.questions as IQuestionWithUserLogs[] || []);

          const answeredIds = extractAnsweredQuestionIds(response.data.questions as IQuestionWithUserLogs[] || []);
          setAnsweredQuestions(new Set(answeredIds));
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching questions:', error);
          toast.error('Có lỗi xảy ra khi tải dữ liệu khu vực.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [landId, checkStartDate, extractAnsweredQuestionIds, openIncompleteRegion]);

  // Optimized helper functions
  const isQuestionAnswered = useCallback((question: IQuestionWithUserLogs) => {
    return question?.userAnswerLogs?.some(log => log.isCorrect === true) ?? false;
  }, []);

  const getPreviousAnswer = useCallback((question: IQuestionWithUserLogs) => {
    const correctAnswer = question?.userAnswerLogs?.find(log => log.isCorrect === true);
    return correctAnswer?.text?.[0] || "";
  }, []);

  const transformKyNhanSummaries = useCallback((summaries: IQuestion['kynhanSummaries']): KyNhan[] => {
    return summaries?.map(summary => ({
      id: summary.kyNhanId, // Use kyNhanId instead of summary.id
      src: summary.imgUrl,
      alt: `Kỳ nhân ${summary.kyNhanId}`,
      name: `Kỳ nhân ${summary.kyNhanId}`,
    })) ?? [];
  }, []);

  // Optimized scroll click handler
  const handleScrollClick = useCallback((scrollIndex: number) => {
    const question = questions[scrollIndex];

    if (!question) {
      toast.warning(`Không tìm thấy câu hỏi với index: ${scrollIndex}`);
      return;
    }

    const isAnswered = isQuestionAnswered(question) || answeredQuestions.has(question.id);
    const hasKyNhanSummaries = question.kynhanSummaries?.length > 0;

    setSelectedQuestion(question);

    if (isAnswered && hasKyNhanSummaries) {
      const transformedKyNhan = transformKyNhanSummaries(question.kynhanSummaries);
      setKyNhanSummaries(transformedKyNhan);
      setKyNhanResultData({
        summary: question.kynhanSummaries[0]?.summary ||
          "Bạn đã trả lời đúng và thu thập được kỳ ấn của kỳ nhân này.",
        points: question.point || 0,
      });
      updateModalState({ isKyNhanResultModalOpen: true });
    } else {
      updateModalState({ isQuestionModalOpen: true });
    }
  }, [questions, isQuestionAnswered, answeredQuestions, transformKyNhanSummaries, updateModalState]);

  // Optimized question submit handler
  const handleQuestionSubmit = useCallback(async (text: string[], questionId: number) => {
    if (!selectedQuestion || text.length === 0) return;

    updateModalState({ isSubmittingAnswer: true });

    try {
      const requestData: IUserAnswerLogRequest = {
        questionId,
        text,
      };

      const response = await userAnswerLogService.answerQuestion(requestData);

      if (response?.statusCode && [200, 201].includes(response.statusCode) && response.data) {
        if (response.data.isCorrect) {
          toast.success("Chính xác! Bạn đã trả lời đúng.");

          setAnsweredQuestions(prev => new Set([...prev, selectedQuestion.id]));

          // Refresh user data to update points/hearts after correct answer
          if (refreshUserData) {
            await refreshUserData();
          }

          // Check if this completes the land
          if (response.data.isCompletedLand) {
            updateModalState({ isQuestionModalOpen: false });
            setIsCompleteLand(true);
            setSelectedQuestion(null);
            return;
          }

          // Show KyNhan result if summaries exist
          if (selectedQuestion.kynhanSummaries?.length > 0) {
            const transformedKyNhan = transformKyNhanSummaries(selectedQuestion.kynhanSummaries);
            setKyNhanSummaries(transformedKyNhan);
            setKyNhanResultData({
              summary: selectedQuestion.kynhanSummaries[0]?.summary ||
                "Bạn đã trả lời đúng và thu thập được kỳ ấn của kỳ nhân này.",
              points: selectedQuestion.point || 0,
            });
            updateModalState({
              isKyNhanResultModalOpen: true,
              isQuestionModalOpen: false
            });
          } else {
            updateModalState({ isQuestionModalOpen: false });
          }
          setSelectedQuestion(null);
        } else {
          // Refresh user data even for wrong answers to update hearts/points
          if (refreshUserData) {
            await refreshUserData();
          }

          updateModalState({
            isQuestionModalOpen: false,
            isWrongAnswerModalOpen: true
          });
        }
      } else {
        toast.error(response?.message || "Có lỗi xảy ra khi gửi câu trả lời.");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại.");
    } finally {
      updateModalState({ isSubmittingAnswer: false });
    }
  }, [selectedQuestion, transformKyNhanSummaries, updateModalState, refreshUserData]);

  // Optimized modal handlers
  const handleCloseModal = useCallback(() => {
    updateModalState({ isQuestionModalOpen: false });
    setSelectedQuestion(null);
  }, [updateModalState]);

  const [isCompleteLand, setIsCompleteLand] = useState(false);
  const handleCloseCompleteLand = useCallback(() => {
    setIsCompleteLand(false);
  }, [setIsCompleteLand]);

  const handleCloseWrongAnswerModal = useCallback(() => {
    updateModalState({ isWrongAnswerModalOpen: false });
  }, [updateModalState]);

  const handleRetryAnswer = useCallback(() => {
    updateModalState({
      isWrongAnswerModalOpen: false,
      isQuestionModalOpen: true
    });
  }, [updateModalState]);

  const handleCloseKyNhanResult = useCallback(() => {
    updateModalState({ isKyNhanResultModalOpen: false });
    setKyNhanSummaries([]);
    setKyNhanResultData(null);
    setSelectedQuestion(null);
  }, [updateModalState]);

  const handleGoToLibrary = useCallback(() => {
    const firstKyNhanId = kyNhanSummaries[0]?.id;
    if (firstKyNhanId) {
      router.replace(`/library?search=${firstKyNhanId}`);
    } else {
      router.replace("/library");
    }
  }, [kyNhanSummaries, router]);

  const handleCloseIncompleteRegion = useCallback(() => {
    updateModalState({ isIncompleteRegionOpen: false });
  }, [updateModalState]);

  // Optimized handleUseCoins function
  const handleUseCoins = useCallback(async (questionId: number) => {
    if (!questionId) {
      toast.error("Không tìm thấy ID câu hỏi");
      return;
    }

    const previousAnsweredQuestions = answeredQuestions;
    setAnsweredQuestions(prev => new Set([...prev, questionId]));

    try {
      const requestData: IUserSkipQuestionByCoinsRequest = { questionId };
      const response = await userAnswerLogService.skipQuestionByCoins(requestData);

      if (response?.statusCode && [200, 201].includes(response.statusCode) && response.data) {
        toast.success("Đã sử dụng 500 xu để vượt qua câu hỏi");

        // Refresh user data to update coins after using coins to skip
        if (refreshUserData) {
          await refreshUserData();
        }

        // Check if this completes the land
        if (response.data.isCompletedLand) {
          updateModalState({ isWrongAnswerModalOpen: false });
          setIsCompleteLand(true);
          setSelectedQuestion(null);
          return;
        }

        const skippedQuestion = questions.find(q => q.id === questionId);
        if (skippedQuestion && skippedQuestion.kynhanSummaries && skippedQuestion.kynhanSummaries.length > 0) {
          const transformedKyNhan = transformKyNhanSummaries(skippedQuestion.kynhanSummaries);
          setKyNhanSummaries(transformedKyNhan);
          setKyNhanResultData({
            summary: skippedQuestion.kynhanSummaries[0]?.summary ||
              "Bạn đã sử dụng xu để vượt qua và thu thập được kỳ ấn của kỳ nhân này.",
            points: skippedQuestion.point || 0,
          });
          setSelectedQuestion(skippedQuestion);
          updateModalState({ isKyNhanResultModalOpen: true });
        }
        updateModalState({ isWrongAnswerModalOpen: false });
      } else {
        setAnsweredQuestions(previousAnsweredQuestions);
        toast.error(response?.message || "Có lỗi xảy ra khi sử dụng xu để vượt qua câu hỏi.");
      }
    } catch (error) {
      setAnsweredQuestions(previousAnsweredQuestions);
      console.error("Error skipping question with coins:", error);
      toast.error("Có lỗi xảy ra khi sử dụng xu. Vui lòng thử lại.");
    }
  }, [questions, answeredQuestions, transformKyNhanSummaries, updateModalState, refreshUserData]);

  // Memoized values for optimization
  const isQuestionModalAnswered = useMemo(() =>
    selectedQuestion ? answeredQuestions.has(selectedQuestion.id) : false,
    [selectedQuestion, answeredQuestions]
  );

  const scrollPositionsToRender = useMemo(() =>
    scrollPositions?.slice(0, questions.length) ?? [],
    [scrollPositions, questions.length]
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#f0e8d8]">
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Region background"
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
      {/* Chỉ hiển thị ở nửa dưới màn hình */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] overflow-hidden z-10">
        {/* Background layer với ảnh các cuộn giấy để làm mẫu định vị */}
        {/* <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="/Các cuộn giấy.png"
            alt="Background scroll papers template"
            fill
            className="object-contain"
            priority
          />
        </div> */}
        {/* <KyNhanResult isOpen={true} onClose={() => {}} title="Kết quả" content="Bạn đã trả lời đúng." points={100} kyNhan={[]} /> */}

        {/* Wrapper 50vh: mọi toạ độ top/left tính trong nửa dưới */}
        <div className="relative w-full h-full z-10">
          {scrollPositionsToRender.map(
            (pos: ICOMPONENTS.ScrollPosition, idx: number) => {
              const question = questions[idx];
              const isAnswered = question
                ? isQuestionAnswered(question) || answeredQuestions.has(question.id)
                : false;

              return (
                <motion.div
                  key={idx}
                  // ⭐ THAY ĐỔI CHÍNH: Kích thước responsive, không còn h-auto
                  className="absolute drop-shadow-[0_6px_6px_rgba(0,0,0,0.25)] w-[28vw] sm:w-[160px] md:w-[200px] lg:w-[240px]"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    // transform: `rotate(${pos.rotate})`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 },
                  }}
                >
                  {/* ⭐ THAY ĐỔI CHÍNH: Container của ảnh giờ có tỷ lệ khung hình cố định */}
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: "180 / 70" }}
                  >
                    <Image
                      src="https://res.cloudinary.com/dznt9yias/image/upload/v1761067482/cuo%CC%A3%CC%82n_gia%CC%82%CC%81y_cuo%CC%A3%CC%82n_la%CC%A3i_d9ppcc.svg"
                      alt={`Cuộn giấy ${idx + 1}`}
                      fill
                      className="object-contain pointer-events-none select-none"
                      sizes="(max-width: 640px) 28vw, (max-width: 768px) 160px, (max-width: 1024px) 200px, 240px"
                      priority
                    />

                    <button
                      aria-label={`Vị trí cuộn giấy ${idx + 1}`}
                      className={`absolute inset-0 cursor-pointer ${DEBUG_HOTSPOTS
                        ? "border-2 border-red-500/70 bg-red-500/10 hover:bg-red-500/20"
                        : "bg-transparent"
                        }`}
                      onClick={() => handleScrollClick(idx)}
                    />

                    {DEBUG_HOTSPOTS && (
                      <span className="absolute -top-3 -left-3 text-xs font-bold text-red-600 bg-white/80 px-1 rounded z-10">
                        {idx + 1}
                      </span>
                    )}

                    {/* Trạng thái câu hỏi */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div
                        className={`rounded-full shadow-lg border flex items-center justify-center
                       w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] md:w-[32px] md:h-[32px] lg:w-[36px] lg:h-[36px] xl:w-[40px] xl:h-[40px]
                       ${isAnswered
                            ? "bg-green-500 border-green-600"
                            : "bg-white/95 border-gray-300"
                          }`}
                      >
                        {isAnswered ? (
                          <Check className="w-[16px] h-[16px] sm:w-[17px] sm:h-[17px] md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px] xl:w-[22px] xl:h-[22px] text-white" />
                        ) : (
                          <Circle className="w-[16px] h-[16px] sm:w-[17px] sm:h-[17px] md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px] xl:w-[22px] xl:h-[22px] text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Không cần lock icon nữa - tất cả đều có thể click */}
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </div>

      {/* Question Modal */}
      <QuestionModal
        question={selectedQuestion ? {
          ...selectedQuestion,
          userAnswerLogs: selectedQuestion.userAnswerLogs?.map(log => ({
            id: log.id,
            isCorrect: log.isCorrect,
            text: Array.isArray(log.text) ? log.text.join(' ') : log.text,
          }))
        } : null}
        isOpen={modalState.isQuestionModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleQuestionSubmit}
        isSubmitting={modalState.isSubmittingAnswer}
        isAnswered={isQuestionModalAnswered}
      />

      {/* Wrong Answer Modal */}
      <WrongAnswer
        isOpen={modalState.isWrongAnswerModalOpen}
        onClose={handleCloseWrongAnswerModal}
        onRetry={handleRetryAnswer}
        onUseCoins={handleUseCoins}
        questionId={selectedQuestion?.id}
        coinCost={500}
        penaltyPoints={20}
      />

      {/* KyNhanResult Modal */}
      <KyNhanResult
        isOpen={modalState.isKyNhanResultModalOpen}
        onClose={handleCloseKyNhanResult}
        title="Bạn đã tìm ra danh tính của vị Kỳ Nhân này. Bạn được cộng 100 điểm."
        content={
          kyNhanResultData?.summary ||
          "Bạn đã trả lời đúng và thu thập được kỳ ấn của kỳ nhân này."
        }
        points={kyNhanResultData?.points}
        kyNhan={kyNhanSummaries}
        onGoToLibrary={handleGoToLibrary}
      />

      {/* IncompleteRegion Modal */}
      <IncompleteRegion
        isOpen={modalState.isIncompleteRegionOpen}
        onClose={handleCloseIncompleteRegion}
        message={responseMessage || null}
      />

      <CompleteLand
        isOpen={isCompleteLand}
        onClose={handleCloseCompleteLand}
        land={slug || ''}
      />
    </main >
  );
}
