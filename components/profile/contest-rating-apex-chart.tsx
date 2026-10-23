"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { ContestHistoryItem } from "@/lib/profile-data";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] rounded-xl bg-[#0d0d12] border border-white/5 animate-pulse flex items-center justify-center text-xs font-mono text-zinc-500">
      Loading contest chart...
    </div>
  ),
});

interface ContestRatingApexChartProps {
  contests: ContestHistoryItem[];
  selectedPlatform?: string;
  height?: number;
  showAnnotations?: boolean;
}

export function ContestRatingApexChart({
  contests,
  selectedPlatform = "all",
  height = 300,
  showAnnotations = true,
}: ContestRatingApexChartProps) {
  const filtered = useMemo(() => {
    const list = selectedPlatform === "all"
      ? contests
      : contests.filter((c) => c.platform.toLowerCase() === selectedPlatform.toLowerCase());
    return [...list].sort((a, b) => a.contestDate - b.contestDate);
  }, [contests, selectedPlatform]);

  // Compute peak rating point for annotation
  const peakContest = useMemo(() => {
    if (filtered.length === 0) return null;
    return filtered.reduce((max, c) => (c.rating > max.rating ? c : max), filtered[0]);
  }, [filtered]);

  const series = useMemo(() => {
    return [
      {
        name: "Contest Rating",
        data: filtered.map((c) => ({
          x: c.contestName,
          y: c.rating,
          meta: c,
        })),
      },
    ];
  }, [filtered]);

  const options: ApexOptions = useMemo(() => {
    const minRating = filtered.length > 0 ? Math.min(...filtered.map((c) => c.rating)) : 200;
    const maxRating = filtered.length > 0 ? Math.max(...filtered.map((c) => c.rating)) : 1600;

    // Build annotations as requested
    const yaxisAnnotations: NonNullable<ApexOptions["annotations"]>["yaxis"] = [];
    const pointAnnotations: NonNullable<ApexOptions["annotations"]>["points"] = [];

    if (showAnnotations) {
      // Milestone annotation (e.g. 1400 Div. 2 milestone or 1000)
      if (maxRating >= 1400 && minRating <= 1450) {
        yaxisAnnotations.push({
          y: 1400,
          borderColor: "#10b981",
          strokeDashArray: 4,
          label: {
            borderColor: "#059669",
            style: {
              color: "#ffffff",
              background: "#047857",
              fontSize: "10px",
              fontFamily: "monospace",
              fontWeight: 700,
            },
            text: "1400 Specialist / Div. 2 Tier",
          },
        });
      }

      if (minRating <= 1000 && maxRating >= 1000) {
        yaxisAnnotations.push({
          y: 1000,
          borderColor: "#38bdf8",
          strokeDashArray: 4,
          label: {
            borderColor: "#0284c7",
            style: {
              color: "#ffffff",
              background: "#0369a1",
              fontSize: "10px",
              fontFamily: "monospace",
              fontWeight: 700,
            },
            text: "1000 Rating Milestone",
          },
        });
      }

      // Peak Rating Point Annotation
      if (peakContest) {
        pointAnnotations.push({
          x: peakContest.contestName,
          y: peakContest.rating,
          marker: {
            size: 6,
            fillColor: "#ff1018",
            strokeColor: "#ffffff",
            strokeWidth: 2,
            shape: "circle",
          },
          label: {
            borderColor: "#ff1018",
            offsetY: 0,
            style: {
              color: "#ffffff",
              background: "#ff1018",
              fontSize: "11px",
              fontFamily: "monospace",
              fontWeight: 800,
            },
            text: `Peak: ${peakContest.rating} (${peakContest.platform})`,
          },
        });
      }
    }

    return {
      chart: {
        id: "contest-rating-chart",
        type: "line",
        height,
        background: "transparent",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 600,
        },
        dropShadow: {
          enabled: true,
          color: "#ff1018",
          top: 4,
          left: 0,
          blur: 10,
          opacity: 0.25,
        },
      },
      theme: {
        mode: "dark",
      },
      colors: ["#ff1018"],
      stroke: {
        curve: "smooth",
        width: 3,
      },
      markers: {
        size: 5,
        colors: ["#000000"],
        strokeColors: "#ff1018",
        strokeWidth: 2,
        hover: {
          size: 7,
          sizeOffset: 2,
        },
      },
      grid: {
        borderColor: "#1e1e24",
        strokeDashArray: 3,
        padding: {
          left: 10,
          right: 20,
          top: 10,
          bottom: 10,
        },
      },
      xaxis: {
        type: "category",
        labels: {
          show: true,
          rotate: -25,
          rotateAlways: false,
          hideOverlappingLabels: true,
          style: {
            colors: "#71717a",
            fontSize: "10px",
            fontFamily: "monospace",
          },
          formatter: (value: string) => {
            if (!value) return "";
            // Shorten lengthy contest titles for axis readability
            return value.length > 18 ? `${value.slice(0, 16)}...` : value;
          },
        },
        axisBorder: {
          color: "#27272a",
        },
        axisTicks: {
          color: "#27272a",
        },
      },
      yaxis: {
        min: Math.max(0, Math.floor((minRating - 150) / 100) * 100),
        max: Math.ceil((maxRating + 150) / 100) * 100,
        tickAmount: 5,
        labels: {
          style: {
            colors: "#71717a",
            fontSize: "10px",
            fontFamily: "monospace",
          },
          formatter: (val: number) => Math.round(val).toString(),
        },
      },
      annotations: {
        yaxis: yaxisAnnotations,
        points: pointAnnotations,
      },
      tooltip: {
        theme: "dark",
        custom: function ({ dataPointIndex }) {
          const item = filtered[dataPointIndex];
          if (!item) return "";

          const dateStr = new Date(item.contestDate * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          const deltaText = item.ratingChange !== undefined
            ? item.ratingChange >= 0
              ? `<span style="color: #34d399; font-weight: 700;">+${item.ratingChange}</span>`
              : `<span style="color: #f87171; font-weight: 700;">${item.ratingChange}</span>`
            : "";

          return `
            <div style="background: #0d0d12; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 10px 12px; font-family: monospace; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.8);">
              <div style="font-size: 11px; font-weight: 800; color: #fff; margin-bottom: 4px;">${item.contestName}</div>
              <div style="font-size: 10px; color: #a1a1aa; margin-bottom: 6px;">${item.platform.toUpperCase()} • ${dateStr}</div>
              <div style="display: flex; justify-content: space-between; gap: 14px; font-size: 11px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px;">
                <span>Rating: <strong style="color: #ff4452;">${item.rating}</strong></span>
                <span>Rank: <strong style="color: #38bdf8;">#${item.rank}</strong></span>
                ${deltaText ? `<span>Delta: ${deltaText}</span>` : ""}
              </div>
            </div>
          `;
        },
      },
      dataLabels: {
        enabled: false,
      },
    };
  }, [filtered, height, showAnnotations, peakContest]);

  if (filtered.length === 0) {
    return (
      <div className="w-full h-[260px] rounded-xl bg-[#0d0d12] border border-white/10 flex flex-col items-center justify-center text-xs text-zinc-500 font-mono">
        <span>No contest records found for this filter</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={height}
      />
    </div>
  );
}
