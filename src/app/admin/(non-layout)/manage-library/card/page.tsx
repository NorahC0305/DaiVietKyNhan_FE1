export const dynamic = 'force-dynamic';


import CardPage from "@containers/Admin/Library/Card";
import landService from "@services/land";

async function getLands() {
  const response = await landService.getLands();
  return response.data;
}

export default async function CardServer() {
  const lands = await getLands();
  return (
    <>
      <CardPage lands={lands?.results || []} />
    </>
  );
}
