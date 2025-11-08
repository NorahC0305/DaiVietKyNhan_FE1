export const dynamic = 'force-dynamic';

import CardStoryPage from "@containers/Admin/Library/CardStory";

export default async function CardStoryServer() {
  return (
    <div className="min-h-screen rounded-xl bg-admin-primary p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Tạo mới chi tiết kỳ nhân
          </h1>
          <p className="text-gray-600">
            Tạo thông tin chi tiết mới cho kỳ nhân
          </p>
        </div>

        <CardStoryPage />
      </div>
    </div>
  );
}
