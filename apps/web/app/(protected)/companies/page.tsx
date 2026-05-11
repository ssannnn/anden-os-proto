import { CompaniesView } from "./view";
import { getCompaniesData } from "../data/demo-repository";

export default async function CompaniesPage({
  searchParams
}: {
  searchParams: Promise<{
    sector?: string;
    status?: string;
    country?: string;
    priority?: string;
  }>;
}) {
  const [{ data: companies }, filters] = await Promise.all([
    getCompaniesData(),
    searchParams
  ]);

  return <CompaniesView companies={companies} filters={filters} />;
}
