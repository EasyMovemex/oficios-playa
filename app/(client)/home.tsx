import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, EmptyState, SkeletonCard } from '@/components/ui';
import { CategoryGrid } from '@/components/shared/CategoryGrid';
import { JobRequestCard } from '@/components/job/JobRequestCard';
import { useAuthStore } from '@/stores/authStore';
import { useMyJobRequests } from '@/hooks/useJobRequests';
import { Colors } from '@/constants/Colors';
import type { ServiceCategory } from '@/types';

export default function ClientHome() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { data: jobs, isLoading, refetch, isRefetching } = useMyJobRequests();

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Usuario';
  const recentJobs = jobs?.slice(0, 3) ?? [];

  function handleCategoryPress(cat: ServiceCategory) {
    router.push(`/(client)/explore?category=${cat.slug}`);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
        }
      >
        {/* ── Gradient Header ── */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 }}
        >
          {/* Greeting row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                ¡Hola, {firstName}!
              </Text>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: 'white', marginTop: 1 }}>
                ¿Qué servicio buscás hoy?
              </Text>
            </View>
            <Avatar
              uri={profile?.avatar_url}
              name={profile?.full_name ?? 'U'}
              size={44}
            />
          </View>

          {/* Fake search bar → navigate to explore */}
          <TouchableOpacity
            onPress={() => router.push('/(client)/explore')}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 11,
              gap: 10,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.25)',
            }}
          >
            <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.75)" />
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              Buscar electricista, plomero...
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* ── Category Card (overlaps gradient) ── */}
        <View style={{ marginTop: -28, paddingHorizontal: 16, zIndex: 1 }}>
          <View style={{
            backgroundColor: Colors.surface,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 5,
            overflow: 'hidden',
          }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary }}>
                Categorías
              </Text>
            </View>
            <CategoryGrid onCategoryPress={handleCategoryPress} />
          </View>
        </View>

        {/* ── Recent Job Requests ── */}
        <View style={{ paddingHorizontal: 16, marginTop: 28, paddingBottom: 32 }}>
          {/* Section header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary }}>
              Mis solicitudes recientes
            </Text>
            <TouchableOpacity onPress={() => router.push('/(client)/requests')}>
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: Colors.primary }}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading && (
            <>
              <SkeletonCard height={96} />
              <SkeletonCard height={96} />
            </>
          )}

          {!isLoading && recentJobs.length === 0 && (
            <EmptyState
              icon="document-text-outline"
              title="Aún no tenés solicitudes"
              subtitle="Publicá tu primer pedido de servicio y recibí ofertas de prestadores verificados"
              action={{
                label: 'Publicar solicitud',
                onPress: () => router.push('/(modals)/new-request'),
              }}
            />
          )}

          {recentJobs.map((job) => (
            <JobRequestCard
              key={job.id}
              job={job}
              onPress={() => router.push(`/(modals)/job/${job.id}`)}
            />
          ))}

          {/* FAB: Nueva solicitud */}
          {recentJobs.length > 0 && (
            <TouchableOpacity
              onPress={() => router.push('/(modals)/new-request')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: Colors.secondary,
                borderRadius: 12,
                paddingVertical: 14,
                marginTop: 4,
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: 'white' }}>
                Nueva solicitud
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
