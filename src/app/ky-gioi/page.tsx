import { IUserLandWithLandArrayResponseModel } from "@models/user-land/response";
import MapPageClient from "@containers/Map";
import userService from "@services/user";
import userLandService from "@services/user-land";
import { IMeResponse } from "@models/user/response";

export const dynamic = "force-dynamic";

async function getUserLand() {
  const userLand = await userLandService.getUserLand();
  return userLand;
}

async function userMe() {
  try {
    return await userService.getMe() as IMeResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function MapServer() {
  const userLand = (await getUserLand()) as IUserLandWithLandArrayResponseModel;
  const user = (await userMe()) as IMeResponse["data"] | null;

  return (
    <>
      <MapPageClient userLand={userLand.data} user={user} />
    </>
  );
}
