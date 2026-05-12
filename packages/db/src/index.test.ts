import { describe, expect, it, vi } from "vitest";
import {
  createSupabaseRepository,
  getSupabaseReadConfig,
  getSupabaseWriteConfig
} from "./index";

describe("Supabase runtime configuration", () => {
  it("allows read access with anon credentials", () => {
    expect(
      getSupabaseReadConfig({
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
      })
    ).toMatchObject({
      url: "http://127.0.0.1:54321",
      key: "anon-key"
    });
  });

  it("requires service role credentials for writes", () => {
    expect(
      getSupabaseWriteConfig({
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
      })
    ).toBeUndefined();

    expect(
      getSupabaseWriteConfig({
        SUPABASE_URL: "http://127.0.0.1:54321",
        SUPABASE_SERVICE_ROLE_KEY: "service-key"
      })
    ).toMatchObject({
      url: "http://127.0.0.1:54321",
      key: "service-key"
    });
  });
});

describe("document chunk repository", () => {
  it("returns retrieval-ready chunks with joined source metadata", async () => {
    const fetch = async () =>
      Response.json([
        {
          chunk_index: 1,
          content: "El texto original debe citarse en espanol.",
          token_count: 12,
          embedding: [1, 0, 0],
          metadata: {
            section: "Articulo 4 - Actividades",
            article: "Articulo 4",
            source_type: "regulation",
            source_pack_version: "2026-05-11.mock-v1"
          },
          documents: {
            slug: "argentina-free-zones-law-24331",
            title: "Ley 24.331 - Zonas Francas",
            document_type: "Regulation",
            source_url:
              "https://www.argentina.gob.ar/normativa/nacional/ley-24331-725/texto",
            source_pack_path:
              "supabase/seed/source-pack/regulations/argentina-free-zones-law-24331.md",
            jurisdiction: "Argentina",
            language: "Spanish",
            legal_review_required: true
          }
        }
      ]);
    const repo = createSupabaseRepository({
      url: "http://127.0.0.1:54321",
      key: "anon-key",
      fetch
    });

    await expect(repo.listDocumentChunks()).resolves.toEqual([
      {
        chunkId: "argentina-free-zones-law-24331:001",
        chunkIndex: 1,
        documentSlug: "argentina-free-zones-law-24331",
        documentTitle: "Ley 24.331 - Zonas Francas",
        sourcePackPath:
          "supabase/seed/source-pack/regulations/argentina-free-zones-law-24331.md",
        sourceUrl:
          "https://www.argentina.gob.ar/normativa/nacional/ley-24331-725/texto",
        sourceType: "regulation",
        jurisdiction: "Argentina",
        originalLanguage: "es",
        section: "Articulo 4 - Actividades",
        article: "Articulo 4",
        content: "El texto original debe citarse en espanol.",
        tokenCount: 12,
        sourcePackVersion: "2026-05-11.mock-v1",
        legalReviewRequired: true,
        embedding: [1, 0, 0]
      }
    ]);
  });

  it("upserts indexed chunks by document slug with persisted embeddings", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json([{ id: 42 }]))
      .mockResolvedValueOnce(new Response(null, { status: 201 }));
    const repo = createSupabaseRepository({
      url: "http://127.0.0.1:54321",
      key: "service-key",
      fetch
    });

    await repo.upsertDocumentChunks("anden-value-proposition", [
      {
        chunkIndex: 0,
        content: "Anden OS gives founders operational leverage.",
        tokenCount: 10,
        embedding: [0.1, 0.2, 0.3],
        metadata: {
          section: "Core Message",
          source_type: "internal_memo",
          source_pack_version: "2026-05-11.mock-v1"
        }
      }
    ]);

    const upsertBody = JSON.parse(String(fetch.mock.calls[1]?.[1]?.body));
    expect(upsertBody).toEqual([
      {
        document_id: 42,
        chunk_index: 0,
        content: "Anden OS gives founders operational leverage.",
        token_count: 10,
        embedding: "[0.1,0.2,0.3]",
        metadata: {
          section: "Core Message",
          source_type: "internal_memo",
          source_pack_version: "2026-05-11.mock-v1"
        }
      }
    ]);
  });
});

describe("assistant conversation repository", () => {
  it("lists assistant messages for a persisted thread", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json([{ id: 7 }]))
      .mockResolvedValueOnce(
        Response.json([
          {
            role: "user",
            content: "What is Anden's value proposition?",
            citations: null,
            confidence: null,
            created_at: "2026-05-11T00:00:00.000Z"
          },
          {
            role: "assistant",
            content: "Anden OS is an internal AI backoffice.",
            citations: [{ documentTitle: "Anden Value Proposition" }],
            confidence: "92.00",
            created_at: "2026-05-11T00:00:01.000Z"
          }
        ])
      );
    const repo = createSupabaseRepository({
      url: "http://127.0.0.1:54321",
      key: "service-key",
      fetch
    });

    await expect(repo.listAssistantMessages("default")).resolves.toEqual([
      {
        role: "user",
        content: "What is Anden's value proposition?",
        citations: [],
        confidence: undefined,
        createdAt: "2026-05-11T00:00:00.000Z"
      },
      {
        role: "assistant",
        content: "Anden OS is an internal AI backoffice.",
        citations: [{ documentTitle: "Anden Value Proposition" }],
        confidence: 92,
        createdAt: "2026-05-11T00:00:01.000Z"
      }
    ]);
  });

  it("persists an assistant exchange into a thread and two messages", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json([]))
      .mockResolvedValueOnce(new Response(null, { status: 201 }))
      .mockResolvedValueOnce(Response.json([{ id: 7 }]))
      .mockResolvedValueOnce(new Response(null, { status: 201 }));
    const repo = createSupabaseRepository({
      url: "http://127.0.0.1:54321",
      key: "service-key",
      fetch
    });

    await repo.recordAssistantExchange({
      threadSlug: "default",
      title: "Assistant demo thread",
      locale: "en",
      userContent: "What is Anden's value proposition?",
      assistantContent: "Anden OS is an internal AI backoffice.",
      citations: [{ documentTitle: "Anden Value Proposition" }],
      confidence: 92
    });

    const messageBody = JSON.parse(String(fetch.mock.calls[3]?.[1]?.body));
    expect(messageBody).toEqual([
      {
        thread_id: 7,
        role: "user",
        content: "What is Anden's value proposition?",
        citations: [],
        confidence: null
      },
      {
        thread_id: 7,
        role: "assistant",
        content: "Anden OS is an internal AI backoffice.",
        citations: [{ documentTitle: "Anden Value Proposition" }],
        confidence: 92
      }
    ]);
  });
});
