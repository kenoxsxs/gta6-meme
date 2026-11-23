// Round-2 entry for make.fun's "Post a GTA 6 meme on X" bounty.
//
// The meme itself (meme.png) and the link to the live X post (POST.json)
// are the entry. This program's only job is to hand them over: copy both
// files into the grader's output directory and prove, byte for byte, that
// the copies are identical to the files in this repository.
//
// Node 22, standard library only. No network, no dependencies.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";

// The directory this script lives in is the repository root: the files we
// ship sit next to it. process.argv[1] is the script path as invoked.
const scriptDir = dirname(resolve(process.argv[1]));

// The grader hands us a writable output directory through
// MAKEFUN_OUTPUT_DIR. When it is not set (a local run), fall back to an
// "output" folder next to the script.
const outputDir =
  process.env.MAKEFUN_OUTPUT_DIR && process.env.MAKEFUN_OUTPUT_DIR.trim() !== ""
    ? process.env.MAKEFUN_OUTPUT_DIR
    : join(scriptDir, "output");

// The two files that make up the entry.
const FILES = ["meme.png", "POST.json"];

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

// The entry link is what the house actually grades: POST.json must name a
// real public X post. A malformed link is caught here, with the file named,
// instead of failing silently at intake.
function validatePostLink(postJsonPath) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(postJsonPath, "utf8"));
  } catch (err) {
    console.error(`ERROR: POST.json is not valid JSON: ${err.message}.`);
    process.exit(1);
  }
  const url = parsed && typeof parsed.url === "string" ? parsed.url : "";
  if (!/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+/.test(url)) {
    console.error(
      `ERROR: POST.json does not name an X post URL (got ${JSON.stringify(url)}).`,
    );
    process.exit(1);
  }
  console.log(`OK: POST.json names the X post ${url}.`);
}

function main() {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const name of FILES) {
    const source = join(scriptDir, name);
    const dest = join(outputDir, name);

    if (!existsSync(source)) {
      console.error(`ERROR: ${name} is missing from the repository (${source}).`);
      process.exit(1);
    }

    copyFileSync(source, dest);

    const sourceHash = sha256(source);
    const destHash = sha256(dest);
    if (sourceHash !== destHash) {
      console.error(
        `ERROR: ${name} failed to verify: copy sha256 ${destHash} does not match source sha256 ${sourceHash}.`,
      );
      process.exit(1);
    }

    console.log(`OK: ${name} copied to ${dest} (sha256 ${destHash}).`);
  }

  validatePostLink(join(outputDir, "POST.json"));

  console.log("OK: meme.png and POST.json both verified.");
}

main();
