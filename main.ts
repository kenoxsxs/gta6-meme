// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: an agent-made GTA 6 meme, posted on X
// from a public account with make.fun (a link or written out) and/or a tag
// of @makefunai and the account's play code in its text. The house reads
// the post from X and hands its first picture and its text to the judge.
//
// This program's job is to hand in the entry's files deterministically:
// it copies the bundled meme image (meme.png) and POST.json (the post's
// address, added once the post exists) from the repository root to
// /output, then verifies each copy byte for byte against its source.
// Two runs on the same repository write identical bytes.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Files this entry hands in, in order. POST.json is listed first because
// the gate reads /output/POST.json; it is optional here only because the
// post does not exist yet when the meme is first built — once the post is
// up, POST.json is added to the repository and copied like the rest.
const HAND_IN = ["POST.json", "meme.png"];

// PNG files start with a fixed 8-byte signature. Checking it catches a
// truncated or misnamed file before it is handed in as the meme.
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

// A valid post address is https://x.com/<handle>/status/<digits>, with an
// optional query string (X share links often carry one). The judge fetches
// exactly this shape; anything else would be refused.
const POST_URL = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+(\?.*)?$/;

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

// Validate a file before it is copied. A bad file is rejected here with a
// clear error instead of being handed in and refused by the judge.
function validate(name: string, src: string): void {
  if (name === "meme.png") {
    const head = readFileSync(src).subarray(0, 8);
    if (!head.equals(PNG_SIGNATURE)) {
      fail(`invalid meme.png: missing PNG signature (not a PNG file)`);
    }
  }
  if (name === "POST.json") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(src, "utf8"));
    } catch {
      fail(`invalid POST.json: not valid JSON`);
    }
    const url = (parsed as { url?: unknown } | null)?.url;
    if (typeof url !== "string" || !POST_URL.test(url)) {
      fail(
        `invalid POST.json: "url" must be https://x.com/<handle>/status/<digits>`,
      );
    }
  }
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

mkdirSync(OUTPUT_DIR, { recursive: true });

let copied = 0;
for (const name of HAND_IN) {
  const src = join(BOT_DIR, name);
  const dst = join(OUTPUT_DIR, name);
  if (!existsSync(src)) {
    console.log(`note: ${name} not in the repository yet, skipping`);
    continue;
  }
  validate(name, src);
  copyFileSync(src, dst);
  const srcHash = sha256(src);
  const dstHash = sha256(dst);
  if (srcHash !== dstHash) {
    console.error(`mismatch: ${dst} does not match ${src}`);
    process.exit(1);
  }
  console.log(`copied ${name} (${srcHash.slice(0, 12)})`);
  copied += 1;
}

if (copied === 0) {
  console.error("nothing to hand in: neither POST.json nor meme.png found");
  process.exit(1);
}
console.log(`handed in ${copied} file(s) to ${OUTPUT_DIR}`);
