import Markdown, { type Components, type UrlTransform } from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export type ContestStatementProps = {
  markdown: string;
  resolveAssetUrl?: (assetPath: string) => string | undefined;
};

const statementSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [["className", /^language-./, "math-inline", "math-display"]],
  },
};

const statementUrlTransform: UrlTransform = (url, key) => {
  if (key === "href") {
    return /^#[A-Za-z0-9_.:-]{1,200}$/.test(url) ? url : undefined;
  }
  if (key === "src") {
    return normalizeContestAssetPath(url) ?? undefined;
  }
  return undefined;
};

/** Render untrusted Polygon-derived Markdown without compiling MDX or raw HTML. */
export function ContestStatement({ markdown, resolveAssetUrl }: ContestStatementProps) {
  const components: Components = {
    h1: ({ children }) => <h1 className="mb-4 mt-7 text-2xl font-bold text-white first:mt-0">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-3 mt-6 text-xl font-semibold text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-2 mt-5 text-lg font-semibold text-white">{children}</h3>,
    h4: ({ children }) => <h4 className="mb-2 mt-4 font-semibold text-white">{children}</h4>,
    p: ({ children }) => <p className="my-3 whitespace-pre-wrap leading-7 text-zinc-300">{children}</p>,
    ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-6 text-zinc-300">{children}</ul>,
    ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-6 text-zinc-300">{children}</ol>,
    li: ({ children }) => <li className="pl-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-red-400/60 pl-4 text-zinc-400">{children}</blockquote>
    ),
    pre: ({ children }) => (
      <pre className="my-4 max-w-full overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-sm text-zinc-200">
        {children}
      </pre>
    ),
    code: ({ className, children }) => (
      <code className={className
        ? `${className} font-mono text-[0.92em] text-rose-200`
        : "rounded bg-white/10 px-1 py-0.5 font-mono text-[0.92em] text-rose-200"}>
        {children}
      </code>
    ),
    table: ({ children }) => (
      <div className="my-4 max-w-full overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full border-collapse text-left text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => <th className="border-b border-white/15 bg-white/5 px-3 py-2 font-semibold text-white">{children}</th>,
    td: ({ children }) => <td className="border-b border-white/10 px-3 py-2 align-top text-zinc-300">{children}</td>,
    a: ({ href, children }) => href
      ? <a className="text-red-300 underline decoration-red-300/40 underline-offset-2" href={href}>{children}</a>
      : <span>{children}</span>,
    img: ({ src, alt }) => {
      const assetPath = typeof src === "string" ? normalizeContestAssetPath(src) : null;
      const localUrl = assetPath ? resolveAssetUrl?.(assetPath) : undefined;
      return localUrl
        ? <img className="my-4 h-auto max-w-full rounded-lg" src={localUrl} alt={alt ?? ""} loading="lazy" decoding="async" />
        : <span className="my-3 inline-flex rounded border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400" role="img" aria-label={alt || "Problem image unavailable"}>
          {alt || "Problem image unavailable"}
        </span>;
    },
    input: () => <span aria-label="Task list item" className="mr-2 text-zinc-500">□</span>,
  };

  return (
    <div className="min-w-0 break-words text-sm" aria-label="Problem statement">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeSanitize, statementSanitizeSchema],
          [rehypeKatex, { trust: false, throwOnError: false, maxExpand: 1000, maxSize: 10 }],
        ]}
        skipHtml
        urlTransform={statementUrlTransform}
        components={components}
      >
        {markdown}
      </Markdown>
    </div>
  );
}

/** Only normalized relative paths can be looked up in the launcher's public asset manifest. */
export function normalizeContestAssetPath(value: string): string | null {
  if (!value || value.length > 2048 || /[\\\u0000-\u001f\u007f?#]/.test(value)) return null;
  const polygonAssetPrefix = "../assets/";
  const polygonRelativeAsset = value.startsWith(polygonAssetPrefix);
  const rawPath = polygonRelativeAsset ? value.slice(polygonAssetPrefix.length) : value;
  if (!rawPath) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    return null;
  }
  if (
    decoded.startsWith("/") ||
    decoded.includes("\\") ||
    /[?#]/.test(decoded) ||
    /^[A-Za-z][A-Za-z0-9+.-]*:/.test(decoded)
  ) return null;
  const segments = decoded.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === ".." || segment.includes(":"))) {
    return null;
  }
  const normalized = segments.map(encodeURIComponent).join("/");
  return polygonRelativeAsset ? `assets/${normalized}` : normalized;
}

/** Match a normalized statement reference to exactly one asset declared for its current public problem. */
export function resolveDeclaredContestAssetPath(
  assetReference: string,
  declaredAssets: ReadonlyArray<{ path: string }>,
): string | null {
  if (!assetReference.startsWith("assets/")) return null;
  const relative = assetReference.slice("assets/".length);
  const segments = relative.split("/");
  if (!relative || relative.length > 400 || segments.some((segment) =>
    !segment || segment === "." || segment === ".." || !/^[A-Za-z0-9._-]+$/.test(segment))) return null;
  const suffix = `/assets/${relative}`;
  const matches = declaredAssets.filter((asset) =>
    asset.path.startsWith("problems/") && asset.path.endsWith(suffix));
  return matches.length === 1 ? matches[0].path : null;
}
