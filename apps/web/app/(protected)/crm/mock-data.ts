export type CompanyStatus =
  | "Interested"
  | "Briefing"
  | "Qualification"
  | "Onboarding";

export type Priority = "High" | "Medium" | "Low";

export type Company = {
  slug: string;
  name: string;
  sector: string;
  country: string;
  status: CompanyStatus;
  priority: Priority;
  lastInteraction: string;
  nextStep: string;
  documents: string[];
  aiSummary: string;
  aiRecommendedAction: string;
  readiness: number;
  partnerRelevance: string[];
};

export type Partner = {
  slug: string;
  name: string;
  type: string;
  country: string;
  relevance: "Strategic" | "High" | "Medium";
  fintechRelevance: number;
  linkedSectors: string[];
  lastInteraction: string;
  nextStep: string;
  documents: string[];
  aiSummary: string;
  recommendedUseCases: string[];
};

export const companies: Company[] = [
  {
    slug: "atlaspay",
    name: "AtlasPay",
    sector: "Fintech",
    country: "Argentina",
    status: "Interested",
    priority: "High",
    lastInteraction: "May 8, 2026",
    nextStep: "Regulatory onboarding call",
    documents: [
      "Knowledge Economy onboarding requirements",
      "Digital Zone benefits brief",
      "Fintech intake checklist"
    ],
    aiSummary:
      "AtlasPay is a fintech lead with strong fit for Argentina Digital Zone Operations. The company needs a regulatory onboarding conversation and a clear benefits brief before moving into qualification.",
    aiRecommendedAction:
      "Schedule regulatory onboarding call and send digital zone benefits brief.",
    readiness: 84,
    partnerRelevance: ["Crecimiento", "Regulatory Studio", "Protocol Labs"]
  },
  {
    slug: "civitas-cloud",
    name: "Civitas Cloud",
    sector: "GovTech",
    country: "Argentina",
    status: "Briefing",
    priority: "Medium",
    lastInteraction: "May 6, 2026",
    nextStep: "Prepare government stakeholder memo",
    documents: ["Government stakeholder meeting playbook", "Operating memo"],
    aiSummary:
      "Civitas Cloud is useful for institutional credibility and public-sector workflow demos, but the immediate path is a targeted briefing rather than onboarding.",
    aiRecommendedAction:
      "Prepare stakeholder talking points and validate institutional sponsor fit.",
    readiness: 72,
    partnerRelevance: ["Crecimiento", "Aragon"]
  },
  {
    slug: "ledgergrid",
    name: "LedgerGrid",
    sector: "Infrastructure",
    country: "Uruguay",
    status: "Qualification",
    priority: "High",
    lastInteraction: "May 4, 2026",
    nextStep: "Validate Knowledge Economy fit",
    documents: ["Company fit assessment rubric", "Partner profiles"],
    aiSummary:
      "LedgerGrid is an infrastructure lead that could become a strong software factory and partner-facing reference if eligibility is validated.",
    aiRecommendedAction:
      "Request technical services revenue breakdown and map applicable regime requirements.",
    readiness: 68,
    partnerRelevance: ["Protocol Labs", "Crecimiento"]
  },
  {
    slug: "nova-legal-ai",
    name: "Nova Legal AI",
    sector: "LegalTech",
    country: "Chile",
    status: "Onboarding",
    priority: "Low",
    lastInteraction: "April 30, 2026",
    nextStep: "Request incorporation documents",
    documents: ["Onboarding FAQ", "Legal review checklist"],
    aiSummary:
      "Nova Legal AI is relevant for legal automation demos but lower priority than fintech and infrastructure leads for the first Andén OS narrative.",
    aiRecommendedAction:
      "Keep warm and request missing incorporation documents after fintech workflow demo.",
    readiness: 58,
    partnerRelevance: ["Regulatory Studio"]
  }
];

export const partners: Partner[] = [
  {
    slug: "crecimiento",
    name: "Crecimiento",
    type: "Ecosystem",
    country: "Argentina",
    relevance: "Strategic",
    fintechRelevance: 94,
    linkedSectors: ["Fintech", "Web3"],
    lastInteraction: "May 7, 2026",
    nextStep: "Map fintech introductions for pilot companies",
    documents: ["Institutional partner profiles", "Fintech ecosystem memo"],
    aiSummary:
      "Crecimiento is the strongest ecosystem partner for fintech and Web3 company discovery in Argentina. It can help validate the local operating narrative and introduce relevant founders.",
    recommendedUseCases: [
      "Introduce fintech leads to local ecosystem operators.",
      "Validate founder-facing messaging for Argentina Digital Zone Operations.",
      "Source warm referrals for partner-led pilots."
    ]
  },
  {
    slug: "regulatory-studio",
    name: "Regulatory Studio",
    type: "Legal/Compliance",
    country: "Argentina",
    relevance: "High",
    fintechRelevance: 88,
    linkedSectors: ["Fintech", "LegalTech"],
    lastInteraction: "May 5, 2026",
    nextStep: "Review regulatory onboarding checklist",
    documents: ["Legal review checklist", "Knowledge Economy requirements"],
    aiSummary:
      "Regulatory Studio is the primary review partner for onboarding language, legal review flags, and fintech regulatory interpretation.",
    recommendedUseCases: [
      "Review regulatory onboarding checklist.",
      "Validate legal review language before external use.",
      "Support fintech fit assessment."
    ]
  },
  {
    slug: "protocol-labs",
    name: "Protocol Labs",
    type: "Technology ecosystem",
    country: "Global",
    relevance: "High",
    fintechRelevance: 72,
    linkedSectors: ["Infrastructure", "Web3"],
    lastInteraction: "May 3, 2026",
    nextStep: "Identify infrastructure use cases",
    documents: ["Partner profiles", "Infrastructure operating memo"],
    aiSummary:
      "Protocol Labs is most relevant for infrastructure credibility and technical ecosystem alignment rather than direct fintech onboarding.",
    recommendedUseCases: [
      "Frame infrastructure partner narrative.",
      "Validate technical ecosystem assumptions.",
      "Identify protocol-adjacent companies."
    ]
  },
  {
    slug: "aragon",
    name: "Aragon",
    type: "Governance",
    country: "Global",
    relevance: "Medium",
    fintechRelevance: 61,
    linkedSectors: ["GovTech", "Web3"],
    lastInteraction: "April 28, 2026",
    nextStep: "Assess governance workflow relevance",
    documents: ["Government stakeholder playbook", "Partner profiles"],
    aiSummary:
      "Aragon is useful for governance narratives and stakeholder workflows, but less directly relevant for fintech onboarding.",
    recommendedUseCases: [
      "Design governance workflow demos.",
      "Support institutional coordination narrative.",
      "Review public-sector collaboration flows."
    ]
  }
];

export const companySectors = Array.from(
  new Set(companies.map((company) => company.sector))
);

export const companyStatuses = Array.from(
  new Set(companies.map((company) => company.status))
);

export const companyCountries = Array.from(
  new Set(companies.map((company) => company.country))
);

export const companyPriorities = Array.from(
  new Set(companies.map((company) => company.priority))
);

export const partnerSectors = Array.from(
  new Set(partners.flatMap((partner) => partner.linkedSectors))
);

export function findCompany(slug: string) {
  return companies.find((company) => company.slug === slug);
}

export function findPartner(slug: string) {
  return partners.find((partner) => partner.slug === slug);
}
