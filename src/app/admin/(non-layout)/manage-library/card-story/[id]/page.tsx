export const dynamic = 'force-dynamic';


import CardStoryPage from "@containers/Admin/Library/CardStory";
import chiTietKyNhanService from "@services/chi-tiet-ky-nhan";

async function getChiTietKyNhan(id: number) {
  try {
    const response = await chiTietKyNhanService.getChiTietKyNhanByKyNhanId(id) as any;
    return response.data[0];
  } catch (error) {
    console.error("Error fetching chi tiet ky nhan:", error);
    return null;
  }
}

export default async function CardStoryServer({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const chiTietKyNhan = await getChiTietKyNhan(id);

  return (
    <div className="min-h-screen rounded-xl bg-admin-primary p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {chiTietKyNhan ? `Chỉnh sửa: ${chiTietKyNhan.kyNhan?.name}` : "Tạo mới chi tiết kỳ nhân"}
          </h1>
          <p className="text-gray-600">
            {chiTietKyNhan ? "Cập nhật thông tin chi tiết của kỳ nhân" : "Tạo thông tin chi tiết mới cho kỳ nhân"}
          </p>
        </div>

        <CardStoryPage chiTietKyNhan={chiTietKyNhan} />
      </div>
    </div>
  );
}
