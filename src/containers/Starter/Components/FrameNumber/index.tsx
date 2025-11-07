import React from "react";
import Image from "next/image";

interface FrameNumberProps {
  text: string;
  className?: string;
  textClassName?: string;
  textStyle?: React.CSSProperties;
  width?: number;
  height?: number;
}

const FrameNumber: React.FC<FrameNumberProps> = React.memo(
  ({
    text,
    className = "",
    textClassName = "",
    textStyle,
    width = 60,
    height = 60,
  }) => {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
      >
        {/* Background frame image */}
        <div className="relative">
          <Image
            src='https://res.cloudinary.com/dznt9yias/image/upload/v1760722372/khung_ma%CC%A3ng_xu_%C4%91ie%CC%82%CC%89m_ngan_p10yq9.svg'
            alt="Number frame"
            width={width}
            height={height}
            className="object-contain"
            style={{
              width: `${width}px`,
              height: `${height}px`,
            }}
          />

          {/* Text overlay positioned in the center */}
          <div
            className={`
            absolute inset-0 
            flex items-center justify-center
            px-2 py-1
            ${textClassName}
          `}
            style={{
              left: "10%",
              right: "10%",
              top: "20%",
              bottom: "15%",
            }}
          >
            <span
              className={`
              text-center text-green-800
              leading-none
              max-w-full
            `}
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                lineHeight: "1",
                ...textStyle,
              }}
            >
              {text}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export default FrameNumber;
