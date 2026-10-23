"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { ContestHistoryItem } from "@/lib/profile-data";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[260px] rounded-xl bg-[#0d0d12] border border-white/5 animate-pulse flex items-center justify-center text-xs font-mono text-zinc-500">
      Loading performance analytics...
    </div>
  ),
});

interface ContestPerformanceDeltaApexChartProps {
  contests: ContestHistoryItem[];
  height?: number;
}

export function ContestPerformanceDeltaApexChart({
  contests,
  height = 260,
}: ContestPerformanceDeltaApexChartProps) {
  const sorted = useMemo(() => {
    return [...contests]
      .filter((c) => c.ratingChange !== undefined)
      .sort((a, b) => a.contestDate - b.contestDate);
  }, [contests]);

  const maxGain = useMemo(() => {
    if (sorted.length === 0) return null;
    return sorted.reduce((max, c) => ((c.ratingChange ?? 0) > (max.ratingChange ?? 0) ? c : max), sorted[0]);
  }, [sorted]);

  const series = useMemo(() => {
    return [
      {
        name: "Rating Delta",
        data: sorted.map((c) => ({
          x: c.contestName,
          y: c.ratingChange ?? 0,
        })),
      },
    ];
  }, [sorted]);

  const options: ApexOptions = useMemo(() => {
    const pointAnnotations: NonNullable<ApexOptions["annotations"]>["points"] = [];

    if (maxGain && (maxGain.ratingChange ?? 0) > 0) {
      pointAnnotations.push({
        x: maxGain.contestName,
        y: maxGain.ratingChange ?? 0,
        marker: {
          size: 5,
          fillColor: "#10b981",
          strokeColor: "#ffffff",
          strokeWidth: 2,
          shape: "circle",
        },
        label: {
          borderColor: "#10b981",
          offsetY: -8,
          style: {
            color: "#ffffff",
            background: "#047857",
            fontSize: "10px",
            fontFamily: "monospace",
            fontWeight: 700,
          },
          text: `Top Gain: +${maxGain.ratingChange}`,
        },
      });
    }

    return {
      chart: {
        id: "contest-delta-chart",
        type: "bar",
        height,
        background: "transparent",
        toolbar: {
          show: false,
        },
      },
      theme: {
        mode: "dark",
      },
      plotOptions: {
        bar: {
          colors: {
            ranges: [
              {
                from: -1000,
                to: -1,
                color: "#f43f5e",
              },
              {
                from: 0,
                to: 1000,
                color: "#10b981",
              },
            ],
          },
          columnWidth: "55%",
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: "#1e1e24",
        strokeDashArray: 3,
        padding: {
          left: 10,
          right: 20,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#71717a",
            fontSize: "10px",
            fontFamily: "monospace",
          },
          formatter: (val: number) => (val > 0 ? `+${Math.round(val)}` : Math.round(val).toString()),
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
            return value.length > 16 ? `${value.slice(0, 14)}...` : value;
          },
        },
        axisBorder: {
          color: "#27272a",
        },
        axisTicks: {
          color: "#27272a",
        },
      },
      annotations: {
        points: pointAnnotations,
      },
      tooltip: {
        theme: "dark",
        custom: function ({ dataPointIndex }) {
          const item = sorted[dataPointIndex];
          if (!item) return "";

          const isGain = (item.ratingChange ?? 0) >= 0;
          const color = isGain ? "#34d399" : "#f87171";
          const sign = isGain ? "+" : "";

          return `
            <div style="background: #0d0d12; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 10px 12px; font-family: monospace; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.8);">
              <div style="font-size: 11px; font-weight: 800; color: #fff; margin-bottom: 4px;">${item.contestName}</div>
              <div style="font-size: 10px; color: #a1a1aa; margin-bottom: 6px;">${item.platform.toUpperCase()} • Rating: ${item.rating}</div>
              <div style="font-size: 12px; font-weight: 800; color: ${color}; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px;">
                Rating Delta: ${sign}${item.ratingChange}
              </div>
            </div>
          `;
        },
      },
    };
  }, [sorted, height, maxGain]);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={height}
      />
    </div>
  );
}
