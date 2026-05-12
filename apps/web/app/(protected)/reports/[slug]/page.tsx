import { notFound } from "next/navigation";
import { getDataModeLabel, getReportData } from "../../data/demo-repository";
import { ReportDetailView } from "../view";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: report, mode } = await getReportData(slug);

  if (!report) {
    notFound();
  }

  return (
    <ReportDetailView
      report={report}
      dataModeLabel={getDataModeLabel(mode)}
    />
  );
}
