import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { ProfileView } from "@/components/profile/profile-view";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default async function DefaultProfilePage() {
  let user: Awaited<ReturnType<typeof currentUser>> = null;
  try {
    user = await currentUser();
  } catch {
    // Clerk errors should not redirect visitors to another member's profile.
  }

  if (!user?.id) redirect("/sign-in?redirect_url=%2Fprofile");

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 sm:pt-28 pb-16">
        <ProfileView initialUsername={user.id} />
      </div>
      <Footer />
    </div>
  );
}
