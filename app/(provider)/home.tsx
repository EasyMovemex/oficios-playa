import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, SkeletonCard, EmptyState } from '@/components/ui';
import { JobRequestCard } from '@/components/job/JobRequestCard';
import { useMyProviderProfile } from '@/hooks/useProviderProfile';
import { useOpenJobsForCategories } from '@/hooks/useJobRequests';
import { useMyActiveBids } from '@/hooks/useBids';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/Colors';
import type { MyActiveBid } from '@/hooks/useBids';

function BidRow({ bid, onPress }: { bid: MyActiveBid; onPress: () => void }) {
  const cat = bid.job_requests.service_categories;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: Colors.textPrimary }} numberOfLines={1}>
          {bid.job_requests.title}
        </Text>
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
          {cat.name} · Tu oferta: ${bid.price.toLocaleString('es-MX')}
        </Text>
      </View>
      <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 11, color: '#92400E' }}>Pendiente</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ProviderHome() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { data: providerProfile, isLoading: profileLoading, refetch: refetchProfile } = useMyProviderProfile();

  const categoryIds = (providerProfile?.provider_services ?? []).map((s) => s.service_categories.id);
  const {
    data: jobs,
    isLoading: jobsLoading,
    refetch: refetchJobs,
    isRefetching,
  } = useOpenJobsForCategories(categoryIds);
  const { data: activeBids = [], isLoading: bidsLoading, refetch: refetchBids } = useMyActiveBids(providerProfile?.id);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Prestador';
  const displayName = providerProfile?.business_name ?? profile?.full_name ?? 'Prestador';
  const avatarUri = providerProfile?.logo_url ?? profile?.avatar_url;
  const recentJobs = jobs?.slice(0, 5) ?? [];

  const handleRefresh = () => {
    refetchProfile();
    refetchJobs();
    refetchBids();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor={Colors.primary} />
        }
      >
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
                Panel de trabajo
              </Text>
            </View>
            <Avatar uri={avatarUri} name={displayName} size={44} />
          </View>

          {/* Stats row */}
          {providerProfile && (
            <View style={{
              flexDirection: 'row',
              marginTop: 16,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: 14,
            }}>
              {[
                { label: 'Calificación', value: providerProfile.total_reviews > 0 ? providerProfile.rating_avg.toFixed(1) : '—' },
                { label: 'Reseñas', value: String(providerProfile.total_reviews) },
                { label: 'Disponibles', value: String(jobs?.length ?? 0) },
                { label: 'Mis ofertas', value: String(activeBids.length) },
              ].map((stat, i, arr) => (
                <View key={stat.label} style={{
                  flex: 1,
                  alignItems: 'center',
                  borderRightWidth: i < arr.length - 1 ? 1 : 0,
                  borderRightColor: 'rgba(255,255,255,0.3)',
                }}>
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: 'white' }}>{stat.value}</Text>
                  <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          )}
        </LinearGradient>

        {/* Active bids section */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary, marginBottom: 12 }}>
            Mis ofertas activas
          </Text>

          {bidsLoading && <SkeletonCard height={72} />}

          {!bidsLoading && activeBids.length === 0 && (
            <View style={{ backgroundColor: Colors.surface, borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary, textAlign: 'center' }}>
                No tenés ofertas pendientes. ¡Buscá solicitudes abiertas y enviá tu primera oferta!
              </Text>
            </View>
          )}

          {activeBids.map((bid) => (
            <BidRow
              key={bid.id}
              bid={bid}
              onPress={() => router.push(`/(modals)/job/${bid.job_request_id}`)}
            />
          ))}
        </View>

        {/* Available jobs section */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary }}>
              Solicitudes disponibles
            </Text>
            <TouchableOpacity onPress={() => router.push('/(provider)/jobs')}>
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: Colors.primary }}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          {(profileLoading || jobsLoading) && (
            <View style={{ gap: 12 }}>
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

          {!profileLoading && !jobsLoading && categoryIds.length > 0 && recentJobs.length === 0 && (
            <EmptyState
              icon="briefcase-outline"
              title="Sin trabajos disponibles"
              subtitle="No hay solicitudes abiertas en tus categorías por el momento"
            />
          )}

          {recentJobs.map((item) => (
            <JobRequestCard
              key={item.id}
              job={item}
              onPress={() => router.push(`/(modals)/job/${item.id}`)}
            />
          ))}
        </View>
      </ScrollView>

      {/* FAB — Editar mi perfil */}
      {providerProfile && (
        <TouchableOpacity
          onPress={() => router.push('/(modals)/become-provider')}
          activeOpacity={0.85}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 16,
            backgroundColor: Colors.secondary,
            borderRadius: 999,
            paddingHorizontal: 18,
            paddingVertical: 13,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            shadowColor: Colors.secondary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 16 }}>✏️</Text>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: 'white' }}>
            Editar mi perfil
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
