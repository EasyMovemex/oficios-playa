import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, SkeletonCard, EmptyState } from '@/components/ui';
import { JobRequestCard } from '@/components/job/JobRequestCard';
import { useMyProviderProfile } from '@/hooks/useProviderProfile';
import { useOpenJobsForCategories } from '@/hooks/useJobRequests';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/Colors';

export default function ProviderHome() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { data: providerProfile, isLoading: profileLoading } = useMyProviderProfile();

  const categoryIds = (providerProfile?.provider_services ?? []).map((s) => s.service_categories.id);
  const { data: jobs, isLoading: jobsLoading, refetch, isRefetching } = useOpenJobsForCategories(categoryIds);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Prestador';
  const recentJobs = jobs?.slice(0, 5) ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <FlatList
        data={recentJobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />
        }
        ListHeaderComponent={
          <>
            {/* Gradient header */}
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                    ¡Hola, {firstName}!
                  </Text>
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: 'white', marginTop: 1 }}>
                    Trabajos disponibles
                  </Text>
                </View>
                <Avatar uri={profile?.avatar_url} name={profile?.full_name ?? 'P'} size={44} />
              </View>

              {/* Stats row */}
              {providerProfile && (
                <View style={{
                  flexDirection: 'row',
                  marginTop: 16,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 12,
                  padding: 14,
                  gap: 0,
                }}>
                  {[
                    { label: 'Calificación', value: providerProfile.total_reviews > 0 ? providerProfile.rating_avg.toFixed(1) : '—' },
                    { label: 'Reseñas', value: String(providerProfile.total_reviews) },
                    { label: 'Disponibles', value: String(jobs?.length ?? 0) },
                  ].map((stat, i, arr) => (
                    <View key={stat.label} style={{
                      flex: 1,
                      alignItems: 'center',
                      borderRightWidth: i < arr.length - 1 ? 1 : 0,
                      borderRightColor: 'rgba(255,255,255,0.3)',
                    }}>
                      <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: 'white' }}>{stat.value}</Text>
                      <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{stat.label}</Text>
                    </View>
                  ))}
                </View>
              )}
            </LinearGradient>

            {/* Section header */}
            <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary }}>
                En mis categorías
              </Text>
              <TouchableOpacity onPress={() => router.push('/(provider)/jobs')}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: Colors.primary }}>
                  Ver todas
                </Text>
              </TouchableOpacity>
            </View>

            {(profileLoading || jobsLoading) && (
              <View style={{ paddingHorizontal: 16, gap: 12 }}>
                <SkeletonCard height={96} />
                <SkeletonCard height={96} />
              </View>
            )}

            {!profileLoading && !jobsLoading && categoryIds.length === 0 && (
              <EmptyState
                icon="construct-outline"
                title="Sin categorías configuradas"
                subtitle="Completá tu perfil de prestador para ver solicitudes disponibles"
                action={{ label: 'Ir a mi perfil', onPress: () => router.push('/(provider)/profile') }}
              />
            )}
          </>
        }
        ListEmptyComponent={
          (!profileLoading && !jobsLoading && categoryIds.length > 0) ? (
            <EmptyState
              icon="briefcase-outline"
              title="Sin trabajos disponibles"
              subtitle="No hay solicitudes abiertas en tus categorías por el momento"
            />
          ) : null
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <JobRequestCard job={item} onPress={() => router.push(`/(modals)/job/${item.id}`)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
