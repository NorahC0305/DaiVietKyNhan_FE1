export const dynamic = 'force-dynamic';

import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import KyNhanSummaryPage from "@containers/Admin/Library/KyNhanSummary";
import kynhanService from "@services/kynhan";
import { IKyNhanResponseModel } from "@models/ky-nhan/response";
import { IKyNhan } from "@models/ky-nhan/entity";

export default async function AdminKyNhanSummaryPage() {
  const session = (await getServerSession(authOptions)) as UTILS.ISession;

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Fetch kỳ nhân list with initial pagination (9 items per page)
  const kyNhanResponse =
    (await kynhanService.getKyNhan(undefined, 1, 9)) as IKyNhanResponseModel;
  const kyNhanList: IKyNhan[] = kyNhanResponse.data?.results || [];
  const initialPagination = (kyNhanResponse as any).data?.pagination || {
    totalItem: kyNhanList.length,
    current: 1,
    totalPage: 1,
    pageSize: 9,
  };

  return <KyNhanSummaryPage kyNhanList={kyNhanList} initialPagination={initialPagination} />;
}
