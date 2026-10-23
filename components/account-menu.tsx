"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { LogIn, LogOut, Settings2, UserRound, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DropdownMenu, {
  type DropdownMenuItemConfig,
} from "@/components/smoothui/dropdown-menu";

interface AccountMenuProps {
  size?: "desktop" | "mobile";
  variant?: "circle" | "pill";
}

export function AccountMenu({ size = "desktop", variant = "circle" }: AccountMenuProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const router = useRouter();
  const displayName = user?.fullName || user?.username || "Account";
  const triggerSize = size === "mobile" ? "h-10 w-10" : "h-11 w-11";
  const circleTriggerClassName = `grid ${triggerSize} shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-black/90 text-zinc-100 shadow-lg shadow-black/30 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e83040] disabled:cursor-wait disabled:opacity-70`;

  if (!isLoaded) {
    if (variant === "pill") {
      return (
        <div className="glass-pill h-10 flex items-center gap-2 pl-1.5 pr-4 rounded-full text-xs font-medium text-zinc-400 opacity-60">
          <span className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
            <UserRound className="h-3.5 w-3.5" />
          </span>
          <span>Loading...</span>
        </div>
      );
    }
    return (
      <button
        type="button"
        aria-label="Loading account menu"
        aria-busy="true"
        disabled
        className={circleTriggerClassName}
      >
        <UserRound className="h-4 w-4" aria-hidden="true" />
      </button>
    );
  }

  const accountItems: DropdownMenuItemConfig[] = isSignedIn
    ? [
        {
          key: "profile",
          label: "Profile",
          icon: <UserRound aria-hidden="true" />,
          onSelect: () => router.push("/profile"),
        },
        {
          key: "account-settings",
          label: "Account settings",
          icon: <Settings2 aria-hidden="true" />,
          onSelect: () => openUserProfile(),
        },
        { key: "account-separator", label: "", separator: true },
        {
          key: "sign-out",
          label: "Log out",
          icon: <LogOut aria-hidden="true" />,
          variant: "destructive",
          onSelect: () => {
            void signOut({ redirectUrl: "/" });
          },
        },
      ]
    : [
        {
          key: "sign-in",
          label: "Log in",
          icon: <LogIn aria-hidden="true" />,
          onSelect: () => router.push("/sign-in"),
        },
        {
          key: "sign-up",
          label: "Sign up",
          icon: <UserPlus aria-hidden="true" />,
          onSelect: () => router.push("/sign-up"),
        },
      ];

  // Exact GetLayers Sign-in Pill Variant
  if (variant === "pill") {
    if (!isSignedIn) {
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
      <DropdownMenu
        align="end"
        className="min-w-48 rounded-2xl border-white/10 bg-[#0c0c0f]/95 p-1.5 text-zinc-100 shadow-2xl shadow-black/80 backdrop-blur-2xl"
        items={accountItems}
        sideOffset={8}
      >
        <button
          type="button"
          aria-label={`Open account menu for ${displayName}`}
          className="glass-pill h-10 relative inline-flex items-center gap-2.5 pl-1.5 pr-4 rounded-full text-xs sm:text-sm font-medium text-zinc-200 hover:text-white transition-all hover:border-white/25 active:scale-[0.98]"
        >
          <span className="h-7 w-7 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/10 text-white shrink-0">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
                decoding="async"
              />
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
                <path d="M2.5 14c0-3 2.5-4.6 5.5-4.6s5.5 1.6 5.5 4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            )}
          </span>
          <span className="tracking-tight font-medium truncate max-w-[120px]">{displayName}</span>
        </button>
      </DropdownMenu>
    );
  }

  // Fallback / standard circular trigger
  return (
    <DropdownMenu
      align="end"
      className="min-w-48 rounded-xl border-white/10 bg-[#0c0c0f] p-1.5 text-zinc-100 shadow-2xl shadow-black/50 backdrop-blur-2xl"
      items={accountItems}
      sideOffset={8}
    >
      <button
        type="button"
        aria-label={
          isSignedIn ? `Open account menu for ${displayName}` : "Open account menu"
        }
        title={isSignedIn ? displayName : "Account"}
        className={circleTriggerClassName}
      >
        {isSignedIn && user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            decoding="async"
          />
        ) : (
          <UserRound className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </DropdownMenu>
  );
}
