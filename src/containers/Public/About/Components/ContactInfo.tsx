'use client'

import React from "react";
import LucideIcon from "@/components/Atoms/LucideIcon";

const ContactInfo = () => {
  return (
    <div className="rounded-xl bg-gray-200/25 py-1 px-10 sm:py-10 sm:px-16 border border-white/10 text-white">
      <h2 className="text-2xl sm:text-4xl text-center font-semibold">Thông tin liên hệ</h2>
      <div className="mt-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 h-12 w-12 flex items-center justify-center rounded-full bg-gray-200/25 border border-white/10">
            <LucideIcon name="Mail" iconSize={24} iconColor="currentColor" />
          </div>
          <div>
            <div className="text-base font-semibold">Email</div>
            <div className="text-base text-gray-200">
              daivietkynhan.er@gmail.com
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="mt-1 h-12 w-12 flex items-center justify-center rounded-full bg-gray-200/25 border border-white/10">
            <LucideIcon name="Phone" iconSize={24} iconColor="currentColor" />
          </div>
          <div>
            <div className="text-base font-semibold">Điện thoại</div>
            <div className="text-base text-gray-200">039 495 9607</div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="mt-1 h-12 w-12 flex items-center justify-center rounded-full bg-gray-200/25 border border-white/10">
            <LucideIcon name="MapPin" iconSize={24} iconColor="currentColor" />
          </div>
          <div>
            <div className="text-base font-semibold">Địa chỉ</div>
            <div className="text-base text-gray-200">56 Phước Hưng, Phường 8, Quận 5, TP. Hồ Chí Minh</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
