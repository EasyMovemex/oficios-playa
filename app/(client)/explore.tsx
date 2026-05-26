import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProviderCard } from '@/components/provider/ProviderCard';
import { SkeletonCard, EmptyState, AnimatedListItem } from '@/components/ui';
import { useProviders } from '@/hooks/useProviders';
import { useCategories } from '@/hooks/useCategories';
import { Colors } from '@/constants/Colors';

export default function Explore() {
  const router = useRouter();
  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(initialCategory);
  const [searchText, setSearchText] = useState('');

  const { data: providers, isLoading, refetch, isRefetching } = useProviders();
  const { data: categories } = useCategories();

  const filtered = useMemo(() => {
    if (!providers) return [];
    return providers.filter((p) => {
      const matchesCategory =
        !selectedSlug ||
        p.provider_services.some((s) => s.service_categories.slug === selectedSlug);
      const q = searchText.trim().toLowerCase();
      const matchesSearch =
        !q || p.profiles.full_name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [providers, selectedSlug, searchText]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 12,
          backgroundColor: Colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        }}
      >
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.textPrimary, marginBottom: 10 }}>
          Explorar prestadores
        </Text>
        {/* Search input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.background,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 9,
            gap: 8,
            borderWidth: 1,
            borderColor: '#E2E8F0',
          }}
        >
          <Ionicons name="search-outline" size={17} color={Colors.textSecondary} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar por nombre..."
            placeholderTextColor={Colors.textSecondary}
            style={{
              flex: 1,
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              color: Colors.textPrimary,
              padding: 0,
            }}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={17} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        style={{ flexGrow: 0, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}
      >
        <TouchableOpacity
          onPress={() => setSelectedSlug(undefined)}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 999,
            backgroundColor: !selectedSlug ? Colors.primary : Colors.background,
            borderWidth: 1,
            borderColor: !selectedSlug ? Colors.primary : '#E2E8F0',
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins_500Medium',
              fontSize: 13,
              color: !selectedSlug ? 'white' : Colors.textSecondary,
            }}
          >
            Todas
          </Text>
        </TouchableOpacity>
        {(categories ?? []).map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedSlug(cat.slug === selectedSlug ? undefined : cat.slug)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 999,
              backgroundColor: selectedSlug === cat.slug ? Colors.primary : Colors.background,
              borderWidth: 1,
              borderColor: selectedSlug === cat.slug ? Colors.primary : '#E2E8F0',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Text style={{ fontSize: 13 }}>{cat.icon}</Text>
            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: 13,
                color: selectedSlug === cat.slug ? 'white' : Colors.textSecondary,
              }}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Provider list */}
      {isLoading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
          <SkeletonCard height={100} />
          <SkeletonCard height={100} />
          <SkeletonCard height={100} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="Sin prestadores"
              subtitle={
                selectedSlug || searchText
                  ? 'Probá con otros filtros o categorías'
                  : 'Todavía no hay prestadores registrados en OficiosPlaya'
              }
            />
          }
          renderItem={({ item, index }) => (
            <AnimatedListItem index={index}>
              <ProviderCard
                provider={item}
                onPress={() => router.push(`/(modals)/provider/${item.id}`)}
              />
            </AnimatedListItem>
          )}
        />
      )}
    </SafeAreaView>
  );
}
