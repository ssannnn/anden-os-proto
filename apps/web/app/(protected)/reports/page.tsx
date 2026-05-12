import { getDataModeLabel, getReportsData } from "../data/demo-repository";
import { ReportsView } from "./view";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { data: reports, mode } = await getReportsData();

  return (
    <ReportsView reports={reports} dataModeLabel={getDataModeLabel(mode)} />
  );
}
