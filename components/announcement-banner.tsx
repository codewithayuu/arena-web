"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock2, X } from "lucide-react";

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-primary relative hidden md:block">
      <Link
        href="https://mindflare.tech"
        className="block hover:bg-primary/90 transition-all duration-300"
      >
        <div className="container flex items-center justify-center py-1 text-sm font-medium text-primary-foreground pr-8">
          <Clock2 className="h-4 w-4 mr-2 animate-pulse" />
          <span>
            <strong>Limited Time Offer:</strong> Get upto 40% off on Mindflare
            Premium.
          </span>
          <span className="ml-2 underline-offset-2 hover:underline">
            Check it out →
          </span>
        </div>
      </Link>
      <button
        type="button"
        aria-label="Dismiss banner"
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
