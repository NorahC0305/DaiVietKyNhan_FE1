"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";

type ModalBackdropProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string; // container width classes
  cardClassName?: string; // inner card classes
  showCloseButton?: boolean;
};

export default function ModalBackdrop({
  isOpen,
  onClose,
  children,
  // Chiều rộng linh hoạt hơn, giới hạn max-width cho màn hình lớn
  className = "relative mx-auto w-[95vw] sm:w-[90vw] max-w-3xl",
  // Thêm padding lớn hơn và giới hạn chiều cao, tự động cuộn khi nội dung dài
  cardClassName = "relative bg-primary-light border-4 border-secondary rounded-2xl my-8 p-6 sm:p-8 md:p-10 max-h-[90vh]",
  showCloseButton = true,
}: ModalBackdropProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={className}
          >
            <div className={`${cardClassName}`}>
              {showCloseButton && (
                <button
                  // Vị trí nút X được điều chỉnh để phù hợp với padding mới, đảm bảo tách biệt
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 cursor-pointer p-2"
                  onClick={onClose}
                  aria-label="Đóng"
                >
                  <span className="relative block h-8 w-8 sm:h-10 sm:w-10">
                    <Image
                      src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763391063/Tr%E1%BB%9F_l%E1%BA%A1i_trang_tr%C6%B0%E1%BB%9Bc_t1jpaz.png"
                      alt="Đóng"
                      fill
                      sizes="(max-width: 640px) 32px, 40px"
                      style={{ objectFit: "contain" }}
                    />
                  </span>
                </button>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}