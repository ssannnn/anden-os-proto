export type SourcePackLanguage = "en" | "es";

export type SourcePackDocument = {
  slug: string;
  title: string;
  path: string;
  sourceUrl?: string;
  sourceType: string;
  jurisdiction: string;
  language: SourcePackLanguage;
  retrievedAt: string;
  legalReviewRequired: boolean;
};

export type SourcePackChunk = {
  chunkId: string;
  chunkIndex: number;
  documentSlug: string;
  documentTitle: string;
  sourcePackPath: string;
  sourceUrl?: string;
  sourceType: string;
  jurisdiction: string;
  originalLanguage: SourcePackLanguage;
  section: string;
  article?: string;
  content: string;
  tokenCount: number;
  sourcePackVersion: string;
  legalReviewRequired: boolean;
  embedding?: number[];
};

export type SourceCitation = {
  chunkId: string;
  documentSlug: string;
  documentTitle: string;
  sourcePackPath: string;
  sourceUrl?: string;
  sourceType: string;
  jurisdiction: string;
  originalLanguage: SourcePackLanguage;
  section: string;
  article?: string;
  excerpt: string;
  confidence: number;
  legalReviewRequired: boolean;
};

export type RetrievalResult =
  | {
      kind: "sources_found";
      query: string;
      citations: SourceCitation[];
    }
  | {
      kind: "knowledge_gap";
      query: string;
      citations: [];
      reason: string;
    };

export type SourcePackDocumentInput = {
  document: SourcePackDocument;
  markdown: string;
};

export type EmbedTexts = (input: {
  feature: string;
  texts: string[];
}) => Promise<{ embeddings: number[][] }>;

export async function indexSourcePackDocuments({
  sourcePackVersion,
  documents,
  embedTexts
}: {
  sourcePackVersion: string;
  documents: SourcePackDocumentInput[];
  embedTexts: EmbedTexts;
}): Promise<SourcePackChunk[]> {
  const chunks = documents.flatMap((input) =>
    chunkSourcePackDocument({
      sourcePackVersion,
      document: input.document,
      markdown: input.markdown
    })
  );
  const { embeddings } = await embedTexts({
    feature: "rag_indexing",
    texts: chunks.map((chunk) => chunk.content)
  });

  return chunks.map((chunk, index) => ({
    ...chunk,
    embedding: embeddings[index] ?? []
  }));
}

export async function retrieveRelevantChunks({
  query,
  chunks,
  embedTexts,
  limit = 4,
  minConfidence = 0.25
}: {
  query: string;
  chunks: SourcePackChunk[];
  embedTexts: EmbedTexts;
  limit?: number;
  minConfidence?: number;
}): Promise<RetrievalResult> {
  const { embeddings } = await embedTexts({
    feature: "rag_retrieval",
    texts: [query]
  });
  const queryEmbedding = embeddings[0] ?? [];
  const ranked = chunks
    .map((chunk) => ({
      chunk,
      confidence: scoreChunk(query, queryEmbedding, chunk)
    }))
    .filter((result) => result.confidence >= minConfidence)
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, limit);

  if (ranked.length === 0) {
    return {
      kind: "knowledge_gap",
      query,
      citations: [],
      reason: "No indexed source chunk met the retrieval confidence threshold."
    };
  }

  return {
    kind: "sources_found",
    query,
    citations: ranked.map(({ chunk, confidence }) => ({
      chunkId: chunk.chunkId,
      documentSlug: chunk.documentSlug,
      documentTitle: chunk.documentTitle,
      sourcePackPath: chunk.sourcePackPath,
      sourceUrl: chunk.sourceUrl,
      sourceType: chunk.sourceType,
      jurisdiction: chunk.jurisdiction,
      originalLanguage: chunk.originalLanguage,
      section: chunk.section,
      article: chunk.article,
      excerpt: chunk.content,
      confidence,
      legalReviewRequired: chunk.legalReviewRequired
    }))
  };
}

export function chunkSourcePackDocument({
  sourcePackVersion,
  document,
  markdown
}: {
  sourcePackVersion: string;
  document: SourcePackDocument;
  markdown: string;
}): SourcePackChunk[] {
  return parseMarkdownSections(stripFrontmatter(markdown)).map(
    (section, index) => ({
      chunkId: `${document.slug}:${String(index).padStart(3, "0")}`,
      chunkIndex: index,
      documentSlug: document.slug,
      documentTitle: document.title,
      sourcePackPath: normalizeSourcePackPath(document.path),
      sourceUrl: document.sourceUrl,
      sourceType: document.sourceType,
      jurisdiction: document.jurisdiction,
      originalLanguage: document.language,
      section: section.title,
      article: extractArticle(section.title),
      content: section.content,
      tokenCount: estimateTokenCount(section.content),
      sourcePackVersion,
      legalReviewRequired: document.legalReviewRequired
    })
  );
}

function stripFrontmatter(markdown: string) {
  const trimmed = markdown.trim();

  if (!trimmed.startsWith("---")) {
    return trimmed;
  }

  const end = trimmed.indexOf("\n---", 3);
  return end === -1 ? trimmed : trimmed.slice(end + 4).trim();
}

function parseMarkdownSections(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const sections: Array<{ title: string; contentLines: string[] }> = [];
  let current: { title: string; contentLines: string[] } | undefined;

  for (const line of lines) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*$/);

    if (heading) {
      current = { title: heading[1] ?? "Document", contentLines: [] };
      sections.push(current);
      continue;
    }

    current ??= { title: "Document", contentLines: [] };
    if (!sections.includes(current)) {
      sections.push(current);
    }
    current.contentLines.push(line);
  }

  return sections
    .map((section) => {
      const body = section.contentLines.join("\n").trim();
      return {
        title: section.title,
        content: body ? `# ${section.title}\n\n${body}` : `# ${section.title}`
      };
    })
    .filter((section) => section.content.trim().length > 0);
}

function normalizeSourcePackPath(path: string) {
  return path.startsWith("supabase/seed/source-pack/")
    ? path
    : `supabase/seed/source-pack/${path}`;
}

function extractArticle(section: string) {
  return section.match(/\b(art(?:i|\u00ed)culo|article|art\.)\s+\d+/i)?.[0];
}

function scoreChunk(
  query: string,
  queryEmbedding: number[],
  chunk: SourcePackChunk
) {
  const semanticScore =
    queryEmbedding.length > 0 && chunk.embedding
      ? cosineSimilarity(queryEmbedding, chunk.embedding)
      : 0;
  return roundConfidence(Math.max(semanticScore, lexicalScore(query, chunk.content)));
}

function cosineSimilarity(left: number[], right: number[]) {
  const length = Math.min(left.length, right.length);
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < length; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;
    dot += leftValue * rightValue;
    leftMagnitude += leftValue * leftValue;
    rightMagnitude += rightValue * rightValue;
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return 0;
  }

  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

function lexicalScore(query: string, content: string) {
  const queryTerms = tokenize(query);
  const contentTerms = new Set(tokenize(content));

  if (queryTerms.length === 0) {
    return 0;
  }

  const matches = queryTerms.filter((term) => contentTerms.has(term)).length;
  return matches / queryTerms.length;
}

function tokenize(text: string) {
  return normalizeSearchText(text)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2);
}

function normalizeSearchText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function estimateTokenCount(text: string) {
  return Math.max(1, Math.ceil(text.trim().length / 4));
}

function roundConfidence(value: number) {
  return Math.round(value * 1_000) / 1_000;
}
