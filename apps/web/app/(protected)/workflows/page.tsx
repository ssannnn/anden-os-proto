import {
  getDataModeLabel,
  getWorkflowRunsData,
  getWorkflowsData
} from "../data/demo-repository";
import { WorkflowsView } from "./view";

export const dynamic = "force-dynamic";

export default async function WorkflowsPage() {
  const [workflows, runs] = await Promise.all([
    getWorkflowsData(),
    getWorkflowRunsData()
  ]);

  return (
    <WorkflowsView
      workflows={workflows.data}
      initialRuns={runs.data}
      dataModeLabel={getDataModeLabel(workflows.mode)}
    />
  );
}
