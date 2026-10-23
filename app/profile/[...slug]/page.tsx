import { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProfileTabKey } from "@/components/profile/profile-nav-tabs";

interface ProfilePageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const username = decodeURIComponent(slug?.[0] || "unknown");
  const rawTab = slug?.[1] || "problemSolving";

  const tabLabels: Record<string, string> = {
    problemSolving: "Problem Solving",
    contests: "Contest Ratings",
    development: "Development",
    badgesCard: "Badges & Scorecard",
    about: "About",
  };

  const label = tabLabels[rawTab] || "Profile";

  return {
    title: `${username} — ${label} | Mindflare Arena`,
    description: `Competitive programming portfolio, contest ratings, and judge scorecards of @${username} on Mindflare Arena.`,
  };
}

export default async function DynamicProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const username = decodeURIComponent(slug?.[0] || "unknown");
  const rawTab = slug?.[1] || "problemSolving";

  // Normalize tab key
  let initialTab: ProfileTabKey = "problemSolving";
  const lower = rawTab.toLowerCase();
  if (lower === "contests" || lower === "contestratings") {
    initialTab = "contests";
  } else if (lower === "development" || lower === "devstats") {
    initialTab = "development";
  } else if (lower === "badges" || lower === "badgescard" || lower === "scorecard") {
    initialTab = "badgesCard";
  } else if (lower === "about" || lower === "journey") {
    initialTab = "about";
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 sm:pt-28 pb-16">
        <ProfileView initialUsername={username} initialTab={initialTab} />
      </div>
      <Footer />
    </div>
  );
}
