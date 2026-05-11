export type DocumentType =
  | "Regulation"
  | "Official guidance"
  | "Internal memo"
  | "Partner profile"
  | "Playbook"
  | "Template";

export type DocumentStatus = "Indexed" | "Review queued" | "Draft";

export type DocumentRecord = {
  slug: string;
  title: string;
  type: DocumentType;
  sourceLabel: string;
  sourceUrl?: string;
  sourcePackPath: string;
  jurisdiction: "Argentina" | "Internal" | "Global";
  language: "Spanish" | "English";
  indexStatus: DocumentStatus;
  retrievedAt?: string;
  updatedAt: string;
  legalReviewRequired: boolean;
  summary: string;
  entities: string[];
  risks: string[];
  checklist: string[];
  linkedCompanies: string[];
  linkedPartners: string[];
  aiUseCases: string[];
};

export const documents: DocumentRecord[] = [
  {
    slug: "argentina-knowledge-economy-law",
    title: "Ley 27.506 - Régimen de Economía del Conocimiento",
    type: "Regulation",
    sourceLabel: "Official source",
    sourceUrl:
      "https://www.argentina.gob.ar/normativa/nacional/ley-27506-324101/actualizacion",
    sourcePackPath:
      "supabase/seed/source-pack/regulations/argentina-knowledge-economy-law.md",
    jurisdiction: "Argentina",
    language: "Spanish",
    indexStatus: "Indexed",
    retrievedAt: "May 11, 2026",
    updatedAt: "May 11, 2026",
    legalReviewRequired: true,
    summary:
      "Operational summary of Argentina's Knowledge Economy regime for software, digital services, professional services exports, R&D, training, export thresholds, registration, and revalidation workflows. Original source in Spanish.",
    entities: [
      "Régimen de Promoción de la Economía del Conocimiento",
      "Registro Nacional de Beneficiarios",
      "ARCA",
      "Trámites a Distancia"
    ],
    risks: [
      "Eligibility depends on current regulatory interpretation and company-specific evidence.",
      "AI-generated summaries must be reviewed by legal before being used externally.",
      "Companies must validate fiscal, labor, social security, and union debt status."
    ],
    checklist: [
      "Confirm legal entity is constituted or authorized to operate in Argentina.",
      "Map revenue to promoted activities and verify the 70% activity threshold.",
      "Gather evidence for two additional requirements: quality, training/R&D, or exports.",
      "Prepare Knowledge Economy eligibility memo for legal review."
    ],
    linkedCompanies: ["AtlasPay", "LedgerGrid"],
    linkedPartners: ["Regulatory Studio", "Crecimiento"],
    aiUseCases: [
      "Knowledge Economy eligibility",
      "Regulatory onboarding",
      "Benefits brief"
    ]
  },
  {
    slug: "argentina-knowledge-economy-decree-1034-2020",
    title: "Decreto 1034/2020 - Reglamentación Ley 27.506",
    type: "Regulation",
    sourceLabel: "Official source",
    sourceUrl:
      "https://www.argentina.gob.ar/normativa/nacional/decreto-1034-2020-345431/texto",
    sourcePackPath:
      "supabase/seed/source-pack/regulations/argentina-knowledge-economy-decree-1034-2020.md",
    jurisdiction: "Argentina",
    language: "Spanish",
    indexStatus: "Indexed",
    retrievedAt: "May 11, 2026",
    updatedAt: "May 11, 2026",
    legalReviewRequired: true,
    summary:
      "Regulatory decree that operationalizes the Knowledge Economy regime, including authority, registration implementation, beneficiary obligations, sanctions, and export duty treatment for qualifying services.",
    entities: [
      "Poder Ejecutivo Nacional",
      "Ministerio de Desarrollo Productivo",
      "Beneficiaries register",
      "Export services"
    ],
    risks: [
      "Decree-level requirements can be superseded by later regulations.",
      "Operational workflows should point to current official text before legal reliance."
    ],
    checklist: [
      "Check whether the company is applying under software, services, or another promoted activity.",
      "Validate authority and registration steps against current administrative guidance.",
      "Attach this source to legal review notes for regulated companies."
    ],
    linkedCompanies: ["AtlasPay", "LedgerGrid"],
    linkedPartners: ["Regulatory Studio"],
    aiUseCases: ["Legal research packet", "Eligibility assumptions"]
  },
  {
    slug: "argentina-knowledge-economy-registration",
    title: "Argentina.gob.ar - Beneficios Economía del Conocimiento",
    type: "Official guidance",
    sourceLabel: "Official source",
    sourceUrl:
      "https://www.argentina.gob.ar/servicio/acceder-los-beneficios-del-regimen-de-promocion-de-la-economia-del-conocimiento",
    sourcePackPath:
      "supabase/seed/source-pack/regulations/argentina-knowledge-economy-registration.md",
    jurisdiction: "Argentina",
    language: "Spanish",
    indexStatus: "Indexed",
    retrievedAt: "May 11, 2026",
    updatedAt: "May 11, 2026",
    legalReviewRequired: true,
    summary:
      "Official registration guidance for accessing Knowledge Economy benefits, including benefits, eligibility, documentation, Form 1278, TAD submission, and revalidation expectations.",
    entities: ["ARCA", "TAD", "Formulario 1278", "MiPyMEs"],
    risks: [
      "Administrative forms and attachments can change without changing the law.",
      "Teams should verify the source before requesting documents from a company."
    ],
    checklist: [
      "Request CUIT and fiscal key readiness.",
      "Confirm TAD access for legal representative or authorized proxy.",
      "Prepare declarations for R&D, training, sales, staff, exports, and related documentation."
    ],
    linkedCompanies: ["AtlasPay", "Nova Legal AI"],
    linkedPartners: ["Regulatory Studio"],
    aiUseCases: ["Document request checklist", "Company onboarding"]
  },
  {
    slug: "argentina-free-zones-law-24331",
    title: "Ley 24.331 - Zonas Francas",
    type: "Regulation",
    sourceLabel: "Official source",
    sourceUrl:
      "https://www.argentina.gob.ar/normativa/nacional/ley-24331-725/texto",
    sourcePackPath:
      "supabase/seed/source-pack/regulations/argentina-free-zones-law-24331.md",
    jurisdiction: "Argentina",
    language: "Spanish",
    indexStatus: "Indexed",
    retrievedAt: "May 11, 2026",
    updatedAt: "May 11, 2026",
    legalReviewRequired: true,
    summary:
      "Official law establishing Argentina's free zone framework, including objectives, permitted activities, provincial adherence, fiscal/customs treatment, and export-oriented industrial activity.",
    entities: [
      "Zonas Francas",
      "Poder Ejecutivo Nacional",
      "Provinces",
      "Customs territory"
    ],
    risks: [
      "Digital-zone positioning must not imply a special customs treatment unless legally validated.",
      "Provincial implementation details can materially affect applicability."
    ],
    checklist: [
      "Separate free-zone legal concepts from Andén's digital operations narrative.",
      "Ask legal team to review any external comparison to free zones.",
      "Map whether the stakeholder question concerns customs, tax, or institutional operations."
    ],
    linkedCompanies: ["Civitas Cloud"],
    linkedPartners: ["Regulatory Studio"],
    aiUseCases: ["Government stakeholder briefing", "Risk detection"]
  },
  {
    slug: "argentina-free-zones-arca-index",
    title: "ARCA/AFIP - Zonas Francas normativa index",
    type: "Official guidance",
    sourceLabel: "Official source",
    sourceUrl: "https://www.afip.gob.ar/zonasFrancas/ayuda/normativa.asp",
    sourcePackPath:
      "supabase/seed/source-pack/regulations/argentina-free-zones-arca.md",
    jurisdiction: "Argentina",
    language: "Spanish",
    indexStatus: "Review queued",
    retrievedAt: "May 11, 2026",
    updatedAt: "May 11, 2026",
    legalReviewRequired: true,
    summary:
      "ARCA/AFIP index of free-zone references, including Ley 24.331, Código Aduanero, and related resolutions useful for a legal source map.",
    entities: ["ARCA", "AFIP", "Código Aduanero", "Resolución General 270/1998"],
    risks: [
      "Index pages are source maps, not final legal analysis.",
      "Linked library documents need separate retrieval and legal validation."
    ],
    checklist: [
      "Use this as a navigation source for legal research.",
      "Flag unresolved linked documents before external briefings.",
      "Attach index source to the free-zone legal research packet."
    ],
    linkedCompanies: ["Civitas Cloud"],
    linkedPartners: ["Regulatory Studio"],
    aiUseCases: ["Source discovery", "Legal research packet"]
  },
  {
    slug: "anden-value-proposition",
    title: "Andén Value Proposition",
    type: "Internal memo",
    sourceLabel: "Internal mock",
    sourcePackPath:
      "supabase/seed/source-pack/internal/anden-value-proposition.md",
    jurisdiction: "Internal",
    language: "English",
    indexStatus: "Indexed",
    updatedAt: "May 10, 2026",
    legalReviewRequired: false,
    summary:
      "Internal narrative for positioning Andén as an AI-enabled operating layer for knowledge, company onboarding, partner coordination, documents, workflows, and executive decision support.",
    entities: ["Andén OS", "AI Backoffice", "Digital Zone Operations"],
    risks: [
      "Should not overstate production readiness during demo conversations.",
      "Claims about regulated workflows should point to legal-reviewed sources."
    ],
    checklist: [
      "Use this as the default answer for value proposition questions.",
      "Pair with the weekly operating brief when pitching founders.",
      "Link regulated claims to legal-reviewed documents."
    ],
    linkedCompanies: ["AtlasPay", "Civitas Cloud", "LedgerGrid"],
    linkedPartners: ["Crecimiento", "Protocol Labs"],
    aiUseCases: ["Value proposition", "Founder demo script"]
  },
  {
    slug: "digital-zone-company-onboarding-faq",
    title: "Digital Zone Company Onboarding FAQ",
    type: "Internal memo",
    sourceLabel: "Internal mock",
    sourcePackPath:
      "supabase/seed/source-pack/internal/digital-zone-company-onboarding-faq.md",
    jurisdiction: "Internal",
    language: "English",
    indexStatus: "Indexed",
    updatedAt: "May 9, 2026",
    legalReviewRequired: false,
    summary:
      "Mock onboarding FAQ that explains intake data, document requests, fit assessment, legal review routing, and next steps for companies entering the Digital Zone pipeline.",
    entities: ["Company intake", "Document request", "Fit assessment"],
    risks: [
      "Must not replace regulated onboarding guidance.",
      "Country-specific requirements need legal validation."
    ],
    checklist: [
      "Create company profile.",
      "Request incorporation, tax, product, sector, and compliance documents.",
      "Generate AI summary and recommended next action.",
      "Route legal questions to legal review."
    ],
    linkedCompanies: ["AtlasPay", "Nova Legal AI"],
    linkedPartners: ["Regulatory Studio"],
    aiUseCases: ["Document request checklist", "Onboarding workflow"]
  },
  {
    slug: "institutional-partner-profiles",
    title: "Institutional Partner Profiles",
    type: "Partner profile",
    sourceLabel: "Internal mock",
    sourcePackPath:
      "supabase/seed/source-pack/internal/institutional-partner-profiles.md",
    jurisdiction: "Global",
    language: "English",
    indexStatus: "Indexed",
    updatedAt: "May 9, 2026",
    legalReviewRequired: false,
    summary:
      "Mock partner profile pack for Crecimiento, Regulatory Studio, Protocol Labs, and Aragon, including sector relevance, recommended use cases, and meeting prep notes.",
    entities: ["Crecimiento", "Regulatory Studio", "Protocol Labs", "Aragon"],
    risks: [
      "Partner relevance is demo data and should be validated before external partner claims.",
      "Introductions should be treated as relationship-sensitive."
    ],
    checklist: [
      "Select partner by company sector and stakeholder goal.",
      "Attach recommended use cases to meeting briefing.",
      "Record last interaction and next step after outreach."
    ],
    linkedCompanies: ["AtlasPay", "LedgerGrid", "Civitas Cloud"],
    linkedPartners: ["Crecimiento", "Regulatory Studio", "Protocol Labs", "Aragon"],
    aiUseCases: ["Partner matching", "Meeting preparation"]
  },
  {
    slug: "government-stakeholder-meeting-playbook",
    title: "Government Stakeholder Meeting Playbook",
    type: "Playbook",
    sourceLabel: "Internal mock",
    sourcePackPath:
      "supabase/seed/source-pack/internal/government-stakeholder-meeting-playbook.md",
    jurisdiction: "Internal",
    language: "English",
    indexStatus: "Indexed",
    updatedAt: "May 8, 2026",
    legalReviewRequired: false,
    summary:
      "Structured playbook for preparing institutional meetings: stakeholder context, objectives, talking points, risks, suggested questions, and follow-up email draft.",
    entities: ["Government stakeholder", "Briefing", "Talking points"],
    risks: [
      "Public-sector framing should be reviewed before formal outreach.",
      "Regulatory claims must cite legal-reviewed sources."
    ],
    checklist: [
      "Identify stakeholder and objective.",
      "Generate briefing and talking points.",
      "List risks and suggested questions.",
      "Draft follow-up email."
    ],
    linkedCompanies: ["Civitas Cloud"],
    linkedPartners: ["Crecimiento", "Aragon"],
    aiUseCases: ["Meeting briefing", "Government stakeholder prep"]
  },
  {
    slug: "weekly-operating-brief-template",
    title: "Weekly Operating Brief Template",
    type: "Template",
    sourceLabel: "Internal mock",
    sourcePackPath:
      "supabase/seed/source-pack/internal/weekly-operating-brief-template.md",
    jurisdiction: "Internal",
    language: "English",
    indexStatus: "Draft",
    updatedAt: "May 8, 2026",
    legalReviewRequired: false,
    summary:
      "Template for founder-facing operating reports covering progress, risks, next steps, opportunities, blockers, and AI recommendations.",
    entities: ["Weekly brief", "Operating metrics", "AI recommendations"],
    risks: [
      "Metrics are mock data until integrated with live systems.",
      "Risk summaries need owner confirmation before executive circulation."
    ],
    checklist: [
      "Summarize weekly progress.",
      "List risks, blockers, and owners.",
      "Surface opportunities and recommended actions.",
      "Attach source citations for any regulatory statement."
    ],
    linkedCompanies: ["AtlasPay", "LedgerGrid", "Nova Legal AI"],
    linkedPartners: ["Crecimiento", "Regulatory Studio"],
    aiUseCases: ["Weekly report generation", "Founder briefing"]
  }
];

export const documentTypes = Array.from(
  new Set(documents.map((document) => document.type))
);

export const documentJurisdictions = Array.from(
  new Set(documents.map((document) => document.jurisdiction))
);

export const documentStatuses = Array.from(
  new Set(documents.map((document) => document.indexStatus))
);

export function findDocument(slug: string) {
  return documents.find((document) => document.slug === slug);
}
