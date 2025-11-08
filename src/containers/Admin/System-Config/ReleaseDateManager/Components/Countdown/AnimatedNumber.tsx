"use client";


import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedNumberProps {
  value: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = React.memo(({ value }) => {
  return (
    <div className="relative h-12 w-12 overflow-hidden">
      <AnimatePresence>
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-800 tracking-tighter"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
});

AnimatedNumber.displayName = "AnimatedNumber";

export default AnimatedNumber;
