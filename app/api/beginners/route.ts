import { NextRequest, NextResponse } from "next/server";
import {
  getChapterData,
  getSystemDesignDetail,
  getCompanySheet,
  getAllPOTDProblems,
} from "@/lib/beginners-server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "chapter") {
    const track = searchParams.get("track") || "dsa";
    const chapter = searchParams.get("chapter");
    if (!chapter) {
      return NextResponse.json({ error: "Chapter slug required" }, { status: 400 });
    }
    const data = getChapterData(track, chapter);
    if (!data) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  if (type === "sd-detail") {
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Question slug required" }, { status: 400 });
    }
    const data = getSystemDesignDetail(slug);
    if (!data) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  if (type === "company-sheet") {
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Company slug required" }, { status: 400 });
    }
    const data = getCompanySheet(slug);
    if (!data) {
      return NextResponse.json({ error: "Company sheet not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  if (type === "potd") {
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const query = (searchParams.get("q") || "").toLowerCase().trim();
    const { totalCount, problems } = getAllPOTDProblems();
    
    let filtered = problems;
    if (query) {
      filtered = problems.filter(
        (p) =>
          p.problemName.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          String(p.problemNumber).includes(query) ||
          p.topicTags.some((t) => t.toLowerCase().includes(query))
      );
    }
    const paged = filtered.slice(offset, offset + limit);
    return NextResponse.json({
      totalCount: filtered.length,
      problems: paged,
      hasMore: offset + limit < filtered.length,
    });
  }

  return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
}
