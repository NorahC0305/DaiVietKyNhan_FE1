import { cn } from "@utils/CN";
import Image from "next/image";
import FramedImage from "../ImageInFrame";
import Link from "next/link";

export default function Card({
  unlocked,
  isCenter,
  cardNumber,
  imageSrc,
  backContent,
  isFlipped,
  highlightQuery,
  onCtaClick,
}: {
  unlocked: boolean;
  isCenter: boolean;
  cardNumber: number;
  imageSrc?: string;
  backContent?: {
    backgroundSrc?: string;
    name?: string;
    thoiKy?: string;
    chienCong?: string;
    ctaText?: string;
    ctaHref?: string;
  };
  isFlipped?: boolean;
  highlightQuery?: string;
  onCtaClick?: () => void;
}) {
  const renderHighlighted = (text?: string) => {
    const q = (highlightQuery || "").trim();
    if (!text || !q) return text;

    // Accent-insensitive search: build index on normalized text, map back to original
    const normalizedText = text
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "");
    const normalizedQuery = q
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "");

    const lower = normalizedText.toLowerCase();
    const start = lower.indexOf(normalizedQuery);
    if (start === -1) return text;

    // Map normalized indices back to original string indices
    const mapOriginalIndices = (s: string) => {
      const map: number[] = [];
      let origIndex = 0;
      for (const ch of s) {
        map.push(origIndex);
        origIndex += ch.length;
      }
      return map;
    };

    // Build arrays of code points for original and normalized to align
    const originalCodePoints = Array.from(text);
    const normalizedCodePoints = Array.from(
      text.normalize("NFD").replace(/\p{Diacritic}+/gu, "")
    );

    // Create mapping from normalized code point index to original code point index
    const normToOrig: number[] = [];
    let iOrig = 0;
    let iNorm = 0;
    while (
      iOrig < originalCodePoints.length &&
      iNorm < normalizedCodePoints.length
    ) {
      const origChar = originalCodePoints[iOrig];
      const folded = origChar.normalize("NFD").replace(/\p{Diacritic}+/gu, "");
      // folded may have length 0 (for pure combining), 1 or more; advance norm by its length
      const len = Array.from(folded).length || 0;
      for (let k = 0; k < len; k += 1) {
        normToOrig[iNorm + k] = iOrig;
      }
      iNorm += len;
      iOrig += 1;
    }

    const startOrig = normToOrig[start] ?? 0;
    const endOrig =
      normToOrig[start + normalizedQuery.length - 1] ??
      originalCodePoints.length - 1;

    const before = originalCodePoints.slice(0, startOrig).join("");
    const match = originalCodePoints.slice(startOrig, endOrig + 1).join("");
    const after = originalCodePoints.slice(endOrig + 1).join("");

    return (
      <>
        {before}
        <mark className="bg-yellow-300/70 px-0.5 rounded-sm">{match}</mark>
        {after}
      </>
    );
  };
  return (
    <div className="relative">
      <div
        className={cn(
          "relative p-1 shadow-2xl",
          isCenter && unlocked && "group"
        )}
      >
        <div className="relative aspect-[3/5] w-48 sm:w-56 md:w-64 lg:w-80 xl:w-96 [perspective:1200px]">
          <div
            className={cn(
              "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
              isCenter && unlocked && "group-hover:[transform:rotateY(180deg)]",
              isFlipped && unlocked && "[transform:rotateY(180deg)]"
            )}
          >
            {/* Front side */}
            <div className="absolute inset-0 [backface-visibility:hidden]">
              {!unlocked ? (
                <>
                  <Image
                    src="https://res.cloudinary.com/dznt9yias/image/upload/v1760722617/Group_104_otxy0s.svg"
                    alt="Hidden framed card"
                    fill
                    sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 18vw"
                    className="object-contain"
                    priority={isCenter}
                  />
                </>
              ) : (
                <>
                  <FramedImage
                    src={
                      imageSrc ||
                      "https://res.cloudinary.com/dznt9yias/image/upload/v1760722617/Group_104_otxy0s.svg"
                    }
                    alt="Kỳ nhân card"
                  />
                </>
              )}
            </div>

            {/* Back side (shown on flip for unlocked center card) */}
            {unlocked && (
              <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <Image
                  src={
                    backContent?.backgroundSrc ||
                    "https://res.cloudinary.com/dznt9yias/image/upload/v1760726112/revealedBG_gzuiid.svg" ||
                    "/placeholder.svg"
                  }
                  alt="Revealed background"
                  fill
                  sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 18vw"
                  className="object-contain"
                  priority={isCenter}
                />
                <div className="absolute inset-2 sm:inset-3 md:inset-4 lg:inset-6 xl:inset-8 border border-[#be9b36]/60 rounded-md px-3 sm:px-4 md:px-5 py-4 sm:py-5 md:py-6 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 flex flex-col mt-2 sm:mt-3 md:mt-4 space-y-3 sm:space-y-4 overflow-hidden">
                    {/* Name - Section 1 */}
                    {backContent?.name && (
                      <div className="text-lg sm:text-base md:text-lg font-extrabold text-black leading-tight text-left break-words overflow-hidden">
                        <div
                          className="overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            wordBreak: "break-word",
                          }}
                        >
                          {renderHighlighted(backContent.name)}
                        </div>
                      </div>
                    )}

                    {/* Thoi Ky - Section 2 */}
                    {backContent?.thoiKy && (
                      <div className="text-xs sm:text-sm md:text-base leading-relaxed text-black italic text-left break-words overflow-hidden">
                        <div
                          className="overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            wordBreak: "break-word",
                          }}
                        >
                          {renderHighlighted(backContent.thoiKy)}
                        </div>
                      </div>
                    )}

                    {/* Chien Cong - Section 3 */}
                    {backContent?.chienCong && (
                      <div className="text-xs lg:text-base font-extrabold leading-relaxed text-black text-left flex-1 break-words overflow-y-auto custom-scrollbar-thin">
                        <div
                          className="overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            wordBreak: "break-word",
                          }}
                        >
                          {renderHighlighted(backContent.chienCong)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  {(backContent?.ctaText ||
                    backContent?.ctaHref ||
                    onCtaClick) && (
                      <div className="w-full flex justify-center mt-3 sm:mt-4">
                        {backContent?.ctaHref && !onCtaClick ? (
                          <Link
                            href={backContent.ctaHref}
                            className="cursor-pointer rounded-2xl bg-[#C49B39] border-gray-300 border-2 text-black px-4 py-2 sm:px-10 sm:py-2.5 text-xl sm:text-sm md:text-base font-normal shadow-md"
                          >
                            {backContent?.ctaText || "Xem Thêm"}
                          </Link>
                        ) : (
                          <button
                            onClick={onCtaClick}
                            className="cursor-pointer rounded-2xl bg-[#C49B39] border-gray-300 border-2 text-black px-4 py-2 sm:px-10 sm:py-2.5 text-xl sm:text-sm md:text-base font-normal shadow-md"
                          >
                            {backContent?.ctaText || "Xem Thêm"}
                          </button>
                        )}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isCenter && (
        <div className="absolute inset-0 rounded-lg blur-xl -z-10" />
      )}
    </div>
  );
}
