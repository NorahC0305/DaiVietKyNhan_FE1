"use client";

import React from "react";
import Image from "next/image";
import ModalBackdrop from "../../../Atoms/ModalBackdrop";
import ButtonImage from "../../../Atoms/ButtonImage";
import { getCurrentVietnamTime } from "@/utils/ReleaseDateUtils";

export type LetterGuideProps = {
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onBack?: () => void;
};

const LetterGuide: React.FC<LetterGuideProps> = ({ isOpen, onClose, onNext, onBack }) => {
  // Check if current date is after October 27th, 2024
  const isParticipationEnabled = () => {
    const currentDate = getCurrentVietnamTime();
    const targetDate = new Date(2024, 9, 27); // October 27, 2024 (month is 0-indexed)
    return currentDate >= targetDate;
  };

  const handleParticipate = () => {
    if (onNext) {
      onNext();
      return;
    }
    onClose();
  };

  const handleViewLetters = () => {
    if (onBack) {
      onBack();
      return;
    }
    onClose();
  };
  return (
    <ModalBackdrop
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="relative mx-2 sm:mx-3 md:mx-4 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[900px] xl:max-w-[1000px]"
      cardClassName="relative bg-primary-light border-4 border-secondary rounded-xl sm:rounded-2xl my-2 sm:my-4 md:my-6 lg:my-8 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8"
    >
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-y-auto">
        <div className="max-w-8xl mx-auto">
          {/* Header Section - Responsive và centered */}
          <div className="flex flex-col items-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            {/* Title - Responsive text sizing */}
            <div className="text-center px-2">
              <h1 className="font-bd-street-sign text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl text-secondary global leading-tight">
                LÁ THƯ GỬI KỲ NHÂN - TÂM SỰ TỪ HẬU THẾ
              </h1>
            </div>

            {/* Banner - Responsive sizing */}
            <div className="flex-shrink-0 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-xl mx-auto mt-3 sm:mt-4 md:mt-6">
              <div className="relative aspect-[26/9] w-full">
                <Image
                  src="https://res.cloudinary.com/dznt9yias/image/upload/v1761020824/Group_101_cv70mj.svg"
                  alt="Khung chứa thông điệp"
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 400px"
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Content Grid - Fully responsive layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 items-start">
            {/* Left Content - Text content */}
            <div className="col-span-1 md:col-span-3 space-y-2 sm:space-y-3 md:space-y-4">
              <div className="text-secondary space-y-2 sm:space-y-3 md:space-y-4">
                <p className="text-xs sm:text-sm md:text-base leading-relaxed text-left px-1">
                  Giữa nhịp sống của hiện tại, những dòng chữ được viết ra như
                  lời nhắn gửi vượt qua lớp bụi thời gian, tìm đến nơi linh hồn
                  các Kỳ Nhân để tỏ bày cảm xúc.
                </p>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed text-left px-1">
                  Đó có thể là một lời tri ân, một câu hỏi chưa từng được thốt,
                  hay chỉ là niềm cảm mến dành cho những con người đã khắc tên
                  mình vào lịch sử.
                </p>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed text-left px-1">
                  LÁ THƯ GỬI KỲ NHÂN mở ra để những suy tư ấy được cất thành lời
                  – một cuộc đối thoại giữa quá khứ và hiện tại, giữa con chữ và
                  ký ức.
                </p>
              </div>
            </div>

            {/* Right Content - Scrolls image */}
            <div className="col-span-1 md:col-span-2 flex justify-center md:justify-end items-start pt-3 sm:pt-4 md:pt-0 px-2">
              <div className="relative w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[280px]">
                <Image
                  src="https://res.cloudinary.com/dznt9yias/image/upload/v1760861352/FA25MC15_SLIDE_1_1_gby9iz.svg"
                  alt="Letter Guide"
                  width={280}
                  height={280}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 640px) 200px, (max-width: 768px) 220px, (max-width: 1024px) 240px, 280px"
                />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-center mt-6 sm:mt-8 gap-3 sm:gap-4">
            <button
              onClick={handleParticipate}
              className="relative overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer px-6 sm:px-8 py-3 sm:py-4 min-w-[180px] rounded-xl font-semibold text-lg flex items-center justify-center"
            >
              <ButtonImage width={180} height={48}>
                Tham gia ngay
              </ButtonImage>
            </button>

            <button
              onClick={handleViewLetters}
              className="relative overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer px-6 sm:px-8 py-3 sm:py-4 min-w-[180px] rounded-xl font-semibold text-lg flex items-center justify-center"
            >
              <ButtonImage width={180} height={48}>
                Xem hòm thư
              </ButtonImage>
            </button>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default LetterGuide;
