import React from "react";
import Image from "next/image";

interface CardDetailsPageProps {
  content?: {
    title?: string;
    description?: string;
    paragraphs?: string[];
  };
}

const CardDetailsPage = ({ content }: CardDetailsPageProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div className="w-full max-w-[1600px] px-2">
        <div className="relative w-full">
          <Image
            src="https://res.cloudinary.com/dznt9yias/image/upload/v1760721989/ScrollPaper_dqmtkl.svg"
            alt="ScrollPaper"
            className="w-full h-auto object-contain"
            width={1600}
            height={900}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1600px) 98vw, 1600px"
          />
          {/* Text content overlay on left side */}
          <div className="absolute inset-0 z-0 flex items-start justify-start pl-[11%] pr-[12%] pt-[18%] pb-[18%] md:pl-[13%] md:pt-[15%] md:pb-[15%] md:pr-[48%]">
            <div className="w-full max-w-[500px] max-h-[90%] md:max-h-[92%] overflow-y-auto pr-2 break-words">
              {content?.title && (
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 leading-tight">
                  {content.title}
                </h1>
              )}
              {content?.description && (
                <p className="text-lg md:text-xl text-black/90 mb-6 leading-relaxed">
                  {content.description}
                </p>
              )}
              {content?.paragraphs && content.paragraphs.length > 0 && (
                <div className="space-y-4">
                  {content.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm md:text-base text-black/85 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {/* Fallback content if no API data */}
              {!content && (
                <div className="space-y-4">
                  <p className="text-sm md:text-base text-black/85 leading-relaxed">
                    Mẫu Thượng Thiên là một trong bốn vị Mẫu tối cao trong hệ
                    thống Tứ Phủ của tín ngưỡng thờ Mẫu Việt Nam, đại diện cho
                    Thiên phủ – tức là vùng trời.
                  </p>
                  <p className="text-sm md:text-base text-black/85 leading-relaxed">
                    Bà được coi là vị thần tối cao cai quản trời đất, điều hành
                    mưa nắng, gió sấm và những hiện tượng tự nhiên trên không
                    trung.
                  </p>
                  <p className="text-sm md:text-base text-black/85 leading-relaxed">
                    Mẫu Thượng Thiên thường được đồng nhất với Mẫu Cửu Trùng
                    Thiên, Mẫu Liễu Hạnh hoặc Mẫu Đệ Nhất, và ngự tại cung trời.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right-side character illustration */}
          <div className="pointer-events-none absolute inset-0 z-10 hidden md:flex items-center justify-end pr-[2%]">
            <div className="relative w-[45%] max-w-[720px] aspect-[3/5]">
              <Image
                src="/DetailGirl.png"
                alt="Detail Character"
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1600px) 45vw, 720px"
                className="object-contain drop-shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;
