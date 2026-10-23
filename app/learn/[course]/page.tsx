import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

interface PageProps {
  params: Promise<{
    course: string;
  }>;
}

export default async function CourseIndexPage({ params }: PageProps) {
  const { course } = await params;

  const possibleDirs = [
    path.join(process.cwd(), 'content', course),
    path.join(process.cwd(), 'apps', 'web', 'content', course),
  ];
  let courseDir = possibleDirs[0];
  for (const d of possibleDirs) {
    if (fs.existsSync(d)) {
      courseDir = d;
      break;
    }
  }

  for (const preferred of ['course-introduction.mdx', 'introduction.mdx', 'course-roadmap.mdx']) {
    if (fs.existsSync(path.join(courseDir, preferred))) {
      redirect(`/learn/${course}/${preferred.replace(/\.mdx$/, '')}`);
    }
  }

  if (fs.existsSync(courseDir)) {
    const files = fs.readdirSync(courseDir).filter((f) => f.endsWith('.mdx')).sort();
    if (files.length > 0) {
      const firstSlug = files[0].replace(/\.mdx$/, '');
      redirect(`/learn/${course}/${firstSlug}`);
    }
  }

  redirect('/learn/dsa');
}
