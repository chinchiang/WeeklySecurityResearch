import { createHash } from "node:crypto";

// Internal WORK tracking IDs, private Drive/Docs links and private names must never
// reach public data. Names are kept as SHA-256 of the exact word so this public repo
// does not itself publish them; add a name with:
//   node -e 'console.log(require("crypto").createHash("sha256").update("Name").digest("hex"))'
const PATTERNS = [/WORK-\d+/, /(?:docs|drive)\.google\.com\//];
const NAME_HASHES = new Set(["349b3190be299fcce50a5d411d5d4155e9885d1dc76cda6858ac60bf965d6f30"]);

/** Returns a description of the first private identifier in text, or null. */
export function findPrivate(text) {
  for (const pattern of PATTERNS) if (pattern.test(text)) return String(pattern);
  for (const [word] of text.matchAll(/[A-Za-z]+/g)) {
    if (NAME_HASHES.has(createHash("sha256").update(word).digest("hex"))) return "private name";
  }
  return null;
}
