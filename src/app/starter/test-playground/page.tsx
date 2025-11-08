export const dynamic = 'force-dynamic';


import { ITestHomeResponseModel } from "@models/test-home/response";
import EntryTestPlaygroundPage from "@containers/Starter/TestPlayground/EntryTestPlayground";
import testHomeService from "@services/test-home";

async function getTestHome() {
  const testHome = await testHomeService.getTestHome();
  return testHome;
}

export default async function TestPlayground() {
  // Gọi API lấy câu hỏi giống test chính, nhưng không cần kiểm tra session
  const testHome = (await getTestHome()) as ITestHomeResponseModel;
  return <EntryTestPlaygroundPage testHome={testHome.data?.results || []} />;
}
