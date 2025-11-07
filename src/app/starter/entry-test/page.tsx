import { ITestHomeResponseModel } from "@models/test-home/response";
import EntryTestPage from "@containers/Starter/Entry-test";
import testHomeService from "@services/test-home";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@routes";
import { authOptions } from "@lib/authOptions";

async function getTestHome() {
  const testHome = await testHomeService.getTestHome();
  return testHome;
}

export default async function EntryTest() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(ROUTES.PUBLIC.HOME);
  }
  const testHome = (await getTestHome()) as ITestHomeResponseModel;
  return <EntryTestPage testHome={testHome.data?.results || []} />;
}
