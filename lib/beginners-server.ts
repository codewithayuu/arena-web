import "server-only";
import { cache } from "react";
import fs from "fs";
import path from "path";
import {
  TrackMeta,
  ChapterData,
  POTDProblem,
  SystemDesignQuestion,
  AIConcept,
  CompanyMeta,
} from "./beginners-data";

const DATA_DIR = path.join(process.cwd(), "data", "beginners");

function readJsonFile<T>(relPath: string): T | null {
  try {
    const fullPath = path.join(DATA_DIR, relPath);
    if (!fs.existsSync(fullPath)) return null;
    const raw = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to read beginners data: ${relPath}`, err);
    return null;
  }
}

export const getBeginnersStats = cache((): Record<string, number> => {
  return readJsonFile<Record<string, number>>("stats/stats.json") ?? {
    tracks: 4,
    chapters: 41,
    lectures: 1820,
    hours: 739,
    potd: 1124,
  };
});

export const getTracksOverview = cache((): TrackMeta[] => {
  const tracks = readJsonFile<TrackMeta[]>("tracks/tracks_overview.json") ?? [];
  return tracks.filter((t) => t.slug !== "other" && t.chapterCount > 0);
});

export const getChapterData = cache((trackSlug: string, chapterSlug: string): ChapterData | null => {
  return readJsonFile<ChapterData>(`tracks/${trackSlug}/chapters/${chapterSlug}.json`);
});

export const getAllPOTDProblems = cache((): { totalCount: number; problems: POTDProblem[] } => {
  return (
    readJsonFile<{ totalCount: number; problems: POTDProblem[] }>(
      "potd/potd_all_problems.json"
    ) ?? { totalCount: 0, problems: [] }
  );
});

export const getSystemDesignQuestions = cache((): SystemDesignQuestion[] => {
  const data = readJsonFile<{ questions: SystemDesignQuestion[] }>(
    "system_design/questions_overview.json"
  );
  return data?.questions ?? [];
});

export const getSystemDesignDetail = cache((slug: string): SystemDesignQuestion | null => {
  return readJsonFile<SystemDesignQuestion>(`system_design/questions/${slug}.json`);
});

export const getAIConcepts = cache((): AIConcept[] => {
  const data = readJsonFile<{ concepts: AIConcept[] }>("system_design/ai_concepts.json");
  return data?.concepts ?? [];
});

export const getCompaniesOverview = cache((): CompanyMeta[] => {
  const data = readJsonFile<{ companies: CompanyMeta[] }>("companies/companies_overview.json");
  return data?.companies ?? [];
});

export const getCompanySheet = cache((slug: string): any | null => {
  return readJsonFile<any>(`companies/sheets/${slug}.json`);
});
