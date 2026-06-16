const lines = [
  { delay: 0, prefix: "[ OK ]", body: "init keyring · GPG verified" },
  { delay: 60, prefix: "[ OK ]", body: "mounting /home/jaden — 2y 4mo of work" },
  { delay: 120, prefix: "[ OK ]", body: "loading ml-pipelines.kmod" },
  { delay: 180, prefix: "[ OK ]", body: "loading ai-tools.kmod" },
  { delay: 240, prefix: "[LIVE]", body: "ai-daily: last sync 8h ago · 4 stories" },
  { delay: 300, prefix: "[ OK ]", body: "starting bash · clean tty" },
];

export default function BootSequence() {
  return (
    <div className="px-4 sm:px-8 pt-8 pb-2 font-mono text-xs sm:text-sm leading-[1.85] text-muted-foreground">
      {lines.map((l, i) => (
        <div
          key={i}
          className="boot-line"
          style={{ animationDelay: `${l.delay}ms` }}
        >
          <span
            className={
              l.prefix === "[LIVE]" ? "text-accent" : "text-signal"
            }
          >
            {l.prefix}
          </span>
          <span> {l.body}</span>
        </div>
      ))}
      <div
        className="boot-line mt-4 cmd-prompt"
        style={{ animationDelay: "420ms" }}
      >
        <span className="user">jaden</span>
        <span className="at">@portfolio</span>
        <span className="at">:</span>
        <span className="path">~</span>
        <span className="sigil">$ </span>
        <span className="text">whoami</span>
      </div>
    </div>
  );
}
