"use client";

import { Input } from "@components/Atoms/ui/input";
import ModalBackdrop from "../../../Atoms/ModalBackdrop";
import InputAnswer from "../InputAnswer";
import { Button } from "@components/Atoms/ui/button";
import { useState, useCallback } from "react";
import rewardService from "@services/reward";
import { useUserDataContextSafe } from "@contexts/UserDataContext";
import CorrectGiftCode from "../CorrectGiftCode";
import IncorrectGiftCode from "../IncorrectGiftCode";
import LimitGiftCode from "../LimitGiftCode";

export default function InputGiftCode({
  isOpen,
  onClose,
}: ICOMPONENTS.CommonModalProps) {
  const [giftCode, setGiftCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [showIncorrectModal, setShowIncorrectModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(500);

  // Get user data context for synchronization with GameFrame
  const context = useUserDataContextSafe();
  const refreshUserData = context?.refreshUserData || null;

  // Helper function to determine which modal to show based on error message
  const determineErrorModal = useCallback(
    (errorMessage: string, statusCode?: number) => {
      const message = errorMessage.toLowerCase();

      // Check for limit/exhausted related messages
      if (
        message.includes("limit") ||
        message.includes("hết") ||
        message.includes("đã sử dụng") ||
        message.includes("exhausted") ||
        message.includes("quota") ||
        message.includes("usage") ||
        message.includes("thưởng đã hết hạn") ||
        message.includes("hết hạn") ||
        message.includes("giới hạn thưởng đã vượt")
      ) {
        return "limit";
      }

      // Check for invalid/incorrect code messages
      if (
        message.includes("invalid") ||
        message.includes("sai") ||
        message.includes("không hợp lệ") ||
        message.includes("not found") ||
        message.includes("không tìm thấy") ||
        message.includes("mã đổi thưởng không hợp lệ")
      ) {
        return "incorrect";
      }

      // Default to incorrect for unknown errors
      return "incorrect";
    },
    []
  );

  // Handle modal close for result modals
  const handleResultModalClose = useCallback(() => {
    setShowCorrectModal(false);
    setShowIncorrectModal(false);
    setShowLimitModal(false);
    setGiftCode(""); // Reset form when closing any result modal
    onClose(); // Close the main input modal
  }, [onClose]);

  const handleRedeemGiftCode = useCallback(async () => {
    if (!giftCode.trim()) {
      setShowIncorrectModal(true);
      return;
    }

    try {
      setIsLoading(true);

      const response: any = await rewardService.redeemGiftCode(giftCode.trim());

      if (response && response.statusCode === 200) {
        // Extract reward amount from response if available
        if (response.data?.coinsReward) {
          setRewardAmount(response.data.coinsReward);
        }

        // Close input modal and show success modal
        setShowCorrectModal(true);

        // Synchronize user data with GameFrame
        if (refreshUserData) {
          await refreshUserData();
        }
      } else {
        // Determine which error modal to show based on response
        const errorMessage =
          response?.message || "Code không hợp lệ hoặc đã được sử dụng";
        const modalType = determineErrorModal(
          errorMessage,
          response?.statusCode
        );

        if (modalType === "limit") {
          setShowLimitModal(true);
        } else {
          setShowIncorrectModal(true);
        }
      }
    } catch (error: any) {
      console.error("Error redeeming gift code:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi đổi code. Vui lòng thử lại.";

      const modalType = determineErrorModal(
        errorMessage,
        error?.response?.status
      );

      if (modalType === "limit") {
        setShowLimitModal(true);
      } else {
        setShowIncorrectModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [giftCode, refreshUserData, determineErrorModal]);

  const handleEnter = useCallback(() => {
    if (!isLoading && giftCode.trim()) {
      handleRedeemGiftCode();
    }
  }, [handleRedeemGiftCode, isLoading, giftCode]);

  return (
    <>
      {/* Main Input Modal - only show when open and no result modals are showing */}
      <ModalBackdrop
        isOpen={
          isOpen && !showCorrectModal && !showIncorrectModal && !showLimitModal
        }
        onClose={onClose}
      >
        {/* Content */}
        <div className="text-center">
          <h3 className="text-secondary text-2xl sm:text-3xl md:text-4xl font-extrabold">
            NHIỆM VỤ
          </h3>

          <p className="mt-3 text-secondary text-base sm:text-lg md:text-xl leading-relaxed font-extrabold">
            Hãy nhập mật mã để nhận ngay {rewardAmount} xu.
          </p>

          <div className="mt-3 w-full flex justify-center">
            <InputAnswer
              placeholder="Nhập code..."
              value={giftCode}
              onChange={(value) => {
                setGiftCode(value);
              }}
              onEnter={handleEnter}
              disabled={isLoading}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleRedeemGiftCode}
              disabled={isLoading || !giftCode.trim()}
              isLoading={isLoading}
              className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang xử lý..." : "Đổi Code"}
            </Button>
          </div>
        </div>
      </ModalBackdrop>

      {/* Result Modals */}
      <CorrectGiftCode
        isOpen={showCorrectModal}
        onClose={handleResultModalClose}
        coinsReward={rewardAmount}
      />

      <IncorrectGiftCode
        isOpen={showIncorrectModal}
        onClose={handleResultModalClose}
        coinsReward={rewardAmount}
      />

      <LimitGiftCode
        isOpen={showLimitModal}
        onClose={handleResultModalClose}
        coinsReward={rewardAmount}
      />
    </>
  );
}
