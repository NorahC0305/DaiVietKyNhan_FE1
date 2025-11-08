"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@atoms/ui/card";
import { Separator } from "@atoms/ui/separator";
import { Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isValid } from "date-fns";
import CountdownBlock from "./CountdownBlock";
import LaunchProgressBar from "./LaunchProgressBar";
import {
  getCurrentVietnamTime,
  convertUtcToVietnamTime,
  formatVietnamTime,
} from "@utils/ReleaseDateUtils";

interface SystemStatusDashboardProps {
  currentTime: Date;
  activeReleaseDate: Date | undefined;
  activeReleaseEventData: ICOMPONENTS.ReleaseDateData | null;
}

const SystemStatusDashboard: React.FC<SystemStatusDashboardProps> = ({
  currentTime,
  activeReleaseDate,
  activeReleaseEventData,
}) => {
  const [countdown, setCountdown] = useState<ICOMPONENTS.CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLaunched, setIsLaunched] = useState(false);
  const [startDate] = useState(getCurrentVietnamTime());

  useEffect(() => {
    if (!activeReleaseDate || !isValid(activeReleaseDate)) {
      setIsLaunched(false);
      return;
    }

    const interval = setInterval(() => {
      try {
        // Lấy thời gian hiện tại và +7 tiếng để điều chỉnh múi giờ
        const nowVietnam = new Date(
          getCurrentVietnamTime().getTime() + 7 * 60 * 60 * 1000
        );
        const releaseDateVietnam = convertUtcToVietnamTime(activeReleaseDate);

        // Validate dates before calculation
        if (!isValid(nowVietnam) || !isValid(releaseDateVietnam)) {
          console.warn("Invalid date detected in countdown calculation");
          return;
        }

        const distance = releaseDateVietnam.getTime() - nowVietnam.getTime();

        if (distance < 0) {
          setIsLaunched(true);
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          clearInterval(interval);
          return;
        }

        setIsLaunched(false);
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } catch (error) {
        console.error("Error in countdown calculation:", error);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeReleaseDate]);

  const padZero = (num: number) => num.toString().padStart(2, "0");

  return (
    <Card className="animated-gradient shadow-xl overflow-hidden">
      <CardContent className="p-6 space-y-5">
        {/* Current Time Display */}
        <div>
          <div className="flex justify-between items-center text-gray-700">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Thời gian hệ thống (GMT+7):</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-gray-800">
                {isValid(currentTime)
                  ? formatVietnamTime(currentTime, "HH:mm:ss")
                  : "Invalid Time"}
              </span>
            </div>
          </div>
          <div className="flex justify-end text-sm text-gray-600 mt-1">
            <span>
              {isValid(currentTime)
                ? formatVietnamTime(currentTime, "EEEE, dd/MM/yyyy")
                : "Invalid Date"}
            </span>
          </div>
        </div>

        <Separator className="bg-white/50" />

        {/* Countdown Section */}
        <AnimatePresence>
          {activeReleaseDate && isValid(activeReleaseDate) ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center mb-2">
                <span className="font-semibold text-gray-700">
                  Đếm ngược đến ngày ra mắt
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 md:gap-6">
                {isLaunched ? (
                  <div className="text-2xl font-bold text-green-700 flex items-center gap-2 py-10">
                    <CheckCircle />
                    <span>Hệ Thống Đã Ra Mắt!</span>
                  </div>
                ) : (
                  <>
                    <CountdownBlock
                      value={padZero(countdown.days)}
                      label="Ngày"
                    />
                    <CountdownBlock
                      value={padZero(countdown.hours)}
                      label="Giờ"
                    />
                    <CountdownBlock
                      value={padZero(countdown.minutes)}
                      label="Phút"
                    />
                    <CountdownBlock
                      value={padZero(countdown.seconds)}
                      label="Giây"
                    />
                  </>
                )}
              </div>
              <LaunchProgressBar
                releaseDate={activeReleaseDate}
                startDate={startDate}
                createdAt={activeReleaseEventData?.createdAt}
              />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 h-40 flex items-center justify-center bg-black/5 rounded-lg"
            >
              <div>
                <p className="font-medium">
                  Chưa có ngày ra mắt được kích hoạt
                </p>
                <p className="text-sm mt-1">
                  Vui lòng thiết lập và kích hoạt ngày ra mắt để bắt đầu đếm
                  ngược
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SystemStatusDashboard;
