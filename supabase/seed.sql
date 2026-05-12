begin;

truncate table
  public.ai_usage_events,
  public.assistant_messages,
  public.assistant_threads,
  public.workflow_runs,
  public.workflows,
  public.document_chunks,
  public.documents,
  public.partners,
  public.companies,
  public.dashboard_metrics,
  public.reports,
  public.demo_settings
restart identity cascade;

insert into public.demo_settings (setting_key, value, description)
values
  (
    'demo_access',
    '{"access_code_hint":"configured in DEMO_ACCESS_CODE","default_data_mode":"mock"}',
    'Runtime settings for the password-protected Anden OS demo.'
  ),
  (
    'ai_cost_guard',
    '{"monthly_budget_usd":5,"default_provider":"mock","hard_stop_enabled":true}',
    'AI usage guardrail for keeping the public demo below the approved USD 5 cap.'
  );

insert into public.dashboard_metrics (
  metric_key,
  value,
  label_en,
  label_es,
  tone,
  sort_order
)
values
  ('companies_tracked', '12', 'companies tracked', 'empresas registradas', 'blue', 10),
  ('institutional_partners', '4', 'institutional partners', 'partners institucionales', 'lime', 20),
  ('documents_indexed', '37', 'documents indexed', 'documentos indexados', 'orange', 30),
  ('pending_workflows', '8', 'pending workflows', 'workflows pendientes', 'sky', 40),
  ('retrieval_confidence', '92%', 'AI retrieval confidence', 'confianza de retrieval AI', 'periwinkle', 50),
  ('hours_saved', '14', 'hours saved this week', 'horas ahorradas esta semana', 'brown', 60);

insert into public.companies (
  slug,
  name,
  sector,
  country,
  status,
  priority,
  last_interaction,
  next_step,
  documents,
  ai_summary,
  ai_recommended_action,
  readiness,
  partner_relevance
)
values
  (
    'atlaspay',
    'AtlasPay',
    'Fintech',
    'Argentina',
    'Interested',
    'High',
    '2026-05-08',
    'Regulatory onboarding call',
    array[
      'Knowledge Economy onboarding requirements',
      'Digital Zone benefits brief',
      'Fintech intake checklist'
    ],
    'AtlasPay is a fintech lead with strong fit for Argentina Digital Zone Operations. The company needs a regulatory onboarding conversation and a clear benefits brief before moving into qualification.',
    'Schedule regulatory onboarding call and send digital zone benefits brief.',
    84,
    array['Crecimiento', 'Regulatory Studio', 'Protocol Labs']
  ),
  (
    'civitas-cloud',
    'Civitas Cloud',
    'GovTech',
    'Argentina',
    'Briefing',
    'Medium',
    '2026-05-06',
    'Prepare government stakeholder memo',
    array['Government stakeholder meeting playbook', 'Operating memo'],
    'Civitas Cloud is useful for institutional credibility and public-sector workflow demos, but the immediate path is a targeted briefing rather than onboarding.',
    'Prepare stakeholder talking points and validate institutional sponsor fit.',
    72,
    array['Crecimiento', 'Aragon']
  ),
  (
    'ledgergrid',
    'LedgerGrid',
    'Infrastructure',
    'Uruguay',
    'Qualification',
    'High',
    '2026-05-04',
    'Validate Knowledge Economy fit',
    array['Company fit assessment rubric', 'Partner profiles'],
    'LedgerGrid is an infrastructure lead that could become a strong software factory and partner-facing reference if eligibility is validated.',
    'Request technical services revenue breakdown and map applicable regime requirements.',
    68,
    array['Protocol Labs', 'Crecimiento']
  ),
  (
    'nova-legal-ai',
    'Nova Legal AI',
    'LegalTech',
    'Chile',
    'Onboarding',
    'Low',
    '2026-04-30',
    'Request incorporation documents',
    array['Onboarding FAQ', 'Legal review checklist'],
    'Nova Legal AI is relevant for legal automation demos but lower priority than fintech and infrastructure leads for the first Anden OS narrative.',
    'Keep warm and request missing incorporation documents after fintech workflow demo.',
    58,
    array['Regulatory Studio']
  );

insert into public.partners (
  slug,
  name,
  partner_type,
  country,
  relevance,
  fintech_relevance,
  linked_sectors,
  last_interaction,
  next_step,
  documents,
  ai_summary,
  recommended_use_cases
)
values
  (
    'crecimiento',
    'Crecimiento',
    'Ecosystem',
    'Argentina',
    'Strategic',
    94,
    array['Fintech', 'Web3'],
    '2026-05-07',
    'Map fintech introductions for pilot companies',
    array['Institutional partner profiles', 'Fintech ecosystem memo'],
    'Crecimiento is the strongest ecosystem partner for fintech and Web3 company discovery in Argentina. It can help validate the local operating narrative and introduce relevant founders.',
    array[
      'Introduce fintech leads to local ecosystem operators.',
      'Validate founder-facing messaging for Argentina Digital Zone Operations.',
      'Source warm referrals for partner-led pilots.'
    ]
  ),
  (
    'regulatory-studio',
    'Regulatory Studio',
    'Legal/Compliance',
    'Argentina',
    'High',
    88,
    array['Fintech', 'LegalTech'],
    '2026-05-05',
    'Review regulatory onboarding checklist',
    array['Legal review checklist', 'Knowledge Economy requirements'],
    'Regulatory Studio is the primary review partner for onboarding language, legal review flags, and fintech regulatory interpretation.',
    array[
      'Review regulatory onboarding checklist.',
      'Validate legal review language before external use.',
      'Support fintech fit assessment.'
    ]
  ),
  (
    'protocol-labs',
    'Protocol Labs',
    'Technology ecosystem',
    'Global',
    'High',
    72,
    array['Infrastructure', 'Web3'],
    '2026-05-03',
    'Identify infrastructure use cases',
    array['Partner profiles', 'Infrastructure operating memo'],
    'Protocol Labs is most relevant for infrastructure credibility and technical ecosystem alignment rather than direct fintech onboarding.',
    array[
      'Frame infrastructure partner narrative.',
      'Validate technical ecosystem assumptions.',
      'Identify protocol-adjacent companies.'
    ]
  ),
  (
    'aragon',
    'Aragon',
    'Governance',
    'Global',
    'Medium',
    61,
    array['GovTech', 'Web3'],
    '2026-04-28',
    'Assess governance workflow relevance',
    array['Government stakeholder playbook', 'Partner profiles'],
    'Aragon is useful for governance narratives and stakeholder workflows, but less directly relevant for fintech onboarding.',
    array[
      'Design governance workflow demos.',
      'Support institutional coordination narrative.',
      'Review public-sector collaboration flows.'
    ]
  );

insert into public.documents (
  slug,
  title,
  document_type,
  source_label,
  source_url,
  source_pack_path,
  jurisdiction,
  language,
  index_status,
  retrieved_at,
  updated_at,
  legal_review_required,
  summary,
  entities,
  risks,
  checklist,
  linked_companies,
  linked_partners,
  ai_use_cases,
  metadata
)
values
  (
    'argentina-knowledge-economy-law',
    'Ley 27.506 - Régimen de Economía del Conocimiento',
    'Regulation',
    'Official source',
    'https://www.argentina.gob.ar/normativa/nacional/ley-27506-324101/actualizacion',
    'supabase/seed/source-pack/regulations/argentina-knowledge-economy-law.md',
    'Argentina',
    'Spanish',
    'Indexed',
    '2026-05-11',
    '2026-05-11',
    true,
    'Operational summary of Argentina''s Knowledge Economy regime for software, digital services, professional services exports, R&D, training, export thresholds, registration, and revalidation workflows. Original source in Spanish.',
    array['Régimen de Promoción de la Economía del Conocimiento', 'Registro Nacional de Beneficiarios', 'ARCA', 'Trámites a Distancia'],
    array[
      'Eligibility depends on current regulatory interpretation and company-specific evidence.',
      'AI-generated summaries must be reviewed by legal before being used externally.',
      'Companies must validate fiscal, labor, social security, and union debt status.'
    ],
    array[
      'Confirm legal entity is constituted or authorized to operate in Argentina.',
      'Map revenue to promoted activities and verify the 70% activity threshold.',
      'Gather evidence for two additional requirements: quality, training/R&D, or exports.',
      'Prepare Knowledge Economy eligibility memo for legal review.'
    ],
    array['AtlasPay', 'LedgerGrid'],
    array['Regulatory Studio', 'Crecimiento'],
    array['Knowledge Economy eligibility', 'Regulatory onboarding', 'Benefits brief'],
    '{"source_pack_version":"2026-05-11.mock-v1"}'
  ),
  (
    'argentina-knowledge-economy-decree-1034-2020',
    'Decreto 1034/2020 - Reglamentación Ley 27.506',
    'Regulation',
    'Official source',
    'https://www.argentina.gob.ar/normativa/nacional/decreto-1034-2020-345431/texto',
    'supabase/seed/source-pack/regulations/argentina-knowledge-economy-decree-1034-2020.md',
    'Argentina',
    'Spanish',
    'Indexed',
    '2026-05-11',
    '2026-05-11',
    true,
    'Regulatory decree that operationalizes the Knowledge Economy regime, including authority, registration implementation, beneficiary obligations, sanctions, and export duty treatment for qualifying services.',
    array['Poder Ejecutivo Nacional', 'Ministerio de Desarrollo Productivo', 'Beneficiaries register', 'Export services'],
    array['Decree-level requirements can be superseded by later regulations.', 'Operational workflows should point to current official text before legal reliance.'],
    array['Check whether the company is applying under software, services, or another promoted activity.', 'Validate authority and registration steps against current administrative guidance.', 'Attach this source to legal review notes for regulated companies.'],
    array['AtlasPay', 'LedgerGrid'],
    array['Regulatory Studio'],
    array['Legal research packet', 'Eligibility assumptions'],
    '{"source_pack_version":"2026-05-11.mock-v1"}'
  ),
  (
    'argentina-knowledge-economy-registration',
    'Argentina.gob.ar - Beneficios Economía del Conocimiento',
    'Official guidance',
    'Official source',
    'https://www.argentina.gob.ar/servicio/acceder-los-beneficios-del-regimen-de-promocion-de-la-economia-del-conocimiento',
    'supabase/seed/source-pack/regulations/argentina-knowledge-economy-registration.md',
    'Argentina',
    'Spanish',
    'Indexed',
    '2026-05-11',
    '2026-05-11',
    true,
    'Official registration guidance for accessing Knowledge Economy benefits, including benefits, eligibility, documentation, Form 1278, TAD submission, and revalidation expectations.',
    array['ARCA', 'TAD', 'Formulario 1278', 'MiPyMEs'],
    array['Administrative forms and attachments can change without changing the law.', 'Teams should verify the source before requesting documents from a company.'],
    array['Request CUIT and fiscal key readiness.', 'Confirm TAD access for legal representative or authorized proxy.', 'Prepare declarations for R&D, training, sales, staff, exports, and related documentation.'],
    array['AtlasPay', 'Nova Legal AI'],
    array['Regulatory Studio'],
    array['Document request checklist', 'Company onboarding'],
    '{"source_pack_version":"2026-05-11.mock-v1"}'
  ),
  (
    'argentina-free-zones-law-24331',
    'Ley 24.331 - Zonas Francas',
    'Regulation',
    'Official source',
    'https://www.argentina.gob.ar/normativa/nacional/ley-24331-725/texto',
    'supabase/seed/source-pack/regulations/argentina-free-zones-law-24331.md',
    'Argentina',
    'Spanish',
    'Indexed',
    '2026-05-11',
    '2026-05-11',
    true,
    'Official law establishing Argentina''s free zone framework, including objectives, permitted activities, provincial adherence, fiscal/customs treatment, and export-oriented industrial activity.',
    array['Zonas Francas', 'Poder Ejecutivo Nacional', 'Provinces', 'Customs territory'],
    array['Digital-zone positioning must not imply a special customs treatment unless legally validated.', 'Provincial implementation details can materially affect applicability.'],
    array['Separate free-zone legal concepts from Anden''s digital operations narrative.', 'Ask legal team to review any external comparison to free zones.', 'Map whether the stakeholder question concerns customs, tax, or institutional operations.'],
    array['Civitas Cloud'],
    array['Regulatory Studio'],
    array['Government stakeholder briefing', 'Risk detection'],
    '{"source_pack_version":"2026-05-11.mock-v1"}'
  ),
  (
    'argentina-free-zones-arca-index',
    'ARCA/AFIP - Zonas Francas normativa index',
    'Official guidance',
    'Official source',
    'https://www.afip.gob.ar/zonasFrancas/ayuda/normativa.asp',
    'supabase/seed/source-pack/regulations/argentina-free-zones-arca.md',
    'Argentina',
    'Spanish',
    'Review queued',
    '2026-05-11',
    '2026-05-11',
    true,
    'ARCA/AFIP index of free-zone references, including Ley 24.331, Código Aduanero, and related resolutions useful for a legal source map.',
    array['ARCA', 'AFIP', 'Código Aduanero', 'Resolución General 270/1998'],
    array['Index pages are source maps, not final legal analysis.', 'Linked library documents need separate retrieval and legal validation.'],
    array['Use this as a navigation source for legal research.', 'Flag unresolved linked documents before external briefings.', 'Attach index source to the free-zone legal research packet.'],
    array['Civitas Cloud'],
    array['Regulatory Studio'],
    array['Source discovery', 'Legal research packet'],
    '{"source_pack_version":"2026-05-11.mock-v1"}'
  ),
  (
    'anden-value-proposition',
    'Andén Value Proposition',
    'Internal memo',
    'Internal mock',
    null,
    'supabase/seed/source-pack/internal/anden-value-proposition.md',
    'Internal',
    'English',
    'Indexed',
    null,
    '2026-05-10',
    false,
    'Internal narrative for positioning Andén as an AI-enabled operating layer for knowledge, company onboarding, partner coordination, documents, workflows, and executive decision support.',
    array['Andén OS', 'AI Backoffice', 'Digital Zone Operations'],
    array['Should not overstate production readiness during demo conversations.', 'Claims about regulated workflows should point to legal-reviewed sources.'],
    array['Use this as the default answer for value proposition questions.', 'Pair with the weekly operating brief when pitching founders.', 'Link regulated claims to legal-reviewed documents.'],
    array['AtlasPay', 'Civitas Cloud', 'LedgerGrid'],
    array['Crecimiento', 'Protocol Labs'],
    array['Value proposition', 'Founder demo script'],
    '{"source_pack_version":"2026-05-11.mock-v1"}'
  ),
  (
    'digital-zone-company-onboarding-faq',
    'Digital Zone Company Onboarding FAQ',
    'Internal memo',
    'Internal mock',
    null,
    'supabase/seed/source-pack/internal/digital-zone-company-onboarding-faq.md',
    'Internal',
    'English',
    'Indexed',
    null,
    '2026-05-09',
    false,
    'Mock onboarding FAQ that explains intake data, document requests, fit assessment, legal review routing, and next steps for companies entering the Digital Zone pipeline.',
    array['Company intake', 'Document request', 'Fit assessment'],
    array['Must not replace regulated onboarding guidance.', 'Country-specific requirements need legal validation.'],
    array['Create company profile.', 'Request incorporation, tax, product, sector, and compliance documents.', 'Generate AI summary and recommended next action.', 'Route legal questions to legal review.'],
    array['AtlasPay', 'Nova Legal AI'],
    array['Regulatory Studio'],
    array['Document request checklist', 'Onboarding workflow'],
    '{"source_pack_version":"2026-05-11.mock-v1"}'
  ),
  (
    'institutional-partner-profiles',
    'Institutional Partner Profiles',
    'Partner profile',
    'Internal mock',
    null,
    'supabase/seed/source-pack/internal/institutional-partner-profiles.md',
    'Global',
    'English',
    'Indexed',
    null,
    '2026-05-09',
    false,
    'Mock partner profile pack for Crecimiento, Regulatory Studio, Protocol Labs, and Aragon, including sector relevance, recommended use cases, and meeting prep notes.',
    array['Crecimiento', 'Regulatory Studio', 'Protocol Labs', 'Aragon'],
    array['Partner relevance is demo data and should be validated before external partner claims.', 'Introductions should be treated as relationship-sensitive.'],
    array['Select partner by company sector and stakeholder goal.', 'Attach recommended use cases to meeting briefing.', 'Record last interaction and next step after outreach.'],
    array['AtlasPay', 'LedgerGrid', 'Civitas Cloud'],
    array['Crecimiento', 'Regulatory Studio', 'Protocol Labs', 'Aragon'],
    array['Partner matching', 'Meeting preparation'],
    '{"source_pack_version":"2026-05-11.mock-v1"}'
  ),
  (
    'government-stakeholder-meeting-playbook',
    'Government Stakeholder Meeting Playbook',
    'Playbook',
    'Internal mock',
    null,
    'supabase/seed/source-pack/internal/government-stakeholder-meeting-playbook.md',
    'Internal',
    'English',
    'Indexed',
    null,
    '2026-05-08',
    false,
    'Structured playbook for preparing institutional meetings: stakeholder context, objectives, talking points, risks, suggested questions, and follow-up email draft.',
    array['Government stakeholder', 'Briefing', 'Talking points'],
    array['Public-sector framing should be reviewed before formal outreach.', 'Regulatory claims must cite legal-reviewed sources.'],
    array['Identify stakeholder and objective.', 'Generate briefing and talking points.', 'List risks and suggested questions.', 'Draft follow-up email.'],
    array['Civitas Cloud'],
    array['Crecimiento', 'Aragon'],
    array['Meeting briefing', 'Government stakeholder prep'],
    '{"source_pack_version":"2026-05-11.mock-v1"}'
  ),
  (
    'weekly-operating-brief-template',
    'Weekly Operating Brief Template',
    'Template',
    'Internal mock',
    null,
    'supabase/seed/source-pack/internal/weekly-operating-brief-template.md',
    'Internal',
    'English',
    'Draft',
    null,
    '2026-05-08',
    false,
    'Template for founder-facing operating reports covering progress, risks, next steps, opportunities, blockers, and AI recommendations.',
    array['Weekly brief', 'Operating metrics', 'AI recommendations'],
    array['Metrics are mock data until integrated with live systems.', 'Risk summaries need owner confirmation before executive circulation.'],
    array['Summarize weekly progress.', 'List risks, blockers, and owners.', 'Surface opportunities and recommended actions.', 'Attach source citations for any regulatory statement.'],
    array['AtlasPay', 'LedgerGrid', 'Nova Legal AI'],
    array['Crecimiento', 'Regulatory Studio'],
    array['Weekly report generation', 'Founder briefing'],
    '{"source_pack_version":"2026-05-11.mock-v1"}'
  );

insert into public.document_chunks (document_id, chunk_index, content, token_count, metadata)
select
  id,
  0,
  summary,
  80,
  jsonb_build_object(
    'source_pack_path', source_pack_path,
    'source_type', lower(replace(document_type, ' ', '_')),
    'source_pack_version', '2026-05-11.mock-v1',
    'section', 'Operational Summary',
    'original_language', case when language = 'Spanish' then 'es' else 'en' end,
    'legal_review_required', legal_review_required
  )
from public.documents;

insert into public.workflows (slug, name, category, status, description, sort_order, steps, trigger_schema)
values
  (
    'company-onboarding',
    'Company onboarding',
    'onboarding',
    'Active',
    'Create a company profile, request documents, generate a summary, validate fit, prepare email, and assign the next step.',
    10,
    '[
      {"name":"Create profile","status":"complete"},
      {"name":"Request documents","status":"active"},
      {"name":"Generate summary","status":"queued"},
      {"name":"Validate fit","status":"queued"},
      {"name":"Prepare email","status":"queued"},
      {"name":"Assign next step","status":"queued"}
    ]',
    '{"company":"string","sector":"string","country":"string"}'
  ),
  (
    'prepare-meeting',
    'Prepare meeting',
    'briefing',
    'Active',
    'Generate a briefing, talking points, risks, suggested questions, and follow-up email for a company or stakeholder meeting.',
    20,
    '[
      {"name":"Collect stakeholder context","status":"complete"},
      {"name":"Draft briefing","status":"active"},
      {"name":"List risks","status":"queued"},
      {"name":"Draft follow-up","status":"queued"}
    ]',
    '{"company":"string","stakeholder":"string","objective":"string"}'
  ),
  (
    'publish-institutional-content',
    'Publish institutional content',
    'content',
    'Active',
    'Turn an institutional topic into outline, blog draft, SEO metadata, LinkedIn post, and newsletter snippet.',
    30,
    '[
      {"name":"Generate outline","status":"active"},
      {"name":"Draft blog","status":"queued"},
      {"name":"SEO metadata","status":"queued"},
      {"name":"LinkedIn post","status":"queued"},
      {"name":"Newsletter snippet","status":"queued"}
    ]',
    '{"topic":"string"}'
  );

insert into public.workflow_runs (
  workflow_id,
  target_company_id,
  state,
  progress,
  inputs,
  outputs
)
select
  workflows.id,
  companies.id,
  'Waiting documents',
  64,
  '{"company":"AtlasPay"}',
  '{"next_step":"Request Knowledge Economy onboarding documents"}'
from public.workflows, public.companies
where workflows.slug = 'company-onboarding' and companies.slug = 'atlaspay';

insert into public.workflow_runs (workflow_id, target_company_id, state, progress, inputs, outputs)
select
  workflows.id,
  companies.id,
  'Brief draft ready',
  82,
  '{"company":"Civitas Cloud","stakeholder":"government"}',
  '{"briefing":"Draft stakeholder briefing generated"}'
from public.workflows, public.companies
where workflows.slug = 'prepare-meeting' and companies.slug = 'civitas-cloud';

insert into public.workflow_runs (workflow_id, state, progress, inputs, outputs)
select
  id,
  'Outline generated',
  46,
  '{"topic":"Digital Zone operations"}',
  '{"outline":"Institutional content outline generated"}'
from public.workflows
where slug = 'publish-institutional-content';

insert into public.assistant_threads (slug, title, locale, context)
values
  (
    'golden-path-value-proposition',
    'Golden path: Anden value proposition',
    'en',
    '{"demo":true,"primary_sources":["anden-value-proposition"]}'
  );

insert into public.assistant_messages (thread_id, role, content, citations, confidence)
select
  id,
  'user',
  'What is Anden''s value proposition?',
  '[]',
  null
from public.assistant_threads
where slug = 'golden-path-value-proposition';

insert into public.assistant_messages (thread_id, role, content, citations, confidence)
select
  id,
  'assistant',
  'Anden OS centralizes knowledge, partners, companies, documents, workflows, and executive decisions into an internal AI backoffice.',
  '[{"document_slug":"anden-value-proposition","label":"Andén Value Proposition"}]',
  92
from public.assistant_threads
where slug = 'golden-path-value-proposition';

insert into public.reports (
  slug,
  title,
  report_type,
  status,
  locale,
  period_start,
  period_end,
  content,
  citations,
  provider,
  requested_provider,
  model,
  estimated_cost_usd,
  legal_review_required
)
values
  (
    'weekly-operating-brief-2026-05-11',
    'Weekly Operating Brief - May 11, 2026',
    'weekly_operating_brief',
    'Draft',
    'en',
    '2026-05-04',
    '2026-05-11',
    '{
      "progress":["Dashboard, CRM, and document library slices are live."],
      "risks":["Legal review required for regulatory summaries before external use."],
      "next_steps":["Build AI provider adapter and RAG indexing."],
      "opportunities":["Use founder briefing to demonstrate operating leverage."],
      "blockers":[],
      "ai_recommendations":["Prioritize assistant golden path after persistence."]
    }',
    '[{"documentTitle":"Weekly Operating Brief Template","sourcePackPath":"supabase/seed/source-pack/internal/weekly-operating-brief-template.md"}]',
    'mock',
    'mock',
    'mock-seed',
    0,
    true
  );

insert into public.ai_usage_events (
  provider,
  model,
  feature,
  prompt_tokens,
  completion_tokens,
  cost_usd,
  locale,
  metadata
)
values
  (
    'mock',
    'mock-local',
    'dashboard',
    0,
    0,
    0,
    'en',
    '{"reason":"Seeded demo metric; no paid provider call."}'
  ),
  (
    'mock',
    'mock-local',
    'assistant',
    0,
    0,
    0,
    'en',
    '{"reason":"Golden path placeholder before issue #7/#8."}'
  );

commit;
