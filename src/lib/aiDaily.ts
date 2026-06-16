import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

// Resolution order:
// 1. AI_BRIEF_ARCHIVE_DIR env var (explicit override for any environment)
// 2. ./content/ai-daily relative to cwd (committed/synced into the repo — works on Vercel)
// 3. Local Mac dev path (the upstream Python archive — for local iteration without sync)
const PROJECT_ARCHIVE = path.join(process.cwd(), "content", "ai-daily");
const LOCAL_DEV_ARCHIVE = "/Users/fleap/Documents/AI Research App/archive";

async function pickArchiveDir(): Promise<string> {
  if (process.env.AI_BRIEF_ARCHIVE_DIR) return process.env.AI_BRIEF_ARCHIVE_DIR;
  try {
    await fs.access(PROJECT_ARCHIVE);
    return PROJECT_ARCHIVE;
  } catch {
    return LOCAL_DEV_ARCHIVE;
  }
}

export type Link = { text: string; href: string };

export type Story = {
  title: string;
  isHeadliner: boolean;
  lead: string;
  whyItMatters?: string;
  yesBut?: string;
  tryThis?: string;
  goDeeper: Link[];
};

export type Brief = {
  date: string;
  smartBrevity: string;
  bigPicture: string;
  whyItMatters: string;
  catchUpQuick: string[];
  stories: Story[];
  whatsNext: string[];
  bottomLine: string;
  fileMtime: number;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function listArchiveDates(): Promise<string[]> {
  try {
    const dir = await pickArchiveDir();
    const entries = await fs.readdir(dir);
    return entries
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""))
      .filter((d) => DATE_RE.test(d))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export async function loadBrief(date?: string): Promise<Brief | null> {
  const dates = await listArchiveDates();
  if (dates.length === 0) return null;
  const target = date && dates.includes(date) ? date : dates[0];
  const dir = await pickArchiveDir();
  const file = path.join(dir, `${target}.md`);
  const [raw, stat] = await Promise.all([
    fs.readFile(file, "utf8"),
    fs.stat(file),
  ]);
  return parseBrief(raw, target, stat.mtimeMs);
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function parseLinks(text: string): Link[] {
  const out: Link[] = [];
  for (const m of text.matchAll(LINK_RE)) {
    out.push({ text: m[1], href: m[2] });
  }
  return out;
}

function stripLeadingLabel(p: string, label: string): string | null {
  const re = new RegExp(`^\\s*\\*\\*${label}:\\*\\*\\s*`);
  if (!re.test(p)) return null;
  return p.replace(re, "").trim();
}

function getParagraphByLabel(
  paragraphs: string[],
  label: string,
): string | undefined {
  for (const p of paragraphs) {
    const stripped = stripLeadingLabel(p, label);
    if (stripped !== null) return stripped;
  }
  return undefined;
}

function splitParagraphs(block: string): string[] {
  return block
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function parseStory(block: string): Story | null {
  const lines = block.split("\n");
  const titleIdx = lines.findIndex((l) => l.startsWith("## "));
  if (titleIdx === -1) return null;
  const titleLine = lines[titleIdx].replace(/^##\s*/, "").trim();
  const isHeadliner = /^1 big thing:\s*/i.test(titleLine);
  const title = titleLine.replace(/^1 big thing:\s*/i, "");

  const body = lines.slice(titleIdx + 1).join("\n").trim();
  const paragraphs = splitParagraphs(body);

  const whyItMatters = getParagraphByLabel(paragraphs, "Why it matters");
  const yesBut = getParagraphByLabel(paragraphs, "Yes, but");
  const tryThis = getParagraphByLabel(paragraphs, "Try this");
  const goDeeperRaw = getParagraphByLabel(paragraphs, "Go deeper");
  const goDeeper = goDeeperRaw ? parseLinks(goDeeperRaw) : [];

  // Lead = first paragraph that doesn't have a known label prefix
  const labels = ["Why it matters", "Yes, but", "Try this", "Go deeper"];
  const lead =
    paragraphs.find(
      (p) => !labels.some((l) => p.startsWith(`**${l}:**`)),
    ) ?? "";

  return {
    title,
    isHeadliner,
    lead,
    whyItMatters,
    yesBut,
    tryThis,
    goDeeper,
  };
}

function parseIntro(block: string): {
  date: string;
  smartBrevity: string;
  bigPicture: string;
  whyItMatters: string;
  catchUpQuick: string[];
} {
  const dateMatch = block.match(/^#\s+AI Brief\s+—\s+(\S+)/m);
  const date = dateMatch?.[1] ?? "";

  const paragraphs = splitParagraphs(block);

  const smartBrevity =
    getParagraphByLabel(paragraphs, "Smart Brevity count") ?? "";
  const bigPicture = getParagraphByLabel(paragraphs, "The big picture") ?? "";
  const whyItMatters =
    getParagraphByLabel(paragraphs, "Why it matters") ?? "";

  // Catch up quick is a label paragraph followed by bullet block
  const catchUpQuick: string[] = [];
  const catchIdx = paragraphs.findIndex((p) =>
    /^\*\*Catch up quick:\*\*/i.test(p),
  );
  if (catchIdx !== -1) {
    // Bullets may be in the same paragraph (rare) or following ones
    for (let i = catchIdx; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const lines = p.split("\n");
      for (const line of lines) {
        const m = line.match(/^[-*]\s+(.+)$/);
        if (m) catchUpQuick.push(m[1].trim());
      }
    }
  }

  return { date, smartBrevity, bigPicture, whyItMatters, catchUpQuick };
}

function parseClosing(block: string): { whatsNext: string[]; bottomLine: string } {
  const whatsNext: string[] = [];
  let bottomLine = "";
  const paragraphs = splitParagraphs(block);
  for (const p of paragraphs) {
    const lines = p.split("\n");
    for (const line of lines) {
      const m = line.match(/^[-*]\s+(.+)$/);
      if (m) whatsNext.push(m[1].trim());
    }
    const bl = stripLeadingLabel(p, "The bottom line");
    if (bl !== null) bottomLine = bl;
  }
  return { whatsNext, bottomLine };
}

export function parseBrief(raw: string, date: string, mtime: number): Brief {
  // Sections separated by --- on its own line
  const sections = raw
    .split(/\n\s*---\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sections.length < 2) {
    return {
      date,
      smartBrevity: "",
      bigPicture: "",
      whyItMatters: "",
      catchUpQuick: [],
      stories: [],
      whatsNext: [],
      bottomLine: "",
      fileMtime: mtime,
    };
  }

  const intro = parseIntro(sections[0]);

  // Find closing section: the one containing "## What's next"
  let closingIdx = sections.findIndex((s) => /##\s+What's next/i.test(s));
  if (closingIdx === -1) closingIdx = sections.length;

  const storySections = sections.slice(1, closingIdx);
  const stories = storySections
    .map(parseStory)
    .filter((s): s is Story => s !== null);

  const closing =
    closingIdx < sections.length
      ? parseClosing(sections[closingIdx])
      : { whatsNext: [], bottomLine: "" };

  return {
    date: intro.date || date,
    smartBrevity: intro.smartBrevity,
    bigPicture: intro.bigPicture,
    whyItMatters: intro.whyItMatters,
    catchUpQuick: intro.catchUpQuick,
    stories,
    whatsNext: closing.whatsNext,
    bottomLine: closing.bottomLine,
    fileMtime: mtime,
  };
}

export function relativeTime(mtimeMs: number, now: number = Date.now()): string {
  const diffSec = Math.max(0, Math.floor((now - mtimeMs) / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function isStale(mtimeMs: number, now: number = Date.now()): boolean {
  return now - mtimeMs > 30 * 60 * 60 * 1000; // 30 hours
}

export function formatDate(date: string): string {
  // "2026-05-05" -> "May 5, 2026"
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return date;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const [, y, mo, d] = m;
  return `${months[Number(mo) - 1]} ${Number(d)}, ${y}`;
}
