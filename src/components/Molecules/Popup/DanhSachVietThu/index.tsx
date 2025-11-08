import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useInfiniteLetters } from "@hooks/use-letter-queries";
import { createPortal } from "react-dom";
import { ILetterEntity } from "@models/letter/entity";
import { DateMonthYear } from "@utils/Date";
import ButtonImage from "@components/Atoms/ButtonImage";

type DanhSachVietThuProps = {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onOpenDetail?: (letter: ILetterEntity, letters: ILetterEntity[]) => void;
};

const DanhSachVietThu = ({
  isOpen,
  onClose,
  onBack,
  onOpenDetail,
}: DanhSachVietThuProps) => {
  // State for filter - default to false (show all letters)
  const [filterByUserId, setFilterByUserId] = useState<boolean>(false);
  
  // Ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch PUBLIC letters with infinite scroll
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLetters({
    qs: "sort:-id,status=PUBLIC",
    pageSize: 20,
    filterByUserId: filterByUserId,
  });

  // Flatten all pages into a single array of letters
  const letters = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);

  // Reset scroll position when modal opens or filter changes
  useEffect(() => {
    if (scrollContainerRef.current && isOpen) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isOpen, filterByUserId]);

  // Handle scroll to load more
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !isOpen) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      // Load more when user scrolls to within 100px of the bottom
      if (
        scrollHeight - scrollTop - clientHeight < 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, hasNextPage, isFetchingNextPage, fetchNextPage]);
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    onClose();
  };

  const handleOpenDetail = (letter: ILetterEntity) => {
    console.log('DanhSachVietThu - handleOpenDetail called with letter:', letter.id, letter); // Debug log
    if (onOpenDetail) {
      onOpenDetail(letter, letters);
      return;
    }
    onClose();
  };

  // Use React Portal to render modal at root level
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            onClick={onClose}
          />

          <div className="absolute inset-0" onClick={onClose}>
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 cursor-pointer p-2"
              onClick={onClose}
              aria-label="Đóng"
            >
              <span className="relative block h-8 w-8 sm:h-10 sm:w-10">
                <Image
                  src="https://res.cloudinary.com/dznt9yias/image/upload/v1760721841/X_lqpgdp.svg"
                  alt="Đóng"
                  fill
                  sizes="(max-width: 640px) 32px, 40px"
                  style={{ objectFit: "contain" }}
                />
              </span>
            </button>
          </div>

          <button
            type="button"
            className="absolute bottom-3 right-3 z-10 cursor-pointer p-2 w-[70px] h-[70px]"
            onClick={handleBack}
          >
            <span className="relative block h-full w-full">
              <Image
                src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726102/Return_1_qwp1kh.svg"
                alt="Back"
                fill
              />
            </span>
          </button>

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative mx-3 w-full lg:max-w-5xl max-w-3xl flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center">
              {/* Cuộn giấy */}
              <div className="relative lg:w-[1300px] lg:h-[700px] w-[700px] h-[400px]">
                <Image
                  src="https://res.cloudinary.com/dznt9yias/image/upload/v1760721989/ScrollPaper_dqmtkl.svg"
                  alt="Viet Thu Gui Hau The"
                  fill
                />

                <div className="absolute w-full h-[100%] flex items-center justify-center inset-0">
                  <div className="absolute lg:w-[70%] w-[80%] lg:h-[80%] h-[60%] flex flex-col justify-center">
                    {/* Title */}
                    <div className="flex justify-center items-center mb-5">
                      <span className="text-secondary font-bd-street-sign lg:text-5xl text-3xl">
                        LÁ THƯ GỬI KỲ NHÂN - TÂM SỰ TỪ HẬU THẾ
                      </span>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex justify-center items-center gap-4 mb-4">
                      <ButtonImage
                        onClick={() => setFilterByUserId(false)}
                        className={filterByUserId === false ? "opacity-100" : "opacity-70"}
                        width={120}
                        height={50}
                        classNameText="text-sm"
                      >
                        Toàn bộ thư
                      </ButtonImage>
                      <ButtonImage
                        onClick={() => setFilterByUserId(true)}
                        className={filterByUserId === true ? "opacity-100" : "opacity-70"}
                        width={120}
                        height={50}
                        classNameText="text-sm"
                      >
                        Của tôi
                      </ButtonImage>
                    </div>

                    {/* List */}
                    <div 
                      ref={scrollContainerRef}
                      className="grid lg:grid-cols-3 grid-cols-2 h-[68%] gap-5 overflow-y-auto px-3"
                    >
                      {isLoading ? (
                        <div className="col-span-full flex justify-center items-center py-10">
                          <p className="text-secondary text-lg">Đang tải...</p>
                        </div>
                      ) : isError ? (
                        <div className="col-span-full flex justify-center items-center py-10">
                          <p className="text-secondary text-lg">
                            Có lỗi xảy ra khi tải dữ liệu
                          </p>
                        </div>
                      ) : letters.length === 0 ? (
                        <div className="col-span-full flex justify-center items-center py-10">
                          <p className="text-secondary text-lg">
                            Chưa có thư nào
                          </p>
                        </div>
                      ) : (
                        letters.map((letter: ILetterEntity) => (
                          <div
                            key={letter.id}
                            className="relative lg:w-72 w-60 lg:h-52 h-48 rounded-2xl lg:border-4 border-2 border-secondary bg-[#F4ECD1]"
                          >
                            <div className="p-4 lg:p-5">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-[#BB4D00] lg:text-xs text-[12px]">
                                    TỪ
                                  </p>
                                  <p
                                    className="text-secondary font-black lg:text-sm text-[12px] leading-none mt-1"
                                    style={{
                                      fontWeight: 700,
                                      WebkitTextStroke: "0.2px",
                                      textShadow:
                                        "0.5px 0.5px 0px rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    {letter.fromUser?.name ||
                                      letter.from ||
                                      "Ẩn danh"}
                                  </p>
                                </div>
                                <p className="text-[#E17100] font-bold lg:text-sm text-[13px]">
                                  {DateMonthYear(
                                    letter.createdAt instanceof Date
                                      ? letter.createdAt.toISOString()
                                      : String(letter.createdAt)
                                  )}
                                </p>
                              </div>

                              <div className="h-[1px] w-full bg-[#E8D389] my-2" />

                              <p className="text-[#BB4D00] font-bold tracking-wide lg:text-xs text-[12px]">
                                GỬI ĐẾN
                              </p>
                              <h3
                                className="text-secondary font-black lg:text-sm text-[12px] mt-1"
                                style={{
                                  fontWeight: 700,
                                  WebkitTextStroke: "0.2px",
                                  textShadow: "0.5px 0.5px 0px rgba(0,0,0,0.1)",
                                }}
                              >
                                {letter.to || "Kỳ Nhân"}
                              </h3>

                              <p className="italic text-secondary lg:text-sm text-[12px] mt-2 line-clamp-2">
                                "{letter.content}"
                              </p>

                              <div className="mt-3 flex justify-center items-center hover:text-[#E17100] hover:underline">
                                <button
                                  type="button"
                                  onClick={() => handleOpenDetail(letter)}
                                  className="relative text-[#E17100] font-black lg:text-[12px] text-[10px] text-center cursor-pointer"
                                >
                                  Bấm để xem chi tiết →
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      
                      {/* Loading indicator for fetching next page */}
                      {isFetchingNextPage && (
                        <div className="col-span-full flex justify-center items-center py-4">
                          <p className="text-secondary text-sm">Đang tải thêm...</p>
                        </div>
                      )}
                      
                      {/* End of list message */}
                      {!hasNextPage && letters.length > 0 && (
                        <div className="col-span-full flex justify-center items-center py-4">
                          <p className="text-secondary text-sm">Đã hiển thị tất cả thư</p>
                        </div>
                      )}
                    </div>
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
};

export default DanhSachVietThu;
