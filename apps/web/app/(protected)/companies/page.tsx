import { CompaniesView } from "./view";

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
  return <CompaniesView filters={await searchParams} />;
}
