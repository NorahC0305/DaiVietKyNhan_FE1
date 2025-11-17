"use client";

import React from "react";
import Image from "next/image";
import ModalBackdrop from "../../../Atoms/ModalBackdrop";
import ButtonImage from "../../../Atoms/ButtonImage";
import { getCurrentVietnamTime } from "@/utils/ReleaseDateUtils";
import { createPortal } from "react-dom";
import TrangSuConDoiAiDua from "@components/Atoms/TrangSuConDoiAiDua";

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
  if (typeof window === "undefined") return null;

  return createPortal(
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
              <TrangSuConDoiAiDua />
            </div>
          </div>

          {/* Content Grid - Fully responsive layout */}
          <div className="gap-3 sm:gap-4 md:gap-6 items-start">
            {/* Left Content - Text content */}
            <div className="flex gap-3 sm:gap-4 md:gap-6 items-center">
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <div className="text-secondary space-y-2 sm:space-y-3 md:space-y-4 leading-relaxed">
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
                <div className="relative w-[200px] lg:w-[300px] h-[200px] lg:h-[300px]">
                  <Image
                    src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763392057/FA25MC15_SLIDE_1_1_vltddq.png"
                    alt="Letter Guide"
                    width={280}
                    height={280}
                    className="w-full h-auto object-contain"
                    sizes="(max-width: 640px) 200px, (max-width: 768px) 220px, (max-width: 1024px) 240px, 280px"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-start  px-2 py-4 my-10 bg-[#a4a89d57] rounded-2xl border border-[#aaaaaa]">
              <div className="flex justify-center items-center w-full my-4">
                <h3 className="text-center font-bd-street-sign text-3xl lg:text-4xl text-[#CE7346]">Cách tham gia</h3>
              </div>

              <div className="flex gap-3 sm:gap-4 md:gap-6 items-center">
                <div className="relative w-[400px] lg:w-[400px] h-[200px] lg:h-[200px]">
                  <Image
                    src="https://res.cloudinary.com/dznt9yias/image/upload/v1762593929/mapcl_3_sew4en.png"
                    alt="Letter Guide"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>

                <ul className="list-disc list-inside text-secondary lg:text-base text-sm">
                  <li>Đăng nhập vào tài khoản trên website Đại Việt Kỳ Nhân để tham gia.</li>
                  <li>Viết những lời tâm sự, hoặc những điều bạn muốn bày tỏ tới một vị Kỳ Nhân bất kì.</li>
                  <li>Những lá thư được xét duyệt sẽ được đăng tải trên website Đại Việt Kỳ Nhân.</li>
                  <li>Không giới hạn số lần viết thư.</li>
                  <li>Nhận ngay <span className="font-bold">200 xu</span> cho lần viết thư đầu tiên (sau khi đã được xét duyệt và đăng tải)</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-center items-start lg:px-24 px-10 py-5 bg-[#a4a89d57] rounded-2xl border border-[#aaaaaa]">
              <div className="flex justify-center items-center w-full my-4">
                <h3 className="text-center font-bd-street-sign text-3xl lg:text-4xl text-[#CE7346]">Lưu ý</h3>
              </div>

              <ul className="list-disc list-inside italic text-secondary lg:text-base text-sm">
                <h4 className="font-bold text-base lg:text-xl">Để giữ tinh thần tôn trọng lịch sử và giá trị văn hóa dân tộc, mọi lá thư cần tuân thủ các quy định sau:</h4>
                <li>Không sử dụng ngôn từ phản cảm, thô tục, xúc phạm cá nhân hoặc tôn giáo.</li>
                <li>Không xuyên tạc, bịa đặt, chế giễu hay bóp méo hình tượng các nhân vật lịch sử.</li>
                <li>Không lồng ghép nội dung chính trị, kích động, phân biệt giới tính, vùng miền, tôn giáo hay dân tộc.                </li>
                <li>Không đăng tải liên kết, hình ảnh hoặc nội dung quảng cáo, thương mại.</li>
                <li>Không sao chép nội dung của người khác hoặc vi phạm bản quyền.</li>
              </ul>

              <br />

              <ul className="list-disc list-inside italic text-secondary lg:text-base text-sm">
                <h4 className="font-bold text-base lg:text-xl">Quyền sử dụng nội dung:</h4>
                <li>Ban Tổ Chức có toàn quyền xét duyệt hoặc loại bỏ các lá thư vi phạm quy định.</li>
                <li>Các lá thư hợp lệ có thể được sử dụng cho mục đích trưng bày, truyền thông và quảng bá trong khuôn khổ chiến dịch Đại Việt Kỳ Nhân, bao gồm cả sự kiện trực tiếp tại TP.HCM và các kênh truyền thông trực tuyến.</li>
                <li>Việc tham gia gửi thư đồng nghĩa với việc người viết đồng ý cho phép Ban Tổ Chức sử dụng nội dung thư cho các hoạt động nêu trên, không yêu cầu thù lao hoặc quyền lợi phát sinh.</li>
              </ul>
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
    </ModalBackdrop>,
    document.body
  );
};

export default LetterGuide;
