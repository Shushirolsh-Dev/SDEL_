import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export function LineChart({ data, color = '#2563eb', height = 200 }: LineChartProps) {
  if (!data || data.length === 0) return <div className="h-[200px] flex items-center justify-center text-zinc-400">No data</div>;

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 10);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal;

  const width = 500;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, index) => {
    return index === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        {/* Grids and Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e4e4e7" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e4e4e7" strokeWidth="1" />

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + chartHeight * ratio;
          const val = maxVal - ratio * range;
          return (
            <g key={idx}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding - 8} y={y + 4} textAnchor="end" className="text-[10px] font-mono fill-zinc-400">
                ${Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={`${color}15`} />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots & Labels */}
        {points.map((p, index) => (
          <g key={index} className="group cursor-pointer">
            <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke={color} strokeWidth="2" className="transition-all hover:r-6" />
            
            {/* Tooltip on hover simulation */}
            <rect x={p.x - 25} y={p.y - 25} width="50" height="18" rx="3" fill="#18181b" className="opacity-0 group-hover:opacity-100 transition-opacity" />
            <text x={p.x} y={p.y - 13} textAnchor="middle" className="text-[9px] font-mono fill-white opacity-0 group-hover:opacity-100 pointer-events-none">
              ${p.value}
            </text>

            {/* X labels */}
            <text x={p.x} y={height - padding + 16} textAnchor="middle" className="text-[9px] font-mono fill-zinc-400">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

interface BarChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export function BarChart({ data, color = '#3b82f6', height = 200 }: BarChartProps) {
  if (!data || data.length === 0) return <div className="h-[200px] flex items-center justify-center text-zinc-400">No data</div>;

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 10);
  const minVal = 0;
  const range = maxVal - minVal;

  const width = 500;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const barWidth = (chartWidth / data.length) * 0.6;
  const gap = (chartWidth / data.length) * 0.4;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        {/* Base axis lines */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e4e4e7" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e4e4e7" strokeWidth="1" />

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + chartHeight * ratio;
          const val = maxVal - ratio * range;
          return (
            <g key={idx}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding - 8} y={y + 4} textAnchor="end" className="text-[10px] font-mono fill-zinc-400">
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, index) => {
          const x = padding + index * (barWidth + gap) + gap / 2;
          const barHeight = (d.value / maxVal) * chartHeight;
          const y = height - padding - barHeight;

          return (
            <g key={index} className="group cursor-pointer">
              {/* Actual bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="3"
                className="transition-colors hover:opacity-80"
              />

              {/* Top value text */}
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                className="text-[10px] font-mono font-bold fill-zinc-700 dark:fill-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {d.value}
              </text>

              {/* Bottom label */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 16}
                textAnchor="middle"
                className="text-[9px] font-mono fill-zinc-400"
              >
                {d.label.length > 10 ? d.label.substring(0, 8) + '..' : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
