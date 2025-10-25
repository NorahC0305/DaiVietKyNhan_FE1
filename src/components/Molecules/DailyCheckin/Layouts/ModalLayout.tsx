import React, { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../index.module.scss";
import RewardDisplay from "../Components/RewardDisplay";
import WeeklyGrid from "../Components/WeeklyGrid";
import BonusInfo from "../Components/BonusInfo";
import ButtonImage from "@components/Atoms/ButtonImage";
import Image from "next/image";
import { IAttendanceItem } from "@models/attendance/response";

interface AttendanceData {
  attendanceList: IAttendanceItem[];
  isLoading: boolean;
  isCheckingIn: boolean;
  checkIn: () => Promise<any>;
  refetch: () => Promise<void>;
  isTodayCheckedIn: () => boolean;
  getCheckedDates: () => Set<string>;
}

interface ModalLayoutProps {
  isOpen: boolean;
  onClose?: () => void;
  onCheckinSuccess?: () => void;
  attendanceData: AttendanceData;
  userCoin?: number;
}

const ModalLayout: React.FC<ModalLayoutProps> = memo(({ isOpen, onClose, onCheckinSuccess, attendanceData, userCoin }) => {
  // Use attendance data from props instead of hook
  const {
    attendanceList,
    isLoading,
    isCheckingIn,
    checkIn,
    refetch,
    isTodayCheckedIn,
    getCheckedDates,
  } = attendanceData;

  // Generate weekly progress from attendance data
  const weeklyProgress = useMemo(() => {
    const today = new Date();
    const checkedDates = getCheckedDates();
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    // Get the start of the week (Sunday) - Tuần bắt đầu từ Chủ Nhật
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = CN, 1 = T2, ..., 6 = T7
    const daysToSubtract = dayOfWeek; // CN = 0 -> lùi 0 ngày, T2 = 1 -> lùi 1 ngày
    startOfWeek.setDate(today.getDate() - daysToSubtract);

    return days.map((dayName, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);

      // Sử dụng local date string để tránh lỗi múi giờ
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const isChecked = checkedDates.has(dateString);

      // So sánh với ngày hôm nay (local time)
      const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const isToday = dateString === todayString;

      return {
        day: dateString,
        label: dayName,
        checked: isChecked,
        dayName,
        isSpecial: isToday,
      };
    });
  }, [attendanceList, getCheckedDates]);

  // Calculate current progress (checked days this week)
  const currentProgress = useMemo(() => {
    return weeklyProgress.filter((day) => day.checked).length;
  }, [weeklyProgress]);

  // Check if today is checked in
  const todayChecked = useMemo(() => {
    const today = new Date();
    // Sử dụng local date để tránh lỗi múi giờ
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return attendanceList.some((item) => {
      let itemDateString: string;

      if (item.date.includes("T")) {
        // ISO string format: "2025-10-21T00:00:00.000Z"
        const itemDate = new Date(item.date);
        itemDateString = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
      } else {
        // Direct date string format
        const itemDate = new Date(item.date);
        itemDateString = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
      }

      return itemDateString === todayString && item.status === "PRESENT";
    });
  }, [attendanceList]);

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      await checkIn();
      // Gọi callback khi điểm danh thành công
      if (onCheckinSuccess) {
        onCheckinSuccess();
      }
    } catch (error) {
      console.error("Check-in failed:", error);
    }
  };

  const getButtonText = (): string => {
    if (todayChecked) return "Đã điểm danh";
    if (isCheckingIn) return "Đang điểm danh...";
    return "Điểm danh";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          <div className="absolute inset-0" onClick={onClose} >
            <button
              // Vị trí nút X được điều chỉnh để phù hợp với padding mới, đảm bảo tách biệt
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 cursor-pointer p-2"
              onClick={onClose}
              aria-label="Đóng"
            >
              <span className="relative block h-8 w-8 sm:h-10 sm:w-10">
                <Image
                  src="https://res.cloudinary.com/dznt9yias/image/upload/v1760721841/X_lqpgdp.svg"
                  alt="Đóng"
                  fill
                  sizes="(max-width: 640px) 32px, 40px"
                  style={{ objectFit: "contain" }}
                />
              </span>
            </button>
          </div>

          <div className="flex justify-center items-center relative">
            <div className="relative lg:w-[700px] lg:h-[600px] w-[500px] h-[400px]">
              <Image
                src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726271/scroll-vertical_aftde9.svg"
                alt="scroll-vertical"
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute top-0 left-0 w-full my-auto">
              <div className="flex flex-col justify-around items-center  lg:pt-0 pt-10">
                <div className="flex flex-col justify-between">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 flex flex-col items-center justify-center lg:pt-16 w-full"
                  >
                    {/* Header Section */}
                    <header className="flex flex-col gap-2 justify-center items-center text-center mb-3">
                      <div className="hidden lg:block relative w-[50px] h-[50px] lg:w-[70px] lg:h-[70px]">
                        <Image
                          src="/big-logo.svg"
                          alt="logo"
                          fill
                        />
                      </div>
                      <h2 className="text-sm lg:text-xl font-extrabold text-[#A40000]">
                        ĐIỂM DANH TÍCH XU
                      </h2>
                    </header>

                    {/* Progress and Reward Display */}
                    <div className="flex-1 flex justify-center mb-2">
                      <RewardDisplay
                        reward={userCoin ?? 100}
                        className={styles["reward-frame"]}
                      />
                    </div>

                    {/* Weekly Attendance Tracker */}
                    <div className="mb-6 w-full">
                      <div className="text-center text-gray-600 mb-3 lg:text-lg text-sm font-extrabold">
                        Tiến độ tuần này
                      </div>
                      <WeeklyGrid weeklyProgress={weeklyProgress} variant="desktop" />
                    </div>

                    {/* Check-in Button */}
                    <div className="text-center w-full">
                      <ButtonImage
                        width={130}
                        height={48}
                        onClick={handleCheckIn}
                        disabled={todayChecked || isCheckingIn}
                        classNameText="text-sm font-extrabold hover text-[#A40000] w-full"
                        className={`hover:scale-105 transition-all duration-300 ${todayChecked || isCheckingIn
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                          }`}
                      >
                        {getButtonText()}
                      </ButtonImage>
                      <BonusInfo variant="desktop" />
                    </div>
                  </motion.div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
});

ModalLayout.displayName = "ModalLayout";

export default ModalLayout;
