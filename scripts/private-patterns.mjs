import { createHash } from "node:crypto";

// Internal WORK tracking IDs, private Google Workspace links and private names must
// never reach public data. Names are kept as SHA-256 so this public repo does not
// itself publish them. Latin names are compared case-insensitively; add one with:
//   node -e 'console.log(require("crypto").createHash("sha256").update("name".toLowerCase()).digest("hex"))'
// Chinese text has no word boundaries, so CJK names (2–4 characters) go in their own
// set and are matched against every 2–4 character run; hash the exact characters.
const PATTERNS = [
  /WORK-\d+/i,
  /(?:docs|drive|drive\.usercontent|sites|script|mail|calendar|meet|photos)\.google\.com\//i,
  /forms\.gle\//i,
];
const NAME_HASHES = new Set(["91ed2ef15eee7102873d33d852cae9a195eff25e758269de6457723b1d8dc29a"]);
const CJK_NAME_HASHES = new Set([]);

const sha256 = (text) => createHash("sha256").update(text).digest("hex");

/** Returns a description of the first private identifier in text, or null. Tests may pass their own hash sets. */
export function findPrivate(text, { nameHashes = NAME_HASHES, cjkNameHashes = CJK_NAME_HASHES } = {}) {
  for (const pattern of PATTERNS) if (pattern.test(text)) return String(pattern);
  for (const [word] of text.matchAll(/[A-Za-z]+/g)) {
    if (nameHashes.has(sha256(word.toLowerCase()))) return "private name";
  }
  if (cjkNameHashes.size > 0) {
    for (const [run] of text.matchAll(/\p{Script=Han}{2,}/gu)) {
      const chars = [...run];
      for (let start = 0; start < chars.length; start++) {
        for (let length = 2; length <= 4 && start + length <= chars.length; length++) {
          if (cjkNameHashes.has(sha256(chars.slice(start, start + length).join("")))) return "private name";
        }
      }
    }
  }
  return null;
}
