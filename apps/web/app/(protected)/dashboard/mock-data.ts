import type { DashboardData } from "@anden/db";

export const mockDashboardData: DashboardData = {
  metrics: [
    {
      value: "12",
      label: { en: "companies tracked", es: "empresas registradas" },
      tone: "blue"
    },
    {
      value: "4",
      label: { en: "institutional partners", es: "partners institucionales" },
      tone: "lime"
    },
    {
      value: "37",
      label: { en: "documents indexed", es: "documentos indexados" },
      tone: "orange"
    },
    {
      value: "8",
      label: { en: "pending workflows", es: "workflows pendientes" },
      tone: "sky"
    },
    {
      value: "92%",
      label: { en: "AI retrieval confidence", es: "confianza de retrieval AI" },
      tone: "periwinkle"
    },
    {
      value: "14",
      label: { en: "hours saved this week", es: "horas ahorradas esta semana" },
      tone: "brown"
    }
  ],
  pipeline: [
    {
      company: "AtlasPay",
      sector: "Fintech",
      status: "Interested",
      priority: "High",
      nextAction: "Schedule regulatory onboarding call",
      readiness: 84
    },
    {
      company: "Civitas Cloud",
      sector: "GovTech",
      status: "Briefing",
      priority: "Medium",
      nextAction: "Send digital zone benefits memo",
      readiness: 72
    },
    {
      company: "LedgerGrid",
      sector: "Infrastructure",
      status: "Qualification",
      priority: "High",
      nextAction: "Validate Knowledge Economy fit",
      readiness: 68
    }
  ],
  alerts: [
    "Legal review required for fintech onboarding checklist",
    "ARCA Free Zone source pack needs final citation check",
    "Government stakeholder briefing due tomorrow"
  ],
  recentQueries: [
    "What documents should we request from a new fintech company?",
    "Which partners are most relevant for fintech companies?",
    "Summarize requirements for Argentina digital zone readiness."
  ],
  workflows: [
    { name: "Company onboarding", state: "Waiting documents", progress: 64 },
    { name: "Prepare meeting", state: "Brief draft ready", progress: 82 },
    {
      name: "Publish institutional content",
      state: "Outline generated",
      progress: 46
    }
  ]
};
