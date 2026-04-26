import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import {
  profile,
  experiences,
  projects,
  activities,
  education,
  awards,
  skills,
} from "@/lib/content";

export const runtime = "nodejs";
export const maxDuration = 30;

// Build a compact resume context once at module load.
function buildResumeContext(): string {
  const lines: string[] = [];
  lines.push(`# ${profile.name} — ${profile.title}`);
  lines.push(`Location: ${profile.location} (${profile.openTo})`);
  lines.push(`Email: ${profile.email} | Phone: ${profile.phone}`);
  lines.push(`LinkedIn: ${profile.linkedin}`);
  lines.push(`GitHub: ${profile.github}`);
  lines.push("");
  lines.push("## Summary");
  lines.push(profile.bio);
  lines.push("");

  lines.push("## Experience");
  for (const e of experiences) {
    lines.push(
      `### ${e.role} — ${e.company} (${e.location}, ${e.start} – ${e.end})`
    );
    lines.push(e.blurb);
    for (const b of e.bullets) lines.push(`- ${b}`);
    if (e.tech?.length) lines.push(`Tech: ${e.tech.join(", ")}`);
    lines.push("");
  }

  lines.push("## Projects");
  for (const p of projects) {
    lines.push(`### ${p.name} — ${p.tagline} (${p.start} – ${p.end})`);
    for (const b of p.bullets) lines.push(`- ${b}`);
    lines.push(`Tech: ${p.tech.join(", ")}`);
    if (p.href) lines.push(`Link: ${p.href}`);
    lines.push("");
  }

  lines.push("## Leadership & Activities");
  for (const a of activities) {
    lines.push(`### ${a.title} — ${a.org} (${a.start} – ${a.end})`);
    for (const b of a.bullets) lines.push(`- ${b}`);
    lines.push("");
  }

  lines.push("## Education");
  lines.push(
    `${education.degree} — ${education.school} (${education.location}), graduated ${education.graduation}.`
  );
  lines.push(education.minors);
  if (education.activities?.length) {
    lines.push("College activities:");
    for (const a of education.activities) {
      lines.push(`- ${a.role} at ${a.org} (${a.start} – ${a.end})`);
    }
  }
  lines.push("");

  lines.push("## Awards");
  for (const a of awards) lines.push(`- ${a}`);
  lines.push("");

  lines.push("## Skills");
  lines.push(`Languages: ${skills.languages.join(", ")}`);
  lines.push(`Python libraries: ${skills.python.join(", ")}`);
  lines.push(`Data tools: ${skills.data.join(", ")}`);
  lines.push(`Other tools: ${skills.tools.join(", ")}`);

  return lines.join("\n");
}

const RESUME_CONTEXT = buildResumeContext();

// Per-IP rate limit (in-memory; resets on serverless cold start).
// Cheap defense against casual abuse. Pair with an Anthropic spend cap
// for a hard ceiling.
type Bucket = { count: number; resetAt: number };
type Entry = { minute: Bucket; day: Bucket };
const RATE_LIMIT = new Map<string, Entry>();
const PER_MINUTE = 10;
const PER_DAY = 50;
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * 60_000;

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; reason: string } {
  const now = Date.now();
  let entry = RATE_LIMIT.get(ip);
  if (!entry) {
    entry = {
      minute: { count: 0, resetAt: now + MINUTE_MS },
      day: { count: 0, resetAt: now + DAY_MS },
    };
    RATE_LIMIT.set(ip, entry);
  }
  if (now > entry.minute.resetAt) {
    entry.minute = { count: 0, resetAt: now + MINUTE_MS };
  }
  if (now > entry.day.resetAt) {
    entry.day = { count: 0, resetAt: now + DAY_MS };
  }
  if (entry.minute.count >= PER_MINUTE) {
    return { ok: false, reason: "Too many messages — give me a moment and try again." };
  }
  if (entry.day.count >= PER_DAY) {
    return { ok: false, reason: "Daily message limit reached. Please come back tomorrow." };
  }
  entry.minute.count++;
  entry.day.count++;
  return { ok: true };
}

// Periodic cleanup of stale entries to keep the map bounded.
function sweepRateLimit(now: number) {
  for (const [ip, entry] of RATE_LIMIT) {
    if (now > entry.day.resetAt) RATE_LIMIT.delete(ip);
  }
}

const SYSTEM_PROMPT = `You are a friendly, concise assistant embedded on Jaden Oca's portfolio website (jadenoca.com). Your job is to answer questions a recruiter, hiring manager, or curious visitor might have about Jaden's background, experience, projects, and skills.

Ground every answer strictly in the context below. If a question can't be answered from what you know, just say you don't have that info and suggest they email Jaden at ${profile.email} — do NOT mention the resume, the context, or where your info comes from. Never invent facts, employers, dates, or numbers.

Style:
- Keep replies short and conversational (2–4 sentences for most questions).
- Use specific numbers and details from the resume when relevant (e.g. "automated 95% of claims review").
- Refer to him as "Jaden".
- If asked something off-topic (jokes, unrelated trivia, coding help), politely redirect to questions about Jaden's background.
- Never repeat the entire resume — answer just what was asked.
- Output PLAIN TEXT only. Do NOT use markdown formatting — no **bold**, no *italics*, no #headings, no - bullet lists, no \`code\` ticks, no [links](). Write in normal sentences. If you need to list things, use a comma-separated sentence or short separate sentences.
- Speak naturally as if you know Jaden personally. Do NOT reference your source — never say "based on his resume", "according to the resume", "from the information provided", "his resume mentions", etc. Just state the facts directly as if it's common knowledge.

Important facts to never get wrong:
- Jaden plays the viola. He is a TMEA All-State Violist. Always say "viola" — never say "violin" or imply he plays the violin. No need to call out the distinction; just use the correct instrument.

# Resume Context
${RESUME_CONTEXT}`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Server not configured (missing API key)." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = (body.messages ?? [])
    .filter(
      (m): m is ChatMessage =>
        m && (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-10); // cap history

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return new Response(JSON.stringify({ error: "No user message." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Trim each message to a sane size to prevent abuse
  for (const m of messages) {
    if (m.content.length > 2000) m.content = m.content.slice(0, 2000);
  }

  // Rate limit before we spend any API tokens.
  const ip = getClientIp(req);
  sweepRateLimit(Date.now());
  const gate = checkRateLimit(ip);
  if (!gate.ok) {
    return new Response(JSON.stringify({ error: gate.reason }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const lastUserMsg = messages[messages.length - 1].content;
  // Log the visitor's question so it shows up in Vercel Runtime Logs.
  // Truncate to keep log lines reasonable.
  console.log(
    `[chat] ip=${ip} q=${JSON.stringify(lastUserMsg.slice(0, 500))}`
  );

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text =
      response.content
        .filter((b) => b.type === "text")
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("\n")
        .trim() || "Sorry, I didn't catch that — try rephrasing?";

    console.log(`[chat] ip=${ip} a=${JSON.stringify(text.slice(0, 500))}`);

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[chat] anthropic error", err);

    // Detect Anthropic spend-limit / billing / quota errors and surface a
    // friendly message instead of a generic 502. The Anthropic SDK throws
    // APIError subclasses with a `status` and an `error.error.type` field.
    const status =
      typeof err === "object" && err !== null && "status" in err
        ? (err as { status?: number }).status
        : undefined;
    const errType =
      typeof err === "object" && err !== null && "error" in err
        ? ((err as { error?: { error?: { type?: string }; type?: string } })
            .error?.error?.type ??
          (err as { error?: { type?: string } }).error?.type)
        : undefined;
    const errMessage =
      err instanceof Error ? err.message.toLowerCase() : "";

    const isBillingLimit =
      errType === "billing_error" ||
      errType === "permission_error" ||
      (status === 400 &&
        (errMessage.includes("credit") ||
          errMessage.includes("billing") ||
          errMessage.includes("spend") ||
          errMessage.includes("quota") ||
          errMessage.includes("limit")));

    if (isBillingLimit) {
      return new Response(
        JSON.stringify({
          error: `Usage limit reached for this month — the chatbot is paused. Please email Jaden directly at ${profile.email} with any questions.`,
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Anthropic-side rate limits (e.g. burst overage) — distinct from billing
    if (status === 429) {
      return new Response(
        JSON.stringify({
          error: "The assistant is a bit busy right now. Please try again in a moment.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Sorry, the assistant is unavailable right now." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
