"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FrameText from "../Components/FrameText";
import FrameNumber from "../Components/FrameNumber";
import { ROUTES } from "@routes";
import { useGodProfilePointHome } from "@hooks/useGodProfilePointHome";
import VietnameseHistoryLoading from "@components/Molecules/HistoryLoading";
import godProfileService from "@services/god-profile";
import { IGodProfileResponseModel } from "@models/god-profile/response";
import userLandService from "@services/user-land";

const PersonalityResultPage = React.memo(() => {
  const router = useRouter();
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(
    null
  );
  const [selectedGuardian, setSelectedGuardian] = useState<any>(null);
  const [showGuardianResult, setShowGuardianResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { loading, error, data: profiles } = useGodProfilePointHome();

  useEffect(() => {
    // trigger initial slide-in animation
    const id = window.setTimeout(() => setMounted(true), 10);

    // Check if mobile on mount and resize
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1200;
      setIsMobile(mobile);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Auto-select first achieved profile and map selection
  useEffect(() => {
    if (!profiles || profiles.length === 0) return;
    const map: Record<string, string> = {
      SANGUINE: "vui-tuoi",
      CHOLERIC: "manh-me",
      MELANCHOLIC: "uu-tu",
      PHLEGMATIC: "diem-tinh",
    };
    const firstAchieved = profiles?.find((p) => p.isAchieved);
    if (firstAchieved) {
      setSelectedPersonality(map[firstAchieved.traitType] || null);
    }
  }, [profiles]);

  // Memoized utility functions
  const formatNumber = useCallback(
    (n: number) => String(Math.max(0, Math.min(99, n))).padStart(2, "0"),
    []
  );

  const getProfileById = useCallback(
    (id: string) => {
      if (!profiles) return null;
      const mapIdToTrait: Record<string, string> = {
        "vui-tuoi": "SANGUINE",
        "manh-me": "CHOLERIC",
        "diem-tinh": "PHLEGMATIC",
        "uu-tu": "MELANCHOLIC",
      };
      const trait = mapIdToTrait[id];
      return profiles?.find((p) => p.traitType === trait) || null;
    },
    [profiles]
  );
  // Build personality options from BE profiles
  const personalityOptions = useMemo(() => {
    const mapTraitToId: Record<string, string> = {
      SANGUINE: "vui-tuoi",
      CHOLERIC: "manh-me",
      MELANCHOLIC: "uu-tu",
      PHLEGMATIC: "diem-tinh",
    };
    return (profiles || []).map((p) => ({
      id: mapTraitToId[p.traitType],
      title: p.title,
      number: formatNumber(p.point || 0),
      color: p.text_color,
      description: p.description,
    }));
  }, [profiles]);

  // Guardian card meta by traitType
  const guardianMetaByTrait: Record<
    string,
    {
      id: string;
      title: string;
      name: string;
      image: string;
      borderColor: string;
      bgColor: string;
      textColor: string;
    }
  > = {
    PHLEGMATIC: {
      id: "tan-vien-son-thanh",
      title: "TẢN VIÊN SƠN THÁNH",
      name: "SƠN TINH",
      image: "https://res.cloudinary.com/dznt9yias/image/upload/v1760882410/god-profiles/images/file_hubadj.png",
      borderColor: "border-green-500",
      bgColor: "bg-green-50",
      textColor: "#10B981",
    },
    SANGUINE: {
      id: "chu-dao-to",
      title: "CHỬ ĐẠO TỔ",
      name: "CHỬ ĐỒNG TỬ",
      image: "https://res.cloudinary.com/dznt9yias/image/upload/v1760882435/god-profiles/images/file_rogijq.png",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-50",
      textColor: "#3B82F6",
    },
    CHOLERIC: {
      id: "phu-dong-thien-vuong",
      title: "PHÙ ĐỔNG THIÊN VƯƠNG",
      name: "THÁNH GIÓNG",
      image: "https://res.cloudinary.com/dznt9yias/image/upload/v1760882465/god-profiles/images/file_umblfc.png",
      borderColor: "border-red-500",
      bgColor: "bg-red-50",
      textColor: "#EF4444",
    },
    MELANCHOLIC: {
      id: "mau-thuong-thien",
      title: "MẪU THƯỢNG THIÊN",
      name: "CÔNG CHÚA LIỄU HẠNH",
      image: "https://res.cloudinary.com/dznt9yias/image/upload/v1760882511/god-profiles/images/file_jqsu8f.png",
      borderColor: "border-purple-500",
      bgColor: "bg-purple-50",
      textColor: "#8B5CF6",
    },
  };

  // Build guardian cards with fixed order from guardianMetaByTrait
  const guardianDeities = useMemo(() => {
    // Define fixed order for guardian cards
    const traitOrder = ["PHLEGMATIC", "SANGUINE", "CHOLERIC", "MELANCHOLIC"];

    return traitOrder.map((traitType) => {
      const profile = profiles?.find((p) => p.traitType === traitType);
      return {
        ...guardianMetaByTrait[traitType],
        personalityId:
          traitType === "SANGUINE"
            ? "vui-tuoi"
            : traitType === "CHOLERIC"
            ? "manh-me"
            : traitType === "MELANCHOLIC"
            ? "uu-tu"
            : "diem-tinh",
        // Include profile data if available
        ...(profile && { profileData: profile }),
      };
    });
  }, [profiles]);

  const selectedOption = personalityOptions?.find(
    (option) => option.id === selectedPersonality
  );

  // Auto-select guardian when personality is selected
  useEffect(() => {
    if (selectedPersonality) {
      const guardian = guardianDeities?.find(
        (g) => g.personalityId === selectedPersonality
      );
      const profile = getProfileById(selectedPersonality);
      if (guardian && profile?.isAchieved) {
        setSelectedGuardian(guardian);
      } else {
        // Clear guardian if no valid match found
        setSelectedGuardian(null);
      }
    }
  }, [selectedPersonality, guardianDeities, getProfileById]);

  const handleOptionSelect = useCallback((optionId: string) => {
    setSelectedPersonality(optionId);
  }, []);

  const handleNext = useCallback(async () => {
    if (showGuardianResult) {
      if (submitting) return;
      try {
        setSubmitting(true);
        const correspondingProfile = getProfileById(
          selectedGuardian?.personalityId
        );
        const profileId = correspondingProfile?.id;
        if (!profileId) return;
        const res = (await godProfileService.chooseGodProfile(
          profileId
        )) as IGodProfileResponseModel;
        if (res.statusCode === 200) {
          await userLandService.createUserLand();
          router.replace(ROUTES.PUBLIC.MAP);
        }
      } finally {
        setSubmitting(false);
      }
      return;
    }
    // Only show guardian result if a personality is selected
    if (selectedPersonality) {
      setShowGuardianResult(true);
    }
  }, [
    showGuardianResult,
    submitting,
    selectedGuardian,
    getProfileById,
    router,
    selectedPersonality,
  ]);

  const handleBack = useCallback(() => {
    setShowGuardianResult(false);
  }, []);

  // Guardian Deity Result Component - New Design
  const GuardianDeityResult = useMemo(
    () => (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6 px-6">
        {/* Instruction Box */}
        <div className="w-full max-w-4xl bg-amber-200/50 border-3 border-[#835D26] rounded-lg p-5 mb-8">
          <div className="text-center  text-[#835D26] font-medium">
            <p className="text-lg md:text-xl font-extrabold mb-2">
              Tương ứng với khí chất, vị Thần Bảo Hộ của bạn là:
            </p>
            <p className="text-sm md:text-base font-extrabold italic text-[#835D26]">
              (Trong trường hợp bạn có nhiều hơn một khí chất có số điểm ngang
              nhau, vui lòng chọn một vị Thần Bảo Hộ theo mong muốn của bạn)
            </p>
          </div>
        </div>

        {/* Guardian Selection Cards */}
        <div className="w-full max-w-8xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {guardianDeities.map((guardian) => {
              const isSelected = selectedGuardian?.id === guardian.id;
              // Use BE flag to determine availability
              const correspondingProfile =
                guardian.profileData || getProfileById(guardian.personalityId);
              const isAchieved = Boolean(correspondingProfile?.isAchieved);
              const shouldDim = !isAchieved;
              const isClickable = isAchieved || isSelected;
              // Split title into lines of max 2 words per line
              const titleWords = guardian.title.split(" ");
              const titleLines: string[] = [];
              for (let i = 0; i < titleWords.length; i += 2) {
                titleLines.push(titleWords.slice(i, i + 2).join(" "));
              }
              // Split name into lines of max 2 words per line
              const nameWords = guardian.name.split(" ");
              const nameLines: string[] = [];
              for (let i = 0; i < nameWords.length; i += 2) {
                nameLines.push(nameWords.slice(i, i + 2).join(" "));
              }
              return (
                <div
                  key={guardian.id}
                  onClick={
                    isClickable
                      ? () => setSelectedGuardian(guardian)
                      : undefined
                  }
                  className={`relative transition-all duration-300 transform ${
                    isClickable
                      ? "cursor-pointer hover:scale-105"
                      : "cursor-not-allowed"
                  } ${isSelected ? "scale-105" : "scale-100"} ${
                    shouldDim ? "opacity-40" : "opacity-100"
                  }`}
                >
                  {/* Guardian Card */}
                  <div
                    className={`relative w-full h-80 md:h-96 lg:h-[28rem] border-4 ${guardian.borderColor} bg-primary-light rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex`}
                  >
                    {/* Text Section - Fixed width */}
                    <div className="w-[40%] md:w-[38%] lg:w-[35%] flex flex-col justify-center items-center p-2 md:p-3 relative z-10">
                      <div className="text-center">
                        <div
                          className="text-base md:text-lg lg:text-xl font-extrabold uppercase tracking-wide mb-2 leading-tight"
                          style={{ color: guardian.textColor }}
                        >
                          {titleLines.map((line, idx) => (
                            <div key={`${guardian.id}-title-${idx}`}>
                              {line}
                            </div>
                          ))}
                        </div>
                        <div
                          className="mx-auto rounded-sm"
                          style={{
                            height: "4px",
                            width: "80px",
                            backgroundColor: guardian.textColor,
                          }}
                        />
                        <div
                          className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bd-street-sign leading-tight"
                          style={{ color: guardian.textColor }}
                        >
                          {nameLines.map((line, idx) => (
                            <div key={`${guardian.id}-name-${idx}`}>{line}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Image Section - Remaining width */}
                    <div className="flex-1 relative">
                      <Image
                        src={guardian.image}
                        alt={guardian.name}
                        fill
                        sizes="(max-width: 768px) 65vw, (max-width: 1024px) 68vw, 70vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Container */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {!isMobile && (
            <button
              onClick={handleBack}
              className="cursor-pointer flex items-center justify-center hover:opacity-80 transition-opacity duration-300"
              aria-label="Back"
            >
              <Image
                src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763391123/Next_1_rws1tq.png"
                alt="Back"
                width={50}
                height={50}
              />
            </button>
          )}
          <div className="flex items-center justify-center">
            <button
              onClick={handleNext}
              disabled={!selectedGuardian || submitting}
              className={`cursor-pointer relative flex items-center justify-center transition-all duration-300 ${
                selectedGuardian
                  ? "hover:scale-105"
                  : "opacity-50 cursor-not-allowed"
              }`}
              style={{ width: "180px", height: "50px" }}
            >
              <Image
                src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763389725/Rectangle_znlllq.png"
                alt="Tiếp tục"
                objectFit="contain"
                className="absolute"
                width={180}
                height={50}
              />
              <p className="relative z-10 text-[#835D26] font-semibold">
                Tiếp tục
              </p>
            </button>
          </div>
        </div>
      </div>
    ),
    [
      guardianDeities,
      selectedGuardian,
      isMobile,
      handleBack,
      handleNext,
      submitting,
      getProfileById,
    ]
  );

  // Personality Selection Component
  const PersonalitySelection = useMemo(() => {
    // Check if it's mobile landscape (width > height and width < 1024)
    const isMobileLandscape =
      isMobile && window.innerWidth > window.innerHeight;

    return (
      <div
        className={`${
          isMobileLandscape ? "flex flex-row" : "flex flex-col lg:flex-row"
        } gap-6 lg:gap-10 w-full items-center`}
      >
        {/* Left Side - Personality Options */}
        <div
          className={`${
            isMobileLandscape ? "w-1/2" : "w-full lg:w-1/2"
          } flex flex-col justify-center items-center ${
            isMobileLandscape ? "space-y-1" : "space-y-3"
          }`}
        >
          {/* Title */}
          <div className="text-center mb-2">
            <h1
              className={`${
                isMobileLandscape ? "text-sm" : "text-xl lg:text-2xl"
              } font-extrabold uppercase`}
              style={{
                color:
                  getProfileById(selectedPersonality || "")?.text_color ||
                  selectedOption?.color ||
                  "#2B638F",
              }}
            >
              KHÍ CHẤT CỦA BẠN CÓ THIÊN HƯỚNG:
            </h1>
          </div>
          <div
            className={`flex flex-col lg:flex-col ${
              isMobileLandscape ? "gap-1" : "gap-2"
            }`}
          >
            {personalityOptions.map((option) => {
              const isSelected = selectedPersonality === option.id;
              const correspondingProfile = getProfileById(option.id);
              const isAchieved = Boolean(correspondingProfile?.isAchieved);
              const shouldDim = !isAchieved;
              const isClickable = isAchieved || isSelected;

              return (
                <div
                  key={option.id}
                  onClick={
                    isClickable
                      ? () => handleOptionSelect(option.id)
                      : undefined
                  }
                  className={`transition-all duration-300 ${
                    isClickable
                      ? "cursor-pointer hover:opacity-80"
                      : "cursor-not-allowed"
                  } ${shouldDim ? "opacity-40" : "opacity-100"}`}
                >
                  <div className="flex items-center">
                    {/* Left Frame - Text */}
                    <FrameText
                      text={
                        getProfileById(option.id)?.textEmotion || option.title
                      }
                      className={`text-base lg:text-lg transition-all duration-300 ${
                        isSelected ? "scale-105" : "scale-100"
                      }`}
                      textClassName={`transition-all duration-300`}
                      textStyle={{
                        fontSize: isMobile ? "18px" : "28px",
                        fontFamily: "var(--font-bd-street-sign)",
                        color:
                          getProfileById(option.id)?.text_color || option.color,
                      }}
                      width={isMobile ? 180 : 280}
                      height={isMobile ? 40 : 60}
                    />

                    {/* Right Frame - Number */}
                    <FrameNumber
                      text={option.number}
                      className={`text-base lg:text-lg transition-all duration-300 ${
                        isSelected ? "scale-105" : "scale-100"
                      }`}
                      textClassName={`transition-all duration-300`}
                      textStyle={{
                        fontSize: isMobile ? "16px" : "24px",
                        fontFamily: "var(--font-bd-street-sign)",
                        color:
                          getProfileById(option.id)?.text_color || option.color,
                      }}
                      width={isMobile ? 60 : 100}
                      height={isMobile ? 50 : 70}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Description */}
        <div
          className={`${
            isMobileLandscape ? "w-1/2" : "w-full lg:w-1/2"
          } flex justify-center items-center`}
        >
          {selectedOption && (
            <div
              className={`bg-gray-400/40 rounded-xl ${
                isMobileLandscape ? "p-3" : "p-8 lg:p-10"
              } border border-gray-300 ${
                isMobileLandscape
                  ? "max-h-[15rem]"
                  : "max-h-[24rem] lg:max-h-[30rem]"
              } w-full flex flex-col`}
            >
              <div
                className={`${
                  isMobileLandscape ? "text-sm" : "text-xl lg:text-2xl"
                } leading-relaxed whitespace-pre-line italic overflow-y-auto custom-scrollbar flex-1 pr-2`}
                style={{
                  color:
                    getProfileById(selectedPersonality || "")?.text_color ||
                    selectedOption.color,
                }}
              >
                {getProfileById(selectedPersonality || "")?.description ||
                  selectedOption.description}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [
    isMobile,
    personalityOptions,
    selectedPersonality,
    handleOptionSelect,
    getProfileById,
    selectedOption,
  ]);

  if (loading) {
    return <VietnameseHistoryLoading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-3 ">
        <div className="bg-red-50 border-3 border-red-500 rounded-xl px-6 py-4 text-red-700 font-bold">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-3 ">
      {/* When not showing guardian, keep content inside framed container */}
      {!showGuardianResult && (
        <div
          className="relative bg-amber-200/50 border-3 rounded-2xl max-w-5xl md:max-w-6xl w-full shadow-2xl"
          style={{
            borderColor:
              getProfileById(selectedPersonality || "")?.text_color ||
              selectedOption?.color ||
              "#2B638F",
          }}
        >
          {/* Padded content wrapper */}
          <div className="p-5 md:p-8 lg:p-10">
            {/* This container hides overflow */}
            <div
              className={`relative overflow-hidden ${
                isMobile && window.innerWidth > window.innerHeight
                  ? "min-h-[18rem] max-h-[22rem]"
                  : "min-h-[24rem] lg:min-h-[30rem]"
              }`}
            >
              {/* Personality slides in from left */}
              <div
                className={`absolute inset-0 flex transition-transform duration-500 ease-in-out ${
                  mounted ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                {PersonalitySelection}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 pb-8 pl-5 md:pl-8 lg:pl-10 pr-5 md:pr-8 lg:pr-10">
            <div className="text-left w-full max-w-[460px]">
              <span
                className="text-xs"
                style={{ color: selectedOption?.color || "#6B7280" }}
              >
                *Kết quả mang tính chất tham khảo
              </span>
            </div>
          </div>

          {/* Edge-aligned navigation button */}
          <button
            onClick={handleNext}
            disabled={!selectedPersonality}
            className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              selectedPersonality
                ? "hover:bg-amber-200/80"
                : "opacity-50 cursor-not-allowed"
            }`}
            aria-label="Next"
          >
            <Image
              src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763391077/Next_ek6cme.png"
              alt="Next"
              width={50}
              height={50}
              className="text-gray-700"
            />
          </button>
        </div>
      )}

      {/* Guardian section rendered independently and full-width */}
      {showGuardianResult && (
        <div className="w-full">{GuardianDeityResult}</div>
      )}
    </div>
  );
});

export default PersonalityResultPage;
