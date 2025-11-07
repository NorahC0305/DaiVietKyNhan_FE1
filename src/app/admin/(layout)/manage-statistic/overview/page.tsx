import StatisticOverViewPage from "@pages/Admin/Statistic/Overview";

export const dynamic = 'force-dynamic';

export default async function StatisticOverviewServer() {
  return (
    <>
      <StatisticOverViewPage />
    </>
  );
}
