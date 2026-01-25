"use client";

import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface SparklineDataPoint {
  time?: string;
  value: number;
  date?: string;
}

interface SparklineProps {
  data: SparklineDataPoint[];
  height?: number;
  width?: string;
  color?: string;
  fillColor?: string;
  isPositive?: boolean;
  className?: string;
  showTooltip?: boolean;
}

/**
 * Compact sparkline chart showing historical rate trends
 * Perfect for displaying rate changes at a glance
 */
export function Sparkline({
  data,
  height = 40,
  width = "100%",
  color = "#10b981",
  fillColor = "#d1fae5",
  isPositive = true,
  className = "",
  showTooltip = true,
}: SparklineProps) {
  // If no data or insufficient data, show placeholder
  if (!data || data.length < 2) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 rounded ${className}`}
        style={{ height, width }}
      />
    );
  }

  // Dynamic color based on trend
  const lineColor = isPositive ? "#10b981" : "#ef4444";
  const areaColor = isPositive ? "#dcfce7" : "#fee2e2";

  return (
    <div className={className} style={{ width, height }}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 2, right: 2, left: 0, bottom: 2 }}
        >
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
              }}
              formatter={(value: any) => [
                `₦${typeof value === "number" ? value.toLocaleString() : value}`,
                "Rate",
              ]}
              labelFormatter={(label) => `${label}`}
              cursor={{ stroke: "rgba(0, 0, 0, 0.1)" }}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            fill={areaColor}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Compact card version of sparkline with label and metadata
 */
export function SparklineCard({
  label,
  value,
  data,
  change,
  currency,
}: {
  label: string;
  value: number;
  data: SparklineDataPoint[];
  change?: number;
  currency?: string;
}) {
  const isPositive = change === undefined ? true : change >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const changeBgColor = isPositive
    ? "bg-green-50 dark:bg-green-950/20"
    : "bg-red-50 dark:bg-red-950/20";

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {label}
        </span>
        {change !== undefined && (
          <span
            className={`text-xs font-semibold ${changeColor} ${changeBgColor} px-2 py-0.5 rounded`}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        )}
      </div>

      <Sparkline data={data} height={30} isPositive={isPositive} width="100%" />

      <div className="text-sm font-bold text-gray-900 dark:text-white">
        {currency || "₦"}
        {value.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
}
