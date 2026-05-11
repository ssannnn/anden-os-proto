import { PartnersView } from "./view";

export default async function PartnersPage({
  searchParams
}: {
  searchParams: Promise<{ sector?: string; type?: string }>;
}) {
  return <PartnersView filters={await searchParams} />;
}
