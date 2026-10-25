"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  FileArchive,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  ShieldAlert,
  Cpu,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Eye,
  FileText,
  Clock,
  ArrowRight,
  Radio,
} from "lucide-react";
import { isMockContestModeEnabled, setMockContestModeEnabled } from "@/lib/mock-contest-store";
import { ContestControlDashboard } from "./contest-control-dashboard";

interface ContestSummary {
  contest_id: string;
  name: string;
  description: string;
  problem_count: number;
  starts_at: string;
  ends_at: string;
  languages: string[];
  mock_mode: boolean;
  proctoring: {
    enabled: boolean;
    webcam_required: boolean;
    gaze_tracking: boolean;
    admin_ws_url: string;
    capture_interval_ms: number;
  };
  created_at: string;
}

export default function AdminContestsPage() {
  return process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_LOCAL_CONTEST_MODE === "true"
    ? <DevelopmentContestAdmin /> : <ContestControlDashboard />;
}

function DevelopmentContestAdmin() {
  const [contests, setContests] = useState<ContestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [mockMode, setMockMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customPath, setCustomPath] = useState("C:\\Users\\ayush\\Downloads\\Halloween_Hollow_Hill_Div3.zip");
  const [expandedContestId, setExpandedContestId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMockMode(isMockContestModeEnabled());
    loadContests();
  }, []);

  async function loadContests() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contests");
      const data = await res.json();
      if (data.success && Array.isArray(data.contests)) {
        setContests(data.contests);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function handleToggleMockMode() {
    const next = !mockMode;
    setMockMode(next);
    setMockContestModeEnabled(next);
  }

  async function handleFileUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;

    setImporting(true);
    setImportMessage(null);

    try {
      // Send raw binary stream with octet-stream header to bypass FormData 10MB parser limits on large 50MB ZIP packages
      const res = await fetch("/api/admin/contests/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "X-Filename": encodeURIComponent(selectedFile.name),
        },
        body: selectedFile,
      });
      const data = await res.json();
      if (data.success) {
        setImportMessage({ type: "success", text: data.message });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await loadContests();
      } else {
        setImportMessage({ type: "error", text: data.error || "Import failed" });
      }
    } catch (err: any) {
      setImportMessage({ type: "error", text: err?.message || "Import failed" });
    } finally {
      setImporting(false);
    }
  }

  async function handleOneClickImport(pathToImport?: string) {
    setImporting(true);
    setImportMessage(null);

    const targetPath = pathToImport || customPath;
    try {
      const res = await fetch("/api/admin/contests/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          localPath: targetPath,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setImportMessage({ type: "success", text: data.message });
        await loadContests();
      } else {
        setImportMessage({ type: "error", text: data.error || "Import failed" });
      }
    } catch (err: any) {
      setImportMessage({ type: "error", text: err?.message || "Import failed" });
    } finally {
      setImporting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 text-zinc-100">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">
              Admin Operations & Settings
            </p>
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Dynamic Contest Importer & Platform Controls
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Import Polygon & custom contest ZIP archives dynamically, manage local mock modes, and configure on-device AI proctoring telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contests"
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 transition-colors"
          >
            Go to Contests Arena
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Global Mock Mode Settings Card */}
      <section className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Cpu className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Local Mock Contest Mode</h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                  mockMode
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                }`}
              >
                {mockMode ? "Active / Enabled" : "Disabled (Strict Azure)"}
              </span>
            </div>
            <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
              When enabled, the contest workspace executes against public samples and runs submissions locally in the browser with mock verdicts, bypassing Azure VM judge allocation and the native SEB desktop launcher requirement for rapid UI testing and verification.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleMockMode}
            className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-lg ${
              mockMode
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10"
            }`}
          >
            {mockMode ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
            {mockMode ? "Disable Mock Mode" : "Enable Mock Mode"}
          </button>
        </div>
      </section>

      {/* Contest Importer Box */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 border border-red-500/30 text-red-400">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Import Contest Package (ZIP)</h2>
            <p className="text-xs text-zinc-400">
              Upload a Polygon contest package or lettered folder archive (with LaTeX / Markdown statements, samples, and tests).
            </p>
          </div>
        </div>

        {importMessage && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl p-4 text-xs font-medium ${
              importMessage.type === "success"
                ? "border border-emerald-500/30 bg-emerald-950/40 text-emerald-200"
                : "border border-red-500/30 bg-red-950/40 text-red-200"
            }`}
          >
            {importMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            )}
            <p className="leading-relaxed">{importMessage.text}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* File Upload Form */}
          <form onSubmit={handleFileUpload} className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <FileArchive className="h-4 w-4 text-zinc-400" />
              Upload Archive From Device
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-zinc-400 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20 cursor-pointer"
            />
            <button
              type="submit"
              disabled={!selectedFile || importing}
              className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-red-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {importing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {importing ? "Parsing & Extracting Archive…" : "Upload & Parse Contest ZIP"}
            </button>
          </form>

          {/* Import by Local System Path */}
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Import by Local System Path
              </h3>
              <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                Directly parse and import archives from disk without browser upload limits.
              </p>
              <input
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="C:\path\to\contest.zip"
                className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 font-mono text-xs text-amber-300 placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleOneClickImport(customPath)}
                disabled={!customPath || importing}
                className="flex-1 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {importing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {importing ? "Importing…" : "Import Package From Path"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Registered Contests List */}
      <section className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-black text-white">Registered Dynamic Contests</h2>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-zinc-300">
              {contests.length}
            </span>
          </div>

          <button
            type="button"
            onClick={loadContests}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-12 text-center text-sm text-zinc-400">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-red-500 mb-3" />
            Loading registered contest definitions…
          </div>
        ) : contests.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-12 text-center text-sm text-zinc-400">
            No dynamic contests imported yet. Use the importer above to load an archive.
          </div>
        ) : (
          <div className="grid gap-4">
            {contests.map((c) => (
              <div
                key={c.contest_id}
                className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-lg backdrop-blur-md transition-all hover:border-white/20"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-bold text-white tracking-tight">{c.name}</h3>
                      <span className="font-mono text-xs text-zinc-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                        {c.contest_id}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        {c.problem_count} Problems
                      </span>
                      {c.mock_mode && (
                        <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
                          Mock Arena Ready
                        </span>
                      )}
                      {c.proctoring?.enabled && (
                        <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 flex items-center gap-1">
                          <Radio className="h-3 w-3" />
                          AI Proctored
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 max-w-3xl line-clamp-2">{c.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/contests/${c.contest_id}`}
                      className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-red-500 transition-all"
                    >
                      Enter Arena
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/5 pt-3 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    Starts: {new Date(c.starts_at).toLocaleDateString()}
                  </span>
                  <span>·</span>
                  <span>Languages: {c.languages?.join(", ") || "All"}</span>
                  <span>·</span>
                  <span>Admin WSS: {c.proctoring?.admin_ws_url || "ws://127.0.0.1:8765"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
