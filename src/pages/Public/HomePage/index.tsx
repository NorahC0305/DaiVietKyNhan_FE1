"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@routes";
import { IUser } from "@models/user/entity";
import { IGetSystemConfigWithAmountUserResponse } from "@models/system/response";
import { IUserRankData, IUserRankResponse } from "@models/user/response";
import RadialGradial from "@components/Atoms/RadialGradient";
import { useUserRank } from "@hooks/useUser";
import { useAttendance } from "@hooks/useAttendance";
import ModalLayout from "@components/Molecules/DailyCheckin/Layouts/ModalLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/Atoms/ui/tooltip";
import VideoModal from "@components/Atoms/VideoModal";
import { useRouter } from "next/navigation";
import { AttendanceProvider } from "@contexts/AttendanceContext";
import { IAttendanceItem } from "@models/attendance/response";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
interface HomePageClientProps {
  user: IUser;
  activeWithAmountUser: IGetSystemConfigWithAmountUserResponse;
  accessToken: string;
}

interface HomePageWrapperProps {
  user: IUser;
  activeWithAmountUser: IGetSystemConfigWithAmountUserResponse;
  accessToken: string;
  initialAttendanceList?: IAttendanceItem[] | null;
}

// Dữ liệu mock cho phần nhận xét
const testimonialsData = [
  {
    id: 1,
    name: "TS. Phạm Thanh Hải",
    title: "",
    quote:
      "Đây là cuốn sách rất xứng đáng để có một trên gia sách của các gia đình Việt Nam?",
    avatar:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1760811389/PhanThanhHai_dtbb2b.svg",
    isMain: false,
  },
  {
    id: 2,
    name: "NSƯT Thành Lộc",
    title: "",
    quote:
      "Tôi tin đây là một cuốn sách ai cũng nên có cho chính mình, người thân và gia đình!",
    avatar:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1760811335/NSUTThanhLoc_o9xoa6.svg",
    isMain: true,
  },
  {
    id: 3,
    name: "Charlie Nguyễn",
    title: "Đạo diễn",
    quote:
      "Đây là 1 dự án hiếm hoi xứng đáng được lan truyền rộng rãi trong cộng đồng.",
    avatar:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1760811440/CharlieNguyen_oxuqka.svg",
    isMain: false,
  },
];

// Component for authenticated features
const AuthenticatedFeatures = ({ user }: { user: IUser }) => {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);

  // Hook để kiểm tra trạng thái điểm danh
  const {
    attendanceList,
    isLoading: isAttendanceLoading,
    isCheckingIn,
    checkIn,
    refetch,
    isTodayCheckedIn,
    getCheckedDates,
  } = useAttendance();

  const isAuthenticated = status === "authenticated" && session?.user;

  // Tự động mở modal nếu chưa điểm danh hôm nay - chỉ khi đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && !isAttendanceLoading) {
      if (!isTodayCheckedIn()) {
        setShowModal(true);
      } else {
        // Nếu đã điểm danh rồi mà modal đang mở thì đóng nó đi
        setShowModal(false);
      }
    } else if (!isAuthenticated) {
      // Nếu chưa đăng nhập thì đóng modal
      setShowModal(false);
    }
  }, [isAuthenticated, isAttendanceLoading, isTodayCheckedIn]);

  if (!isAuthenticated) return null;

  return (
    <ModalLayout
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onCheckinSuccess={() => {
        // Đóng modal sau khi điểm danh thành công
        setShowModal(false);
      }}
      userCoin={user?.coin}
      attendanceData={{
        attendanceList,
        isLoading: isAttendanceLoading,
        isCheckingIn,
        checkIn,
        refetch,
        isTodayCheckedIn,
        getCheckedDates,
      }}
    />
  );
};

// Dynamically import the authenticated features to avoid SSR issues
const DynamicAuthenticatedFeatures = dynamic(() => Promise.resolve(AuthenticatedFeatures), {
  ssr: false,
  loading: () => null,
});

const HomePageClient = ({
  user,
  activeWithAmountUser,
  accessToken,
}: HomePageClientProps) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(1); // Bắt đầu từ testimonial thứ 2 (index 1) làm chính
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentRankPage, setCurrentRankPage] = useState(1); // Trang hiện tại của bảng xếp hạng (1-5)

  // Luôn fetch theo trang hiện tại (bỏ cache để tránh trùng dữ liệu)
  const rankParams = useMemo(() => ({ currentPage: currentRankPage, pageSize: 15 }), [currentRankPage]);

  const { data: userRankData, isLoading: isLoadingRank } = useUserRank(
    rankParams
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
    }, 5000); // Tự động lướt sau mỗi 5 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  const getTestimonialDisplay = (indexOffset: number) => {
    const total = testimonialsData.length;
    let actualIndex = (currentIndex + indexOffset + total) % total;
    return testimonialsData[actualIndex];
  };

  const getDotClass = (index: number) => {
    if (index === currentIndex) {
      return "w-3.5 h-3.5 bg-red-600 rounded-full cursor-pointer";
    }
    return "w-2.5 h-2.5 bg-gray-500 rounded-full cursor-pointer hover:bg-gray-400";
  };

  // Process user rank data for display - memoized để tránh re-computation
  // Sử dụng displayData (có thể từ cache hoặc fetch mới)
  const leaderboardData = useMemo(() => {
    if (!userRankData?.data?.results) {
      return { leftColumn: [], rightColumn: [], thirdColumn: [] };
    }

    const users = userRankData.data.results;
    const leftColumn = users.slice(0, 5);
    const rightColumn = users.slice(5, 10);
    const thirdColumn = users.slice(10, 15);

    return { leftColumn, rightColumn, thirdColumn };
  }, [userRankData?.data?.results]);

  // Tính toán rank number dựa trên trang hiện tại
  const getRankNumber = useCallback((index: number, columnIndex: number) => {
    // Trang 1: 1-15, Trang 2: 16-30, Trang 3: 31-45, Trang 4: 46-60, Trang 5: 61-75
    const baseRank = (currentRankPage - 1) * 15;
    return baseRank + columnIndex * 5 + index + 1;
  }, [currentRankPage]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentRankPage < 5) {
      setCurrentRankPage(prev => prev + 1);
    }
  }, [currentRankPage]);

  const handlePrev = useCallback(() => {
    if (currentRankPage > 1) {
      setCurrentRankPage(prev => prev - 1);
    }
  }, [currentRankPage]);

  const renderRankItem = useCallback(
    (item: IUserRankData | undefined, rank: number) => (
      <div
        key={item?.id ?? `r-${rank}`}
        className="flex items-center space-x-1 md:space-x-2 p-1 md:p-2 rounded"
      >
        <div className="text-lg md:text-xl font-bold text-primary opacity-70">
          {rank}.
        </div>
        <div className="w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center flex-shrink-0">
          {item?.avatar ? (
            <Image
              src={item.avatar}
              alt={item.name || "User"}
              width={24}
              height={24}
              className="rounded-full w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-600">?</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-primary text-xs md:text-sm truncate">
            {item?.name || "Chưa có dữ liệu"}
          </div>
          <div className="text-primary text-xs">{item?.point || 0}</div>
        </div>
      </div>
    ),
    []
  );
  return (
    <div className="min-h-screen">
      {/* Banner 1 - Main Hero Section */}
      <section className="relative w-full lg:h-[750px] h-[510px] flex items-center justify-center overflow-hidden">
        <div className="absolute z-0 flex justify-center lg:w-[1330px] w-full h-full">
          <Image
            src="https://res.cloudinary.com/dznt9yias/image/upload/v1762103211/Key_visual_trong_web_3_dldjch.png"
            alt="HomePage Banner"
            fill
            priority
          />
          <div className="flex w-[1330px]">
            <div className="absolute bottom-16 lg:bottom-25 left-20 lg:left-20 lg:w-[250px] lg:h-[80px] w-[150px] h-[50px] cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => router.push(ROUTES.PUBLIC.MAP)}>
              <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762103336/Group_117_jdhguy.png" alt="HomePage Banner" fill />
            </div>
            <div className="absolute bottom-16 lg:bottom-25 left-[250px] lg:left-[350px] lg:w-[250px] lg:h-[80px] w-[150px] h-[50px] cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => router.push(ROUTES.PUBLIC.INTRODUCE)}>
              <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762103394/Group_116_nvwx5n.png" alt="HomePage Banner" fill />
            </div>
          </div>
        </div>
      </section>

      {/* Check-in Modal Dialog - dynamically loaded to avoid SSR issues */}
      <DynamicAuthenticatedFeatures user={user} />

      {/* Video Guide Icon with Tooltip */}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="fixed lg:bottom-7 bottom-20 lg:right-7 right-5 lg:w-[50px] lg:h-[50px] w-[45px] h-[45px] z-10 cursor-pointer"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1761673445/video_pzrrzw.png" alt="Video" fill />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={10} className="bg-transparent border-0 shadow-none">
            <p
              className="lg:text-2xl text-lg font-black italic"
              style={{
                color: '#FFFFFF',
                WebkitTextStroke: '0.1px #000000',
                textShadow: '-0.1px -0.1px 0 #000000, 0.1px -0.1px 0 #000000, -0.1px 0.1px 0 #000000, 0.1px 0.1px 0 #000000'
              }}
            >
              Hướng dẫn Khai Nhân Mở Ấn
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="https://res.cloudinary.com/djwgtiit3/video/upload/v1761676141/videohuongdan_dwmc23.mp4"
        title="Hướng dẫn Khai Nhân Mở Ấn"
      />

      {/* Banner 2 - Khí Chất Section */}
      <section className="relative mt-12 lg:mt-32 w-full lg:h-[870px] h-[591px] flex items-center justify-center overflow-hidden">
        <div className="absolute z-0 cursor-pointer flex justify-center w-[1330px] h-full">
          <Image
            src="https://res.cloudinary.com/dznt9yias/image/upload/v1760803844/KhiChatCuaBanLa_wmxfip.svg"
            alt="Khí Chất Của Bạn Là"
            fill
            onClick={() => router.push(ROUTES.STARTER.TEST_PLAYGROUND)}
            priority
          />
        </div>
      </section>

      {/* Ranking Section */}
      <section className="relative w-full flex items-center justify-center py-16">
        <div className="relative">
          {/* Scroll Paper Background - Điều chỉnh kích thước */}
          <Image
            src="https://res.cloudinary.com/dznt9yias/image/upload/v1760804373/CuonGiayHaiBenMauTrang_w8cxky.svg"
            alt="Bảng Xếp Hạng"
            width={1000}
            height={600}
            className="w-full h-auto max-h-[600px] object-contain"
            priority
          />

          {/* Content Overlay - Điều chỉnh positioning */}
          <div className="absolute top-3 left-0 right-0 bottom-0 z-10  mx-auto h-[100%] flex flex-col justify-center">
            {/* Content Container - Giới hạn kích thước */}
            <div className="w-full overflow-hidden">
              <div className="flex items-center justify-center">
                <RadialGradial className="text-center lg:text-6xl py-3 text-5xl font-bd-street-sign">
                  BẢNG XẾP HẠNG
                </RadialGradial>
              </div>
              <div className="w-full flex justify-center items-center gap-3 md:gap-4 relative">
                {/* Previous Button - Cố định vị trí */}
                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                  {currentRankPage > 1 && (
                    <button
                      onClick={handlePrev}
                      disabled={isLoadingRank}
                      className="relative left-8 w-full h-full flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Trang trước"
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Content Container - Giữ cấu trúc 3 cột cố định */}
                <div className="w-[80%] flex justify-around items-center relative min-h-[200px]">
                  {isLoadingRank ? (
                    <div className="absolute inset-0 flex justify-center items-center bg-transparent z-10">
                      <div className="text-primary">Đang tải dữ liệu...</div>
                    </div>
                  ) : null}

                  <div className={`w-full flex justify-around items-center ${isLoadingRank ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    {/* Left Column */}
                    <div className="space-y-1 md:space-y-2 flex-shrink-0">
                      {Array.from({ length: 5 }, (_, index) => {
                        const rank = getRankNumber(index, 0);
                        const item = leaderboardData.leftColumn[index];
                        return renderRankItem(item, rank);
                      })}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-1 md:space-y-2 flex-shrink-0">
                      {Array.from({ length: 5 }, (_, index) => {
                        const rank = getRankNumber(index, 1);
                        const item = leaderboardData.rightColumn[index];
                        return renderRankItem(item, rank);
                      })}
                    </div>

                    {/* Third Column */}
                    <div className="space-y-1 md:space-y-2 flex-shrink-0">
                      {Array.from({ length: 5 }, (_, index) => {
                        const rank = getRankNumber(index, 2);
                        const item = leaderboardData.thirdColumn[index];
                        return renderRankItem(item, rank);
                      })}
                    </div>
                  </div>
                </div>

                {/* Next Button - Cố định vị trí */}
                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                  {currentRankPage < 5 && (
                    <button
                      onClick={handleNext}
                      disabled={isLoadingRank}
                      className="relative right-8 w-full h-full flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Trang sau"
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Page Indicators - Luôn hiển thị */}
              <div className="w-full flex justify-center items-center gap-2 mt-4">
                {Array.from({ length: 5 }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => !isLoadingRank && setCurrentRankPage(pageNumber)}
                      disabled={isLoadingRank}
                      className={`w-2 h-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${pageNumber === currentRankPage
                        ? 'bg-primary w-6'
                        : 'bg-primary/30 hover:bg-primary/50'
                        }`}
                      aria-label={`Trang ${pageNumber}`}
                    />
                  );
                })}
              </div>
              {/* <div className="w-full flex items-center justify-center mt-0 lg:mt-4">
                <button className="text-primary cursor-pointer font-bold text-sm lg:text-lg hover:underline">
                  Xem thêm
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-gradient-to-b from-gray-900 to-black py-16 pb-24 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4">
          {/* Headline */}
          <div className="w-full mb-10 lg:mb-16 flex items-center justify-center gap-4">
            <div className="line" />
            <h3 className="text-3xl lg:text-4xl text-white font-bd-street-sign text-center">
              NHỮNG NHẬN XÉT VỀ ĐẠI VIỆT KỲ NHÂN
            </h3>
            <div className="line" />
          </div>

          {/* Testimonials Carousel Container */}
          <div className="flex justify-center items-start gap-8 lg:gap-12 relative h-[350px]">
            {/* Để lướt, chúng ta sẽ render 3 phần tử: trước, hiện tại, sau */}

            {/* === Left Testimonial (Faded) === */}
            <div
              className={`
              absolute transition-all duration-1000 ease-in-out
              flex flex-col items-center space-y-5 pt-12 opacity-60
              w-full max-w-xs
              left-1/3 lg:left-1/4 transform -translate-x-full -ml-40 md:-ml-0
              md:flex
              `}
            >
              <p className="text-gray-300 text-base italic text-center h-24 flex items-center justify-center">
                {getTestimonialDisplay(-1).quote}
              </p>
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={getTestimonialDisplay(-1).avatar}
                  alt={getTestimonialDisplay(-1).name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">
                  {getTestimonialDisplay(-1).name}
                </p>
                {getTestimonialDisplay(-1).title && (
                  <p className="text-gray-400 text-sm">
                    {getTestimonialDisplay(-1).title}
                  </p>
                )}
              </div>
            </div>

            {/* === Center Testimonial (Prominent) === */}
            <div
              className={`
              absolute transition-all duration-1000 ease-in-out
              flex flex-col items-center space-y-6
              w-full md:w-1/2 max-w-md
              left-1/2 transform -translate-x-1/2
              `}
            >
              {/* Speech Bubble */}
              <div className="bg-secondary p-6 rounded-lg shadow-lg relative z-10">
                <p className="text-white font-medium text-center text-lg lg:text-xl italic">
                  {getTestimonialDisplay(0).quote}
                </p>
                {/* Bubble Pointer */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-secondary rotate-45"></div>
              </div>
              {/* Avatar */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={getTestimonialDisplay(0).avatar}
                  alt={getTestimonialDisplay(0).name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover w-full h-full border-2 border-secondary"
                />
              </div>
              {/* Name */}
              <div className="text-center">
                <p className="text-white font-semibold text-lg">
                  {getTestimonialDisplay(0).name}
                </p>
                {getTestimonialDisplay(0).title && (
                  <p className="text-gray-400 text-sm">
                    {getTestimonialDisplay(0).title}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`
              absolute transition-all duration-1000 ease-in-out
              flex flex-col items-center space-y-5 pt-12 opacity-60
              w-full max-w-xs
              right-0 transform translate-x-0 ml-40 md:ml-0
              md:flex
              `}
            >
              <p className="text-gray-300 text-base italic text-center h-24 flex items-center justify-center">
                {getTestimonialDisplay(1).quote}
              </p>
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={getTestimonialDisplay(1).avatar}
                  alt={getTestimonialDisplay(1).name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">
                  {getTestimonialDisplay(1).name}
                </p>
                {getTestimonialDisplay(1).title && (
                  <p className="text-gray-400 text-sm">
                    {getTestimonialDisplay(1).title}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center items-center gap-3 pt-12">
            {testimonialsData.map((_, index) => (
              <div
                key={index}
                className={getDotClass(index)}
                onClick={() => setCurrentIndex(index)}
              ></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Wrapper component với AttendanceProvider
const HomePageWrapper = ({
  user,
  activeWithAmountUser,
  accessToken,
  initialAttendanceList,
}: HomePageWrapperProps) => {
  return (
    <AttendanceProvider initialAttendanceList={initialAttendanceList || []}>
      <HomePageClient
        user={user}
        activeWithAmountUser={activeWithAmountUser}
        accessToken={accessToken}
      />
    </AttendanceProvider>
  );
};

export default HomePageWrapper;

