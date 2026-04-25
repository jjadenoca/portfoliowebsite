import Section from "./Section";
import { profile } from "@/lib/content";

type Post = {
  title: string;
  link: string;
  pubDate: string;
};

async function fetchMediumPosts(username: string): Promise<Post[]> {
  try {
    // rss2json proxies Medium's RSS feed and returns clean JSON.
    // Free tier is rate-limited but fine for a portfolio.
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
      `https://medium.com/feed/@${username}`,
    )}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== "ok" || !Array.isArray(data.items)) return [];
    return data.items.slice(0, 5).map((item: { title: string; link: string; pubDate: string }) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
    }));
  } catch {
    return [];
  }
}

export default async function Writing() {
  const posts = await fetchMediumPosts(profile.mediumUsername);

  return (
    <Section id="writing" eyebrow="Writing" title="Latest from the blog.">
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">
          <p>
            No Medium posts loaded yet. Update{" "}
            <code className="font-mono">profile.mediumUsername</code> in{" "}
            <code className="font-mono">src/lib/content.ts</code> to your handle
            and posts will appear here automatically.
          </p>
          <a
            href={profile.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-foreground hover:text-accent transition-colors"
          >
            Visit my Medium →
          </a>
        </div>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((p) => (
            <li key={p.link}>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 py-5 hover:text-accent transition-colors"
              >
                <span className="font-medium">{p.title}</span>
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground group-hover:text-accent transition-colors shrink-0">
                  {new Date(p.pubDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <a
          href={profile.medium}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm border border-border px-4 py-2 rounded-full hover:border-accent hover:text-accent transition-colors"
        >
          See all posts on Medium ↗
        </a>
      </div>
    </Section>
  );
}
