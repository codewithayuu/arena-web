import matter from 'gray-matter';

// Recognized JSX and HTML elements supported in MDX
const VALID_TAG_PATTERN =
  /^(LessonCard|QuizCard|MultiSelectQuiz|DragDropQuiz|LLDProblemsBlock|Callout|Accordion|Tabs|Tab|Badge|InteractiveAnimation|AuthorCard|CommentsSection|h[1-6]|p|div|span|table|thead|tbody|tr|th|td|ul|ol|li|a|strong|b|em|i|code|pre|br|hr|img|blockquote|details|summary|sub|sup|kbd|mark)(\s|\/|>|$)/i;

export interface FrontmatterData {
  title?: string;
  description?: string;
  readTime?: string;
  lastUpdated?: string;
  [key: string]: unknown;
}

export interface ParsedMdx {
  data: FrontmatterData;
  content: string;
}

/**
 * Robust frontmatter parser that extracts YAML metadata.
 * If gray-matter encounters unescaped characters or formatting issues,
 * it safely falls back to regex-based extraction to prevent runtime exceptions.
 */
export function parseMdxFrontmatter(source: string): ParsedMdx {
  try {
    const parsed = matter(source);
    return {
      data: parsed.data as FrontmatterData,
      content: parsed.content,
    };
  } catch {
    const extractField = (field: string, fallback = '') => {
      const match = source.match(new RegExp(`^${field}:\\s*(?:"([^"]*)"|'([^']*)'|(.*))$`, 'm'));
      if (!match) return fallback;
      return (match[1] || match[2] || match[3] || '').trim();
    };

    const content = source.replace(/^---[\s\S]*?---\s*/, '');
    return {
      data: {
        title: extractField('title'),
        description: extractField('description'),
        readTime: extractField('readTime', '10 min read'),
        lastUpdated: extractField('lastUpdated', 'June 2026'),
      },
      content,
    };
  }
}

/**
 * Sanitizes markdown content so MDX compilation succeeds without syntax errors:
 * 1. Preserves fenced code blocks (``` and ~~~) and inline backticks (`...`).
 * 2. Normalizes `<details>` and `<summary>` tags.
 * 3. Escapes mathematical / relational operators (`<=`, `<-`, `<<`, `<?`, `<100`).
 * 4. Escapes angle brackets in headings and generic types (`<T>`, `<K, V>`).
 * 5. Escapes plain curly braces outside code blocks (`{1, ..., n}`).
 */
export function cleanMdxSource(raw: string): string {
  // Normalize details + summary on same line
  const normalized = raw.replace(/<details>\s*<summary>/gi, '<details>\n<summary>');

  const lines = normalized.split('\n');
  let inCode = false;
  const out: string[] = [];

  for (const line of lines) {
    if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
      inCode = !inCode;
      out.push(line);
      continue;
    }
    if (inCode) {
      out.push(line);
      continue;
    }

    // Split by backtick inline code
    const parts = line.split(/(`[^`\n]*`)/);
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].startsWith('`') && parts[i].endsWith('`') && parts[i].length >= 2) {
        continue;
      }
      let t = parts[i];

      // Fix headings like <h1 ...>Title <T></h1>
      t = t.replace(/(<h[1-6][^>]*>)([\s\S]*?)(<\/h[1-6]>)/gi, (_m, open, inner, close) => {
        const safeInner = inner
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\{/g, '&#123;')
          .replace(/\}/g, '&#125;');
        return `${open}${safeInner}${close}`;
      });

      // Escape autolinks <http...>
      t = t.replace(/<(https?:\/\/[^\s>]+)>/g, '[$1]($1)');

      // Any < that is NOT followed by an allowed tag (or closing allowed tag) -> &lt;
      t = t.replace(/<(\/?[A-Za-z0-9_:\-*, ]*)/g, (match, tagPart) => {
        const cleanName = tagPart.replace(/^\//, '').trim();
        if (VALID_TAG_PATTERN.test(cleanName)) {
          return `<${tagPart}`;
        }
        return `&lt;${tagPart}`;
      });

      // Also any < before non-alphanumeric (like <=, <-, <?, <) -> &lt;
      t = t.replace(/<(?![a-zA-Z/])/g, '&lt;');

      // Replace plain { and } outside code
      t = t.replace(/\{/g, '&#123;');
      t = t.replace(/\}/g, '&#125;');

      parts[i] = t;
    }
    out.push(parts.join(''));
  }
  return out.join('\n');
}
