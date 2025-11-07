export const dynamic = 'force-dynamic';

import LibraryDetailPage from "@containers/Public/LibraryDetail";
import chiTietKyNhanService from "@services/chi-tiet-ky-nhan";
import libcardService from "@services/mo-ta-ky-nhan";


async function getChiTietKyNhan(id: number) {
  try {
    const response = await chiTietKyNhanService.getChiTietKyNhanByKyNhanId(id) as any;
    return response.data[0];
  } catch (error) {
    console.error("Error fetching chi tiet ky nhan:", error);
    return null;
  }
}

async function getMoTaKyNhanByKyNhanId(kyNhanId: number) {
  try {
    const response = await libcardService.getMoTaKyNhanByKyNhanId(kyNhanId) as any;
    return response.data;
  } catch (error) {
    console.error("Error fetching chi tiet ky nhan:", error);
    return null;
  }
}


type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LibraryDetailServer({ params }: PageProps) {
  const { id } = await params;
  const res = await getChiTietKyNhan(parseInt(id))
  const moTaKyNhan = await getMoTaKyNhanByKyNhanId(parseInt(id))

  return (
    <>
      <LibraryDetailPage chiTietKyNhan={res} moTaKyNhan={moTaKyNhan} />
    </>
  );
}
