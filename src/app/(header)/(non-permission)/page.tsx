export const dynamic = 'force-dynamic';


import HomePageClient from "@containers/Public/HomePage";
import userService from "@services/user";
import { UserSchema } from "@models/user/entity";
import { IBackendResponse } from "@models/backend";
import { IUser } from "@models/user/entity";
import systemService from "@services/system";
import {
  GetSystemConfigWithAmountUserResSchema,
  IGetSystemConfigWithAmountUserResponse,
} from "@models/system/response";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";
import { getAttendanceListSSR } from "@lib/attendance";
import SocialMediaIcons from "@components/Atoms/SocialMediaIcons";
import { getQueryClient } from "@lib/get-query-client";
import { godProfileKeys } from "@hooks/useGodProfile";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

async function userMe() {
  try {
    return await userService.getMe();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Home() {
  const session = (await getServerSession(authOptions)) as UTILS.ISession;
  const user = (await userMe()) as IBackendResponse<typeof UserSchema>;
  const activeWithAmountUser = (await systemService.getActiveWithAmountUser(
    true
  )) as IBackendResponse<typeof GetSystemConfigWithAmountUserResSchema>;
  const initialAttendanceList = await getAttendanceListSSR();


  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(godProfileKeys.ranking())


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClient
        user={user.data as IUser}
        activeWithAmountUser={
          activeWithAmountUser.data as IGetSystemConfigWithAmountUserResponse
        }
        accessToken={session?.accessToken}
        initialAttendanceList={initialAttendanceList}
      />

      <div className="hidden lg:block fixed right-0 top-1/2 transform -translate-y-1/2 z-50 pointer-events-auto">
        <SocialMediaIcons />
      </div>
    </HydrationBoundary>
  );
}
