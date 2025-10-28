import { authOptions } from "@lib/authOptions";
import { IMePaginationResponse } from "@models/user/response";
import UserInfoPage from "@pages/Admin/User/UserInfo";
import userService from "@services/user";
import { getServerSession } from "next-auth";
import dashboardService from "@services/dashboard";

export default async function UserInfoServer() {
  const session = await getServerSession(authOptions) as UTILS.ISession;
  let listUsers: IMePaginationResponse | null = null;
  let birthdayAndGenderStats: any | null = null;
  if (session) {
    listUsers = await userService.getUsers() as IMePaginationResponse;
    birthdayAndGenderStats = await dashboardService.getBirthdayAndGenderStats() as any;
  }



  return <UserInfoPage listUsers={listUsers!.data!} birthdayAndGenderStats={birthdayAndGenderStats!.data!} />;
}
