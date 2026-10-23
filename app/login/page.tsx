import { Metadata } from "next";
import ModernLoginSignup from "@/components/ui/modern-login-signup";

export const metadata: Metadata = {
  title: "Sign In / Sign Up | Mindflare",
  description: "Sign in or create an account on Mindflare Arena",
};

export default function LoginPage() {
  return <ModernLoginSignup brandName="Mindflare Arena" />;
}
