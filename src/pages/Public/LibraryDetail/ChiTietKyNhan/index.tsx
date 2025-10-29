"use client";

import React, { useState } from "react";
import TipTapEditor from "@components/Organisms/Tiptap";
import ImageModal from "@components/Atoms/ImageModal";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { IChiTietKyNhanResponse } from "@models/chi-tiet-ky-nhan/entity";

interface ChiTietKyNhanProps {
  chiTietKyNhan: IChiTietKyNhanResponse;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center mt-10 mb-7">
    <h2 className="font-bd-street-sign text-3xl lg:text-5xl text-[#CBA247]">
      {children}
    </h2>
  </div>
);

const ChiTietKyNhan: React.FC<ChiTietKyNhanProps> = ({ chiTietKyNhan }) => {
  // Kiểm tra an toàn để tránh lỗi build
  if (!chiTietKyNhan) {
    return (
      <div className="flex flex-col mx-6 lg:mx-52">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#CBA247]" />
          <span className="ml-3 text-gray-300">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const openImageModal = (index: number) => {
    if (
      chiTietKyNhan?.media &&
      index >= 0 &&
      index < chiTietKyNhan.media.length
    ) {
      setCurrentImageIndex(index);
      setIsModalOpen(true);
    } else {
      console.error(
        "Invalid image index:",
        index,
        "Media length:",
        chiTietKyNhan?.media?.length
      );
    }
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
  };

  const goToPreviousImage = () => {
    if (chiTietKyNhan?.media && chiTietKyNhan.media.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? chiTietKyNhan.media.length - 1 : prev - 1
      );
    }
  };

  const goToNextImage = () => {
    if (chiTietKyNhan?.media && chiTietKyNhan.media.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === chiTietKyNhan.media.length - 1 ? 0 : prev + 1
      );
    }
  };
  // Tạo grid layout 3-2-3-2 lặp lại
  const createGridLayout = (
    images: Array<{ id: number; url: string; alt?: string | null }>
  ) => {
    const layout = [];
    let currentIndex = 0;
    let rowNumber = 1;

    while (currentIndex < images.length) {
      // Pattern: 3-2-3-2 lặp lại
      const pattern = [3, 2, 3, 2];
      const patternIndex = (rowNumber - 1) % 4;
      const imagesInThisRow = pattern[patternIndex];
      const remainingImages = images.length - currentIndex;
      const actualImagesInRow = Math.min(imagesInThisRow, remainingImages);

      if (actualImagesInRow > 0) {
        const isTwoColumnRow = imagesInThisRow === 2;
        layout.push(
          <div
            key={`row-${rowNumber}`}
            className={`grid gap-4 ${
              isTwoColumnRow ? "grid-cols-2 max-w-2xl mx-auto" : "grid-cols-3"
            }`}
          >
            {images
              .slice(currentIndex, currentIndex + actualImagesInRow)
              .map((image, index) => {
                const actualIndex = currentIndex + index;
                return (
                  <div
                    key={image.id}
                    className="relative w-full h-[450px] aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      openImageModal(actualIndex);
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || "media"}
                      fill
                    />
                  </div>
                );
              })}
          </div>
        );
        currentIndex += actualImagesInRow;
        rowNumber++;
      }
    }

    return layout;
  };

  return (
    <div className="flex flex-col mx-6 lg:mx-52">
      <SectionTitle>BỐI CẢNH LỊCH SỬ</SectionTitle>
      <div className="space-y-6">
        {chiTietKyNhan?.boiCanhLichSuVaSuuThan?.map(
          (item: IChiTietKyNhanResponse["boiCanhLichSuVaXuatThan"][number]) => (
            <div key={item?.id}>
              {item?.tieuDe && (
                <div className="text-white font-bd-street-sign text-3xl mb-2">
                  {item?.tieuDe.trim()}
                </div>
              )}
              <TipTapEditor
                value={item.noiDung || ""}
                onChange={() => {}}
                disabled
                className="rounded-md border-0 m-h-fit"
              />
              {item?.nguon && (
                <div className="text-sm text-gray-300 mt-2">{item?.nguon}</div>
              )}
            </div>
          )
        )}
        {chiTietKyNhan?.boiCanhLichSuVaXuatThan?.length === 0 && (
          <div className="text-gray-300">Chưa có dữ liệu</div>
        )}
      </div>

      <SectionTitle>SỬ SÁCH VIẾT GÌ</SectionTitle>
      <div className="space-y-6">
        {(chiTietKyNhan?.suSachVietGi || []).map((item: any, index: number) => {
          // Kiểm tra xem tiêu đề này đã xuất hiện trước đó chưa
          const isFirstOccurrence =
            index === 0 ||
            !(chiTietKyNhan?.suSachVietGi || [])
              .slice(0, index)
              .some((prevItem: any) => prevItem.tieuDe === item.tieuDe);

          return (
            <div key={item?.id}>
              <div className="flex flex-col gap-2">
                {item?.tieuDe && isFirstOccurrence && (
                  <div className="text-white font-bd-street-sign text-3xl">
                    {item?.tieuDe.trim()}
                  </div>
                )}
                <TipTapEditor
                  value={item.doanVan || ""}
                  onChange={() => {}}
                  disabled
                  className="rounded-md border-0 h-fit"
                />
                <div className="text-sm text-gray-300">
                  {item.tacGia ? `Tác giả: ${item.tacGia}` : ""}
                  {item.tacGia && item.nguonSach ? " • " : ""}
                  {item.nguonSach ? `${item.nguonSach}` : ""}
                </div>
              </div>
            </div>
          );
        })}
        {(!chiTietKyNhan?.suSachVietGi ||
          chiTietKyNhan?.suSachVietGi.length === 0) && (
          <div className="text-gray-300">Chưa có dữ liệu</div>
        )}
      </div>

      <SectionTitle>GIAI THOẠI DÂN GIAN VÀ TRUYỀN THUYẾT</SectionTitle>
      <div className="space-y-6">
        {(chiTietKyNhan?.giaiThoaiDanGian || []).map((item: any) => (
          <div key={item.id}>
            {item?.tieuDe && (
              <div className="text-white font-bd-street-sign text-3xl mb-2">
                {item?.tieuDe.trim()}
              </div>
            )}
            <TipTapEditor
              value={item.noiDung || ""}
              onChange={() => {}}
              disabled
              className="rounded-md border-0 m-h-fit"
            />
            {item.nguon && (
              <div className="text-sm text-gray-300 mt-2">{item.nguon}</div>
            )}
          </div>
        ))}
        {(!chiTietKyNhan?.giaiThoaiDanGian ||
          chiTietKyNhan?.giaiThoaiDanGian.length === 0) && (
          <div className="text-gray-300">Chưa có dữ liệu</div>
        )}
      </div>

      <SectionTitle>THAM KHẢO</SectionTitle>
      <div>
        <TipTapEditor
          value={chiTietKyNhan?.thamKhao || ""}
          onChange={() => {}}
          disabled
          className="rounded-md border-0 h-fit"
        />
      </div>

      {chiTietKyNhan?.media && chiTietKyNhan?.media?.length > 0 ? (
        <>
          <SectionTitle>THƯ VIỆN ẢNH</SectionTitle>
          <div className="space-y-6">
            {createGridLayout(chiTietKyNhan?.media)}
          </div>
        </>
      ) : (
        <></>
      )}

      {/* Image Modal */}
      {chiTietKyNhan?.media && chiTietKyNhan?.media.length > 0 && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeImageModal}
          images={chiTietKyNhan?.media}
          currentIndex={currentImageIndex}
          onPrevious={goToPreviousImage}
          onNext={goToNextImage}
        />
      )}
    </div>
  );
};

export default ChiTietKyNhan;
