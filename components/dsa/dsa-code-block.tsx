'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Copy,
  Check,
  Hash,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  FileCode,
} from 'lucide-react';
import { usePreferredLanguage, normalizeLanguage } from '@/lib/code-language-store';
import SmoothButton from '@/components/smoothui/smooth-button';
import { SimpleTooltip } from '@/components/animate-ui/tooltip';

export interface CodeSnippet {
  language: string;
  code: string;
  fileName?: string;
}

interface DsaCodeBlockProps {
  code?: string;
  language?: string;
  fileName?: string;
  showLineNumbers?: boolean;
  snippets?: CodeSnippet[];
}

import { LanguageIcon } from './language-icons';
export { LanguageIcon };

export function getLanguageDisplayName(lang: string): string {
  const norm = normalizeLanguage(lang);
  switch (norm) {
    case 'python':
      return 'Python';
    case 'java':
      return 'Java';
    case 'cpp':
      return 'C++';
    case 'csharp':
      return 'C#';
    case 'go':
      return 'Go';
    case 'rust':
      return 'Rust';
    case 'javascript':
      return 'Javascript';
    case 'typescript':
      return 'Typescript';
    default:
      return lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'Code';
  }
}

// Tokenizer supporting Python, Java, C++, C#, Go, Rust, JS, TS
function highlightCode(code: string, language: string): React.ReactNode[] {
  const lines = code.split('\n');
  const norm = normalizeLanguage(language);
  const isPython = norm === 'python';

  // Keyword regex
  const regex = isPython
    ? /(\b(?:from|import|def|class|return|if|elif|else|for|while|in|not|and|or|is|as|with|try|except|finally|raise|lambda|yield|async|await|break|continue|pass|global|nonlocal|assert)\b)|(\b(?:True|False|None)\b)|(\b(?:print|len|range|enumerate|zip|map|filter|sorted|reversed|min|max|sum|abs|all|any|isinstance|issubclass|type|id|iter|next|int|float|str|bool|list|dict|set|tuple|defaultdict|Counter|deque|OrderedDict|heapq|heappush|heappop|heapify|bisect_left|bisect_right|insort|lru_cache|cache|combinations|permutations|product|accumulate|inf|ceil|floor|gcd|sqrt|isqrt|sys|Optional|List|Dict|Set|Tuple)\b)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)/g
    : /(\b(?:public|private|protected|static|final|class|interface|enum|extends|implements|import|package|new|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|finally|throw|throws|void|int|long|double|float|boolean|char|byte|short|struct|fn|pub|mut|impl|let|match|func|var|val|const|function|typeof|instanceof|async|await|export|using|namespace|nullptr|bool)\b)|(\b(?:true|false|null|nil|this|self|super)\b)|(\b(?:String|Integer|Long|Character|Boolean|Double|List|ArrayList|Map|HashMap|LinkedHashMap|TreeMap|Set|HashSet|LinkedHashSet|TreeSet|Queue|LinkedList|Deque|ArrayDeque|PriorityQueue|Arrays|Collections|Math|System|ListNode|TreeNode|Node|TrieNode|StringBuilder|vector|string|unordered_map|unordered_set|pair|make_pair|unique_ptr|shared_ptr|i32|i64|u32|u64|usize|Vec|Option|Some|None|Result|Ok|Err|Console)\b)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:_\d+)*(?:L|f|d|u)?\b)/g;

  return lines.map((line, lineIdx) => {
    if (!line) {
      return (
        <div key={lineIdx} className="table-row">
          <span className="table-cell select-none pr-4 text-right text-xs text-[#6e7681] font-mono leading-6 w-8 shrink-0">
            {lineIdx + 1}
          </span>
          <span className="table-cell">&nbsp;</span>
        </div>
      );
    }

    const tokens: React.ReactNode[] = [];
    let keyIdx = 0;

    const commentChar = isPython ? '#' : '//';
    const commentIndex = line.indexOf(commentChar);
    let codePart = line;
    let commentPart = '';

    if (commentIndex !== -1) {
      const quotesBefore = (line.substring(0, commentIndex).match(/["']/g) || []).length;
      if (quotesBefore % 2 === 0) {
        codePart = line.substring(0, commentIndex);
        commentPart = line.substring(commentIndex);
      }
    }

    let lastIdx = 0;
    let m: RegExpExecArray | null;

    while ((m = regex.exec(codePart)) !== null) {
      if (m.index > lastIdx) {
        tokens.push(
          <span key={keyIdx++} className="text-[#c9d1d9]">
            {codePart.substring(lastIdx, m.index)}
          </span>
        );
      }

      if (m[1]) {
        // Keyword
        tokens.push(
          <span key={keyIdx++} className="text-[#ff7b72] font-semibold">
            {m[1]}
          </span>
        );
      } else if (m[2]) {
        // Boolean / Constant
        tokens.push(
          <span key={keyIdx++} className="text-[#79c0ff] font-semibold">
            {m[2]}
          </span>
        );
      } else if (m[3]) {
        // Type / Built-in
        tokens.push(
          <span key={keyIdx++} className="text-[#d2a8ff]">
            {m[3]}
          </span>
        );
      } else if (m[4]) {
        // String
        tokens.push(
          <span key={keyIdx++} className="text-[#a5d6ff]">
            {m[4]}
          </span>
        );
      } else if (m[5]) {
        // Number
        tokens.push(
          <span key={keyIdx++} className="text-[#79c0ff]">
            {m[5]}
          </span>
        );
      }

      lastIdx = regex.lastIndex;
    }

    if (lastIdx < codePart.length) {
      tokens.push(
        <span key={keyIdx++} className="text-[#c9d1d9]">
          {codePart.substring(lastIdx)}
        </span>
      );
    }

    if (commentPart) {
      tokens.push(
        <span key={keyIdx++} className="text-[#8b949e] italic">
          {commentPart}
        </span>
      );
    }

    return (
      <div key={lineIdx} className="table-row hover:bg-white/[0.02] transition-colors">
        <span className="table-cell select-none pr-4 text-right text-xs text-[#6e7681] font-mono leading-6 w-8 shrink-0">
          {lineIdx + 1}
        </span>
        <span className="table-cell font-mono text-sm leading-6 whitespace-pre">{tokens}</span>
      </div>
    );
  });
}

export function DsaCodeBlock({
  code = '',
  language = 'python',
  fileName,
  snippets,
}: DsaCodeBlockProps) {
  const [globalLang, setGlobalLang] = usePreferredLanguage('python');
  const [copied, setCopied] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize snippets list
  const availableSnippets: CodeSnippet[] =
    snippets && snippets.length > 0
      ? snippets
      : [{ language: language || 'python', code: code || '', fileName }];

  // Find snippet matching global language preference, or fallback to first
  const activeSnippet =
    availableSnippets.find(
      (s) => normalizeLanguage(s.language) === normalizeLanguage(globalLang)
    ) || availableSnippets[0];

  const currentCode = (activeSnippet?.code || '').trim();
  const currentLang = activeSnippet?.language || 'python';
  const currentFileName = activeSnippet?.fileName || fileName;

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleSelectLanguage = (lang: string) => {
    setGlobalLang(lang);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={`my-6 rounded-xl border border-border/80 bg-[#0d1117] shadow-lg transition-all duration-200 ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col my-0 overflow-hidden' : isDropdownOpen ? 'relative z-30' : 'relative overflow-hidden'
      }`}
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#161b22] border-b border-border/60 text-xs">
        {/* Left: Language Dropdown or Badge */}
        <div className="relative" ref={dropdownRef}>
          {availableSnippets.length > 1 ? (
            <div>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-foreground font-medium text-[13px] tracking-wide transition-all shadow-sm group"
              >
                <LanguageIcon language={currentLang} className="w-4 h-4" />
                <span className="font-semibold text-foreground">
                  {getLanguageDisplayName(currentLang)}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-foreground' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu matching Image 2 & 3 */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 z-50 w-48 sm:w-52 rounded-2xl bg-[#161b22]/95 backdrop-blur-xl border border-[#30363d] shadow-2xl p-1.5 animate-in fade-in-0 zoom-in-95 duration-100">
                  <div className="space-y-0.5">
                    {availableSnippets.map((snippet) => {
                      const isSelected =
                        normalizeLanguage(snippet.language) === normalizeLanguage(currentLang);
                      return (
                        <button
                          key={snippet.language}
                          type="button"
                          onClick={() => handleSelectLanguage(snippet.language)}
                          className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-[13px] font-medium transition-colors text-left ${
                            isSelected
                              ? 'bg-red-950/70 border border-red-500/30 text-cyan-400 font-semibold'
                              : 'text-[#c9d1d9] hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <LanguageIcon language={snippet.language} className="w-4 h-4 shrink-0" />
                            <span>{getLanguageDisplayName(snippet.language)}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-cyan-400 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2 py-0.5">
              <LanguageIcon language={currentLang} className="w-4 h-4" />
              <span className="font-semibold text-foreground tracking-wide font-mono text-[13px]">
                {currentFileName || getLanguageDisplayName(currentLang)}
              </span>
            </div>
          )}
        </div>

        {/* Right Toolbar */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
          {/* Copy Button */}
          <SimpleTooltip content={copied ? 'Copied!' : 'Copy Code'}>
            <SmoothButton
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </SmoothButton>
          </SimpleTooltip>

          {/* Line Numbers Toggle */}
          <SimpleTooltip content="Toggle line numbers">
            <SmoothButton
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => setShowNumbers(!showNumbers)}
              className={showNumbers ? 'text-foreground' : 'text-muted-foreground/60'}
            >
              <Hash className="w-3.5 h-3.5" />
            </SmoothButton>
          </SimpleTooltip>

          {/* Collapse/Expand Toggle */}
          <SimpleTooltip content={isCollapsed ? 'Expand code' : 'Collapse code'}>
            <SmoothButton
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </SmoothButton>
          </SimpleTooltip>

          {/* Fullscreen Toggle */}
          <SimpleTooltip content={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            <SmoothButton
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </SmoothButton>
          </SimpleTooltip>
        </div>
      </div>

      {/* Code Area */}
      {!isCollapsed && (
        <div
          className={`p-4 overflow-x-auto font-mono text-sm leading-relaxed ${
            isFullscreen ? 'flex-1 overflow-y-auto' : 'max-h-[550px] overflow-y-auto'
          }`}
        >
          {showNumbers ? (
            <div className="table w-full">{highlightCode(currentCode, currentLang)}</div>
          ) : (
            <pre className="text-foreground whitespace-pre font-mono text-sm">
              {currentCode}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
