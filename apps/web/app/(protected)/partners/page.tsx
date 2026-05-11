import { PartnersView } from "./view";
import { getPartnersData } from "../data/demo-repository";

export default async function PartnersPage({
  searchParams
}: {
  searchParams: Promise<{ sector?: string; type?: string }>;
}) {
  const [{ data: partners }, filters] = await Promise.all([
    getPartnersData(),
    searchParams
  ]);

  return <PartnersView partners={partners} filters={filters} />;
}
