import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");

  if (!handle || typeof handle !== "string" || !handle.trim()) {
    return NextResponse.json(
      { success: false, error: "Handle is required" },
      { status: 400 }
    );
  }

  const cleanHandle = handle.trim();

  try {
    const res = await fetch(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(cleanHandle)}`,
      {
        headers: {
          "User-Agent": "Mindflare-Arena/1.0",
        },
        next: { revalidate: 300 }, // cache 5 mins
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Codeforces API returned status ${res.status}`,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (data.status !== "OK" || !Array.isArray(data.result) || data.result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: data.comment || "User not found on Codeforces",
        },
        { status: 404 }
      );
    }

    const user = data.result[0];
    const rating = typeof user.rating === "number" ? user.rating : 0;
    const maxRating = typeof user.maxRating === "number" ? user.maxRating : rating;
    const rank = user.rank || "unrated";
    const maxRank = user.maxRank || rank;

    let avatar = user.avatar || user.titlePhoto || "";
    if (avatar && avatar.startsWith("//")) {
      avatar = `https:${avatar}`;
    }

    return NextResponse.json({
      success: true,
      data: {
        handle: user.handle,
        rating,
        maxRating,
        rank,
        maxRank,
        avatar,
        lastOnlineTimeSeconds: user.lastOnlineTimeSeconds,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to contact Codeforces",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const handle = body?.handle;
    if (!handle) {
      return NextResponse.json(
        { success: false, error: "Handle is required" },
        { status: 400 }
      );
    }
    const url = new URL(req.url);
    url.searchParams.set("handle", handle);
    return GET(new NextRequest(url.toString(), { headers: req.headers }));
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
