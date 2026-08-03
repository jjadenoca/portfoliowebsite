import { creator } from "@/lib/content";
import SocialLinks from "@/components/site/SocialLinks";

// Slim footer — the big CTA lives in the bento grid's CTA tile now.
export default function CtaFooter() {
  return (
    <footer className="py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted font-sans lowercase" style={{ fontSize: "0.8125rem" }}>
          &copy; 2026 {creator.name} &middot; {creator.handle}
        </p>
        <SocialLinks variant="navy" />
      </div>
    </footer>
  );
}
