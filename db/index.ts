import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// The D1 binding is optional until `.openai/hosting.json` declares `d1`, so
// the generated Env type does not carry it; narrow it locally.
const bindings = env as unknown as { DB?: D1Database };

export function getDb() {
  if (!bindings.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(bindings.DB, { schema });
}
