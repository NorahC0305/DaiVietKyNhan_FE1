"use client";

import Image from "next/image";
import { useId, useRef, useEffect } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onEnter?: () => void;
};

export default function InputAnswer({
  value,
  onChange,
  placeholder = "Nhập đáp án...",
  className = "",
  inputClassName = "",
  disabled = false,
  autoFocus = false,
  onEnter,
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus effect
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter && !disabled) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div
      className={`relative w-[min(280px,60%)] sm:w-[min(360px,50%)] md:w-[min(400px,42%)] ${className}`}
    >
      <div className="relative aspect-[26/9] w-full">
        <Image
          src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763391722/Artboard_4_2_ggkvjh.png"
          alt="Khung nhập đáp án"
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 640px"
          style={{ objectFit: "contain" }}
          priority
        />
        <input
          ref={inputRef}
          id={id}
          className={`absolute left-[18%] right-[18%] top-[42%] -translate-y-1/2 h-[38%] bg-transparent text-[#835D26] outline-none text-base sm:text-lg md:text-xl placeholder:text-[#835D26]/60 text-center ${
            disabled ? "cursor-not-allowed opacity-60" : ""
          } ${inputClassName}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
