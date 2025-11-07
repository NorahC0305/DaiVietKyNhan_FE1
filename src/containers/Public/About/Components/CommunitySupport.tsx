"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const CommunitySupport = () => {
  return (
    <div className="rounded-xl bg-gray-200/25 py-1 px-10 sm:py-10 sm:px-16 border border-white/10 text-white">
      <h2 className="text-xl sm:text-4xl text-center font-semibold">Hỗ trợ cộng đồng</h2>
      <p className="mt-2 text-md text-center text-gray-200 font-semibold">
        Tham gia cộng đồng của chúng tôi để được hỗ trợ và thảo luận nhanh hơn
      </p>

      <Link href="https://www.facebook.com/groups/1084277652036931" target="_blank" className="relative mt-5 flex flex-col gap-3 justify-center items-center">
        <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760718877/Button_bb7ywk.svg' alt="Button" className="w-[40%]" width={150} height={50} />
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <p className="text-secondary text-xl font-semibold">Nhóm Facebook</p>
        </div>
      </Link>
    </div>
  );
};

export default CommunitySupport;
