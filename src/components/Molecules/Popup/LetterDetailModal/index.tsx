"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";

export interface LetterDetail {
  id: string;
  from: string;
  to: string;
  date: string;
  content: string;
}

export type LetterDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  letters: LetterDetail[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
};

export default function LetterDetailModal({
  isOpen,
  onClose,
  letters,
  currentIndex = 0,
  onIndexChange,
}: LetterDetailModalProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const currentLetter = useMemo(() => {
    if (letters.length === 0) return null;
    return letters[activeIndex] || letters[0];
  }, [letters, activeIndex]);

  const handlePrevious = () => {
    if (letters.length === 0) return;
    const newIndex = activeIndex > 0 ? activeIndex - 1 : letters.length - 1;
    setActiveIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  const handleNext = () => {
    if (letters.length === 0) return;
    const newIndex = activeIndex < letters.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  // Update activeIndex when currentIndex prop changes
  useEffect(() => {
    if (
      currentIndex !== activeIndex &&
      currentIndex >= 0 &&
      currentIndex < letters.length
    ) {
      setActiveIndex(currentIndex);
    }
  }, [currentIndex, letters.length, activeIndex]);

  if (!currentLetter) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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
                className="absolute p-6"
                style={{ top: "13%", right: "9%", bottom: "12%", left: "9%" }}
              >
                <div className="relative flex h-full w-full flex-col px-2 sm:px-4 lg:px-8 ">
                  <button
                    className="absolute -top-6 right-2 sm:-top-8 sm:right-4 md:-top-9 md:right-6 cursor-pointer p-1 sm:p-2"
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

                  <div className="flex flex-col items-center text-center gap-2 sm:gap-3 md:gap-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#835D26] font-bd-street-sign leading-tight">
                      LÁ THƯ GỬI KỸ NHÂN - TÂM SỰ TỪ HẬU THỂ
                    </h2>
                  </div>

                  <div className="mt-4 sm:mt-6 flex flex-1 flex-col gap-4 sm:gap-6 min-h-0">
                    {/* Letter Info */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 sm:gap-3 flex-shrink-0">
                      <div className="flex flex-col gap-1 sm:gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[#835D26] text-xs sm:text-sm font-bold uppercase tracking-wide">
                            Từ:
                          </span>
                          <span
                            className="text-[#CE7346] text-xs sm:text-sm font-bold italic"
                            style={{
                              fontWeight: 700,
                              WebkitTextStroke: "0.2px #CE7346",
                              textShadow: "0.5px 0.5px 0px rgba(0,0,0,0.1)",
                            }}
                          >
                            {currentLetter.from}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#835D26] text-xs sm:text-sm font-bold uppercase tracking-wide">
                            Đến:
                          </span>
                          <span
                            className="text-[#CE7346] text-xs sm:text-sm font-bold italic"
                            style={{
                              fontWeight: 700,
                              WebkitTextStroke: "0.2px #CE7346",
                              textShadow: "0.5px 0.5px 0px rgba(0,0,0,0.1)",
                            }}
                          >
                            {currentLetter.to}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end">
                        <span className="text-[#835D26] text-xs sm:text-sm font-bold uppercase tracking-wide">
                          Ngày gửi
                        </span>
                        <span className="text-[#835D26] text-[10px] sm:text-xs italic">
                          {currentLetter.date}
                        </span>
                      </div>
                    </div>

                    {/* Content Box - Fixed height with scroll */}
                    <div className="bg-[#F4ECD0] border-[3px] sm:border-4 border-[#835D26] rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                      <p className="text-[#835D26] text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line text-left">
                        {currentLetter.content}
                      </p>
                    </div>

                    {/* Navigation */}
                    {letters.length > 1 && (
                      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 flex-shrink-0">
                        <button
                          onClick={handlePrevious}
                          className="p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full bg-[#FFD700] border-2 sm:border-[3px] border-[#835D26] hover:opacity-80 transition-opacity flex items-center justify-center shadow-[0_4px_0_rgba(131,93,38,0.4)] sm:shadow-[0_5px_0_rgba(131,93,38,0.4)] md:shadow-[0_6px_0_rgba(131,93,38,0.4)]"
                          aria-label="Thư trước"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-[#835D26]" />
                        </button>

                        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
                          {letters.map((_, index) => {
                            const isActive = index === activeIndex;
                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  setActiveIndex(index);
                                  onIndexChange?.(index);
                                }}
                                className={`h-1.5 sm:h-2 md:h-2.5 lg:h-3 rounded-full transition-all duration-200 ${
                                  isActive
                                    ? "bg-[#835D26] w-4 sm:w-5 md:w-7 lg:w-8"
                                    : "bg-[#D4C3A0] hover:bg-[#C0AD7E] w-2 sm:w-2.5 md:w-3 lg:w-3.5"
                                }`}
                                aria-label={`Đi tới thư ${index + 1}`}
                              />
                            );
                          })}
                        </div>

                        <button
                          onClick={handleNext}
                          className="p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full bg-[#FFD700] border-2 sm:border-[3px] border-[#835D26] hover:opacity-80 transition-opacity flex items-center justify-center shadow-[0_4px_0_rgba(131,93,38,0.4)] sm:shadow-[0_5px_0_rgba(131,93,38,0.4)] md:shadow-[0_6px_0_rgba(131,93,38,0.4)]"
                          aria-label="Thư sau"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-[#835D26]" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
