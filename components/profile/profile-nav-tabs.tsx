"use client";

import React from "react";
import {
  Code,
  Trophy,
  CircuitBoard,
  BookOpen,
  Award,
} from "@/components/animate-ui/icons";
import { RubberSegment, RubberSegmentItem } from "@/components/RubberSegment";

export type ProfileTabKey =
  | "problemSolving"
  | "contests"
  | "development"
  | "badgesCard"
  | "about";

interface ProfileNavTabsProps {
  activeTab: ProfileTabKey;
  onSelectTab: (tab: ProfileTabKey) => void;
  solvedCount?: number;
  contestsCount?: number;
  contributionsCount?: number;
  badgesCount?: number;
}

export function ProfileNavTabs({
  activeTab,
  onSelectTab,
}: ProfileNavTabsProps) {
  const items: RubberSegmentItem[] = [
    {
      value: "problemSolving",
      icon: <Code className="w-4 h-4 shrink-0" />,
      label: <span className="sr-only md:not-sr-only">Problem Solving</span>,
    },
    {
      value: "contests",
      icon: <Trophy className="w-4 h-4 shrink-0" />,
      label: <span className="sr-only md:not-sr-only">Contest Ratings</span>,
    },
    {
      value: "development",
      icon: <CircuitBoard className="w-4 h-4 shrink-0" />,
      label: <span className="sr-only md:not-sr-only">Development</span>,
    },
    {
      value: "badgesCard",
      icon: <Award className="w-4 h-4 shrink-0" />,
      label: <span className="sr-only md:not-sr-only">Badges &amp; Card</span>,
    },
    {
      value: "about",
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
      label: <span className="sr-only md:not-sr-only">Journey &amp; Projects</span>,
    },
  ];

  return (
    <div className="w-full border border-white/10 bg-black p-1.5 rounded-full mb-4 shadow-2xl overflow-x-auto no-scrollbar">
      <RubberSegment
        items={items}
        value={activeTab}
        onChange={(val) => onSelectTab(val as ProfileTabKey)}
        trackColor="#000000"
        thumbColor="#ff1018"
        textColor="#a1a1aa"
        activeTextColor="#000000"
        size="md"
        radius={9999}
        inset={3}
        equalSlots={false}
        className="profile-rubber-nav min-w-0 w-full"
        aria-label="Profile navigation sections"
      />
    </div>
  );
}
