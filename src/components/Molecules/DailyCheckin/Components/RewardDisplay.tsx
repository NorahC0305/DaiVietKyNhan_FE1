import React, { memo } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

const RewardDisplay: React.FC<ICOMPONENTS.RewardDisplayProps> = memo(
  ({ reward, className = "" }) => (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <div className="flex items-center justify-center">
        <div className="relative top-0 left-0 flex items-center justify-center lg:ml-5 ml-3 drop-shadow-2xl ">
          <div className="relative lg:w-[180px] lg:h-[75px] w-[140px] h-[60px]">
            <Image src={"https://res.cloudinary.com/dauhpllo7/image/upload/v1763399184/Khung_xu_e0gu4j.png"} alt="frame" fill />
          </div>
          <div className="absolute -top-1 left-3 flex justify-center items-center h-full w-full gap-2">
            {reward.toLocaleString()}
          </div>
        </div>
        <Plus
          color="#FFDD3D"
          className="cursor-pointer text-center justify-center items-center drop-shadow-2xl hover:opacity-60 transition-all duration-300 -ml-8"
          strokeWidth={3}
          size={25}
        // onClick={onBuyMoreLifeClick}
        />
      </div>
    </div>
  )
);

RewardDisplay.displayName = "RewardDisplay";

export default RewardDisplay;
