'use client'

import React from "react";

const ContactHeader = () => {
  return (
    <div className="text-center text-white space-y-4">
      <h1 className="text-5xl sm:text-6xl tracking-wide" style={{ fontWeight: 950 }}>LIÊN HỆ</h1>
      <p className="text-base sm:text-lg text-gray-200 font-semibold">
        Bạn có thắc mắc về Đại Việt Kỳ Nhân? Bạn muốn cung cấp phản hồi hoặc báo
        cáo lỗi?
      </p>
      <p className="text-base sm:text-lg text-gray-200 font-semibold">
        Chúng tôi rất muốn nghe ý kiến từ bạn!
      </p>
    </div>
  );
};

export default ContactHeader;
