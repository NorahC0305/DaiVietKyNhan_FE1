"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useAchievements, Achievement } from "@hooks/useAchievements";

type RewardDisplay =
  | { type: "coins"; amount: number }
  | { type: "text"; label: string };

// Achievement type is now imported from the hook

export type AchievementsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (achievementId: string) => void;
  isClaiming?: boolean;
};

function normalizeRewardDisplay(ach: Achievement): RewardDisplay {
  if (ach.reward) {
    return ach.reward.unit === "COIN"
      ? { type: "coins", amount: ach.reward.amount }
      : { type: "text", label: ach.reward.label };
  }

  const raw = ach.rewardLabel ?? "";
  const normalized = raw.trim().toLowerCase();
  const xuIndex = normalized.indexOf("xu");
  if (xuIndex !== -1) {
    const numberText = normalized.slice(0, xuIndex).replace(/[^0-9]/g, "");
    const amount = Number(numberText);
    if (!Number.isNaN(amount) && amount > 0) {
      return { type: "coins", amount };
    }
  }
  return { type: "text", label: raw };
}

// Function to get the correct button image based on status
function getButtonImage(status: "PENDING" | "COMPLETED" | "CLAIMED"): string {
  switch (status) {
    case "PENDING":
      return "https://res.cloudinary.com/dauhpllo7/image/upload/v1763392811/Property_1_Chu%CC%9Ba_%C4%91u%CC%89_%C4%91e%CC%82%CC%89_%C4%91o%CC%82%CC%89i_lu6jbu.svg"; // PENDING means chưa đủ để nhận
    case "COMPLETED":
      return "https://res.cloudinary.com/dauhpllo7/image/upload/v1763392831/Property_1_%C4%90u%CC%89_%C4%91e%CC%82%CC%89_%C4%91o%CC%82%CC%89i_p3w8gc.svg"; // COMPLETED means đủ để nhận
    case "CLAIMED":
      return "https://res.cloudinary.com/dauhpllo7/image/upload/v1763392811/Property_1_Chu%CC%9Ba_%C4%91u%CC%89_%C4%91e%CC%82%CC%89_%C4%91o%CC%82%CC%89i_lu6jbu.svg";
    default:
      return "https://res.cloudinary.com/dauhpllo7/image/upload/v1763392811/Property_1_Chu%CC%9Ba_%C4%91u%CC%89_%C4%91e%CC%82%CC%89_%C4%91o%CC%82%CC%89i_lu6jbu.svg"; // CLAIMED shows chưa đủ để nhận
  }
}

export default function AchievementsModal({
  isOpen,
  onClose,
  onClaim,
  isClaiming = false,
}: AchievementsModalProps) {
  const { achievements, loading, error, fetchAchievements } =
    useAchievements(isOpen);
  const handleClaim = async (achievementId: string) => {
    await onClaim(achievementId);
    // Refresh achievements data after successful claim
    await fetchAchievements();
  };
  const displayItems = useMemo(() => {
    return achievements.map((a) => ({
      achievement: a,
      reward: normalizeRewardDisplay(a),
    }));
  }, [achievements]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl sm:max-w-5xl mx-2 sm:mx-4"
          >
            <div className="relative w-full overflow-hidden">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/frame1.png"
                  alt="Khung giấy"
                  fill
                  priority
                  sizes="(max-width: 768px) 95vw, (max-width: 1280px) 100vw, 1280px"
                  style={{ objectFit: "contain" }}
                />
              </div>

              <div
                className="absolute flex flex-col items-center justify-between py-2 sm:py-6"
                style={{ top: "14%", right: "10%", bottom: "14%", left: "10%" }}
              >
                <div className="w-full max-w-3xl mx-auto text-center space-y-2 sm:space-y-4 px-2 sm:px-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#835D26] font-bd-street-sign leading-tight">
                    HỆ THỐNG THÀNH TỰU
                  </h2>
                  <button
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 cursor-pointer p-1 sm:p-2"
                    onClick={onClose}
                    aria-label="Đóng"
                  >
                    <span className="block relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                      <Image
                        src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763391063/Tr%E1%BB%9F_l%E1%BA%A1i_trang_tr%C6%B0%E1%BB%9Bc_t1jpaz.png"
                        alt="Đóng"
                        fill
                        sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
                        style={{ objectFit: "contain" }}
                      />
                    </span>
                  </button>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 mt-2 sm:mt-4 lg:mt-6 px-2 sm:px-4 lg:px-6 max-w-3xl overflow-y-auto custom-scrollbar flex-1">
                  {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 gap-3">
                      <Loader2 className="h-8 w-8 text-[#835D26] animate-spin" />
                      <div className="text-[#835D26] font-medium">
                        Đang tải dữ liệu...
                      </div>
                    </div>
                  ) : error ? (
                    <div className="col-span-full flex items-center justify-center py-8">
                      <div className="text-red-600 font-medium">{error}</div>
                    </div>
                  ) : achievements.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 gap-3">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2">
                        <Image
                          src="https://res.cloudinary.com/dznt9yias/image/upload/v1761021351/box_g9zasq.png"
                          alt="Không có thành tựu"
                          fill
                          sizes="(max-width: 640px) 64px, 80px"
                          style={{ objectFit: "contain", opacity: 0.6 }}
                        />
                      </div>
                      <div className="text-[#835D26] font-medium text-lg">
                        Không có thành tựu nào
                      </div>
                    </div>
                  ) : (
                    displayItems.map(({ achievement, reward }) => (
                      <div
                        key={achievement.id}
                        className="rounded-tr-4xl rounded-b-2xl bg-[#F7E6BB] shadow-sm p-0"
                      >
                        <div className="bg-[#E8A64D] text-white rounded-tr-4xl rounded-tl-md px-5 py-3 sm:px-6 sm:py-3.5 font-semibold text-lg sm:text-xl lg:text-2xl leading-tight">
                          {achievement.title}
                        </div>
                        <div className="h-[2px] w-full bg-[#EBD9A8]" />
                        <div className="p-3 sm:p-4">
                          <div className="mt-1 sm:mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-[#2B2B2B] font-semibold">
                                Thưởng:
                              </span>
                              {reward.type === "coins" ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[#2B2B2B] text-lg sm:text-xl font-semibold">
                                    {reward.amount}
                                  </span>
                                  <Image
                                    src="/DVKN coin.svg"
                                    alt="coin"
                                    width={28}
                                    height={28}
                                    className="w-6 h-6 sm:w-7 sm:h-7"
                                  />
                                </div>
                              ) : (
                                <span className="text-[#2B2B2B] text-lg sm:text-xl font-semibold">
                                  {reward.label}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() =>
                                achievement.status === "COMPLETED" &&
                                handleClaim(achievement.achievementId.toString())
                              }
                              disabled={
                                achievement.status !== "COMPLETED" || isClaiming
                              }
                              className="relative cursor-pointer px-4 sm:px-5 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors disabled:cursor-not-allowed text-white hover:opacity-90 min-w-[72px] min-h-[36px] overflow-hidden"
                            >
                              <Image
                                src={getButtonImage(achievement.status)}
                                alt="Button background"
                                fill
                                className="absolute inset-0 object-cover transition-all duration-300"
                                sizes="(max-width: 640px) 72px, (max-width: 1024px) 90px, 100px"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
