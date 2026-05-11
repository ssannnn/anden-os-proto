export const routeCopy = {
  dashboard: {
    eyebrow: { en: "Operating pulse", es: "Pulso operativo" },
    title: { en: "Executive dashboard", es: "Panel ejecutivo" },
    description: {
      en: "A first-view command center for companies, partners, documents, workflows, AI activity, alerts, and operating metrics.",
      es: "Un centro de comando inicial para empresas, partners, documentos, workflows, actividad AI, alertas y métricas operativas."
    }
  },
  assistant: {
    eyebrow: { en: "Knowledge layer", es: "Capa de conocimiento" },
    title: { en: "AI Knowledge Assistant", es: "Asistente de conocimiento AI" },
    description: {
      en: "Ask source-backed questions about Andén, digital zone operations, partners, onboarding, and regulatory context.",
      es: "Hacé preguntas con fuentes sobre Andén, operaciones de zonas digitales, partners, onboarding y contexto regulatorio."
    }
  },
  companies: {
    eyebrow: { en: "Pipeline", es: "Pipeline" },
    title: { en: "Companies", es: "Empresas" },
    description: {
      en: "Track institutional leads with status, priority, next step, linked documents, AI summary, and recommended action.",
      es: "Seguimiento de leads institucionales con estado, prioridad, próximo paso, documentos vinculados, resumen AI y acción recomendada."
    }
  },
  partners: {
    eyebrow: { en: "Ecosystem", es: "Ecosistema" },
    title: { en: "Partners", es: "Partners" },
    description: {
      en: "Map institutional and operational partners by relevance, sector, and recommended use case.",
      es: "Mapeo de partners institucionales y operativos por relevancia, sector y caso de uso recomendado."
    }
  },
  documents: {
    eyebrow: { en: "Source pack", es: "Paquete de fuentes" },
    title: { en: "Documents", es: "Documentos" },
    description: {
      en: "List indexed regulatory and internal documents with source, jurisdiction, status, risks, and checklist intelligence.",
      es: "Listado de documentos regulatorios e internos indexados con fuente, jurisdicción, estado, riesgos y checklist."
    }
  },
  workflows: {
    eyebrow: { en: "Automation", es: "Automatización" },
    title: { en: "Workflows", es: "Workflows" },
    description: {
      en: "Run simulated onboarding, meeting preparation, and institutional content workflows with saved outputs.",
      es: "Ejecución simulada de workflows de onboarding, preparación de reuniones y contenido institucional con outputs guardados."
    }
  },
  reports: {
    eyebrow: { en: "Executive memory", es: "Memoria ejecutiva" },
    title: { en: "Reports", es: "Reportes" },
    description: {
      en: "Review generated weekly operating briefs with citations, legal review items, and estimated AI cost.",
      es: "Revisión de briefs operativos semanales con citas, puntos de revisión legal y costo AI estimado."
    }
  }
} as const;

export type RouteKey = keyof typeof routeCopy;
