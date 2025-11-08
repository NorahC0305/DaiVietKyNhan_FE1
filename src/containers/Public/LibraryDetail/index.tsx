"use client";

import { useRouter } from "next/navigation";
import KyNhanSummary from "./KyNhanSummary";
import ChiTietKyNhan from "./ChiTietKyNhan";
import { IChiTietKyNhanResponse } from "@models/chi-tiet-ky-nhan/entity";

interface LibraryDetailPageProps {
  chiTietKyNhan: IChiTietKyNhanResponse;
  moTaKyNhan: any;
}

const LibraryDetailPage = ({ chiTietKyNhan, moTaKyNhan }: LibraryDetailPageProps) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  if (!chiTietKyNhan) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Không tìm thấy kỳ nhân</div>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-x-hidden overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-[1600px] px-2 py-8">
        <div className="relative w-full">
          {/* Back button */}
          <button
            onClick={handleGoBack}
            className="ml-10 mb-2 z-20 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white/100 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>

          {/* ----- Ky Nhan Summary Section ----- */}
          <KyNhanSummary moTaKyNhan={moTaKyNhan} />

          {/* ----- Chi Tiet Ky Nhan Section ----- */}
          <ChiTietKyNhan chiTietKyNhan={chiTietKyNhan} />
        </div>
      </div>
    </div>
  )

};

export default LibraryDetailPage;
