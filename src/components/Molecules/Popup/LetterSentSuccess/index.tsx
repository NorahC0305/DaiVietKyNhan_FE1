"use client";

import ModalBackdrop from "../../../Atoms/ModalBackdrop";

export type LetterSentSuccessProps = {
  isOpen: boolean;
  onClose: () => void;
  kyNhanName?: string; // Tên kỳ nhân đã gửi thư
};

export default function LetterSentSuccess({
  isOpen,
  onClose,
  kyNhanName,
}: LetterSentSuccessProps) {
  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose}>
      {/* Content */}
      <div className="text-center">
        <p className="mt-3 text-secondary text-base sm:text-lg md:text-xl leading-relaxed font-extrabold">
          Bạn đã gửi thư thành công đến{" "}
          {kyNhanName ? (
            <span className="text-primary font-bold">{kyNhanName}</span>
          ) : (
            "vị Kỳ Nhân"
          )}
          !
        </p>
        <p className="mt-4 text-secondary text-sm sm:text-base md:text-lg leading-relaxed">
          Cảm ơn bạn đã chia sẻ những tình cảm của mình. Lá thư của bạn sẽ được
          gửi đến vị Kỳ Nhân yêu thích.
        </p>
      </div>
    </ModalBackdrop>
  );
}

