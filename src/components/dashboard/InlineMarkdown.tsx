import type { ReactNode } from "react";

const TOKEN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
const BOLD_RE = /^\*\*([^*]+)\*\*$/;
const LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/;

export default function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(TOKEN_RE).filter((p) => p !== "");
  const nodes: ReactNode[] = parts.map((part, i) => {
    const bold = part.match(BOLD_RE);
    if (bold) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {bold[1]}
        </strong>
      );
    }
    const link = part.match(LINK_RE);
    if (link) {
      return (
        <a
          key={i}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline underline-offset-4"
        >
          {link[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
  return <>{nodes}</>;
}
