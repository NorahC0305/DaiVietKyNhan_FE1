"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCurrentVietnamTime } from "@utils/ReleaseDateUtils";

interface LaunchProgressBarProps {
  releaseDate: Date;
  startDate: Date;
  createdAt?: Date;
}

const LaunchProgressBar: React.FC<LaunchProgressBarProps> = ({
  releaseDate,
  startDate,
  createdAt,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = getCurrentVietnamTime();
      
      // Sử dụng createdAt nếu có, nếu không thì dùng mốc thời gian 30 ngày trước
      const actualStartTime = createdAt || new Date(releaseDate.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      const totalDuration = releaseDate.getTime() - actualStartTime.getTime();
      const elapsed = now.getTime() - actualStartTime.getTime();
      
      if (totalDuration <= 0) {
        setProgress(100);
        return;
      }

      const currentProgress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [releaseDate, createdAt]);

  return (
    <div className="w-full bg-gray-200/50 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className="bg-gradient-to-r from-green-400 to-teal-500 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default LaunchProgressBar;
