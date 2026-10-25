import React from "react";
import remarkGfm from "remark-gfm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import {
  getLessonBySlug,
  getAllLessons,
  DsaLesson,
} from "@/lib/dsa-curriculum";
import { GenericLessonContent } from "@/components/dsa/generic-lesson-content";
import { DsaBottomBar } from "@/components/dsa/dsa-bottom-bar";
import { LessonHeader } from "@/components/dsa/lesson-header";
import { dsaMdxComponents } from "@/components/dsa/mdx-components";
import { compileMDX } from "next-mdx-remote/rsc";
import { parseMdxFrontmatter, cleanMdxSource } from "@/lib/mdx-sanitizer";
import { MdxRenderError } from "@/components/dsa/mdx-render-error";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ book?: string | string[] }>;
}

// Registry of known MDX content modules for bundling & type-safety
const MDX_MODULES: Record<
  string,
  () => Promise<{
    default: React.ComponentType<{ components?: typeof dsaMdxComponents }>;
  }>
> = {
  "course-introduction": () => import("@/content/dsa/course-introduction.mdx"),
  "big-o-introduction": () => import("@/content/dsa/big-o-introduction.mdx"),
  "course-roadmap": () => import("@/content/dsa/course-roadmap.mdx"),
  "join-community": () => import("@/content/dsa/join-community.mdx"),
  "how-coding-interviews-work": () =>
    import("@/content/dsa/how-coding-interviews-work.mdx"),
  "how-to-handle-unseen-problems": () =>
    import("@/content/dsa/how-to-handle-unseen-problems.mdx"),
  "java-crash-course": () => import("@/content/dsa/java-crash-course.mdx"),
  "python-crash-course": () => import("@/content/dsa/python-crash-course.mdx"),
  "cpp-crash-course": () => import("@/content/dsa/cpp-crash-course.mdx"),
  "csharp-crash-course": () => import("@/content/dsa/csharp-crash-course.mdx"),
  "go-crash-course": () => import("@/content/dsa/go-crash-course.mdx"),
  "javascript-crash-course": () =>
    import("@/content/dsa/javascript-crash-course.mdx"),
};

function getContentDir(): string {
  const possible = [
    path.join(process.cwd(), "content", "dsa"),
    path.join(process.cwd(), "apps", "web", "content", "dsa"),
  ];
  for (const p of possible) {
    if (fs.existsSync(p)) return p;
  }
  return path.join(process.cwd(), "apps", "web", "content", "dsa");
}

// Normalized slug mapping for aliases
function resolveSlug(slug: string): string {
  if (slug === "join-the-community") {
    return "join-community";
  }
  return slug;
}

function getMdxPath(slug: string): string | null {
  const normalized = resolveSlug(slug);
  const targetPath = path.join(getContentDir(), `${normalized}.mdx`);
  if (fs.existsSync(targetPath)) {
    return targetPath;
  }
  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mdxPath = getMdxPath(slug);

  if (mdxPath) {
    try {
      const fileContent = fs.readFileSync(mdxPath, "utf8");
      const { data } = parseMdxFrontmatter(fileContent);
      return {
        title: `${data.title || "Data Structures and Algorithms"} | Mindflare`,
        description:
          data.description ||
          "Master Data Structures and Algorithms with interactive lessons on Mindflare.",
      };
    } catch {
      // Fallback below
    }
  }

  const found = getLessonBySlug(slug);
  if (found) {
    return {
      title: `${found.lesson.title} - ${found.moduleTitle} | Mindflare`,
      description: `Learn ${found.lesson.title} with step-by-step algorithms and practice problems on Mindflare.`,
    };
  }

  return {
    title: "Data Structures and Algorithms | Mindflare",
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const lessons = getAllLessons();
  return lessons.slice(0, 30).map((l: DsaLesson) => ({
    slug: l.slug,
  }));
}

export default async function DsaLessonPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const bookMode = query.book === "1" || query.book === "" || (Array.isArray(query.book) && query.book.includes("1"));
  const resolved = resolveSlug(slug);
  const mdxLoader = MDX_MODULES[resolved];
  const mdxPath = getMdxPath(slug);

  if (mdxPath) {
    const rawSource = fs.readFileSync(mdxPath, "utf8");
    const { data: frontmatter, content } = parseMdxFrontmatter(rawSource);
    const sanitized = cleanMdxSource(content);

    let ContentComponent: React.ReactNode = null;
    let loaded = false;

    if (mdxLoader) {
      try {
        const { default: MDXContent } = await mdxLoader();
        ContentComponent = <MDXContent components={dsaMdxComponents} />;
        loaded = true;
      } catch (err) {
        console.error("mdxLoader failed:", err);
      }
    } else {
      try {
        const mdxMod = await import(`@/content/dsa/${resolved}.mdx`);
        if (mdxMod?.default) {
          const MDXContent = mdxMod.default;
          ContentComponent = <MDXContent components={dsaMdxComponents} />;
          loaded = true;
        }
      } catch (dynamicImportErr) {
        // Will fallback to compileMDX or markdown parser
      }
    }

    if (!loaded) {
      try {
        const { content: compiledContent } = await compileMDX({
          source: sanitized,
          components: dsaMdxComponents,
          options: {
            parseFrontmatter: false,
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          },
        });
        ContentComponent = compiledContent;
        loaded = true;
      } catch (compileErr) {
        console.warn(`[compileMDX fallback failed for ${resolved}]:`, compileErr);
      }
    }

    if (!loaded) {
      ContentComponent = (
        <MdxRenderError
          courseTitle="DSA"
          backHref="/learn/dsa"
          backLabel="Back to DSA lessons"
        />
      );
    }

    return (
      <>
        <article className={`w-full mx-auto ${bookMode ? "max-w-4xl rounded-2xl border border-zinc-800 bg-[#070709] px-5 py-8 shadow-2xl sm:px-10" : ""}`}>
          <LessonHeader
            title={frontmatter.title || resolved.replace(/-/g, " ")}
            readTime={frontmatter.readTime}
            lastUpdated={frontmatter.lastUpdated}
          />
          {ContentComponent}
        </article>
        <DsaBottomBar currentSlug={resolved} bookMode={bookMode} />
      </>
    );
  }

  const found = getLessonBySlug(slug);
  if (!found) {
    notFound();
  }

  return (
    <>
      <GenericLessonContent
        lesson={found.lesson}
        moduleTitle={found.moduleTitle}
        bookMode={bookMode}
      />
      <DsaBottomBar currentSlug={slug} bookMode={bookMode} />
    </>
  );
}
