export const dynamic = 'force-dynamic';

import KyNhanListPage from "@containers/Admin/Library/KyNhanList";
import kynhanService from "@services/kynhan";
import landService from "@services/land";

async function getKyNhanList() {
  const response = await kynhanService.getKyNhan();
  return response.data;
}

async function getLands() {
  const response = await landService.getLands();
  return response.data;
}

export default async function KyNhanListServer() {
  const kyNhanList = await getKyNhanList();
  const lands = await getLands();
  return (
    <>
      <KyNhanListPage 
        kyNhanList={kyNhanList?.results || []} 
        landList={lands?.results || []} 
        initialPagination={kyNhanList?.pagination}
      />
    </>
  );
}
