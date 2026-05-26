import { View, TouchableOpacity } from 'react-native';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: boolean;
};

const SHADOW: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 3,
  elevation: 2,
};

export function Card({ children, onPress, style, padding = true }: CardProps) {
  const base: ViewStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    ...SHADOW,
    ...(padding && { padding: 16 }),
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={base}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={base}>{children}</View>;
}
