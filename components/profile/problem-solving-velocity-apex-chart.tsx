"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { ChartLoading } from "@/components/ui/visual-loading";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <ChartLoading label="activity chart" kind="activity" height={260} />,
});

interface ProblemSolvingVelocityApexChartProps {
  heatmap: Record<string, number>;
  height?: number;
}

export function ProblemSolvingVelocityApexChart({
  heatmap,
  height = 260,
}: ProblemSolvingVelocityApexChartProps) {
  // Aggregate daily entries by Month-Year (e.g. "Apr 2025", "May 2025", etc.)
  const monthlyData = useMemo(() => {
    const monthsMap: Record<string, { label: string; count: number; dateSortKey: string }> = {};

    Object.entries(heatmap).forEach(([dateStr, count]) => {
      const parts = dateStr.split("-");
      if (parts.length >= 2) {
        const year = parts[0];
        const month = parts[1];
        const key = `${year}-${month}`;
        const dateObj = new Date(Number(year), Number(month) - 1, 1);
        const label = dateObj.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

        if (!monthsMap[key]) {
          monthsMap[key] = { label, count: 0, dateSortKey: key };
        }
        monthsMap[key].count += count;
      }
    });

    return Object.values(monthsMap)
      .sort((a, b) => a.dateSortKey.localeCompare(b.dateSortKey))
      .slice(-12);
  }, [heatmap]);

  const peakMonth = useMemo(() => {
    if (monthlyData.length === 0) return null;
    return monthlyData.reduce((max, m) => (m.count > max.count ? m : max), monthlyData[0]);
  }, [monthlyData]);

  const series = useMemo(() => {
    return [
      {
        name: "Activity Events",
        data: monthlyData.map((m) => ({
          x: m.label,
          y: m.count,
        })),
      },
    ];
  }, [monthlyData]);

  const options: ApexOptions = useMemo(() => {
    const pointAnnotations: NonNullable<ApexOptions["annotations"]>["points"] = [];

    if (peakMonth && peakMonth.count > 0) {
      pointAnnotations.push({
        x: peakMonth.label,
        y: peakMonth.count,
        marker: {
          size: 6,
          fillColor: "#ff1018",
          strokeColor: "#ffffff",
          strokeWidth: 2,
          shape: "circle",
        },
        label: {
          borderColor: "#ff1018",
          offsetY: -6,
          style: {
            color: "#ffffff",
            background: "#ff1018",
            fontSize: "10px",
            fontFamily: "monospace",
            fontWeight: 800,
          },
          text: `Peak: ${peakMonth.count} Events`,
        },
      });
    }

    return {
      chart: {
        id: "submission-velocity-chart",
        type: "area",
        height,
        background: "transparent",
        toolbar: {
          show: false,
        },
      },
      theme: {
        mode: "dark",
      },
      colors: ["#ff1018"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      stroke: {
        curve: "smooth",
        width: 2.5,
      },
      markers: {
        size: 4,
        colors: ["#000000"],
        strokeColors: "#ff1018",
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
      grid: {
        borderColor: "#1e1e24",
        strokeDashArray: 3,
        padding: {
          left: 10,
          right: 20,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "category",
        labels: {
          style: {
            colors: "#71717a",
            fontSize: "10px",
            fontFamily: "monospace",
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
        points: pointAnnotations,
      },
      tooltip: {
        theme: "dark",
        custom: function ({ dataPointIndex }) {
          const m = monthlyData[dataPointIndex];
          if (!m) return "";
          return `
            <div style="background: #0d0d12; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 12px; font-family: monospace; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.8);">
              <div style="font-size: 10px; color: #a1a1aa; margin-bottom: 2px;">${m.label}</div>
              <div style="font-size: 13px; font-weight: 800; color: #ff4452;">
                ${m.count} <span style="font-size: 11px; font-weight: 500; color: #e4e4e7;">Activity events</span>
              </div>
            </div>
          `;
        },
      },
    };
  }, [monthlyData, height, peakMonth]);

  if (monthlyData.length === 0) return null;

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={height}
      />
    </div>
  );
}
