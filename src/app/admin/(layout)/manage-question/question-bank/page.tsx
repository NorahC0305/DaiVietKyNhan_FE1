export const dynamic = 'force-dynamic';

import QuestionBankPage from "@containers/Admin/Question/QuestionBank";
import landService from "@services/land";

 async function getLands() {
  return await landService.getLands();
}
export default async function QuestionBankServer() {
  const lands = await getLands();

  return (
    <>
      <QuestionBankPage lands={lands.data?.results || []} />
    </>
  );
}
