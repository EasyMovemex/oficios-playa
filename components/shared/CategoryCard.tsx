import { TouchableOpacity, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import type { ServiceCategory } from '@/types';

type CategoryCardProps = {
  category: ServiceCategory;
  onPress: (category: ServiceCategory) => void;
};

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(category)}
      activeOpacity={0.7}
      style={{ width: '33.33%', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 6 }}
    >
      <Text style={{ fontSize: 28, marginBottom: 6 }}>{category.icon}</Text>
      <Text
        style={{
          fontFamily: 'Poppins_500Medium',
          fontSize: 11,
          color: Colors.textPrimary,
          textAlign: 'center',
          lineHeight: 15,
        }}
        numberOfLines={2}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}
