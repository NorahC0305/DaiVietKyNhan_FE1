"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import MapRegion from "./Components/MapRegion";
import MobileRegion from "./Components/MobileRegion";
import ForceLandscape from "@/components/Atoms/ForceLandscape";
import IncompleteRegion from "@/components/Molecules/Popup/IncompleteRegion";
import WaitingOthers from "@/components/Molecules/Popup/WaitingOthers";
import LetterGuide from "@/components/Molecules/Popup/LetterGuide";
import DanhSachVietThu from "@/components/Molecules/Popup/DanhSachVietThu";
import ChiTietThu from "@/components/Molecules/Popup/ChiTietThu";
import VietThuGuiHauThe from "@/components/Molecules/Popup/VietThuGuiHauThe";
import { IUserLandWithLandEntity } from "@models/user-land/entity";
import { IUserLandWithLandResponseModel } from "@models/user-land/response";
import { LAND } from "@constants/land";
import userLandService from "@services/user-land";
import { ROUTES } from "@routes";
import { IMeResponse } from "@models/user/response";
import { ILetterEntity } from "@models/letter/entity";

// --- Dữ liệu gốc của các regions, bao gồm `position` ---
const baseRegions: ICOMPONENTS.Region[] = [
  {
    id: "phu-tay-ho",
    name: "Phủ Tây Hồ",
    imageSrc:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1760722471/Phu%CC%89_Ta%CC%82y_Ho%CC%82%CC%80_1_iqoem3.svg",
    position: { top: "-13%", right: "-3%" },
    size: { width: 1220, height: 680 },
    hitboxScale: 0.55,
    hitboxOffset: { x: 0.3, y: 0 },
    description: "...",
  },
  {
    id: "nui-tan-vien",
    name: "Núi Tản Viên",
    imageSrc:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1760722470/Nu%CC%81i_Ta%CC%89n_Vie%CC%82n_1_yaa5yf.svg",
    position: { top: "-8.5%", left: "-8.7%" },
    size: { width: 1270, height: 760 },
    zIndex: 15,
    hitboxScale: 0.6,
    hitboxOffset: { x: -0.08, y: 0 },
    description: "...",
  },
  {
    id: "ky-linh-viet-hoa",
    name: "Kỳ Linh Việt Hỏa",
    imageSrc:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1760722420/Ky%CC%80_Linh_Vie%CC%A3%CC%82t_Ho%CC%89a_1_mvwrlg.svg",
    position: { top: "26%", left: "33.7%" },
    size: { width: 766, height: 490 },
    zIndex: 20,
    hitboxScale: 0.4,
    hitboxOffset: { x: 0, y: 0 },
    description: "...",
  },
  {
    id: "dam-da-trach",
    name: "Đầm Dạ Trạch",
    imageSrc:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1760722555/%C4%90a%CC%82%CC%80m_Da%CC%A3_Tra%CC%A3ch_1_bbfigz.svg",
    position: { bottom: "-8%", left: "-0.1%" },
    size: { width: 1120, height: 620 },
    hitboxScale: 0.8,
    hitboxOffset: { x: -0.1, y: 0.2 },
    description: "...",
  },
  {
    id: "lang-phu-dong",
    name: "Làng Phù Đổng",
    imageSrc:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1760722422/La%CC%80ng_Phu%CC%80_%C4%90o%CC%82%CC%89ng_1_e7tht5.svg",
    position: { bottom: "-10%", right: "-12%" },
    size: { width: 1320, height: 740 },
    hitboxScale: 0.6,
    hitboxOffset: { x: 0.1, y: 0.1 },
    description: "...",
  },
];

// Cấu hình riêng cho mobile regions
const mobileRegionsConfig = {
  "phu-tay-ho": {
    position: { top: "0%", right: "0%" },
    size: { width: 480, height: 100 },
  },
  "nui-tan-vien": {
    position: { top: "0%", left: "0%" },
    size: { width: 380, height: 220 },
  },
  "ky-linh-viet-hoa": {
    position: { top: "48%", left: "53%", transform: "translate(-50%, -50%)" },
    size: { width: 120, height: 120 },
  },
  "dam-da-trach": {
    position: { bottom: "0%", left: "0%" },
    size: { width: 460, height: 140 },
  },
  "lang-phu-dong": {
    position: { bottom: "0%", right: "0%" },
    size: { width: 360, height: 200 },
  },
};

const mainMapImage =
  "https://res.cloudinary.com/dznt9yias/image/upload/v1761121694/Trang_map_Ky%CC%80_Gio%CC%9B%CC%81i_e6kyap.svg";

// TODO: Tạm thời mở khóa tất cả map để review. Sau khi hoàn thành, đổi thành false
const TEMP_UNLOCK_ALL = false;

// Mapping từ region ID đến land ID dựa trên userLand data
// Dựa trên userLand response:
// - land ID 1="Sơn Tinh" (PENDING)
// - land ID 2="Chử Đồng Tử" (LOCKED)
// - land ID 3="Thánh Gióng" (LOCKED)
// - land ID 4="Liễu Hạnh" (LOCKED)
// - "ky-linh-viet-hoa" là vùng đất đặc biệt, chỉ mở khi 4 vùng trước hoàn thành
const regionToLandIdMap: Record<string, number | null> = {
  "phu-tay-ho": 4, // Phủ Tây Hồ -> Liễu Hạnh (land ID 4) - LOCKED
  "nui-tan-vien": 1, // Núi Tản Viên -> Sơn Tinh (land ID 1) - PENDING
  "ky-linh-viet-hoa": null, // Kỳ Linh Việt Hỏa -> vùng đặc biệt, logic riêng trong isRegionUnlocked
  "dam-da-trach": 2, // Đầm Dạ Trạch -> Chử Đồng Tử (land ID 2) - LOCKED
  "lang-phu-dong": 3, // Làng Phù Đổng -> Thánh Gióng (land ID 3) - LOCKED
};

export default function MapPageClient({
  userLand: initialUserLand,
  user,
}: {
  userLand: IUserLandWithLandResponseModel[];
  user: IMeResponse["data"] | null;
}) {
  const router = useRouter();
  const [isIncompleteRegionModalOpen, setIsIncompleteRegionModalOpen] =
    useState(false);
  const [incompleteRegionMessage, setIncompleteRegionMessage] =
    useState<string>("");
  const [isWaitingOthersModalOpen, setIsWaitingOthersModalOpen] =
    useState(false);
  const [userLand, setUserLand] =
    useState<IUserLandWithLandResponseModel[]>(initialUserLand);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useState<number>(0);

  // Letter Guide Modal states
  const [isLetterGuideModalOpen, setIsLetterGuideModalOpen] = useState(false);
  const [isDanhSachVietThuModalOpen, setIsDanhSachVietThuModalOpen] =
    useState<boolean>(false);
  const [isChiTietThuModalOpen, setIsChiTietThuModalOpen] =
    useState<boolean>(false);
  const [selectedLetterId, setSelectedLetterId] = useState<number | null>(null);
  const [lettersList, setLettersList] = useState<ILetterEntity[]>([]);
  const [isVietThuGuiHauTheModalOpen, setIsVietThuGuiHauTheModalOpen] =
    useState<boolean>(false);

  // Function to fetch fresh userLand data
  const fetchUserLandData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userLandService.getUserLand();
      if (response && response.data) {
        // Check if the data has actually changed by comparing land statuses
        setUserLand((prevData) => {
          if (!prevData) {
            return response.data;
          }

          // Create maps for easier comparison
          const prevStatusMap = new Map(
            prevData.map((item) => [item.landId, item.status])
          );
          const newStatusMap = new Map(
            response.data.map((item) => [item.landId, item.status])
          );

          // Check if any status has actually changed
          const hasStatusChange = Array.from(newStatusMap.entries()).some(
            ([landId, newStatus]) => {
              const prevStatus = prevStatusMap.get(landId);
              return prevStatus !== newStatus;
            }
          );

          // Only update if there's actually a status change
          return hasStatusChange ? response.data : prevData;
        });
        setLastRefreshTimestamp(Date.now());
      }
    } catch (error) {
      console.error("Error fetching userLand data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to handle data refresh when returning from detail page
  useEffect(() => {
    // Check if we should refresh data (set when navigating to detail page)
    const shouldRefresh = sessionStorage.getItem("shouldRefreshMapData");
    const navigationTimestamp = sessionStorage.getItem("navigationTimestamp");

    if (shouldRefresh === "true") {
      // Clear the flag immediately
      sessionStorage.removeItem("shouldRefreshMapData");

      // Only refresh if we haven't refreshed recently (within 5 seconds) or if this is a fresh navigation
      const now = Date.now();
      const navTime = navigationTimestamp ? parseInt(navigationTimestamp) : 0;

      if (now - lastRefreshTimestamp > 5000 || navTime > lastRefreshTimestamp) {
        fetchUserLandData();
      }
    }

    const handlePageFocus = () => {
      // Check again for refresh flag when page regains focus
      const shouldRefresh = sessionStorage.getItem("shouldRefreshMapData");
      const navigationTimestamp = sessionStorage.getItem("navigationTimestamp");

      if (shouldRefresh === "true") {
        sessionStorage.removeItem("shouldRefreshMapData");

        // Only refresh if we haven't refreshed recently
        const now = Date.now();
        const navTime = navigationTimestamp ? parseInt(navigationTimestamp) : 0;

        if (
          now - lastRefreshTimestamp > 5000 ||
          navTime > lastRefreshTimestamp
        ) {
          fetchUserLandData();
        }
      }
    };

    // Listen for when the page regains focus
    window.addEventListener("focus", handlePageFocus);

    return () => {
      window.removeEventListener("focus", handlePageFocus);
    };
  }, [fetchUserLandData, lastRefreshTimestamp]);

  // Effect to update userLand state when initialUserLand prop changes
  useEffect(() => {
    setUserLand(initialUserLand);
  }, [initialUserLand]);

  // Effect to check query parameter and open LetterGuide modal
  useEffect(() => {
    // Check URL search params on client side
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const openLetterGuide = searchParams.get("openLetterGuide");
      if (openLetterGuide === "true") {
        setIsLetterGuideModalOpen(true);
        // Remove query parameter from URL without page reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  // Letter Guide handlers
  const handleLetterGuideNext = useCallback(() => {
    setIsLetterGuideModalOpen(false);
    setIsVietThuGuiHauTheModalOpen(true);
  }, []);

  const handleLetterGuideViewLetters = useCallback(() => {
    setIsLetterGuideModalOpen(false);
    setIsDanhSachVietThuModalOpen(true);
  }, []);

  const handleVietThuBack = useCallback(() => {
    setIsVietThuGuiHauTheModalOpen(false);
    setIsLetterGuideModalOpen(true);
  }, []);

  const handleDanhSachBack = useCallback(() => {
    setIsDanhSachVietThuModalOpen(false);
    setIsLetterGuideModalOpen(true);
  }, []);

  const handleDanhSachOpenDetail = useCallback(
    (letter: ILetterEntity, letters: ILetterEntity[]) => {
      setLettersList(letters);
      setSelectedLetterId(letter.id);
      setIsDanhSachVietThuModalOpen(false);
      setIsChiTietThuModalOpen(true);
    },
    []
  );

  const handleLetterChange = useCallback((letterId: number) => {
    setSelectedLetterId(letterId);
  }, []);

  const handleChiTietBack = useCallback(() => {
    setIsChiTietThuModalOpen(false);
    setIsDanhSachVietThuModalOpen(true);
  }, []);

  const handleChiTietParticipate = useCallback(() => {
    setIsChiTietThuModalOpen(false);
    setIsVietThuGuiHauTheModalOpen(true);
  }, []);

  // Function to check if current date is after a specific date
  const isAfterDate = (
    startDate: string | Date | null | undefined
  ): boolean => {
    if (!startDate) return true; // If no start date, consider it unlocked

    const currentDate = new Date();
    const targetDate =
      startDate instanceof Date ? startDate : new Date(startDate);

    return currentDate >= targetDate;
  };

  // Function to check if all previous 4 lands are completed
  const areAllPreviousLandsCompleted = (): boolean => {
    // Check if lands 1, 2, 3, 4 are all completed
    // For "Kỳ Linh Việt Hỏa" to unlock, all 4 previous lands must be COMPLETED
    const requiredLandIds = [1, 2, 3, 4];

    return requiredLandIds.every((landId) => {
      const userLandData = userLand?.find((item) => item.landId === landId);
      // Land is considered "completed" only if status is COMPLETED
      return userLandData && userLandData.status === LAND.LAND_STATUS.COMPLETED;
    });
  };

  // Function to check if a region is unlocked based on userLand status
  const isRegionUnlocked = (regionId: string): boolean => {
    const landId = regionToLandIdMap[regionId];

    // Special case for "Kỳ Linh Việt Hỏa" - only unlock when all 4 previous lands are completed
    if (regionId === "ky-linh-viet-hoa") {
      return areAllPreviousLandsCompleted();
    }

    // If region doesn't have a corresponding landId, it's locked
    if (landId === null || landId === undefined) return false;

    const userLandData = userLand?.find((item) => item.landId === landId);

    // If no userLand data found, consider it locked
    if (!userLandData) return false;

    // Check if current date is after the land's start date
    const isDateUnlocked = isAfterDate(userLandData.land?.startDate);

    // Region is unlocked if both status is NOT LOCKED and date requirement is met
    return userLandData.status !== LAND.LAND_STATUS.LOCKED && isDateUnlocked;
  };

  // Function to check if a region should show lock icon
  const shouldShowLock = (regionId: string): boolean => {
    const landId = regionToLandIdMap[regionId];

    // Special case for "Kỳ Linh Việt Hỏa" - show lock if not all previous lands completed
    if (regionId === "ky-linh-viet-hoa") {
      return !areAllPreviousLandsCompleted();
    }

    // If region doesn't have a corresponding landId, show lock
    if (landId === null || landId === undefined) return true;

    const userLandData = userLand?.find((item) => item.landId === landId);

    // If no userLand data found, show lock
    if (!userLandData) return true;

    // Check if current date is after the land's start date
    const isDateUnlocked = isAfterDate(userLandData.land?.startDate);

    // Show lock if either status is LOCKED or date requirement is not met
    return userLandData.status === LAND.LAND_STATUS.LOCKED || !isDateUnlocked;
  };

  const handleRegionClick = (regionId: string) => {
    // Only allow navigation if region is unlocked (or if TEMP_UNLOCK_ALL is enabled)
    if (TEMP_UNLOCK_ALL || isRegionUnlocked(regionId)) {
      // Set a flag to refresh data when user returns from detail page
      sessionStorage.setItem("shouldRefreshMapData", "true");
      // Set navigation timestamp to track when user navigated away
      sessionStorage.setItem("navigationTimestamp", Date.now().toString());
      router.push(`${ROUTES.PUBLIC.MAP}/${regionId}`);
    } else {
      const landId = regionToLandIdMap[regionId];
      const userLandData = userLand?.find((item) => item.landId === landId);

      // Special case for "ky-linh-viet-hoa" - show WaitingOthers popup
      if (regionId === "ky-linh-viet-hoa") {
        setIsWaitingOthersModalOpen(true);
      } else if (userLandData && userLandData.land?.startDate) {
        // Check if region is locked due to date restriction
        const isDateUnlocked = isAfterDate(userLandData.land.startDate);
        if (!isDateUnlocked) {
          // Show date restriction message
          setIncompleteRegionMessage("Vùng này chưa đến ngày mở");
          setIsIncompleteRegionModalOpen(true);
        } else {
          // Show general incomplete region message
          setIncompleteRegionMessage(
            "Kỳ Chủ phải hoàn thành vùng đất hiện tại mới có thể tiếp tục được hành trình sang vùng đất kế tiếp."
          );
          setIsIncompleteRegionModalOpen(true);
        }
      } else {
        // For other locked regions, show the incomplete region popup
        setIncompleteRegionMessage(
          "Kỳ Chủ phải hoàn thành vùng đất hiện tại mới có thể tiếp tục được hành trình sang vùng đất kế tiếp."
        );
        setIsIncompleteRegionModalOpen(true);
      }
    }
  };

  return (
    <ForceLandscape>
      <div className="min-h-screen w-full relative bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        {/* DESKTOP LAYOUT (>= 1024px) */}
        <div className="hidden lg:block w-full h-screen relative overflow-hidden">
          {/* Lớp 1: Ảnh nền fullscreen */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={mainMapImage}
              alt="Bản đồ Kỳ Giới"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Lớp 2: Các regions với positioning tương đối */}
          <div className="relative w-full h-full">
            {baseRegions.map((region, index) => (
              <MapRegion
                key={region.id}
                {...region}
                onClick={() => handleRegionClick(region.id)}
                zIndex={region.zIndex || 10 + index}
                isFullscreen={true}
                isLocked={TEMP_UNLOCK_ALL ? false : shouldShowLock(region.id)}
              />
            ))}
          </div>
        </div>

        {/* MOBILE LAYOUT (< 1024px) */}
        <div className="block lg:hidden w-full h-screen relative">
          <div className="absolute inset-0 z-0">
            <Image
              src={mainMapImage}
              alt="Bản đồ Kỳ Giới Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 w-full h-full">
            {baseRegions.map((region) => {
              const mobileConfig =
                mobileRegionsConfig[
                region.id as keyof typeof mobileRegionsConfig
                ];
              return (
                <MobileRegion
                  // debug={true}
                  key={`mobile-${region.id}`}
                  id={region.id}
                  name={region.name}
                  position={region.position}
                  size={region.size}
                  mobilePosition={mobileConfig?.position}
                  mobileSize={mobileConfig?.size}
                  onClick={() => handleRegionClick(region.id)}
                  zIndex={region.zIndex || 10}
                  isLocked={TEMP_UNLOCK_ALL ? false : shouldShowLock(region.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Popup for locked regions */}
      <IncompleteRegion
        isOpen={isIncompleteRegionModalOpen}
        onClose={() => setIsIncompleteRegionModalOpen(false)}
        message={incompleteRegionMessage}
      />

      {/* Popup for ky-linh-viet-hoa region */}
      <WaitingOthers
        userLand={userLand}
        isOpen={isWaitingOthersModalOpen}
        onClose={() => setIsWaitingOthersModalOpen(false)}
      />

      {/* Letter Guide Modal */}
      <LetterGuide
        isOpen={isLetterGuideModalOpen}
        onClose={() => setIsLetterGuideModalOpen(false)}
        onNext={handleLetterGuideNext}
        onBack={handleLetterGuideViewLetters}
      />

      {/* Danh Sách Viết Thư Modal */}
      <DanhSachVietThu
        isOpen={isDanhSachVietThuModalOpen}
        onClose={() => setIsDanhSachVietThuModalOpen(false)}
        onBack={handleDanhSachBack}
        onOpenDetail={handleDanhSachOpenDetail}
      />

      {/* Chi Tiết Thư Modal */}
      <ChiTietThu
        key={selectedLetterId || "chi-tiet-thu"}
        isOpen={isChiTietThuModalOpen}
        letterId={selectedLetterId}
        letters={lettersList}
        onLetterChange={handleLetterChange}
        onClose={() => {
          setIsChiTietThuModalOpen(false);
          setSelectedLetterId(null);
          setLettersList([]);
        }}
        onBack={handleChiTietBack}
        onParticipate={handleChiTietParticipate}
      />

      {/* Viết Thư Gửi Hậu Thế Modal */}
      <VietThuGuiHauThe
        isOpen={isVietThuGuiHauTheModalOpen}
        onClose={() => setIsVietThuGuiHauTheModalOpen(false)}
        onBack={handleVietThuBack}
      />
    </ForceLandscape>
  );
}
