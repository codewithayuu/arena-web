"use client";

import React, { useState } from "react";
import { Copy, Check, Hash, WrapText, Maximize2, Minimize2, ChevronDown } from "lucide-react";
import Select from "@/components/smoothui/select";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

export interface CodeTemplate {
  language: string;
  code: string;
  lineMap: Record<string, number[]>;
  conditionalMap?: Record<string, number[]>;
}

export type SupportedLanguage = "java" | "python" | "cpp" | "csharp" | "go" | "javascript" | "typescript";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  java: "Java",
  python: "Python",
  cpp: "C++",
  csharp: "C#",
  go: "Go",
  javascript: "JavaScript",
  typescript: "TypeScript",
};

interface CodeViewerPanelProps {
  templates: Partial<Record<SupportedLanguage, CodeTemplate>>;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeStepKey?: string;
  className?: string;
}

export function CodeViewerPanel({
  templates,
  currentLanguage,
  onLanguageChange,
  activeStepKey,
  className = "",
}: CodeViewerPanelProps) {
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeTemplate = templates[currentLanguage] || Object.values(templates)[0];
  const code = activeTemplate?.code || "// No code available for this language";
  const activeLines = activeStepKey && activeTemplate?.lineMap ? activeTemplate.lineMap[activeStepKey] || [] : [];

  const lines = code.split("\n");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Syntax highlighter tokenizer
  const renderTokens = (line: string, isComment: boolean) => {
    if (isComment || line.trim().startsWith("//") || line.trim().startsWith("#")) {
      return <span className="text-gray-500 italic">{line}</span>;
    }

    const keywords = new Set([
      "def", "class", "public", "private", "int", "void", "return", "for", "while",
      "if", "else", "new", "vector", "function", "const", "let", "var", "func", "make",
      "range", "enumerate", "in", "import", "Map", "HashMap", "unordered_map", "Dictionary"
    ]);

    const words = line.split(/(\b[a-zA-Z_][a-zA-Z0-9_]*\b|[0-9]+|"[^"]*"|'[^']*'|[{}\[\](),;+\-*\/=<>!&|:])/g);

    return words.map((chunk, idx) => {
      if (!chunk) return null;
      if (keywords.has(chunk)) {
        return <span key={idx} className="text-purple-400 font-semibold">{chunk}</span>;
      }
      if (/^[0-9]+$/.test(chunk)) {
        return <span key={idx} className="text-amber-400">{chunk}</span>;
      }
      if ((chunk.startsWith('"') && chunk.endsWith('"')) || (chunk.startsWith("'") && chunk.endsWith("'"))) {
        return <span key={idx} className="text-[#67E8F9]">{chunk}</span>;
      }
      if (["twoSum", "containsKey", "count", "get", "put", "set", "len", "size", "push"].includes(chunk)) {
        return <span key={idx} className="text-[#38BDF8] font-medium">{chunk}</span>;
      }
      return <span key={idx}>{chunk}</span>;
    });
  };

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border border-white/10 bg-black overflow-hidden select-none ${className} ${
        isFullscreen ? "fixed inset-4 z-50 shadow-2xl" : ""
      }`}
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black text-xs">
        {/* Language Dropdown */}
        <div className="w-[130px] shrink-0">
          <Select
            value={currentLanguage}
            onValueChange={(val) => onLanguageChange(val as SupportedLanguage)}
            options={Object.keys(templates).map((lang) => ({
              value: lang,
              label: LANGUAGE_LABELS[lang as SupportedLanguage] || lang,
            }))}
            size="sm"
            className="h-7 text-xs font-semibold rounded-lg bg-black border-white/10 text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 text-zinc-400">
          {/* Wrap Toggle */}
          <SimpleTooltip content={wordWrap ? "Disable line wrap" : "Enable line wrap"}>
            <button
              onClick={() => setWordWrap(!wordWrap)}
              className={`p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors ${wordWrap ? "text-[#FF3B41]" : ""}`}
            >
              <WrapText className="h-3.5 w-3.5" />
            </button>
          </SimpleTooltip>

          {/* Line Numbers Toggle */}
          <SimpleTooltip content={showLineNumbers ? "Hide line numbers" : "Show line numbers"}>
            <button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className={`p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors ${showLineNumbers ? "text-[#FF3B41]" : ""}`}
            >
              <Hash className="h-3.5 w-3.5" />
            </button>
          </SimpleTooltip>

          {/* Copy Button */}
          <SimpleTooltip content="Copy code">
            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </SimpleTooltip>

          {/* Fullscreen Button */}
          <SimpleTooltip content={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </SimpleTooltip>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className={`flex-1 overflow-y-auto p-2 text-xs leading-5 bg-black ${wordWrap ? "whitespace-pre-wrap" : "whitespace-pre overflow-x-auto"}`}>
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isActive = activeLines.includes(lineNum);

              return (
                <tr
                  key={lineNum}
                  className={`transition-colors duration-150 ${
                    isActive
                      ? "bg-[#FF1018]/15 border-l-2 border-[#FF1018] font-bold text-white"
                      : "hover:bg-white/[0.04] text-zinc-300"
                  }`}
                >
                  {/* Line Number & Execution Pointer */}
                  {showLineNumbers && (
                    <td className="w-8 pr-3 text-right select-none text-zinc-600 align-top tabular-nums">
                      {isActive ? (
                        <span className="text-[#FF3B41] font-bold inline-block mr-1">►</span>
                      ) : null}
                      <span>{lineNum}</span>
                    </td>
                  )}

                  {/* Code Content */}
                  <td className="pl-2 font-mono align-top">
                    {renderTokens(line, line.trim().startsWith("//") || line.trim().startsWith("#"))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
