import { View, Text } from 'react-native';
import { CategoryCard } from './CategoryCard';
import { SkeletonCard } from '@/components/ui';
import { useCategories } from '@/hooks/useCategories';
import { Colors } from '@/constants/Colors';
import type { ServiceCategory } from '@/types';

type CategoryGridProps = {
  onCategoryPress: (category: ServiceCategory) => void;
};

export function CategoryGrid({ onCategoryPress }: CategoryGridProps) {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <View style={{ padding: 16, gap: 8 }}>
        <SkeletonCard height={60} />
        <SkeletonCard height={60} />
        <SkeletonCard height={60} />
      </View>
    );
  }

  if (isError || !categories) {
    return (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary }}>
          No se pudieron cargar las categorías
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 }}>
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} onPress={onCategoryPress} />
      ))}
    </View>
  );
}
