export const Colors = {
  primary: '#0891B2',
  primaryLight: '#0EA5E9',
  secondary: '#EA580C',
  accent: '#059669',
  background: '#F0F9FF',
  surface: '#FFFFFF',
  textPrimary: '#0C4A6E',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  danger: '#EF4444',
  warning: '#F59E0B',
  gradientHero: ['#0891B2', '#0EA5E9'] as const,
} as const;

export type ColorKey = keyof typeof Colors;
