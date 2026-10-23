import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ModernLoginSignup from "@/components/ui/modern-login-signup";
import { safePostAuthUrl } from "@/lib/auth-redirect";

export const metadata: Metadata = {
  title: "Sign In | Mindflare Arena",
  description: "Sign in to your Mindflare Arena account",
};

type AuthPageProps = {
  searchParams: Promise<{
    redirect_url?: string | string[];
    redirectUrl?: string | string[];
    next?: string | string[];
  }>;
};

export default async function SignInPage({ searchParams }: AuthPageProps) {
  const { userId } = await auth();
  if (userId) {
    const params = await searchParams;
    const requested = params.redirect_url ?? params.redirectUrl ?? params.next;
    redirect(safePostAuthUrl(typeof requested === "string" ? requested : undefined, "https://mindflare.invalid"));
  }

  return <ModernLoginSignup initialMode="login" brandName="Mindflare Arena" />;
}
