import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = {
  index: number;
  children: React.ReactNode;
};

export function AnimatedListItem({ index, children }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index * 60, 360)).springify()}>
      {children}
    </Animated.View>
  );
}
