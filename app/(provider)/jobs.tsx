import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { JobRequestCard } from '@/components/job/JobRequestCard';
import { SkeletonCard, EmptyState } from '@/components/ui';
import { useMyProviderProfile } from '@/hooks/useProviderProfile';
import { useOpenJobsForCategories } from '@/hooks/useJobRequests';
import { Colors } from '@/constants/Colors';

export default function ProviderJobs() {
  const router = useRouter();
  const { data: providerProfile, isLoading: profileLoading } = useMyProviderProfile();

  const categoryIds = (providerProfile?.provider_services ?? []).map((s) => s.service_categories.id);
  const { data: jobs, isLoading: jobsLoading, refetch, isRefetching } = useOpenJobsForCategories(categoryIds);

  const isLoading = profileLoading || jobsLoading;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
      }}>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.textPrimary }}>
          Solicitudes abiertas
        </Text>
        {!isLoading && jobs && (
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 2 }}>
            {jobs.length} {jobs.length === 1 ? 'trabajo disponible' : 'trabajos disponibles'} en tus categorías
          </Text>
        )}
      </View>

      {isLoading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
          <SkeletonCard height={96} />
          <SkeletonCard height={96} />
          <SkeletonCard height={96} />
        </View>
      ) : categoryIds.length === 0 ? (
        <EmptyState
          icon="construct-outline"
          title="Sin categorías configuradas"
          subtitle="Editá tu perfil de prestador y seleccioná las categorías que ofrecés para ver solicitudes"
          action={{ label: 'Ir a mi perfil', onPress: () => router.push('/(provider)/profile') }}
        />
      ) : (
        <FlatList
          data={jobs ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="briefcase-outline"
              title="Sin trabajos disponibles"
              subtitle="No hay solicitudes abiertas en tus categorías por el momento. Revisá más tarde."
            />
          }
          renderItem={({ item }) => (
            <JobRequestCard
                job={item}
                onPress={() => router.push(`/(modals)/job/${item.id}`)}
              />
          )}
        />
      )}
    </SafeAreaView>
  );
}
