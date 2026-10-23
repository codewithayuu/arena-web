import type { ReactNode } from "react";

type DeferredHomeRenderSection =
  | "built-different"
  | "roadmap"
  | "interactive-animation"
  | "topic-list"
  | "browser-code"
  | "find-track-quiz";

export function DeferredHomeRender({
  section,
  children,
}: {
  section: DeferredHomeRenderSection;
  children: ReactNode;
}) {
  return (
    <div className={`home-deferred-render home-deferred-render--${section}`}>
      {children}
    </div>
  );
}
