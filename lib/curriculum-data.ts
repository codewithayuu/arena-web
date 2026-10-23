import { DSA_CURRICULUM } from './dsa-curriculum';
import systemDesignData from './curriculums/system-design.json';
import systemDesignInterviewsData from './curriculums/system-design-interviews.json';
import javaData from './curriculums/java.json';
import pythonData from './curriculums/python.json';
import lldData from './curriculums/lld.json';

export interface CourseLesson {
  title: string;
  slug: string;
  href: string;
  isFree?: boolean;
  subsection?: string;
  isLabel?: boolean;
  iconType?: 'code' | 'file' | 'video' | 'custom';
  difficulty?: 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced';
}

export interface CourseModule {
  title: string;
  progress: string;
  total: number;
  items: CourseLesson[];
}

export const ALL_COURSES = [
  'dsa',
  'system-design',
  'system-design-interviews',
  'java',
  'python',
  'lld',
] as const;

export type CourseId = (typeof ALL_COURSES)[number];

export function getCourseTitle(course: string): string {
  switch (course) {
    case 'dsa':
      return 'Data Structures & Algorithms';
    case 'system-design':
      return 'System Design Fundamentals';
    case 'system-design-interviews':
      return 'System Design Interviews';
    case 'java':
      return 'Java Programming';
    case 'python':
      return 'Python Programming';
    case 'lld':
      return 'Low-Level Design (LLD)';
    default:
      return course
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
  }
}

export function getCourseCurriculum(course: string): CourseModule[] {
  switch (course) {
    case 'dsa':
      return DSA_CURRICULUM as CourseModule[];
    case 'system-design':
      return systemDesignData as unknown as CourseModule[];
    case 'system-design-interviews':
      return systemDesignInterviewsData as unknown as CourseModule[];
    case 'java':
      return javaData as unknown as CourseModule[];
    case 'python':
      return pythonData as unknown as CourseModule[];
    case 'lld':
      return lldData as unknown as CourseModule[];
    default:
      return [];
  }
}

export function getAllCourseSlugs(course: string): string[] {
  const curriculum = getCourseCurriculum(course);
  const slugs: string[] = [];
  for (const mod of curriculum) {
    for (const item of mod.items) {
      if (item.slug && !item.isLabel) {
        slugs.push(item.slug);
      }
    }
  }
  return slugs;
}
