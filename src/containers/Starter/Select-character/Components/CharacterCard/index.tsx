import React from "react";
import Image from "next/image";

interface CharacterCardProps {
  characterImage: string;
  alt: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = React.memo(
  ({ characterImage, alt, isSelected = false, onClick }) => {
    return (
      <div
        className={`
        relative cursor-pointer transition-all duration-300
        ${isSelected ? "scale-105" : "hover:scale-102"}
      `}
        onClick={onClick}
      >
        <div
          className={`
        relative w-full h-auto rounded-lg transition-all duration-300
        ${
          isSelected
            ? "border-2 border-[#835D26] shadow-md"
            : "border border-transparent"
        }
      `}
        >
          <Image
            src={characterImage}
            alt={alt}
            width={400}
            height={400}
            className="object-contain rounded-lg"
            priority
          />
        </div>
      </div>
    );
  }
);

export default CharacterCard;
