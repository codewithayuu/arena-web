import type { MDXComponents } from 'mdx/types';
import { dsaMdxComponents } from '@/components/dsa/mdx-components';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...dsaMdxComponents,
    ...components,
  };
}
