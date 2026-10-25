"use client";

import React from "react";
import dynamic from "next/dynamic";
import { loader } from "@monaco-editor/react";
import { configureMonacoLoader } from "@/lib/monaco-loader";
import { monacoLanguageId } from "@/lib/monaco-language";
import { EditorLoading } from "@/components/ui/visual-loading";

// SEB permits only the pinned exam origin and launcher loopback. Serve Monaco
// from this app's origin instead of the loader's default public CDN.
configureMonacoLoader(loader);

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <EditorLoading label="Monaco code editor" />,
});

interface MonacoCodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  ariaLabel?: string;
  readOnly?: boolean;
  height?: string;
  theme?: string;
}

export function MonacoCodeEditor({
  language,
  value,
  onChange,
  ariaLabel = "Code editor",
  readOnly = false,
  height = "100%",
  theme = "mindflare-amoled",
}: MonacoCodeEditorProps) {
  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme("mindflare-amoled", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "71717a", fontStyle: "italic" },
        { token: "keyword", foreground: "f43f5e" },
        { token: "string", foreground: "34d399" },
        { token: "number", foreground: "fbbf24" },
        { token: "type", foreground: "60a5fa" },
        { token: "function", foreground: "38bdf8" },
        { token: "variable", foreground: "f4f4f5" },
      ],
      colors: {
        "editor.background": "#000000",
        "editor.foreground": "#f4f4f5",
        "editor.lineHighlightBackground": "#ffffff08",
        "editorLineNumber.foreground": "#52525b",
        "editorLineNumber.activeForeground": "#FF1018",
        "editorGutter.background": "#000000",
        "editorCursor.foreground": "#FF1018",
        "editor.selectionBackground": "#FF101833",
        "editor.inactiveSelectionBackground": "#ffffff15",
        "scrollbarSlider.background": "#ffffff15",
        "scrollbarSlider.hoverBackground": "#ffffff25",
        "scrollbarSlider.activeBackground": "#ffffff35",
      },
    });
  };

  return (
    <div className="w-full h-full min-h-[250px] bg-black">
      <Editor
        height={height}
        language={monacoLanguageId(language)}
        value={value}
        onChange={onChange}
        beforeMount={handleEditorWillMount}
        theme="mindflare-amoled"
        options={{
          fontSize: 13,
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: true,
          minimap: { enabled: false },
          automaticLayout: true,
          ariaLabel,
          scrollBeyondLastLine: false,
          tabSize: 4,
          cursorBlinking: "smooth",
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          fontFamily: "Consolas, 'Courier New', monospace, 'Fira Code'",
          readOnly,
        }}
      />
    </div>
  );
}
