"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { GraduationCap, UserRound } from "lucide-react";
import Link from "next/link";
import { StudentDetailsSettings } from "@/components/account/student-details-settings";

interface AccountMenuProps {
  size?: "desktop" | "mobile";
  variant?: "circle" | "pill";
}

export function AccountMenu({ size = "desktop", variant = "circle" }: AccountMenuProps) {
  const { isLoaded, isSignedIn } = useUser();
  const triggerSize = size === "mobile" ? "h-10 w-10" : "h-11 w-11";
  const circleTriggerClassName = `grid ${triggerSize} shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-black/90 text-zinc-100 shadow-lg shadow-black/30 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e83040] disabled:cursor-wait disabled:opacity-70`;

  if (!isLoaded || !isSignedIn) {
    if (variant === "pill") {
      return (
        <Link
          href="/sign-in"
          className="glass-pill h-10 relative inline-flex items-center gap-2.5 pl-1.5 pr-4 rounded-full text-xs sm:text-sm font-medium text-zinc-200 hover:text-white transition-all hover:border-white/25 active:scale-[0.98] group"
        >
          <span className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10 text-white shrink-0 group-hover:bg-white/15 transition-colors">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
              <path d="M2.5 14c0-3 2.5-4.6 5.5-4.6s5.5 1.6 5.5 4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="tracking-tight font-medium">Sign in</span>
        </Link>
      );
    }
    return (
      <Link href="/sign-in" aria-label="Sign in" className={circleTriggerClassName}>
        <UserRound className="h-4 w-4" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <UserButton
      showName={variant === "pill"}
      appearance={{
        elements: {
          userButtonTrigger: variant === "pill"
            ? "glass-pill h-10 relative inline-flex items-center gap-2.5 pl-1.5 pr-4 rounded-full text-xs sm:text-sm font-medium text-zinc-200 hover:text-white transition-all hover:border-white/25 active:scale-[0.98]"
            : circleTriggerClassName,
          userButtonAvatarBox: variant === "pill" ? "h-7 w-7 rounded-full" : `${triggerSize} rounded-full`,
          userButtonOuterIdentifier: "tracking-tight font-medium truncate max-w-[120px]",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link label="Profile" labelIcon={<UserRound aria-hidden="true" />} href="/profile" />
        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
      <UserButton.UserProfilePage
        label="Student details"
        url="student-details"
        labelIcon={<GraduationCap aria-hidden="true" />}
      >
        <StudentDetailsSettings />
      </UserButton.UserProfilePage>
    </UserButton>
  );
}
