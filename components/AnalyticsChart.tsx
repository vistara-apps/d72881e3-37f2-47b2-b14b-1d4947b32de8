'use client';

import React, { useRef, useEffect } from 'react';

interface AnalyticsChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  className?: string;
}

export function AnalyticsChart({
  data,
  labels,
  color = '#10b981',
  height = 200,
  className = ''
}: AnalyticsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.length === 0) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    // Find min and max values
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);

    // Calculate scale
    const range = maxValue - minValue || 1;
    const scaleY = chartHeight / range;
    const scaleX = chartWidth / (data.length - 1 || 1);

    // Draw grid lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      const value = maxValue - (range * i) / 5;
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(0), padding - 10, y + 4);
    }

    // Draw the line chart
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + (index * scaleX);
      const y = padding + chartHeight - ((value - minValue) * scaleY);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = color;
    data.forEach((value, index) => {
      const x = padding + (index * scaleX);
      const y = padding + chartHeight - ((value - minValue) * scaleY);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // White border for points
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw area under the curve
    ctx.fillStyle = color + '20'; // Add transparency
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + (index * scaleX);
      const y = padding + chartHeight - ((value - minValue) * scaleY);

      if (index === 0) {
        ctx.moveTo(x, height - padding);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(padding + ((data.length - 1) * scaleX), height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw labels if provided
    if (labels && labels.length > 0) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';

      // Show every nth label to avoid overcrowding
      const step = Math.max(1, Math.floor(labels.length / 10));

      labels.forEach((label, index) => {
        if (index % step === 0) {
          const x = padding + (index * scaleX);
          ctx.fillText(label, x, height - 10);
        }
      });
    }

  }, [data, labels, color, height]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={height}
      className={`w-full ${className}`}
      style={{ height: `${height}px` }}
    />
  );
}

