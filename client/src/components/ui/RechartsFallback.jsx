import React, { useState } from 'react';

export const ResponsiveContainer = ({ width = '100%', height = '100%', children }) => {
  return (
    <div style={{ width, height, position: 'relative' }} className="w-full h-full min-h-[220px]">
      {children}
    </div>
  );
};

export const BarChart = ({ data = [], children }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
        No analytical chart data available
      </div>
    );
  }

  // Extract dataKey from Bar child if available, otherwise default to 'collected'
  let dataKey = 'collected';
  React.Children.forEach(children, (child) => {
    if (child?.props?.dataKey) {
      dataKey = child.props.dataKey;
    }
  });

  const values = data.map((d) => Number(d[dataKey] || d.value || d.amount || 0));
  const rawMax = Math.max(...values, 100);
  // Round up to nice upper ceiling for Y-axis
  const maxVal = Math.ceil(rawMax * 1.15);

  const svgWidth = 640;
  const svgHeight = 250;
  const chartLeft = 65;
  const chartRight = 620;
  const chartTop = 25;
  const chartBottom = 205;
  const chartWidth = chartRight - chartLeft;
  const chartHeight = chartBottom - chartTop;

  const ySteps = 4;
  const gridLines = [];
  for (let i = 0; i <= ySteps; i++) {
    const val = Math.round((maxVal / ySteps) * i);
    const yPos = chartBottom - (i / ySteps) * chartHeight;
    let label = `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 10000000) label = `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val < 100000) label = `₹${(val / 1000).toFixed(0)}k`;
    if (val === 0) label = '₹0';

    gridLines.push({ yPos, val, label });
  }

  const slotWidth = chartWidth / data.length;
  const barWidth = Math.min(Math.max(slotWidth * 0.48, 28), 54);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full overflow-visible select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Modern Blue Bar Gradient */}
          <linearGradient id="skywingsBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Active Hover Gradient */}
          <linearGradient id="skywingsBarHoverGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Subtle Drop Shadow */}
          <filter id="barShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Horizontal Grid lines & Y Axis Ticks */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line
              x1={chartLeft}
              y1={line.yPos}
              x2={chartRight}
              y2={line.yPos}
              stroke="#E2E8F0"
              strokeDasharray={idx === 0 ? '0' : '4 4'}
              strokeWidth={idx === 0 ? 1.5 : 1}
            />
            <text
              x={chartLeft - 10}
              y={line.yPos + 4}
              textAnchor="end"
              className="fill-slate-400 font-mono text-[11px] font-medium"
            >
              {line.label}
            </text>
          </g>
        ))}

        {/* Data Bars */}
        {data.map((item, idx) => {
          const val = Number(item[dataKey] || item.value || item.amount || 0);
          const barHeight = Math.max((val / maxVal) * chartHeight, 6);
          const x = chartLeft + idx * slotWidth + (slotWidth - barWidth) / 2;
          const y = chartBottom - barHeight;
          const isHovered = hoveredIdx === idx;

          // Short summary label like 14.2L
          let shortLabel = `${(val / 100000).toFixed(1)}L`;
          if (val < 100000) shortLabel = `${(val / 1000).toFixed(0)}k`;

          return (
            <g
              key={idx}
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Invisible wide hit area for easy hover on mobile/desktop */}
              <rect
                x={chartLeft + idx * slotWidth}
                y={chartTop}
                width={slotWidth}
                height={chartHeight + 35}
                fill="transparent"
              />

              {/* Bar Column */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                ry={6}
                fill={isHovered ? 'url(#skywingsBarHoverGradient)' : 'url(#skywingsBarGradient)'}
                filter="url(#barShadow)"
                className="transition-all duration-300"
              />

              {/* Top Value Badge */}
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                className={`text-[11px] font-mono font-bold transition-opacity ${
                  isHovered ? 'fill-blue-600 font-extrabold text-[12px]' : 'fill-slate-600'
                }`}
              >
                ₹{shortLabel}
              </text>

              {/* Month Label (X-Axis) */}
              <text
                x={x + barWidth / 2}
                y={chartBottom + 22}
                textAnchor="middle"
                className={`text-[12px] font-semibold transition-colors ${
                  isHovered ? 'fill-blue-600 font-bold' : 'fill-slate-500'
                }`}
              >
                {item.month || item.name || `P${idx + 1}`}
              </text>
            </g>
          );
        })}

        {/* Hover Tooltip Box */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          (() => {
            const item = data[hoveredIdx];
            const val = Number(item[dataKey] || item.value || item.amount || 0);
            const x = chartLeft + hoveredIdx * slotWidth + slotWidth / 2;
            const tooltipY = chartTop - 12;

            return (
              <g transform={`translate(${x}, ${tooltipY})`} className="pointer-events-none z-30">
                <rect
                  x="-75"
                  y="-18"
                  width="150"
                  height="34"
                  rx="8"
                  fill="#0F172A"
                  className="shadow-2xl"
                />
                <polygon points="-6,16 6,16 0,22" fill="#0F172A" />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  className="text-[11px] font-semibold font-mono"
                >
                  {item.month}: ₹{val.toLocaleString()}
                </text>
              </g>
            );
          })()
        )}
      </svg>
    </div>
  );
};

export const Bar = () => null;
export const XAxis = () => null;
export const YAxis = () => null;
export const Tooltip = () => null;
export const CartesianGrid = () => null;

export default {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
};
