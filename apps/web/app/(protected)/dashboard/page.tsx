import { DashboardView } from "./dashboard-view";
import { getDashboardData, getDataModeLabel } from "../data/demo-repository";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data, mode } = await getDashboardData();

  return <DashboardView data={data} dataModeLabel={getDataModeLabel(mode)} />;
}
