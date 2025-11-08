"use client";

import ButtonImage from "@components/Atoms/ButtonImage";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface WriteLetterValues {
  from: string;
  to: string;
  content: string;
}

export type WriteLetterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (values: WriteLetterValues) => void;
  defaultValues?: Partial<WriteLetterValues>;
  isSubmitting?: boolean;
};

const initialState: WriteLetterValues = {
  from: "",
  to: "",
  content: "",
};

export default function WriteLetterModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  isSubmitting = false,
}: WriteLetterModalProps) {
  const [formValues, setFormValues] = useState<WriteLetterValues>({
    ...initialState,
    ...defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      setFormValues({
        ...initialState,
        ...defaultValues,
      });
    }
  }, [isOpen, defaultValues]);

  const handleChange = (field: keyof WriteLetterValues, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(formValues);
  };

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="relative w-full mx-2 sm:mx-4"
            style={{
              width: "min(90vw, 1280px, calc(90vh * 16 / 9))",
              maxHeight: "90vh",
            }}
          >
            <div className="text-center px-4">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-semibold leading-snug">
                Hãy viết một lá thư để bày tỏ đôi lời gửi tới vị Kỹ Nhân yêu thích
              </p>
            </div>

            <div className="relative w-full overflow-hidden">
              <div
                className="relative w-full"
                style={{ aspectRatio: "16 / 9" }}
              >
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
                className="absolute flex flex-col items-center justify-between p-4 sm:p-6"
                style={{
                  top: "clamp(4%, 10vh, 15%)",
                  right: "clamp(4%, 6vw, 9%)",
                  bottom: "clamp(4%, 7vh, 12%)",
                  left: "clamp(4%, 6vw, 9%)",
                }}
              >
                <button
                  className="absolute cursor-pointer p-1 sm:p-2"
                  style={{
                    top: "clamp(-3rem, 1vh, -1rem)",
                    right: "clamp(0.25rem, 2vw, 1.5rem)",
                  }}
                  onClick={onClose}
                  aria-label="Đóng"
                  type="button"
                >
                  <span
                    className="block relative hover:scale-105"
                    style={{
                      width: "clamp(32px, 6vw, 48px)",
                      height: "clamp(32px, 6vw, 48px)",
                    }}
                  >
                    <Image
                      src="https://res.cloudinary.com/dznt9yias/image/upload/v1760721841/X_lqpgdp.svg"
                      alt="Đóng"
                      fill
                      sizes="(max-width: 640px) 10vw, (max-width: 768px) 48px, 56px"
                      style={{ objectFit: "contain" }}
                    />
                  </span>
                </button>

                <form
                  className="w-full flex-1 flex flex-col gap-5 sm:gap-6 mt-4 sm:mt-6 px-4 sm:px-6 py-4 overflow-y-auto"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 w-full">
                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                    <label className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                        <span className="text-[#835D26] text-sm sm:text-base font-bold uppercase tracking-wide">
                          Từ:
                        </span>
                        <input
                          type="text"
                          value={formValues.from}
                          onChange={(event) =>
                            handleChange("from", event.target.value)
                          }
                          placeholder="Tên của bạn"
                          className="ml-3 w-full sm:w-auto sm:min-w-[200px] max-w-full sm:max-w-[260px] md:max-w-[320px] rounded-full border-[3px] sm:border-4 border-[#A57B43] bg-[#FFF7DC] px-4 py-2 text-[#835D26] text-sm sm:text-base font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#835D26] focus:ring-2 focus:ring-[#EFD8A7]/70 transition"
                          required
                        />
                      </label>

                    <label className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                        <span className="text-[#835D26] text-sm sm:text-base font-bold uppercase tracking-wide">
                          Đến:
                        </span>
                        <input
                          type="text"
                          value={formValues.to}
                          onChange={(event) =>
                            handleChange("to", event.target.value)
                          }
                          placeholder="Tên của vị Kỹ Nhân bạn muốn gửi"
                          className="w-full sm:w-auto sm:min-w-[200px] max-w-full sm:max-w-[260px] md:max-w-[320px] rounded-full border-[3px] sm:border-4 border-[#A57B43] bg-[#FFF7DC] px-4 py-2 text-[#835D26] text-sm sm:text-base font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#835D26] focus:ring-2 focus:ring-[#EFD8A7]/70 transition"
                          required
                        />
                      </label>
                    </div>

                    <div className="flex justify-center sm:justify-start sm:self-center">
                      <ButtonImage
                        width={140}
                        height={90}
                        classNameText="text-base sm:text-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Đang gửi" : "Gửi"}
                      </ButtonImage>
                    </div>
                  </div>

                  <label className="flex flex-col gap-2 flex-1">
                    <span className="text-[#835D26] text-sm sm:text-base font-bold uppercase tracking-wide text-left">
                      Nội dung thư
                    </span>
                    <textarea
                      value={formValues.content}
                      onChange={(event) =>
                        handleChange("content", event.target.value)
                      }
                      placeholder="Hãy ghi những lời chia sẻ vào đây..."
                      className="flex-1 min-h-[160px] sm:min-h-[220px] rounded-[24px] border-[4px] border-[#A57B43] bg-[#E4D3A1]/60 px-5 py-4 text-[#6F5123] text-sm sm:text-base leading-relaxed resize-none shadow-[inset_0_3px_6px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#835D26] focus:ring-2 focus:ring-[#EFD8A7]/70 transition custom-scrollbar placeholder:italic"
                      required
                    />
                  </label>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
