"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface MapRegionProps {
  id: string;
  name: string;
  // imageSrc is no longer used but kept in props for interface consistency
  imageSrc: string;
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
  hitboxScale?: number;
  hitboxOffset?: {
    x?: number;
    y?: number;
  };
  isFullscreen?: boolean;
  isLocked?: boolean;
}

export default function MapRegion({
  id,
  name,
  imageSrc, // Giữ lại prop nhưng không dùng
  position,
  size = { width: 200, height: 200 },
  onClick,
  zIndex = 10,
  hitboxScale = 0.6,
  hitboxOffset = { x: 0, y: 0 },
  isFullscreen = false,
  isLocked = false,
}: MapRegionProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Tính toán kích thước và vị trí của vùng hover
  const hitboxWidth = size.width * hitboxScale;
  const hitboxHeight = size.height * hitboxScale;
  const hitboxOffsetX =
    (size.width - hitboxWidth) / 2 + size.width * (hitboxOffset.x || 0);
  const hitboxOffsetY =
    (size.height - hitboxHeight) / 2 + size.height * (hitboxOffset.y || 0);

  // Tính toán style cho container dựa trên mode
  const containerStyle = isFullscreen
    ? {
      ...position,
      zIndex,
      width: `${(size.width / 1920) * 100}vw`,
      height: `${(size.height / 1080) * 100}vh`,
    }
    : {
      ...position,
      zIndex,
      width: size.width,
      height: size.height,
    };

  return (
    <div className="absolute group" style={containerStyle}>
      {/* Lock overlay khi region bị khóa */}
      {isLocked && (
        <div className="absolute inset-0 pointer-events-none">
          {id === "ky-linh-viet-hoa" ? (
            // Cloud overlay for Kỳ Linh Việt Hỏa
            <motion.div
              className="absolute inset-16 flex items-center justify-center"
              animate={{
                scale: isHovered ? 1.05 : 1,
                filter: isHovered
                  ? "brightness(1.2) drop-shadow(0 0 20px rgba(255,215,0,0.6))"
                  : "none",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Image
                src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763394347/Group_125_jtzhn7.png"
                alt="Cloud overlay"
                width={610}
                height={200}
                className="object-cover transition-all duration-300"
                style={{ zIndex: 1 }}
              />
            </motion.div>
          ) : (
            // Default lock icon for other regions
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <svg
                  className="w-12 h-12 text-white"
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

      {/* Vùng tương tác hover (hitbox) - Vẫn giữ lại để có thể tương tác */}
      <div
        className={`absolute ${isLocked ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        style={
          isFullscreen
            ? {
              top: "50%",
              left: "50%",
              width: `${hitboxScale * 100}%`,
              height: `${hitboxScale * 100}%`,
              transform: `translate(-50%, -50%) translate(${(hitboxOffset.x || 0) * 100
                }%, ${(hitboxOffset.y || 0) * 100}%)`,
            }
            : {
              top: hitboxOffsetY,
              left: hitboxOffsetX,
              width: hitboxWidth,
              height: hitboxHeight,
            }
        }
        onMouseEnter={() =>
          (!isLocked || id === "ky-linh-viet-hoa") && setIsHovered(true)
        }
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onClick?.()}
      />
    </div>
  );
}
