"use client";

import React from "react";
import AnimatedNumber from "./AnimatedNumber";

interface CountdownBlockProps {
  value: string;
  label: string;
}

const CountdownBlock: React.FC<CountdownBlockProps> = React.memo(
  ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-lg w-24 h-24 border border-white/40 shadow-lg flex items-center justify-center">
        <AnimatedNumber value={value} />
      </div>
      <span className="mt-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
);

CountdownBlock.displayName = "CountdownBlock";

export default CountdownBlock;
