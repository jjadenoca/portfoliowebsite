#!/usr/bin/env node
// Sync AI Daily archive markdown from the upstream Python project into
// content/ai-daily/ so the Next.js app can read it on platforms (Vercel etc.)
// where the absolute upstream path doesn't exist.
//
// Run before deploy: `node scripts/sync-ai-daily.mjs`
// Override source via env: AI_BRIEF_ARCHIVE_DIR=/path/to/archive

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const SRC =
  process.env.AI_BRIEF_ARCHIVE_DIR ??
  "/Users/fleap/Documents/AI Research App/archive";
const DEST = path.join(REPO_ROOT, "content", "ai-daily");

const DATE_RE = /^\d{4}-\d{2}-\d{2}\.md$/;

async function main() {
  console.log(`[sync-ai-daily] src: ${SRC}`);
  console.log(`[sync-ai-daily] dst: ${DEST}`);

  let entries;
  try {
    entries = await fs.readdir(SRC);
  } catch (err) {
    console.error(`[sync-ai-daily] cannot read source: ${err.message}`);
    process.exit(1);
  }

  await fs.mkdir(DEST, { recursive: true });

  const briefs = entries.filter((f) => DATE_RE.test(f));
  if (briefs.length === 0) {
    console.warn("[sync-ai-daily] no YYYY-MM-DD.md files found in source");
    process.exit(0);
  }

  let copied = 0;
  let skipped = 0;
  for (const f of briefs) {
    const srcPath = path.join(SRC, f);
    const dstPath = path.join(DEST, f);
    const [srcStat, dstStat] = await Promise.all([
      fs.stat(srcPath),
      fs.stat(dstPath).catch(() => null),
    ]);
    if (dstStat && dstStat.mtimeMs >= srcStat.mtimeMs) {
      skipped += 1;
      continue;
    }
    await fs.copyFile(srcPath, dstPath);
    copied += 1;
  }

  console.log(
    `[sync-ai-daily] done — ${copied} copied, ${skipped} up-to-date, ${briefs.length} total`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
