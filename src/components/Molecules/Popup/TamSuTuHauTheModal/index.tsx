"use client";

import ButtonImage from "@components/Atoms/ButtonImage";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

export interface Letter {
  id: string;
  from: string;
  to: string;
  date: string;
  preview: string;
  content?: string; // Full content for detail view
  onClick?: () => void;
}

export type TamSuTuHauTheModalProps = {
  isOpen: boolean;
  onClose: () => void;
  letters?: Letter[];
  onLetterClick?: (letter: Letter) => void;
  onJoinClick?: () => void;
};

// Default letters data - can be replaced with API data
const defaultLetters: Letter[] = [
  {
    id: "1",
    from: "HA",
    to: "Trần Hưng Đạo",
    date: "01/11/2025",
    preview: "Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng",
  },
  {
    id: "2",
    from: "HA",
    to: "Trần Hưng Đạo",
    date: "01/11/2025",
    preview: "Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng",
  },
  {
    id: "3",
    from: "HA",
    to: "Trần Hưng Đạo",
    date: "01/11/2025",
    preview: "Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng",
  },
  {
    id: "4",
    from: "HA",
    to: "Trần Hưng Đạo",
    date: "01/11/2025",
    preview: "Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng",
  },
  {
    id: "5",
    from: "HA",
    to: "Trần Hưng Đạo",
    date: "01/11/2025",
    preview: "Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng",
  },
  {
    id: "6",
    from: "HA",
    to: "Trần Hưng Đạo",
    date: "01/11/2025",
    preview: "Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng",
  },
];

export default function TamSuTuHauTheModal({
  isOpen,
  onClose,
  letters = defaultLetters,
  onLetterClick,
  onJoinClick,
}: TamSuTuHauTheModalProps) {
  const displayLetters = useMemo(() => {
    return letters;
  }, [letters]);

  const handleLetterClick = (letter: Letter) => {
    if (onLetterClick) {
      onLetterClick(letter);
    } else if (letter.onClick) {
      letter.onClick();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl sm:max-w-6xl lg:max-w-7xl mx-2 sm:mx-4"
          >
            <div className="relative w-full overflow-hidden">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/frame1.png"
                  alt="Khung giấy"
                  fill
                  priority
                  sizes="(max-width: 768px) 95vw, (max-width: 1280px) 100vw, 1400px"
                  style={{ objectFit: "contain" }}
                />
              </div>

              <div
                className="absolute flex flex-col items-center justify-between py-2 sm:py-6"
                style={{ top: "14%", right: "10%", bottom: "14%", left: "10%" }}
              >
                <div className="w-full max-w-4xl mx-auto text-center space-y-2 sm:space-y-4 px-2 sm:px-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#835D26] font-bd-street-sign leading-tight">
                    LÁ THƯ GỬI KỸ NHÂN - TÂM SỰ TỪ HẬU THỂ
                  </h2>
                  <button
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 cursor-pointer p-1 sm:p-2"
                    onClick={onClose}
                    aria-label="Đóng"
                  >
                    <span className="block relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:scale-105">
                      <Image
                        src="https://res.cloudinary.com/dznt9yias/image/upload/v1760721841/X_lqpgdp.svg"
                        alt="Đóng"
                        fill
                        sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
                        style={{ objectFit: "contain" }}
                      />
                    </span>
                  </button>
                </div>

                <div className="w-full p-2 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mt-2 sm:mt-4 lg:mt-6 px-2 sm:px-4 lg:px-6 max-w-4xl overflow-y-auto custom-scrollbar flex-1">
                  {displayLetters.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 gap-3">
                      <div className="text-[#835D26] font-medium text-lg">
                        Không có lá thư nào
                      </div>
                    </div>
                  ) : (
                    displayLetters.map((letter) => (
                      <div
                        key={letter.id}
                        className="rounded-2xl bg-[#F4ECD1] border-2 sm:border-4 border-[#835D26] p-3 sm:p-4 lg:p-5 hover:scale-101 transition-shadow cursor-pointer"
                        onClick={() => handleLetterClick(letter)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[#BB4D00] text-xs sm:text-sm font-bold">
                              TỪ
                            </p>
                            <p 
                              className="text-[#835D26] text-xs sm:text-sm font-black leading-none mt-1" 
                              style={{ 
                                fontWeight: 900, 
                                WebkitTextStroke: '0.3px #835D26',
                                textShadow: '1px 1px 0px rgba(0,0,0,0.3), 0.5px 0.5px 0px rgba(0,0,0,0.2)',
                                letterSpacing: '0.05em'
                              }}
                            >
                              {letter.from}
                            </p>
                          </div>
                          <p className="text-[#E17100] font-bold text-xs sm:text-sm">
                            {letter.date}
                          </p>
                        </div>

                        <div className="h-[1px] w-full bg-[#E8D389] my-2" />

                        <div>
                          <p className="text-[#BB4D00] font-bold text-xs sm:text-sm tracking-wide">
                            GỬI ĐẾN
                          </p>
                          <h3 className="text-[#835D26] font-black text-xs sm:text-sm mt-1 leading-tight"
                            style={{ 
                              fontWeight: 900, 
                              WebkitTextStroke: '0.3px #835D26',
                              textShadow: '1px 1px 0px rgba(0,0,0,0.3), 0.5px 0.5px 0px rgba(0,0,0,0.2)',
                              letterSpacing: '0.05em'
                            }}
                          >
                            {letter.to}
                          </h3>
                        </div>

                        <p className="italic text-[#835D26] text-xs sm:text-sm mt-2 line-clamp-2">
                          "{letter.preview}"
                        </p>

                        <div className="mt-3 flex flex-row justify-center items-center">
                          <button
                            className="text-[#E17100] font-black text-[10px] sm:text-xs hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLetterClick(letter);
                            }}
                          >
                            Bấm để xem chi tiết 
                          </button>
                          <ArrowRightIcon className="w-4 h-4 ml-2 text-[#E17100]" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          <ButtonImage
            className=""
            width={200}
            height={200}
            classNameText="text-lg sm:text-xl md:text-2xl"
            onClick={() => onJoinClick?.()}
          >
            Tham gia ngay
          </ButtonImage>
        </div>
      )}
    </AnimatePresence>
  );
}
