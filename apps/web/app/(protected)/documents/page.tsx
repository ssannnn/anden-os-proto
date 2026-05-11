import { DocumentsView } from "./view";
import { getDocumentsData } from "../data/demo-repository";

export default async function DocumentsPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string; jurisdiction?: string; status?: string }>;
}) {
  const [{ data: documents }, filters] = await Promise.all([
    getDocumentsData(),
    searchParams
  ]);

  return <DocumentsView documents={documents} filters={filters} />;
}
