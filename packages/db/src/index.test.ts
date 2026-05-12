import { describe, expect, it } from "vitest";
import { getSupabaseReadConfig, getSupabaseWriteConfig } from "./index";

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
