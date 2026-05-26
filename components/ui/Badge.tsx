import { View, Text } from 'react-native';
import type { ReactNode } from 'react';
import { Colors } from '@/constants/Colors';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'warning' | 'danger' | 'neutral';
type BadgeSize = 'sm' | 'md';

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
};

const COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  primary:   { bg: '#E0F2FE', text: Colors.primary },
  secondary: { bg: '#FFF7ED', text: Colors.secondary },
  accent:    { bg: '#ECFDF5', text: Colors.accent },
  warning:   { bg: '#FFFBEB', text: '#B45309' },
  danger:    { bg: '#FEF2F2', text: Colors.danger },
  neutral:   { bg: '#F1F5F9', text: Colors.textSecondary },
};

export function Badge({ children, variant = 'neutral', size = 'md' }: BadgeProps) {
  const { bg, text } = COLORS[variant];
  const sm = size === 'sm';

  return (
    <View style={{
      alignSelf: 'flex-start',
      backgroundColor: bg,
      borderRadius: 999,
      paddingHorizontal: sm ? 8 : 10,
      paddingVertical: sm ? 2 : 4,
    }}>
      <Text style={{
        fontFamily: 'Poppins_600SemiBold',
        fontSize: sm ? 11 : 12,
        color: text,
      }}>
        {children}
      </Text>
    </View>
  );
}
