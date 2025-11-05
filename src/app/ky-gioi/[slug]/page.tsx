import { notFound } from "next/navigation";
import MapRegionDetail from "@pages/Map/Components/MapRegionDetail";

export const dynamic = "force-dynamic";

// Types
interface RegionData {
  slug: string;
  id: number;
  backgroundImage: string;
}

interface ScrollPosition {
  top: string;
  left: string;
  rotate: string;
}

// Mapping từ slug đến region data
const regionSlugs: Record<string, RegionData> = {
  "nui-tan-vien": {
    slug: "nui-tan-vien",
    id: 1,
    backgroundImage:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1760722789/Map_So%CC%9Bn_Tinh_2_pq7v2w.svg",
  },
  "phu-tay-ho": {
    slug: "phu-tay-ho",
    id: 4,
    backgroundImage:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1761121411/Trang_vu%CC%80ng_%C4%91a%CC%82%CC%81t_Lie%CC%82%CC%83u_Ha%CC%A3nh_odoktx.svg",
  },
  "dam-da-trach": {
    slug: "dam-da-trach",
    id: 2,
    backgroundImage:
      "https://res.cloudinary.com/dznt9yias/image/upload/v1760722758/Map_Chu%CC%9B%CC%89_%C4%90o%CC%82%CC%80ng_Tu%CC%9B%CC%89_1_nypmqj.svg", // Sử dụng ảnh Thánh Gióng cho Đầm Dạ Trạch
  },
  "lang-phu-dong": {
    slug: "lang-phu-dong",
    id: 3,
    backgroundImage: "https://res.cloudinary.com/dznt9yias/image/upload/v1760722781/Map_Tha%CC%81nh_Gio%CC%81ng_1_x9yqi3.svg", // Sử dụng ảnh Sơn Tinh cho Làng Phù Đổng
  },

  "ky-linh-viet-hoa": {
    slug: "ky-linh-viet-hoa",
    id: 5,
    backgroundImage: "/Chử Đồng Tử 1.png",
  },
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Constants for scroll positions
const defaultScrollPositions: ScrollPosition[] = [
  // { top: "25%", left: "22%", rotate: "-12deg" },
  // { top: "64%", left: "22%", rotate: "-8deg" },
  { top: "8%", left: "20%", rotate: "-14deg" },
  { top: "34%", left: "30%", rotate: "-10deg" },
  { top: "65%", left: "22%", rotate: "-12deg" },
  { top: "8%", left: "41%", rotate: "-9deg" },
  { top: "40%", left: "50%", rotate: "-13deg" },
  { top: "65%", left: "40%", rotate: "-11deg" },
  { top: "26%", left: "68%", rotate: "-8deg" },
  { top: "65%", left: "65%", rotate: "-12deg" },
  { top: "2%", left: "58%", rotate: "-12deg" },
  // { top: "40%", left: "60%", rotate: "-10deg" },
  // { top: "20%", left: "66%", rotate: "-9deg" },
  // { top: "60%", left: "72%", rotate: "-11deg" },
];

// Per-region custom scroll positions
// Note: current defaults are for "nui-tan-vien". Others can be tuned visually later.
const phuTayHoScrollPositions: ScrollPosition[] = [
  // { top: "18%", left: "18%", rotate: "-8deg" },
  // { top: "52%", left: "20%", rotate: "-6deg" },
  // { top: "6%", left: "28%", rotate: "-10deg" },
  { top: "30%", left: "28%", rotate: "-7deg" },
  { top: "70%", left: "30%", rotate: "-8deg" },
  { top: "18%", left: "38%", rotate: "-6deg" },
  { top: "44%", left: "44%", rotate: "-9deg" },
  { top: "66%", left: "40%", rotate: "-7deg" },
  { top: "22%", left: "50%", rotate: "-6deg" },
  { top: "66%", left: "54%", rotate: "-8deg" },
  { top: "4%", left: "56%", rotate: "-9deg" },
  { top: "36%", left: "58%", rotate: "-7deg" },
  // { top: "18%", left: "64%", rotate: "-6deg" },
  // { top: "56%", left: "70%", rotate: "-8deg" },
];

const kyLinhVietHoaScrollPositions: ScrollPosition[] = [
  { top: "22%", left: "24%", rotate: "-10deg" },
  { top: "60%", left: "24%", rotate: "-7deg" },
  { top: "10%", left: "34%", rotate: "-12deg" },
  { top: "36%", left: "32%", rotate: "-9deg" },
  { top: "76%", left: "34%", rotate: "-10deg" },
  { top: "24%", left: "43%", rotate: "-8deg" },
  { top: "50%", left: "48%", rotate: "-11deg" },
  { top: "72%", left: "44%", rotate: "-9deg" },
  { top: "28%", left: "54%", rotate: "-7deg" },
  { top: "72%", left: "57%", rotate: "-10deg" },
  { top: "6%", left: "60%", rotate: "-10deg" },
  { top: "42%", left: "62%", rotate: "-8deg" },
  { top: "22%", left: "68%", rotate: "-7deg" },
  { top: "62%", left: "74%", rotate: "-9deg" },
];

const damDaTrachScrollPositions: ScrollPosition[] = [
  // { top: "29%", left: "6%", rotate: "-9deg" },
  { top: "30%", left: "12%", rotate: "-7deg" },
  { top: "60%", left: "18%", rotate: "-11deg" },
  { top: "58%", left: "40%", rotate: "-8deg" },
  { top: "38%", left: "28%", rotate: "-9deg" },
  { top: "20%", left: "46%", rotate: "-7deg" },
  { top: "46%", left: "54%", rotate: "-10deg" },
  { top: "24%", left: "64%", rotate: "-8deg" },
  { top: "62%", left: "62%", rotate: "-7deg" },
  { top: "40%", left: "74%", rotate: "-9deg" },
  // { top: "20%", left: "84%", rotate: "-9deg" },
  // { top: "48%", left: "78%", rotate: "-8deg" },
];

const langPhuDongScrollPositions: ScrollPosition[] = [
  // { top: "24%", left: "26%", rotate: "-11deg" },
  // { top: "62%", left: "26%", rotate: "-8deg" },
  { top: "47%", left: "2%", rotate: "-13deg" },
  { top: "26%", left: "10%", rotate: "-9deg" },
  { top: "42%", left: "14%", rotate: "-11deg" },
  { top: "20%", left: "32%", rotate: "-8deg" },
  { top: "52%", left: "26%", rotate: "-12deg" },
  { top: "48%", left: "36%", rotate: "-10deg" },
  { top: "66%", left: "34%", rotate: "-10deg" },
  { top: "44%", left: "50%", rotate: "-8deg" },
  { top: "60%", left: "44%", rotate: "-11deg" },
  { top: "44%", left: "68%", rotate: "-11deg" },
  // { top: "18%", left: "70%", rotate: "-8deg" },
  // { top: "58%", left: "76%", rotate: "-10deg" },
];

// Per-region scroll positions (customize later as needed)
const regionScrollPositions: Record<string, ScrollPosition[]> = {
  "phu-tay-ho": phuTayHoScrollPositions,
  "nui-tan-vien": defaultScrollPositions,
  "ky-linh-viet-hoa": kyLinhVietHoaScrollPositions,
  "dam-da-trach": damDaTrachScrollPositions,
  "lang-phu-dong": langPhuDongScrollPositions,
};

export default async function MapRegionPage({ params }: PageProps) {
  const { slug } = await params;
  const region = regionSlugs[slug];

  if (!region) {
    notFound();
  }

  const scrollPositions =
    regionScrollPositions[region.slug] ?? defaultScrollPositions;

  return (
    <MapRegionDetail
      backgroundImage={region.backgroundImage}
      scrollPositions={scrollPositions}
      landId={region.id}
      slug={slug}
    />
  );
}
