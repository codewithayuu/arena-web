"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Group, Panel, Separator } from "react-resizable-panels";
import {
  FileText,
  Lightbulb,
  History,
  FileEdit,
  MessageCircle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Shuffle,
  Clock,
  Maximize2,
  Minimize2,
  X,
  Play,
  Send,
  RotateCcw,
  Sliders,
  Menu as MenuIcon,
  Eye,
  Plus,
  Tag,
  Lock,
  List as ListIcon,
  CheckCircle2,
  AlertCircle,
  Share2,
  Terminal,
  Search,
  LayoutGrid,
} from "lucide-react";
import {
  PracticeProblem,
  getAllPracticeProblems,
  getAdjacentPracticeProblems,
  getProblemsByList,
} from "@/lib/practice-problems";
import { MonacoCodeEditor } from "./monaco-code-editor";
import { LanguageIcon } from "@/components/dsa/language-icons";
import Select from "@/components/smoothui/select";
import { TooltipProvider, SimpleTooltip } from "@/components/animate-ui/tooltip";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarSeparator,
  useSidebar,
} from "@/components/smoothui/sidebar";
import { cn } from "@/lib/utils";
import {
  cancelLocalExecution,
  completeRuntimePairingOnUserAction,
  getRuntimeStatus,
  prepareRuntimePairingChallenge,
  startRuntimeOnUserAction,
  recoverLocalCacheCleanup,
  runLocalInput,
  RuntimeBridgeError,
  RuntimeSession,
  RuntimePairingChallenge,
} from "@/lib/runtime-bridge";
import {
  canonicalizeResult,
  makePracticeExecution,
  parseExpectedOutput,
  supportsPracticeHarness,
} from "@/lib/practice-run-adapters";
import {
  loadPracticeTestPack,
  PracticeTestCase,
} from "@/lib/practice-test-bundle-client";
import { usePersistedState } from "@/hooks/use-persisted-state";

interface ProblemWorkspaceProps {
  problem: PracticeProblem;
  listParam?: string;
}

export function ProblemWorkspace({
  problem,
  listParam = "am-300",
}: ProblemWorkspaceProps) {
  return (
    <SidebarProvider defaultOpen={false} storageKey="problem_workspace_sidebar">
      <ProblemWorkspaceInner problem={problem} listParam={listParam} />
    </SidebarProvider>
  );
}

function ProblemWorkspaceInner({
  problem,
  listParam = "am-300",
}: ProblemWorkspaceProps) {
  const router = useRouter();
  const { open, toggleSidebar, setOpen } = useSidebar();
  const currentList = getProblemsByList(listParam);
  const allProblems = currentList.problems;
  const listTitle = currentList.title;
  const { prev, next, currentIndex, total } = getAdjacentPracticeProblems(
    problem.slug,
    listParam,
  );

  // Left Panel Tabs
  const [leftTab, setLeftTab] = usePersistedState<
    "problem" | "solution" | "submissions" | "notes" | "discussion"
  >("practice_workspace_left_tab", "problem");

  // Bottom Panel Tabs
  const [bottomTab, setBottomTab] = usePersistedState<
    "testcases" | "output"
  >("practice_workspace_bottom_tab", "testcases");

  // Selected Language & Code State
  const [selectedLanguage, setSelectedLanguage] = usePersistedState<string>(
    "practice_workspace_selected_language",
    "Java",
  );
  const [code, setCode] = useState<string>(problem.starterCodes.Java);
  const [solutionTabs, setSolutionTabs] = useState<string[]>(["Solution 1"]);
  const [activeSolutionTab, setActiveSolutionTab] = useState<number>(0);

  // Test cases & Inputs
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [testCases, setTestCases] = useState<PracticeTestCase[]>([]);
  const [testCasesLoading, setTestCasesLoading] = useState(false);
  const [testCasesError, setTestCasesError] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState<string>("null");
  const [copiedInputId, setCopiedInputId] = useState<number | null>(null);

  // Topic & Companies Tag expansion
  const [showTopics, setShowTopics] = usePersistedState<boolean>(
    "practice_workspace_show_topics",
    false,
  );
  const [showCompanies, setShowCompanies] = usePersistedState<boolean>(
    "practice_workspace_show_companies",
    false,
  );

  // Example collapsibles
  const [collapsedExamples, setCollapsedExamples] = useState<
    Record<number, boolean>
  >({});

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<{
    status: "Not run" | "Ran locally";
    message: string;
    isSubmit?: boolean;
    stdout?: string;
    stderr?: string;
    exitCode?: number | null;
    durationMs?: number;
  } | null>(null);
  const [runtimeSession, setRuntimeSession] = useState<RuntimeSession | null>(
    null,
  );
  const [pendingLauncherChallenge, setPendingLauncherChallenge] = useState<RuntimePairingChallenge | null>(null);
  const [runtimeConnectionState, setRuntimeConnectionState] = useState<
    "disconnected" | "starting" | "pairing" | "connected" | "executing" | "error"
  >("disconnected");
  const [runtimeAvailable, setRuntimeAvailable] = useState(false);
  const [isConnectingRuntime, setIsConnectingRuntime] = useState(false);
  const runtimeSessionActive = runtimeSession !== null && Date.parse(runtimeSession.expiresAt) > Date.now();
  const [activeRun, setActiveRun] = useState<{
    session: RuntimeSession;
    executionId: string;
  } | null>(null);

  useEffect(() => {
    let current = true;
    void getRuntimeStatus().then((status) => {
      if (current) setRuntimeAvailable(status !== null);
    });
    return () => { current = false; };
  }, []);

  useEffect(() => {
    if (!runtimeSession) return;
    const delay = Date.parse(runtimeSession.expiresAt) - Date.now();
    if (delay <= 0) {
      setRuntimeConnectionState("disconnected");
      return;
    }
    const timer = window.setTimeout(() => setRuntimeConnectionState("disconnected"), delay);
    return () => window.clearTimeout(timer);
  }, [runtimeSession]);

  // Notes state
  const [notes, setNotes] = useState("");
  const [notesSyncState, setNotesSyncState] = useState<"loading" | "local" | "saved" | "saving" | "error">("loading");
  const notesReady = useRef(false);
  const notesSyncEnabled = useRef(false);
  const notesRef = useRef("");
  const notesTouched = useRef(false);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Drawers & Modals
  const [problemSearchQuery, setProblemSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Update starter code when language or problem changes
  useEffect(() => {
    const langKey = selectedLanguage as keyof typeof problem.starterCodes;
    try {
      const saved = localStorage.getItem(`practice_code_${problem.slug}_${selectedLanguage}`);
      if (saved !== null && saved !== undefined) {
        setCode(saved);
        return;
      }
    } catch {}
    if (problem.starterCodes[langKey]) {
      setCode(problem.starterCodes[langKey]);
    }
  }, [selectedLanguage, problem]);

  const handleCodeChange = (val: string) => {
    setCode(val);
    try {
      localStorage.setItem(`practice_code_${problem.slug}_${selectedLanguage}`, val);
    } catch {}
  };

  useEffect(() => {
    setSelectedCaseIndex(0);
    setTestCases([]);
    setTestCasesError(null);
    setCustomInput("null");
    setRunResult(null);
  }, [problem.id]);

  useEffect(() => {
    if (bottomTab !== "testcases") return;
    const controller = new AbortController();
    setTestCasesLoading(true);
    setTestCasesError(null);
    void loadPracticeTestPack(problem.id, controller.signal)
      .then((pack) => {
        setTestCases(pack.cases);
        setCustomInput((current) =>
          current === "null" && pack.cases[0]
            ? JSON.stringify(pack.cases[0].rawInput)
            : current,
        );
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setTestCasesError(
          error instanceof Error ? error.message : "Could not load practice tests.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setTestCasesLoading(false);
      });
    return () => controller.abort();
  }, [bottomTab, problem.id]);

  // Load account notes from Neon while keeping an unsynced local draft recoverable.
  useEffect(() => {
    let active = true;
    const storageKey = `notes_${problem.id}`;
    let localDraft = "";
    try { localDraft = localStorage.getItem(storageKey) ?? ""; } catch {}
    notesRef.current = localDraft;
    notesTouched.current = false;
    setNotes(localDraft);
    notesReady.current = false;
    notesSyncEnabled.current = false;
    setNotesSyncState("loading");

    void fetch(`/api/practice/${encodeURIComponent(problem.id)}/notes`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!active) return;
        if (response.status === 401) {
          setNotesSyncState("local");
          return;
        }
        if (!response.ok || typeof body.content !== "string") throw new Error("Notes could not be loaded");

        const serverNote = body.content as string;
        if (notesTouched.current) {
          const content = notesRef.current;
          const saveResponse = await fetch(`/api/practice/${encodeURIComponent(problem.id)}/notes`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          });
          if (!saveResponse.ok) throw new Error("Notes could not be saved");
          notesSyncEnabled.current = true;
          notesReady.current = true;
          setNotesSyncState("saved");
          return;
        }
        if (!serverNote && localDraft) {
          const migration = await fetch(`/api/practice/${encodeURIComponent(problem.id)}/notes`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: localDraft }),
          });
          if (!migration.ok) throw new Error("Notes could not be migrated");
          setNotes(localDraft);
          notesSyncEnabled.current = true;
          setNotesSyncState("saved");
        } else {
          setNotes(serverNote);
          try { localStorage.setItem(storageKey, serverNote); } catch {}
          notesSyncEnabled.current = true;
          setNotesSyncState("saved");
        }
        notesReady.current = true;
      })
      .catch(() => {
        if (!active) return;
        setNotesSyncState("error");
      });
    return () => { active = false; };
  }, [problem.id]);

  useEffect(() => {
    if (!notesReady.current || !notesSyncEnabled.current) return;
    const timer = window.setTimeout(() => {
      setNotesSyncState("saving");
      void fetch(`/api/practice/${encodeURIComponent(problem.id)}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: notes }),
      }).then((response) => {
        if (!response.ok) throw new Error("Notes could not be saved");
        setNotesSyncState("saved");
      }).catch(() => setNotesSyncState("error"));
    }, 600);
    return () => window.clearTimeout(timer);
  }, [notes, problem.id]);

  // Timer interval
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleNotesChange = (text: string) => {
    notesRef.current = text;
    notesTouched.current = true;
    setNotes(text);
    try {
      localStorage.setItem(`notes_${problem.id}`, text);
    } catch {}
    if (!notesSyncEnabled.current) setNotesSyncState("local");
  };

  const toggleExample = (id: number) => {
    setCollapsedExamples((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedInputId(id);
    setTimeout(() => setCopiedInputId(null), 2000);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRandomProblem = () => {
    const others = allProblems.filter((p) => p.slug !== problem.slug);
    if (others.length > 0) {
      const random = others[Math.floor(Math.random() * others.length)];
      router.push(`/practice/dsa/${random.slug}?list=${listParam}`);
    }
  };

  const connectPracticeRuntime = (): RuntimeSession => {
    if (runtimeSession && Date.parse(runtimeSession.expiresAt) > Date.now()) return runtimeSession;
    setRuntimeConnectionState("disconnected");
    throw new RuntimeBridgeError(
      "RUNTIME_NOT_PAIRED",
      "Connect Mindflare Launcher to this tab before running practice code. No code was executed.",
    );
  };

  const handleConnectRuntime = async () => {
    if (isConnectingRuntime) return;
    if (runtimeSession && Date.parse(runtimeSession.expiresAt) > Date.now()) {
      setRuntimeConnectionState("connected");
      return;
    }
    setIsConnectingRuntime(true);
    setRuntimeConnectionState("pairing");
    setRunResult(null);
    try {
      if (!pendingLauncherChallenge || Date.parse(pendingLauncherChallenge.expiresAt) <= Date.now()) {
        if (!runtimeAvailable) {
          await startRuntimeOnUserAction();
          setRuntimeAvailable(true);
        }
        const challenge = await prepareRuntimePairingChallenge("practice");
        setPendingLauncherChallenge(challenge);
        setRunResult({
          status: "Not run",
          message: "Pairing is ready. Click Open Mindflare Launcher to continue; your browser may ask you to confirm the app launch.",
        });
        return;
      }

      const challenge = pendingLauncherChallenge;
      setPendingLauncherChallenge(null);
      // This function dispatches the validated custom URL synchronously before
      // its first await, preserving the browser's direct-click activation.
      const session = await completeRuntimePairingOnUserAction(challenge, setRuntimeConnectionState);
      setRuntimeSession(session);
      // Informational recovery only; failed delivery remains encrypted for a
      // later re-pair and must not block practice or restore contest admission.
      void recoverLocalCacheCleanup(session).catch(() => undefined);
      setRuntimeAvailable(true);
      setRuntimeConnectionState("connected");
    } catch (error) {
      setRuntimeConnectionState("error");
      setRunResult({
        status: "Not run",
        message: error instanceof RuntimeBridgeError
          ? `${error.code}: ${error.message}`
          : "Launcher connection failed. No code was executed.",
      });
    } finally {
      setIsConnectingRuntime(false);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setBottomTab("output");
    setRunResult(null);
    try {
      if (!supportsPracticeHarness(problem, selectedLanguage)) {
        throw new Error(
          `No local practice harness is available for ${selectedLanguage} on this problem.`,
        );
      }
      let input: unknown;
      try {
        input = JSON.parse(customInput);
      } catch {
        throw new Error(
          "Input must be valid JSON for this problem's function arguments.",
        );
      }
      const execution = makePracticeExecution(
        problem,
        selectedLanguage as "Java" | "C++" | "Python" | "JavaScript",
        code,
        input,
      );
      const session = await connectPracticeRuntime();
      const language =
        selectedLanguage === "Java"
          ? "java"
          : selectedLanguage === "C++"
            ? "cpp17"
            : selectedLanguage.toLowerCase();
      const executionId = crypto.randomUUID();
      setActiveRun({ session, executionId });
      setRuntimeConnectionState("executing");
      const result = await runLocalInput(
        session,
        execution.source,
        language,
        execution.stdin,
        executionId,
      );
      setRuntimeConnectionState("connected");
      setRunResult({
        status: "Ran locally",
        message: `Local, unofficial execution · ${result.duration_ms} ms · exit ${result.exit_code ?? "unknown"}`,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exit_code,
        durationMs: result.duration_ms,
      });
    } catch (error) {
      if (runtimeSession && Date.parse(runtimeSession.expiresAt) > Date.now()) {
        setRuntimeConnectionState("connected");
      } else {
        setRuntimeConnectionState("disconnected");
      }
      setRunResult({
        status: "Not run",
        message:
          error instanceof RuntimeBridgeError
            ? `${error.code}: ${error.message}`
            : error instanceof Error
              ? error.message
              : "Runtime pairing failed. No code was executed.",
      });
    } finally {
      setActiveRun(null);
      setIsRunning(false);
    }
  };

  const handleCancelRun = async () => {
    if (!activeRun) return;
    try {
      await cancelLocalExecution(activeRun.session, activeRun.executionId);
      setRuntimeConnectionState("connected");
      setRunResult({
        status: "Not run",
        message: "Cancellation requested; the sandbox will stop this run.",
      });
    } catch (error) {
      setRunResult({
        status: "Not run",
        message:
          error instanceof RuntimeBridgeError
            ? `${error.code}: ${error.message}`
            : "Could not cancel the local run.",
      });
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setBottomTab("output");
    setRunResult(null);
    try {
      if (!supportsPracticeHarness(problem, selectedLanguage)) {
        throw new Error(
          `No local practice harness is available for ${selectedLanguage} on this problem.`,
        );
      }
      const session = await connectPracticeRuntime();
      const language =
        selectedLanguage === "Java"
          ? "java"
          : selectedLanguage === "C++"
            ? "cpp17"
            : selectedLanguage.toLowerCase();
      const pack = await loadPracticeTestPack(problem.id);
      setTestCases(pack.cases);
      if (pack.cases.length === 0) {
        throw new Error("This practice problem has no local test cases configured.");
      }
      const first = makePracticeExecution(
        problem,
        selectedLanguage as "Java" | "C++" | "Python" | "JavaScript",
        code,
        pack.cases[0].rawInput,
      );
      const practiceManifest = {
        schema_version: pack.schema_version,
        pack_id: pack.pack_id,
        problem_id: pack.problem_id,
        problem_revision: pack.problem_revision,
        checker: pack.checker,
        cases: pack.cases.map((testCase) => {
        const execution = makePracticeExecution(
          problem,
          selectedLanguage as "Java" | "C++" | "Python" | "JavaScript",
          code,
          testCase.rawInput,
        );
        return {
          name: testCase.name,
          stdin: execution.stdin,
          expected_stdout: `${canonicalizeResult(parseExpectedOutput(testCase))}\n`,
        };
        }),
      };
      const executionId = crypto.randomUUID();
      setActiveRun({ session, executionId });
      setRuntimeConnectionState("executing");
      const result = await runLocalInput(
        session,
        first.source,
        language,
        "",
        executionId,
        practiceManifest,
      );
      setRuntimeConnectionState("connected");
      const caseResults = result.practice_cases ?? [];
      const passed = caseResults.filter((testCase) => testCase.passed).length;
      const failed = caseResults.find((testCase) => !testCase.passed);
      const failedCase = failed
        ? `${failed.name}: ${failed.exit_code !== 0
          ? `program exited with ${failed.exit_code ?? "unknown"}${failed.stderr ? ` (${failed.stderr.trim().slice(0, 180)})` : ""}`
          : "output did not match the expected public case."}`
        : null;
      setRunResult({
        status: "Ran locally",
        message: failedCase
          ? `Local practice check · ${passed}/${caseResults.length} public cases passed · ${failedCase} · unofficial`
          : `Local practice check · ${passed}/${caseResults.length} public cases passed · unofficial; this is not an official contest verdict.`,
        isSubmit: true,
      });
    } catch (error) {
      if (runtimeSession && Date.parse(runtimeSession.expiresAt) > Date.now()) {
        setRuntimeConnectionState("connected");
      } else {
        setRuntimeConnectionState("disconnected");
      }
      setRunResult({
        status: "Not run",
        message:
          error instanceof RuntimeBridgeError
            ? `${error.code}: ${error.message}`
            : error instanceof Error
              ? error.message
              : "Runtime pairing failed. No local or official verdict was created.",
        isSubmit: true,
      });
    } finally {
      setActiveRun(null);
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    const langKey = selectedLanguage as keyof typeof problem.starterCodes;
    if (problem.starterCodes[langKey]) {
      setCode(problem.starterCodes[langKey]);
      try {
        localStorage.removeItem(`practice_code_${problem.slug}_${selectedLanguage}`);
      } catch {}
    }
  };

  const handleAddSolutionTab = () => {
    const nextTab = `Solution ${solutionTabs.length + 1}`;
    setSolutionTabs([...solutionTabs, nextTab]);
    setActiveSolutionTab(solutionTabs.length);
  };

  const filteredProblems = allProblems.filter((p) =>
    p.title.toLowerCase().includes(problemSearchQuery.toLowerCase()) ||
    p.difficulty.toLowerCase().includes(problemSearchQuery.toLowerCase())
  );

  const cleanListTitle = listTitle.replace(/ Problems$/i, "");

  return (
    <TooltipProvider delayDuration={400} disableHoverableContent>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-white select-none">
        {/* Top Navigation Bar: AMOLED Pure Black */}
        <header className="h-12 border-b border-white/10 bg-[#08080a] px-3 flex items-center justify-between flex-shrink-0 z-30">
          {/* Left Side: Brand Logo, Sidebar Trigger & List dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            <SimpleTooltip content="Mindflare Home">
              <Link
                href="/"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-black border border-white/10 hover:border-white/25 hover:bg-white/5 hover:shadow-[0_0_12px_rgba(255,16,24,0.25)] transition-all p-1.5 group"
              >
                <img
                  src="/images/mindflare_m_logo.svg"
                  alt="Mindflare"
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                />
              </Link>
            </SimpleTooltip>

            <SimpleTooltip content={open ? "Collapse Sidebar" : "Problem Sidebar"}>
              <button
                type="button"
                onClick={toggleSidebar}
                className={cn(
                  "p-1.5 rounded-lg border transition-all",
                  open
                    ? "bg-white/10 text-white border-white/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/10 border-transparent hover:border-white/10"
                )}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </SimpleTooltip>

            <div className="relative">
              <button
                type="button"
                onClick={toggleSidebar}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-zinc-200 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <span>{cleanListTitle}</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-zinc-400 transition-transform duration-200",
                    open && "rotate-180"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Center: Prev, Shuffle, Problem Title with Status Dot, Next */}
          <div className="flex items-center gap-1 sm:gap-2">
            {prev ? (
              <SimpleTooltip content={`Previous: ${prev.title}`}>
                <Link
                  href={`/practice/dsa/${prev.slug}?list=${listParam}`}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </SimpleTooltip>
            ) : (
              <span className="p-1.5 text-zinc-700 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </span>
            )}

            <SimpleTooltip content="Random Problem">
              <button
                type="button"
                onClick={handleRandomProblem}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </SimpleTooltip>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 shadow-inner">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  problem.difficulty === "Easy"
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                    : problem.difficulty === "Medium"
                      ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                      : "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                }`}
              />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate max-w-[130px] sm:max-w-[220px]">
                {problem.title}
              </span>
            </div>

            {next ? (
              <SimpleTooltip content={`Next: ${next.title}`}>
                <Link
                  href={`/practice/dsa/${next.slug}?list=${listParam}`}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </SimpleTooltip>
            ) : (
              <span className="p-1.5 text-zinc-700 cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* Right Side: Timer, Fullscreen, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Stopwatch Timer */}
            <SimpleTooltip content={timerRunning ? "Pause timer" : "Resume timer"}>
              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{formatTimer(timerSeconds)}</span>
              </button>
            </SimpleTooltip>

            {/* Fullscreen Toggle */}
            <SimpleTooltip content={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </SimpleTooltip>

            {/* Close back to practice list */}
            <SimpleTooltip content="Exit to Problems List">
              <Link
                href="/practice/dsa-patterns"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </Link>
            </SimpleTooltip>
          </div>
        </header>

        {/* Workspace Body: SmoothUI Sidebar on Left + Resizable Workspace */}
        <div className="flex-1 w-full overflow-hidden flex relative bg-black">
          {/* SmoothUI Problem Sidebar (Collapsible Rail 56px <-> 280px) */}
          <Sidebar
            collapsibleWidth={56}
            expandedWidth={280}
            className="border-r border-white/10 bg-[#08080a] select-none shrink-0 z-20 transition-colors"
          >
            {/* Sidebar Header */}
            <SidebarHeader className="flex items-center justify-between p-3 border-b border-white/5">
              {open ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs font-bold tracking-wider uppercase text-white truncate">
                      {cleanListTitle}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 font-normal">
                      ({total})
                    </span>
                  </div>
                  <SidebarTrigger />
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <SidebarTrigger />
                </div>
              )}
            </SidebarHeader>

            {/* Search filter when expanded */}
            {open && (
              <div className="p-2.5 border-b border-white/5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={problemSearchQuery}
                    onChange={(e) => setProblemSearchQuery(e.target.value)}
                    placeholder="Search problems..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-white/10 bg-black text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>
            )}

            {/* Problem List Content */}
            <SidebarContent className="p-2 gap-1 custom-scrollbar">
              <SidebarGroup>
                {open && (
                  <SidebarGroupLabel className="text-[10px] text-zinc-500 px-2 py-1 font-mono uppercase">
                    Problem Set
                  </SidebarGroupLabel>
                )}
                <SidebarMenu>
                  {filteredProblems.map((p, idx) => {
                    const isActive = p.slug === problem.slug;
                    const diffColor =
                      p.difficulty === "Easy"
                        ? "text-emerald-400"
                        : p.difficulty === "Medium"
                          ? "text-amber-400"
                          : "text-rose-400";

                    return (
                      <SidebarMenuItem key={p.id}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={`${idx + 1}. ${p.title} (${p.difficulty})`}
                          onClick={() =>
                            router.push(`/practice/dsa/${p.slug}?list=${listParam}`)
                          }
                          className={cn(
                            "transition-all",
                            isActive
                              ? "bg-red-500/10 text-white border-red-500/40"
                              : "text-zinc-400 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                p.difficulty === "Easy"
                                  ? "bg-emerald-400"
                                  : p.difficulty === "Medium"
                                    ? "bg-amber-400"
                                    : "bg-rose-400"
                              )}
                            />
                            <span
                              className={cn(
                                "text-xs font-mono shrink-0 min-w-4 text-left",
                                isActive ? "text-[#FF1018] font-bold" : "text-zinc-500 font-medium"
                              )}
                            >
                              {idx + 1}
                            </span>
                          </div>
                          {open && (
                            <div className="flex items-center justify-between flex-1 min-w-0 gap-2">
                              <span className="truncate text-xs font-medium">
                                {p.title}
                              </span>
                              <span
                                className={cn(
                                  "text-[10px] font-semibold shrink-0",
                                  diffColor
                                )}
                              >
                                {p.difficulty}
                              </span>
                            </div>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>

            {/* Sidebar Footer with Actions */}
            <SidebarFooter className="border-t border-white/10 p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Random Problem"
                    onClick={handleRandomProblem}
                    className="text-zinc-400 hover:text-white hover:bg-white/5"
                  >
                    <Shuffle className="w-4 h-4 shrink-0 text-zinc-400" />
                    {open && (
                      <span className="truncate text-xs">Random Problem</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Practice Tracks"
                    onClick={() => router.push("/practice")}
                    className="text-zinc-400 hover:text-white hover:bg-white/5"
                  >
                    <LayoutGrid className="w-4 h-4 shrink-0 text-zinc-400" />
                    {open && (
                      <span className="truncate text-xs">Practice Tracks</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          {/* Main Resizable Workspace Area */}
          <div className="flex-1 h-full overflow-hidden relative bg-black">
            <Group orientation="horizontal" className="h-full w-full">
              {/* LEFT PANEL: Problem Details & Tabs */}
              <Panel
                defaultSize={48}
                minSize={25}
                className="flex flex-col bg-black border-r border-white/10"
              >
                {/* Left Header Tabs */}
                <div className="flex items-center border-b border-white/10 bg-[#08080a] px-2 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setLeftTab("problem")}
                    className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-all ${
                      leftTab === "problem"
                        ? "border-[#FF1018] text-white font-semibold bg-white/[0.02]"
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <FileText
                      className={`w-3.5 h-3.5 ${leftTab === "problem" ? "text-[#FF1018]" : "text-zinc-400"}`}
                    />
                    <span>Problem</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeftTab("solution")}
                    className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-all ${
                      leftTab === "solution"
                        ? "border-[#FF1018] text-white font-semibold bg-white/[0.02]"
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Solution</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeftTab("submissions")}
                    className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-all ${
                      leftTab === "submissions"
                        ? "border-[#FF1018] text-white font-semibold bg-white/[0.02]"
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <History className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Submissions</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeftTab("notes")}
                    className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-all ${
                      leftTab === "notes"
                        ? "border-[#FF1018] text-white font-semibold bg-white/[0.02]"
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <FileEdit className="w-3.5 h-3.5 text-purple-400" />
                    <span>Notes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeftTab("discussion")}
                    className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-all ${
                      leftTab === "discussion"
                        ? "border-[#FF1018] text-white font-semibold bg-white/[0.02]"
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>Discussion</span>
                  </button>
                </div>

                {/* Left Tab Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar text-sm space-y-5 bg-black">
                  {leftTab === "problem" && (
                    <>
                      {/* Title & Share */}
                      <div className="flex items-center justify-between">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                          <span>{problem.title}</span>
                          <SimpleTooltip content="Copy problem link">
                            <button
                              type="button"
                              onClick={handleShareLink}
                              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              {copiedLink ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Share2 className="w-4 h-4" />
                              )}
                            </button>
                          </SimpleTooltip>
                        </h1>
                      </div>

                      {/* Badges: Difficulty, Topics, Companies */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            problem.difficulty === "Easy"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : problem.difficulty === "Medium"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {problem.difficulty}
                        </span>

                        <button
                          type="button"
                          onClick={() => setShowTopics(!showTopics)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                            showTopics
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          <span>Topics</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowCompanies(!showCompanies)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                            showCompanies
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Lock className="w-3 h-3" />
                          <span>Companies</span>
                        </button>
                      </div>

                      {/* Expanded Topics pills */}
                      {showTopics && (
                        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#08080a] border border-white/10">
                          {problem.topics.map((t) => (
                            <span
                              key={t}
                              className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 font-mono"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Expanded Companies pills */}
                      {showCompanies && (
                        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#08080a] border border-white/10">
                          {problem.companies.map((c) => (
                            <span
                              key={c}
                              className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 font-mono"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Problem Description */}
                      <div className="space-y-3 leading-relaxed text-zinc-300 text-sm">
                        <p>{problem.description}</p>
                        {problem.note && (
                          <div className="p-3.5 rounded-xl bg-white/[0.02] border-l-2 border-[#FF1018] border-white/10 text-zinc-300">
                            <strong className="text-white">Note: </strong>
                            {problem.note}
                          </div>
                        )}
                      </div>

                      {/* Examples Section */}
                      <div className="space-y-4 pt-2">
                        {problem.examples.map((ex) => {
                          const isCollapsed = collapsedExamples[ex.id];

                          return (
                            <div key={ex.id} className="space-y-2">
                              <h3 className="font-bold text-sm text-white">
                                Example {ex.id}:
                              </h3>

                              <div className="rounded-xl border border-white/10 bg-[#08080a] p-4 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-mono text-zinc-400">
                                    <strong className="text-white font-sans">
                                      Input:{" "}
                                    </strong>
                                    <span className="text-zinc-200">
                                      {ex.input}
                                    </span>
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <SimpleTooltip content="Copy input">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          copyToClipboard(ex.input, ex.id)
                                        }
                                        className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                                      >
                                        {copiedInputId === ex.id ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </SimpleTooltip>
                                    <button
                                      type="button"
                                      onClick={() => toggleExample(ex.id)}
                                      className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                                    >
                                      {isCollapsed ? (
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      ) : (
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Array Visualizer Box */}
                                {!isCollapsed && ex.visualizerArray && (
                                  <div className="py-2 overflow-x-auto">
                                    <div className="flex items-center gap-2 min-w-max">
                                      {ex.visualizerArray.map((cell) => (
                                        <div
                                          key={cell.index}
                                          className="flex flex-col items-center gap-1"
                                        >
                                          <span className="text-[11px] font-mono text-zinc-500">
                                            {cell.index}
                                          </span>
                                          <div
                                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-xs sm:text-sm ${
                                              cell.highlight
                                                ? "border-red-500/50 bg-red-500/15 text-red-400 shadow-[0_0_12px_rgba(255,16,24,0.25)]"
                                                : "border-white/10 bg-white/[0.03] text-zinc-200"
                                            }`}
                                          >
                                            {cell.value}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {!isCollapsed && (
                                  <div className="text-xs font-mono text-zinc-400 pt-2 border-t border-white/5">
                                    <strong className="text-white font-sans">
                                      Output:{" "}
                                    </strong>
                                    <span className="text-zinc-200">
                                      {ex.output}
                                    </span>
                                  </div>
                                )}

                                {!isCollapsed && ex.explanation && (
                                  <div className="text-xs text-zinc-400 leading-relaxed pt-1">
                                    <strong className="text-white font-sans">
                                      Explanation:{" "}
                                    </strong>
                                    {ex.explanation}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Constraints */}
                      <div className="pt-2 space-y-2">
                        <h3 className="font-bold text-sm text-white">
                          Constraints:
                        </h3>
                        <ul className="list-disc list-inside space-y-1.5 text-xs font-mono text-zinc-400 pl-1">
                          {problem.constraints.map((c, i) => (
                            <li key={i}>
                              <code className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-zinc-200">
                                {c}
                              </code>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Follow up */}
                      {problem.followUp && (
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-zinc-300">
                          <strong className="text-white font-sans">
                            Follow-up:{" "}
                          </strong>
                          {problem.followUp}
                        </div>
                      )}
                    </>
                  )}

                  {/* Solution Tab */}
                  {leftTab === "solution" && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold text-white">
                        Optimal Approach
                      </h2>
                      <p className="text-zinc-300 leading-relaxed">
                        {problem.solutionExplanation ||
                          "Use a two-pointer algorithm to shift all non-zero numbers to the front while preserving relative order."}
                      </p>

                      <div className="p-4 rounded-xl bg-[#08080a] border border-white/10 space-y-2 text-xs">
                        <div>
                          <strong className="text-white">
                            Time Complexity:
                          </strong>{" "}
                          <span className="text-zinc-300 font-mono">
                            O(N) — Single pass over elements.
                          </span>
                        </div>
                        <div>
                          <strong className="text-white">
                            Space Complexity:
                          </strong>{" "}
                          <span className="text-zinc-300 font-mono">
                            O(1) — Constant extra memory in-place.
                          </span>
                        </div>
                      </div>

                      {problem.solutionCode && (
                        <div className="space-y-2 pt-2">
                          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <LanguageIcon language={selectedLanguage} className="w-4 h-4 shrink-0" />
                            <span>Solution in {selectedLanguage}:</span>
                          </h3>
                          <pre className="p-4 rounded-xl bg-black border border-white/10 overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed custom-scrollbar">
                            {problem.solutionCode[
                              selectedLanguage as keyof typeof problem.solutionCode
                            ] || problem.solutionCode.Java}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submissions Tab */}
                  {leftTab === "submissions" && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold text-white">
                        Submission History
                      </h2>
                      {runResult?.isSubmit ? (
                        <div
                          className="p-4 rounded-xl border border-white/10 bg-[#08080a] space-y-2"
                          role="status"
                        >
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                runResult.status === "Ran locally"
                                  ? "bg-emerald-400"
                                  : "bg-rose-400"
                              }`}
                            />
                            <span>
                              {runResult.status === "Ran locally"
                                ? "Local practice result · unofficial"
                                : "No local result"}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-400">
                            {runResult.message}
                          </p>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-zinc-500 rounded-xl border border-dashed border-white/10">
                          No submissions recorded yet for this session. Click
                          &quot;Submit&quot; to test your code against all test
                          cases!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes Tab */}
                  {leftTab === "notes" && (
                    <div className="space-y-3 h-full flex flex-col">
                      <h2 className="text-sm font-bold text-white">
                        Your Private Notes
                      </h2>
                      <p className="text-xs text-zinc-400" aria-live="polite">
                        {notesSyncState === "loading" && "Loading your saved notes…"}
                        {notesSyncState === "local" && "Saved on this device. Sign in to sync notes across devices."}
                        {notesSyncState === "saving" && "Saving your notes…"}
                        {notesSyncState === "saved" && "Notes saved to your account."}
                        {notesSyncState === "error" && "Could not sync notes. Your draft remains saved on this device; check your connection and reload to retry."}
                      </p>
                      <textarea
                        value={notes}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        placeholder="Write key edge cases, pattern insights, or interview reminders..."
                        className="flex-1 w-full min-h-[250px] p-4 rounded-xl border border-white/10 bg-black font-mono text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 resize-none transition-colors"
                      />
                    </div>
                  )}

                  {/* Discussion Tab */}
                  {leftTab === "discussion" && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold text-white">
                        Community Discussions
                      </h2>
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl border border-white/10 bg-[#08080a] space-y-2">
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="font-semibold text-white">
                              Alex M.
                            </span>
                            <span>2 days ago</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            The two-pointer approach is so elegant here. Keep
                            one slow pointer for where the next non-zero should
                            go!
                          </p>
                        </div>

                        <div className="p-4 rounded-xl border border-white/10 bg-[#08080a] space-y-2">
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="font-semibold text-white">
                              Sarah K.
                            </span>
                            <span>1 week ago</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            Make sure to handle the case where nums only
                            contains zeroes, e.g. [0, 0, 0]!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Panel>

              {/* VERTICAL RESIZE HANDLE */}
              <Separator className="w-1.5 bg-black hover:bg-white/10 cursor-col-resize flex items-center justify-center transition-colors group">
                <div className="h-6 w-1 rounded-full bg-zinc-700 group-hover:bg-[#FF1018] transition-colors" />
              </Separator>

              {/* RIGHT PANEL: Editor (Top) & Test Cases (Bottom) */}
              <Panel
                defaultSize={52}
                minSize={30}
                className="flex flex-col bg-black"
              >
                <Group orientation="vertical" className="h-full w-full">
                  {/* TOP: Monaco Code Editor */}
                  <Panel
                    defaultSize={62}
                    minSize={25}
                    className="flex flex-col border-b border-white/10 bg-black"
                  >
                    {/* Editor Toolbar */}
                    <div className="h-10 border-b border-white/10 bg-[#08080a] px-3 flex items-center justify-between flex-shrink-0 text-xs select-none">
                      <div className="flex items-center gap-2">
                        {/* Language Selector */}
                        <div className="w-[148px] shrink-0">
                          <Select
                            value={selectedLanguage}
                            onValueChange={setSelectedLanguage}
                            options={[
                              {
                                value: "Java",
                                label: "Java",
                                icon: <LanguageIcon language="Java" className="w-4 h-4 shrink-0" />,
                              },
                              {
                                value: "Python",
                                label: "Python",
                                icon: <LanguageIcon language="Python" className="w-4 h-4 shrink-0" />,
                              },
                              {
                                value: "C++",
                                label: "C++",
                                icon: <LanguageIcon language="C++" className="w-4 h-4 shrink-0" />,
                              },
                              {
                                value: "JavaScript",
                                label: "JavaScript",
                                icon: <LanguageIcon language="JavaScript" className="w-4 h-4 shrink-0" />,
                              },
                              {
                                value: "TypeScript",
                                label: "TypeScript",
                                icon: <LanguageIcon language="TypeScript" className="w-4 h-4 shrink-0" />,
                              },
                            ]}
                            size="sm"
                            className="h-7 text-xs font-semibold rounded-md bg-white/5 border-white/10 text-white hover:bg-white/10"
                          />
                        </div>

                        {/* Solution Tabs */}
                        <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                          {solutionTabs.map((tab, idx) => (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setActiveSolutionTab(idx)}
                              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                                activeSolutionTab === idx
                                  ? "bg-white/10 text-white font-semibold border border-white/10"
                                  : "text-zinc-400 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                          <SimpleTooltip content="Add solution tab">
                            <button
                              type="button"
                              onClick={handleAddSolutionTab}
                              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </SimpleTooltip>
                        </div>
                      </div>

                      {/* Right Action Icons */}
                      <div className="flex items-center gap-1 text-zinc-400">
                        <SimpleTooltip content="Reset to starter code">
                          <button
                            type="button"
                            onClick={handleResetCode}
                            className="p-1.5 rounded-md hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </SimpleTooltip>
                        <SimpleTooltip content="Editor settings">
                          <button
                            type="button"
                            className="p-1.5 rounded-md hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        </SimpleTooltip>
                        <SimpleTooltip content="Menu">
                          <button
                            type="button"
                            className="p-1.5 rounded-md hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <MenuIcon className="w-3.5 h-3.5" />
                          </button>
                        </SimpleTooltip>
                      </div>
                    </div>

                    {/* Monaco Editor Container */}
                    <div className="flex-1 w-full h-full overflow-hidden bg-black">
                      <MonacoCodeEditor
                        language={selectedLanguage}
                        value={code}
                        onChange={(val) => handleCodeChange(val || "")}
                      />
                    </div>
                  </Panel>

                  {/* HORIZONTAL RESIZE HANDLE */}
                  <Separator className="h-1.5 bg-black hover:bg-white/10 cursor-row-resize flex items-center justify-center transition-colors group">
                    <div className="w-6 h-1 rounded-full bg-zinc-700 group-hover:bg-[#FF1018] transition-colors" />
                  </Separator>

                  {/* BOTTOM: Test Cases & Execution Panel */}
                  <Panel
                    defaultSize={38}
                    minSize={20}
                    className="flex flex-col bg-black"
                  >
                    {/* Bottom Header Bar: Tabs left, Action buttons right */}
                    <div className="h-11 border-b border-white/10 bg-[#08080a] px-3 flex items-center justify-between flex-shrink-0 text-xs">
                      {/* Left Tabs */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setBottomTab("testcases")}
                          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all ${
                            bottomTab === "testcases"
                              ? "border-[#FF1018] text-white font-semibold"
                              : "border-transparent text-zinc-400 hover:text-white"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Test Cases</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBottomTab("output")}
                          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all ${
                            bottomTab === "output"
                              ? "border-[#FF1018] text-white font-semibold"
                              : "border-transparent text-zinc-400 hover:text-white"
                          }`}
                        >
                          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Output</span>
                        </button>

                      </div>

                      {/* Right Buttons: Evaluate, Run, Submit */}
                      <div className="flex items-center gap-2">
                        <span className="hidden lg:inline text-[10px] text-zinc-500" role="status" aria-live="polite">
                          {runtimeSessionActive && runtimeConnectionState === "connected"
                            ? "Runtime connected to this tab"
                            : runtimeConnectionState === "starting"
                              ? "Starting Mindflare Launcher…"
                              : runtimeConnectionState === "pairing"
                                ? pendingLauncherChallenge
                                  ? "Launcher handoff ready; click to open it…"
                                  : "Preparing launcher handoff…"
                                : runtimeConnectionState === "executing"
                                  ? "Executing locally…"
                                  : runtimeConnectionState === "error"
                                    ? "Launcher connection failed"
                                    : runtimeAvailable
                                      ? "Runtime ready; connect this tab"
                                      : "Runtime unavailable"}
                        </span>
                        {!runtimeSessionActive && (
                          <button
                            type="button"
                            onClick={handleConnectRuntime}
                            disabled={isConnectingRuntime || isRunning || isSubmitting}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 transition-colors disabled:opacity-50"
                          >
                            <span>{isConnectingRuntime ? "Connecting…" : pendingLauncherChallenge ? "Open Mindflare Launcher" : "Connect Mindflare"}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleRunCode}
                          disabled={isRunning || isSubmitting}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 shadow-xs transition-all active:scale-95 disabled:opacity-50"
                        >
                          <Play className="w-3 h-3 fill-current text-emerald-400" />
                          <span>{isRunning ? "Running..." : "Run"}</span>
                        </button>

                        {activeRun && !isSubmitting && (
                          <button
                            type="button"
                            onClick={handleCancelRun}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                          >
                            <X className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleSubmitCode}
                          disabled={isSubmitting || isRunning}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#FF1018] hover:bg-[#e00e15] text-white shadow-lg shadow-red-500/25 transition-all active:scale-95 disabled:opacity-50"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Body */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black">
                      {bottomTab === "testcases" && (
                        <div className="space-y-3">
                          {testCasesLoading && (
                            <p className="text-xs text-zinc-500" role="status">
                              Loading public practice tests…
                            </p>
                          )}
                          {testCasesError && (
                            <p className="text-xs text-rose-300" role="alert">
                              {testCasesError}
                            </p>
                          )}
                          {!testCasesLoading && !testCasesError && testCases.length === 0 && (
                            <p className="text-xs text-zinc-500">
                              No local practice test bundle is available.
                            </p>
                          )}
                          {/* Case Pills */}
                          <div className="flex flex-wrap items-center gap-2">
                            {testCases.map((tc, idx) => (
                              <button
                                key={tc.id}
                                type="button"
                                onClick={() => {
                                  setSelectedCaseIndex(idx);
                                  setCustomInput(JSON.stringify(tc.rawInput));
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  selectedCaseIndex === idx
                                    ? "bg-white/10 text-white border border-white/20 font-semibold shadow-xs"
                                    : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/5"
                                }`}
                              >
                                {tc.name}
                              </button>
                            ))}
                          </div>

                          {/* Input Box */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">
                                  INPUT
                                </span>
                                <button
                                  type="button"
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[11px] text-zinc-300 hover:text-white transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Visualize</span>
                                </button>
                              </div>
                              <span>JSON function arguments</span>
                            </div>

                            <textarea
                              value={customInput}
                              onChange={(e) => setCustomInput(e.target.value)}
                              className="w-full h-18 p-3 rounded-xl border border-white/10 bg-[#08080a] font-mono text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 resize-none transition-colors"
                            />
                          </div>
                        </div>
                      )}

                      {bottomTab === "output" && (
                        <div className="space-y-3 font-mono text-xs">
                          {runResult ? (
                            <div
                              className="space-y-3"
                              role="status"
                              aria-live="polite"
                            >
                              <span
                                className={`px-2.5 py-1 rounded-md font-bold text-xs border ${
                                  runResult.status === "Ran locally"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                }`}
                              >
                                {runResult.status.toUpperCase()}
                              </span>
                              <p className="text-sm text-zinc-300">
                                {runResult.message}
                              </p>
                              {runResult.stdout !== undefined && (
                                <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-[#08080a] p-3 text-xs text-zinc-200">
                                  {runResult.stdout || "(no stdout)"}
                                </pre>
                              )}
                              {runResult.stderr && (
                                <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-300">
                                  {runResult.stderr}
                                </pre>
                              )}
                            </div>
                          ) : (
                            <div className="py-8 text-center text-zinc-500 rounded-xl border border-dashed border-white/10">
                              Run or Submit code to see execution output and
                              diagnostics.
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </Panel>
                </Group>
              </Panel>
            </Group>
          </div>
        </div>

      </div>
    </TooltipProvider>
  );
}
