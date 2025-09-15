import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function calculateEngagementRate(views: number, engagements: number): number {
  if (views === 0) return 0;
  return Math.round((engagements / views) * 100);
}

export function generateGradient(percentage: number): string {
  const hue1 = 170; // Accent color hue
  const hue2 = 210; // Primary color hue
  return `conic-gradient(from 0deg, hsl(${hue1}, 70%, 45%) 0%, hsl(${hue2}, 80%, 50%) ${percentage}%, hsl(215, 35%, 30%) ${percentage}%, hsl(215, 35%, 30%) 100%)`;
}
