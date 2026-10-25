import React from 'react';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { LessonHeader } from '@/components/dsa/lesson-header';
import { dsaMdxComponents } from '@/components/dsa/mdx-components';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getCourseTitle } from '@/lib/curriculum-data';
import { parseMdxFrontmatter, cleanMdxSource } from '@/lib/mdx-sanitizer';
import { MdxRenderError } from '@/components/dsa/mdx-render-error';

interface PageProps {
  params: Promise<{
    course: string;
    slug: string;
  }>;
}

function getContentDir(course: string): string {
  const possible = [
    path.join(process.cwd(), 'content', course),
    path.join(process.cwd(), 'apps', 'web', 'content', course),
  ];
  for (const p of possible) {
    if (fs.existsSync(p)) return p;
  }
  return path.join(process.cwd(), 'apps', 'web', 'content', course);
}

function getMdxPath(course: string, slug: string): string | null {
  const targetPath = path.join(getContentDir(course), `${slug}.mdx`);
  if (fs.existsSync(targetPath)) {
    return targetPath;
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { course, slug } = await params;
  const mdxPath = getMdxPath(course, slug);
  const courseTitle = getCourseTitle(course);

  if (mdxPath) {
    try {
      const fileContent = fs.readFileSync(mdxPath, 'utf8');
      const { data } = parseMdxFrontmatter(fileContent);
      return {
        title: `${data.title || slug.replace(/-/g, ' ')} | ${courseTitle} - Mindflare Arena`,
        description: data.description || `Master ${courseTitle} with comprehensive lessons.`,
      };
    } catch {
      // Fallback
    }
  }

  return {
    title: `${slug.replace(/-/g, ' ')} | ${courseTitle} - Mindflare Arena`,
  };
}

export default async function GenericCourseLessonPage({ params }: PageProps) {
  const { course, slug } = await params;
  const mdxPath = getMdxPath(course, slug);

  if (!mdxPath) {
    notFound();
  }

  const rawSource = fs.readFileSync(mdxPath, 'utf8');
  const { data: frontmatter, content } = parseMdxFrontmatter(rawSource);
  const sanitized = cleanMdxSource(content);

  let ContentComponent: React.ReactNode = null;
  let loaded = false;

  try {
    const mdxMod = await import(`@/content/${course}/${slug}.mdx`);
    if (mdxMod?.default) {
      const MDXContent = mdxMod.default;
      ContentComponent = <MDXContent components={dsaMdxComponents} />;
      loaded = true;
    }
  } catch (dynamicErr) {
    // Fallback below
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
    } catch (err) {
      console.warn(`[compileMDX failed for ${course}/${slug}]:`, err);
    }
  }

  if (!loaded) {
    ContentComponent = (
      <MdxRenderError
        courseTitle={courseTitle}
        backHref={`/learn/${course}`}
        backLabel={`Back to ${courseTitle} lessons`}
      />
    );
  }

  return (
    <article className="w-full mx-auto px-2 sm:px-4 lg:px-0">
      <LessonHeader
        title={frontmatter.title || slug.replace(/-/g, ' ')}
        readTime={frontmatter.readTime}
        lastUpdated={frontmatter.lastUpdated}
      />
      {ContentComponent}
    </article>
  );
}
