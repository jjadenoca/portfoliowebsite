import "server-only";
import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Short git SHA. Tries `git` first (works locally + most CI), then falls back
 * to Vercel's commit env var, then to a placeholder. Computed once at module
 * load so static prerenders bake the value at build time.
 */
function resolveGitSha(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "dev";
  }
}

export const gitSha = resolveGitSha();

/**
 * Format the difference between a start date and now as "Ny Nmo".
 * Used for the status-bar uptime line — counts career duration since
 * the earliest experience.
 */
export function formatUptime(
  startISO: string,
  now: Date = new Date(),
): string {
  const start = new Date(startISO);
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) years = 0;
  return `${years}y ${months}mo`;
}

/**
 * Count YYYY-MM-DD.md files in the AI Daily archive (project-local first,
 * upstream fallback). Mirrors the resolution logic in lib/aiDaily.ts.
 */
const PROJECT_ARCHIVE = path.join(process.cwd(), "content", "ai-daily");
const LOCAL_DEV_ARCHIVE = "/Users/fleap/Documents/AI Research App/archive";
const DATE_RE = /^\d{4}-\d{2}-\d{2}\.md$/;

async function pickArchiveDir(): Promise<string> {
  if (process.env.AI_BRIEF_ARCHIVE_DIR) return process.env.AI_BRIEF_ARCHIVE_DIR;
  try {
    await fs.access(PROJECT_ARCHIVE);
    return PROJECT_ARCHIVE;
  } catch {
    return LOCAL_DEV_ARCHIVE;
  }
}

export async function briefsCount(): Promise<number> {
  try {
    const dir = await pickArchiveDir();
    const entries = await fs.readdir(dir);
    return entries.filter((f) => DATE_RE.test(f)).length;
  } catch {
    return 0;
  }
}
