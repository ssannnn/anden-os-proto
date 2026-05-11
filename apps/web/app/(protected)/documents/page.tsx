import { DocumentsView } from "./view";

export default async function DocumentsPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string; jurisdiction?: string; status?: string }>;
}) {
  return <DocumentsView filters={await searchParams} />;
}
