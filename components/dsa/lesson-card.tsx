'use client';

import React from 'react';
import { DsaCodeBlock, CodeSnippet } from './dsa-code-block';

interface LessonCardProps {
  children: React.ReactNode;
  className?: string;
}

function extractSnippet(child: React.ReactNode): CodeSnippet | null {
  if (!React.isValidElement(child)) return null;

  const props = child.props as any;
  if (!props) return null;

  // If directly rendered DsaCodeBlock
  if (typeof props.code === 'string' && typeof props.language === 'string') {
    return { language: props.language, code: props.code, fileName: props.fileName };
  }

  // If pre element containing a code child
  const codeChild = props.children;
  if (React.isValidElement(codeChild)) {
    const codeProps = codeChild.props as any;
    if (codeProps && typeof codeProps.className === 'string') {
      const match = /language-([a-zA-Z0-9+#_.-]+)/.exec(codeProps.className);
      if (match) {
        const lang = match[1];
        const rawCode =
          typeof codeProps.children === 'string'
            ? codeProps.children
            : Array.isArray(codeProps.children)
            ? codeProps.children.join('')
            : '';
        return { language: lang, code: rawCode };
      }
    }
  }

  return null;
}

export function groupConsecutiveCodeBlocks(children: React.ReactNode): React.ReactNode {
  const childArray = React.Children.toArray(children);
  const result: React.ReactNode[] = [];
  let currentGroup: CodeSnippet[] = [];
  let groupKey = 0;

  const flushGroup = () => {
    if (currentGroup.length === 0) return;
    if (currentGroup.length === 1) {
      result.push(
        <DsaCodeBlock
          key={`code-single-${groupKey++}`}
          code={currentGroup[0].code}
          language={currentGroup[0].language}
          fileName={currentGroup[0].fileName}
        />
      );
    } else {
      result.push(
        <DsaCodeBlock
          key={`code-group-${groupKey++}`}
          snippets={[...currentGroup]}
        />
      );
    }
    currentGroup = [];
  };

  for (let i = 0; i < childArray.length; i++) {
    const item = childArray[i];

    // If whitespace string between elements, skip if we are building a group
    if (typeof item === 'string' && item.trim() === '') {
      continue;
    }

    const snippet = extractSnippet(item);
    if (snippet) {
      currentGroup.push(snippet);
    } else {
      flushGroup();
      result.push(item);
    }
  }

  flushGroup();
  return result;
}

export function LessonCard({ children, className = '' }: LessonCardProps) {
  const processedChildren = groupConsecutiveCodeBlocks(children);

  return (
    <div
      className={`rounded-lg border border-border/80 text-card-foreground shadow-sm p-5 sm:p-6 bg-background ${className}`}
    >
      {processedChildren}
    </div>
  );
}
