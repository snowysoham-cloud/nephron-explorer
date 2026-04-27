import type { ExplorationPhase } from "@/types/nephron";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  explorationPhase?: ExplorationPhase;
  onBackToMap?: () => void;
}

export function Layout({
  children,
  explorationPhase,
  onBackToMap,
}: LayoutProps) {
  const isExploring = explorationPhase === "exploring";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card border-b border-border shadow-subtle sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm">🫘</span>
            </div>
            <span className="font-display font-semibold text-foreground tracking-tight">
              Nephron Explorer
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isExploring && onBackToMap && (
              <button
                type="button"
                onClick={onBackToMap}
                data-ocid="layout.back_to_map_button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-semibold
                  bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20
                  transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7.5 2L3.5 6L7.5 10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Map
              </button>
            )}
            <span className="text-xs text-muted-foreground font-mono hidden sm:block">
              Interactive Kidney Journey
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="bg-muted/40 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
