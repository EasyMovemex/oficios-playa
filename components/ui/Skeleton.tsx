import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import type { ViewStyle, DimensionValue } from 'react-native';

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.85, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: '#CBD5E1', opacity },
        style,
      ]}
    />
  );
}

// Convenience: a card-shaped skeleton block
export function SkeletonCard({ height = 100 }: { height?: number }) {
  return (
    <Skeleton
      width="100%"
      height={height}
      borderRadius={16}
      style={{ marginBottom: 12 }}
    />
  );
}
