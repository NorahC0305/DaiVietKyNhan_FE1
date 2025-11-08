"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import { cn } from "@/utils/CN";
import Avartar from "@components/Atoms/Avartar";
import frame from "../../../../public/frame.svg";
import heart from "../../../../public/Heart.svg";
import heart2 from "../../../../public/Heart (1).svg";
import frameCoin from "../../../../public/FrameCoin.svg";
import { Plus } from "lucide-react";
import AchievementsModal from "../Popup/AchievementsModal";
import LetterGuide from "../Popup/LetterGuide";
import AirEvent from "../Popup/AirEvent";
import RedeemModal from "../Popup/RedeemModal";
import BuyMoreLife from "../Popup/BuyMoreLife";
import CorrectGiftCode from "../Popup/CorrectGiftCode";
import InputGiftCode from "../Popup/InputGiftCode";
import IncorrectGiftCode from "../Popup/IncorrectGiftCode";
import Guide from "../Popup/Guide";
import { IMeResponse } from "@models/user/response";
import { useUserDataContextSafe } from "@contexts/UserDataContext";
import userService from "@services/user";
import userAchievementService from "@services/user-achievement";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import ChiTietThu from "../Popup/ChiTietThu";
import VietThuGuiHauThe from "../Popup/VietThuGuiHauThe";
import DanhSachVietThu from "../Popup/DanhSachVietThu";

interface GameFrameProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  user: IMeResponse["data"] | null;
  slug?: string;
}

export const GameFrame: React.FC<GameFrameProps> = ({
  children,
  className,
  padding = "p-12 md:p-16",
  user: propUser,
  slug,
}) => {
  // console.log(propUser);
  const router = useRouter();

  // Use context user data if available, fallback to prop
  const context = useUserDataContextSafe();
  const contextUser = context?.userData || null;
  const refreshUserData = context?.refreshUserData || null;
  const user = contextUser || propUser;
  /**
   * Achievement Modal
   */
  const [isAchievementModalOpen, setIsAchievementModalOpen] =
    useState<boolean>(false);
  const [isClaimingAchievement, setIsClaimingAchievement] =
    useState<boolean>(false);

  const onAchievementClick = useCallback(() => {
    setIsAchievementModalOpen(!isAchievementModalOpen);
  }, [isAchievementModalOpen]);

  const handleClaimAchievement = useCallback(
    async (achievementId: string) => {
      if (!refreshUserData) return;

      setIsClaimingAchievement(true);
      try {
        const response = (await userAchievementService.claimAchievement(
          parseInt(achievementId)
        )) as any;

        if (response?.statusCode === 200) {
          toast.success("Nhận thưởng thành công!");
          // Refresh user data to show updated coins/points
          await refreshUserData();
        } else {
          toast.error(response?.message || "Có lỗi xảy ra khi nhận thưởng.");
        }
      } catch (error) {
        console.error("Error claiming achievement:", error);
        toast.error("Có lỗi xảy ra khi nhận thưởng. Vui lòng thử lại.");
      } finally {
        setIsClaimingAchievement(false);
      }
    },
    [refreshUserData]
  );
  //--------------------------End--------------------------//

  /**
   * Letter Guide Modal (shows first)
   */
  const [isLetterGuideModalOpen, setIsLetterGuideModalOpen] =
    useState<boolean>(false);
  const onLetterGuideClick = useCallback(() => {
    setIsLetterGuideModalOpen(!isLetterGuideModalOpen);
  }, [isLetterGuideModalOpen]);

  const handleLetterGuideNext = useCallback(() => {
    setIsLetterGuideModalOpen(false);
    // setIsAirEventModalOpen(true);
    setIsVietThuGuiHauTheModalOpen(true);
  }, []);

  const [isDanhSachVietThuModalOpen, setIsDanhSachVietThuModalOpen] =
    useState<boolean>(false);

  const [isChiTietThuModalOpen, setIsChiTietThuModalOpen] =
    useState<boolean>(false);

  const handleLetterGuideViewLetters = useCallback(() => {
    setIsLetterGuideModalOpen(false);
    setIsDanhSachVietThuModalOpen(true);
  }, []);

  const handleVietThuBack = useCallback(() => {
    setIsVietThuGuiHauTheModalOpen(false);
    setIsLetterGuideModalOpen(true);
  }, []);

  const handleChiTietParticipate = useCallback(() => {
    setIsChiTietThuModalOpen(false);
    setIsVietThuGuiHauTheModalOpen(true);
  }, []);

  const handleDanhSachBack = useCallback(() => {
    setIsDanhSachVietThuModalOpen(false);
    setIsLetterGuideModalOpen(true);
  }, []);

  const handleDanhSachOpenDetail = useCallback(() => {
    setIsDanhSachVietThuModalOpen(false);
    setIsChiTietThuModalOpen(true);
  }, []);

  const handleChiTietBack = useCallback(() => {
    setIsChiTietThuModalOpen(false);
    setIsDanhSachVietThuModalOpen(true);
  }, []);

  /**
   * Air Event Modal (shows after LetterGuide)
   */
  const [isAirEventModalOpen, setIsAirEventModalOpen] =
    useState<boolean>(false);
  const [isVietThuGuiHauTheModalOpen, setIsVietThuGuiHauTheModalOpen] =
    useState<boolean>(false);
  //--------------------------End--------------------------//

  /**
   * Redeem Modal
   */
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState<boolean>(false);
  const onRedeemClick = useCallback(() => {
    setIsRedeemModalOpen(!isRedeemModalOpen);
  }, [isRedeemModalOpen]);
  //--------------------------End--------------------------//

  /**
   * Buy More Life Modal
   */
  const [isBuyMoreLifeModalOpen, setIsBuyMoreLifeModalOpen] =
    useState<boolean>(false);
  const [isBuyingLife, setIsBuyingLife] = useState<boolean>(false);
  const coinCost = 200; // Cost to buy one heart

  const onBuyMoreLifeClick = useCallback(() => {
    if (!user) return;

    // Check if user has enough coins before opening modal
    if (user.coin < coinCost) {
      toast.error(
        `Bạn cần ít nhất ${coinCost} xu để mua thêm tim. Số xu hiện tại: ${user.coin.toLocaleString()}`
      );
      return;
    }

    setIsBuyMoreLifeModalOpen(!isBuyMoreLifeModalOpen);
  }, [isBuyMoreLifeModalOpen, user, coinCost]);

  const handleBuyMoreLife = useCallback(async () => {
    if (!refreshUserData || !user) return;

    setIsBuyingLife(true);
    try {
      // Call the addHeart API
      const response = (await userService.addHeart()) as any;

      if (response?.statusCode === 200) {
        toast.success("Mua thêm tim thành công!");
        // Refresh user data to show updated coins and hearts
        await refreshUserData();
        setIsBuyMoreLifeModalOpen(false);
      } else {
        toast.error(response?.message || "Có lỗi xảy ra khi mua thêm tim.");
      }
    } catch (error) {
      console.error("Error buying more life:", error);
      toast.error("Có lỗi xảy ra khi mua thêm tim. Vui lòng thử lại.");
    } finally {
      setIsBuyingLife(false);
    }
  }, [refreshUserData, user, coinCost]);
  //--------------------------End--------------------------//

  /**
   * Input Gift Code Modal
   */
  const [isInputGiftCodeModalOpen, setIsInputGiftCodeModalOpen] =
    useState<boolean>(false);
  const onInputGiftCodeClick = useCallback(() => {
    setIsInputGiftCodeModalOpen(!isInputGiftCodeModalOpen);
  }, [isInputGiftCodeModalOpen]);

  const [isIncorrectGiftCodeModalOpen, setIsIncorrectGiftCodeModalOpen] =
    useState<boolean>(false);
  const onIncorrectGiftCodeClick = useCallback(() => {
    setIsIncorrectGiftCodeModalOpen(!isIncorrectGiftCodeModalOpen);
  }, [isIncorrectGiftCodeModalOpen]);
  //--------------------------End--------------------------//

  const [isCorrectGiftCodeModalOpen, setIsCorrectGiftCodeModalOpen] =
    useState<boolean>(false);
  const onCorrectGiftCodeClick = useCallback(() => {
    setIsCorrectGiftCodeModalOpen(!isCorrectGiftCodeModalOpen);
  }, [isCorrectGiftCodeModalOpen]);
  //--------------------------End--------------------------//

  /**
   * Guide Modal
   */
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const path = usePathname();

  // Mapping slug to land
  const getLandFromSlug = (
    slug?: string
  ): "Sơn Tinh" | "Thánh Gióng" | "Chử Đồng Tử" | "Liễu Hạnh" => {
    const slugToLandMap: Record<
      string,
      "Sơn Tinh" | "Thánh Gióng" | "Chử Đồng Tử" | "Liễu Hạnh"
    > = {
      "nui-tan-vien": "Sơn Tinh",
      "dam-da-trach": "Chử Đồng Tử",
      "lang-phu-dong": "Thánh Gióng",
      "phu-tay-ho": "Liễu Hạnh",
    };

    return slug && slugToLandMap[slug] ? slugToLandMap[slug] : "Sơn Tinh";
  };

  const land = getLandFromSlug(slug);
  const onGuideClick = useCallback(() => {
    setIsGuideModalOpen(!isGuideModalOpen);
  }, [isGuideModalOpen]);
  //--------------------------End--------------------------//

  // Helper function to render hearts based on user's heart count
  const renderHearts = () => {
    const heartCount = (user as any)?.heart || 0;
    const hearts = [];

    for (let i = 0; i < 3; i++) {
      hearts.push(
        <div
          key={i}
          className="relative lg:w-[30px] lg:h-[30px] w-[18px] h-[18px]"
        >
          <Image src={i < heartCount ? heart : heart2} alt="heart" fill />
        </div>
      );
    }
    return hearts;
  };

  const handleToHome = useCallback(() => {
    router.back();
  }, []);

  return (
    <div
      className={cn("relative w-full h-screen min-h-screen z-50", className)}
    >
      {/* Avatar */}
      <div className="absolute ml-4 lg:top-6 top-3 left-0 flex items-center justify-center">
        <Avartar>
          {(user as any)?.figure?.imageUrl ? (
            <div className="relative lg:w-12 lg:h-12 w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={(user as any).figure.imageUrl}
                alt="User Figure"
                fill
                className="object-cover object-top scale-400 mt-7"
              />
            </div>
          ) : (
            <div className="relative lg:w-[18px] lg:h-[18px] w-[14px] h-[14px]">
              <Image
                src="/game-frame/corner-tl.svg"
                alt="Top Left Corner"
                fill
              />
            </div>
          )}
        </Avartar>
        <div className="flex items-center justify-center">
          <div className="relative top-0 left-0 flex items-center justify-center lg:ml-5 ml-3 drop-shadow-2xl ">
            <div className="relative lg:w-[180px] lg:h-[55px] w-[100px] h-[40px]">
              <Image src={frame} alt="frame" fill />
            </div>
            <div className="absolute top-0 left-0 flex justify-center items-center h-full w-full gap-2">
              {renderHearts()}
            </div>
          </div>
          <Plus
            color="red"
            className="ml-1 cursor-pointer drop-shadow-2xl hover:opacity-60 transition-all duration-300"
            strokeWidth={3}
            size={25}
            onClick={onBuyMoreLifeClick}
          />
        </div>
      </div>

      {/* Point/Coin */}
      <div className="absolute mr-4 top-1.5 -right-2 lg:right-0 flex items-center justify-center">
        <div className="relative top-1 lg:top-2 left-0 flex items-center justify-center">
          <div className="relative w-[100px] h-[45px] lg:w-[180px] lg:h-[85px]">
            <Image src={frameCoin} alt="coin" className="mt-3" fill />
            <div className="absolute top-2 lg:top-1.5 -left-1 lg:left-0 flex justify-center items-center h-full w-full gap-2">
              <span className="text-xs lg:text-xl font-bold ml-8 text-amber-500">
                {user?.coin?.toLocaleString() || "0"}
              </span>
            </div>
          </div>

          <Plus
            color="#FFDD3D"
            className="mt-3 -ml-1 cursor-pointer drop-shadow-2xl hover:opacity-60 transition-all duration-300"
            strokeWidth={3}
            size={25}
            onClick={onInputGiftCodeClick}
          />
        </div>

        <div className="relative top-0 left-0 flex items-center justify-center ml-2">
          <div className="relative w-[100px] h-[45px] lg:w-[180px] lg:h-[70px]">
            <Image src={frame} alt="frame" className="mt-3" fill />
            <div className="absolute top-3 lg:top-3.5 left-0 flex justify-center items-center h-full w-full gap-2">
              <span className="text-xs lg:text-xl font-bold text-amber-500">
                {user?.point?.toLocaleString() || "0"} ĐIỂM
              </span>
            </div>
          </div>

          <button
            onClick={handleToHome}
            className="relative w-[35px] h-[35px] lg:w-[65px] lg:h-[65px] top-0 left-0 flex items-center justify-center ml-2 cursor-pointer hover:opacity-80 transition-all duration-300"
          >
            <Image
              src="https://res.cloudinary.com/dznt9yias/image/upload/v1760721841/X_lqpgdp.svg"
              alt="X"
              className="mt-3"
              fill
            />
          </button>
        </div>
      </div>

      {children}

      {/* Achievement */}
      <div className="absolute ml-4 bottom-0 left-0 flex items-end">
        <div className="flex flex-col items-start justify-center">
          <div
            className="relative w-[130px] h-[50px] lg:w-[230px] lg:h-[90px] hover:opacity-80 transition-all duration-300 cursor-pointer"
            onClick={onAchievementClick}
          >
            <Image
              src="https://res.cloudinary.com/dznt9yias/image/upload/v1760727027/achievement_vi5gxo.svg"
              alt="achievement"
              className="mt-3 cursor-pointer"
              fill
            />
          </div>
          <div
            className="relative w-[110px] h-[49px] lg:w-[200px] lg:h-[100px] -left-2 lg:-left-1 hover:opacity-80 transition-all duration-300 cursor-pointer"
            onClick={onRedeemClick}
          >
            <Image
              src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726864/gift_ubfyga.svg"
              alt="gift"
              className="cursor-pointer"
              fill
            />
          </div>
        </div>
      </div>

      {/* Suggest */}
      <div className="absolute bottom-0 right-0 flex items-end">
        <div className="flex flex-col items-end justify-center">
          <div
            className="relative w-[100px] h-[60px] lg:w-[180px] lg:h-[100px] hover:opacity-80 transition-all duration-300 cursor-pointer"
            onClick={onLetterGuideClick}
          >
            <Image
              src="https://res.cloudinary.com/dznt9yias/image/upload/v1760815558/Vi%E1%BA%BFt_Th%C6%B0_hmaabr.svg"
              alt="achievement"
              className="cursor-pointer"
              fill
            />
          </div>
          <div
            className="relative w-[50px] h-[50px] lg:w-[80px] lg:h-[80px] right-2 lg:right-4 hover:opacity-80 transition-all duration-300 cursor-pointer"
            onClick={onGuideClick}
          >
            <Image
              src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726885/guide_pvrmm1.svg"
              alt="gift"
              className="cursor-pointer"
              fill
            />
          </div>
        </div>
      </div>

      <AchievementsModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        onClaim={handleClaimAchievement}
        isClaiming={isClaimingAchievement}
      />
      <LetterGuide
        isOpen={isLetterGuideModalOpen}
        onClose={() => setIsLetterGuideModalOpen(false)}
        onNext={handleLetterGuideNext}
        onBack={handleLetterGuideViewLetters}
      />
      <DanhSachVietThu
        isOpen={isDanhSachVietThuModalOpen}
        onClose={() => setIsDanhSachVietThuModalOpen(false)}
        onBack={handleDanhSachBack}
        onOpenDetail={handleDanhSachOpenDetail}
      />
      <ChiTietThu
        isOpen={isChiTietThuModalOpen}
        onClose={() => setIsChiTietThuModalOpen(false)}
        onBack={handleChiTietBack}
        onParticipate={handleChiTietParticipate}
      />
      <AirEvent
        isOpen={isAirEventModalOpen}
        onClose={() => setIsAirEventModalOpen(false)}
      />
      <RedeemModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        onRedeem={() => { }}
      />
      <BuyMoreLife
        isOpen={isBuyMoreLifeModalOpen}
        onClose={() => setIsBuyMoreLifeModalOpen(false)}
        onBuy={handleBuyMoreLife}
        coinCost={coinCost}
        isBuying={isBuyingLife}
      />
      <InputGiftCode
        isOpen={isInputGiftCodeModalOpen}
        onClose={() => setIsInputGiftCodeModalOpen(false)}
      />
      <CorrectGiftCode
        isOpen={isCorrectGiftCodeModalOpen}
        onClose={() => setIsCorrectGiftCodeModalOpen(false)}
        coinsReward={500}
      />
      <IncorrectGiftCode
        isOpen={isIncorrectGiftCodeModalOpen}
        onClose={() => setIsIncorrectGiftCodeModalOpen(false)}
        coinsReward={500}
      />
      <Guide
        user={user}
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
      <VietThuGuiHauThe
        isOpen={isVietThuGuiHauTheModalOpen}
        onClose={() => setIsVietThuGuiHauTheModalOpen(false)}
        onBack={handleVietThuBack}
      />
    </div>
  );
};
