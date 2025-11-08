"use client";

import CharacterCard from "@containers/Starter/Select-character/Components/CharacterCard";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@routes";
import { IFigure } from "@models/figure/entity";
import figureService from "@services/figure";

interface SelectCharacterPageProps {
  figures: IFigure[];
}

const SelectCharacterPage = React.memo(
  ({ figures }: SelectCharacterPageProps) => {
    const router = useRouter();
    const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
      null
    );

    const handleCharacterSelect = useCallback((figureId: number) => {
      setSelectedCharacter(figureId);
    }, []);

    const handleContinue = useCallback(async () => {
      if (!selectedCharacter) return;
      try {
        await figureService.chooseFigure(selectedCharacter);
      } finally {
        router.push(ROUTES.STARTER.ENTRY_TEST);
      }
    }, [selectedCharacter, router]);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {/* Main Content Frame */}
        <div className="relative bg-amber-50/70 border-3 border-[#835D26] rounded-2xl p-8 max-w-3xl w-full shadow-2xl">
          {/* Question Text */}
          <div className="text-center mb-8 text-xl font-bold text-[#835D26]">
            Bạn muốn tham gia vào Kỳ Giới với phiên bản Kỳ Chủ nào?
          </div>

          {/* Character Selection */}
          <div className="flex justify-center gap-8 mb-6">
            {figures?.map((figure, index) => (
              <CharacterCard
                key={figure.id}
                characterImage={figure.imageUrl}
                alt={index === 0 ? "Nam Kỳ Chủ" : "Nữ Kỳ Chủ"}
                isSelected={selectedCharacter === figure.id}
                onClick={() => handleCharacterSelect(figure.id)}
              />
            ))}
          </div>

          {/* Continue Button */}
          {selectedCharacter && (
            <div className="text-center">
              <button
                onClick={handleContinue}
                className="cursor-pointer bg-[#835D26] hover:bg-[#9d7d4f] text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Tiếp tục
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default SelectCharacterPage;
