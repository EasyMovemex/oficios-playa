import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type RatingSize = 'sm' | 'md' | 'lg';

type RatingProps = {
  value: number;
  count?: number;
  size?: RatingSize;
};

const SIZES: Record<RatingSize, { star: number; font: number }> = {
  sm: { star: 12, font: 11 },
  md: { star: 15, font: 13 },
  lg: { star: 20, font: 15 },
};

export function Rating({ value, count, size = 'md' }: RatingProps) {
  const { star, font } = SIZES[size];
  const filled = Math.round(Math.min(5, Math.max(0, value)));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Ionicons
          key={i}
          name={i < filled ? 'star' : 'star-outline'}
          size={star}
          color={Colors.warning}
        />
      ))}

      {value > 0 && (
        <Text style={{
          fontFamily: 'Poppins_600SemiBold',
          fontSize: font,
          color: Colors.textPrimary,
          marginLeft: 4,
        }}>
          {value.toFixed(1)}
        </Text>
      )}

      {count !== undefined && (
        <Text style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: font,
          color: Colors.textSecondary,
        }}>
          {value > 0 ? `(${count})` : count === 0 ? 'Sin reseñas' : `(${count})`}
        </Text>
      )}
    </View>
  );
}
