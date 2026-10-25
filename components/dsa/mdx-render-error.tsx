import Link from "next/link";

interface MdxRenderErrorProps {
  courseTitle: string;
  backHref: string;
  backLabel: string;
}

export function MdxRenderError({ courseTitle, backHref, backLabel }: MdxRenderErrorProps) {
  return (
    <section
      role="alert"
      aria-labelledby="lesson-render-error-title"
      className="not-prose my-6 rounded-xl border border-border bg-card/70 p-5 shadow-sm sm:p-6"
    >
      <h2 id="lesson-render-error-title" className="text-lg font-semibold text-foreground">
        This lesson could not be displayed
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        We could not load this {courseTitle} lesson. Return to the course outline to choose another lesson.
      </p>
      <Link
        href={backHref}
        className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {backLabel}
      </Link>
    </section>
  );
}
