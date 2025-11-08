import NotFoundPageClient from "@containers/Public/NotFoundPage";
import HeaderSSR from "@components/Molecules/HeaderSSR";

export default async function NotFound() {
  return (
    <>
      <HeaderSSR />
      <NotFoundPageClient />
    </>
  )
}