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

const SYSTEM_PROMPT = `You are a friendly, concise assistant embedded on Jaden Oca's portfolio website (jadenoca.com). Your job is to answer questions a recruiter, hiring manager, or curious visitor might have about Jaden's background, experience, projects, and skills.

Ground every answer strictly in the resume context below. If a question can't be answered from the context, say so honestly and suggest they email Jaden at ${profile.email}. Never invent facts, employers, dates, or numbers.

Style:
- Keep replies short and conversational (2–4 sentences for most questions).
- Use specific numbers and details from the resume when relevant (e.g. "automated 95% of claims review").
- Refer to him as "Jaden".
- If asked something off-topic (jokes, unrelated trivia, coding help), politely redirect to questions about Jaden's background.
- Never repeat the entire resume — answer just what was asked.

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

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[chat] anthropic error", err);
    return new Response(
      JSON.stringify({ error: "Sorry, the assistant is unavailable right now." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
