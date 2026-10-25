import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Suspense, type ReactNode } from "react";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./styles.css";
import { TooltipProvider } from "@/components/animate-ui/tooltip";
import { AccountSyncStatus } from "@/components/topic-list/account-sync-status";
import { UserPresenceAvatar } from "@/components/animate-ui/components/community/user-presence-avatar";
import { NavigationProgressIndicator } from "@/components/ui/navigation-progress-indicator";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Mindflare - DSA & CP Society",
  description: "Where Algorithms Spark Intuition.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: "#e83040",
          colorBackground: "#000000",
          colorInput: "#0a0a0c",
          colorInputForeground: "#f4f3fc",
        },
      }}
    >
      <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
        <head>
          <link rel="icon" href="/images/logo.ico" />
          <link rel="preconnect" href="https://safe-sculpin-2713.clerk.accounts.dev" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://safe-sculpin-2713.clerk.accounts.dev" />
        </head>
        <body className={`${fontSans.variable} ${fontMono.variable} font-sans relative min-h-screen bg-[#08080a] text-foreground antialiased selection:bg-[#e83040]/30 selection:text-red-300`}>
          {/* Dynamic Frosted Glass Atmosphere strictly in BG across the app */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden transform-gpu will-change-transform"
            style={{ contain: "paint" }}
          >
            {/* Luminous ambient glass lighting orbs rendered via zero-overhead mathematical radial gradients */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 650px 320px at 50% -40px, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.07) 35%, rgba(255, 255, 255, 0.015) 65%, transparent 100%),
                  radial-gradient(circle 420px at 0% 25%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 75%),
                  radial-gradient(circle 480px at 100% 42%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.018) 45%, transparent 75%),
                  radial-gradient(ellipse 460px 280px at 30% 90%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.015) 50%, transparent 80%)
                `,
              }}
            />

            {/* Ambient Optical Frosted Glass Gaussian Diffusion Layer (Zero-GPU Mathematical Falloff) */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(
                  ellipse 85% 60% at 50% 15%,
                  rgba(8, 8, 10, 0.08) 0%,
                  rgba(8, 8, 10, 0.22) 35%,
                  rgba(8, 8, 10, 0.55) 70%,
                  rgba(8, 8, 10, 0.88) 100%
                )`,
              }}
            />

            {/* Subtle glass vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/55" />
          </div>

          {/* Tactile Fine Monochrome Glass Grain (Fast-path GPU composited) */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 opacity-[0.028] transform-gpu will-change-transform"
            style={{
              contain: "paint",
              transform: "translateZ(0)",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Page Content above BG */}
          <div className="relative z-10 flex min-h-screen flex-col">
            <Suspense fallback={null}>
              <NavigationProgressIndicator />
            </Suspense>
            <AccountSyncStatus />
            <UserPresenceAvatar />
            <TooltipProvider delayDuration={400} disableHoverableContent>
              {children}
            </TooltipProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
