"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface MobileRegionProps {
  id: string;
  name: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
  };
  size?: {
    width: number;
    height: number;
  };
  onClick?: () => void;
  zIndex?: number;
  // Vị trí cố định dựa trên phần trăm của viewport
  fixedPosition?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
  };
  // Props riêng cho mobile landscape
  mobilePosition?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
  };
  mobileSize?: {
    width: number;
    height: number;
  };
  // Prop để bật/tắt debug mode
  debug?: boolean;
  isLocked?: boolean; // Whether the region is locked
}

export default function MobileRegion({
  id,
  name,
  position,
  size = { width: 200, height: 200 },
  onClick,
  zIndex = 10,
  fixedPosition,
  mobilePosition,
  mobileSize,
  debug = false,
  isLocked = false,
}: MobileRegionProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Ưu tiên mobilePosition > fixedPosition > position
  const finalPosition = mobilePosition || fixedPosition || position;
  const finalSize = mobileSize || size;

  return (
    <div
      className="absolute"
      style={{
        ...finalPosition,
        zIndex,
        width: finalSize.width,
        height: finalSize.height,
      }}
    >
      {/* Vùng tương tác cho mobile - hoàn toàn ẩn nhưng có thể bấm */}
      <div
        className={`absolute inset-0 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        style={{
          backgroundColor: "transparent !important",
          border: "none !important",
          outline: "none !important",
          boxShadow: "none !important",
          background: "transparent !important",
          backgroundImage: "none !important",
          backgroundSize: "auto !important",
          backgroundPosition: "initial !important",
          backgroundRepeat: "initial !important",
        }}
        onTouchStart={() => !isLocked && setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onClick={() => onClick?.()}
      />

      {/* Lock overlay khi region bị khóa */}
      {isLocked && (
        <div className="absolute inset-0 pointer-events-none">
          {id === "ky-linh-viet-hoa" ? (
            // Cloud overlay for Kỳ Linh Việt Hỏa - larger on mobile
            <div className="absolute -inset-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)]">
              <Image
                src="https://res.cloudinary.com/dznt9yias/image/upload/v1761067244/cloud_ybkv9q.svg"
                alt="Cloud overlay"
                fill
                className="object-cover"
                style={{ zIndex: 1 }}
              />
            </div>
          ) : (
            // Default lock icon for other regions
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Debug mode - chỉ hiện khi debug = true */}
      {debug && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-2 border-red-500 border-dashed bg-red-500 bg-opacity-20 flex items-center justify-center">
            <span className="text-red-500 text-xs font-bold bg-white px-2 py-1 rounded">
              {name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
