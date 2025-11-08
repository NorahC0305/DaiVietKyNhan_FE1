import UserStatisticPage from "@containers/Admin/Statistic/User";

export const dynamic = 'force-dynamic';

export default async function UserStatisticServer() {
  return (
    <>
      <UserStatisticPage />
    </>
  );
}
