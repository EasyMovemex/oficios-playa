import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge, SkeletonCard, EmptyState } from '@/components/ui';
import { useMyClientBookings } from '@/hooks/useBookings';
import { Colors } from '@/constants/Colors';
import type { BookingWithDetails } from '@/hooks/useBookings';

const STATUS_CONFIG: Record<string, { label: string; variant: 'primary' | 'warning' | 'accent' | 'danger' | 'neutral' }> = {
  confirmed:   { label: 'Confirmada',  variant: 'primary'  },
  in_progress: { label: 'En progreso', variant: 'warning'  },
  completed:   { label: 'Completada',  variant: 'accent'   },
  disputed:    { label: 'En disputa',  variant: 'danger'   },
  cancelled:   { label: 'Cancelada',   variant: 'neutral'  },
};

function BookingRow({ booking, onPress }: { booking: BookingWithDetails; onPress: () => void }) {
  const config = STATUS_CONFIG[booking.status] ?? { label: booking.status, variant: 'neutral' as const };
  const job = booking.job_requests;
  const provider = booking.provider_profiles.profiles;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <Badge variant={config.variant} size="sm">{config.label}</Badge>
        {job.service_categories && (
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
            {job.service_categories.icon} {job.service_categories.name}
          </Text>
        )}
      </View>

      <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary, marginBottom: 6 }} numberOfLines={2}>
        {job.title}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name="person-outline" size={13} color={Colors.textSecondary} />
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
          {provider.full_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ClientBookings() {
  const router = useRouter();
  const { data: bookings, isLoading, refetch, isRefetching } = useMyClientBookings();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <View style={{
        paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
        flexDirection: 'row', alignItems: 'center', gap: 12,
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.textPrimary }}>
          Mis reservas
        </Text>
      </View>

      {isLoading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
          <SkeletonCard height={96} />
          <SkeletonCard height={96} />
        </View>
      ) : (
        <FlatList
          data={bookings ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="Sin reservas"
              subtitle="Cuando aceptes una oferta, la reserva aparecerá aquí"
            />
          }
          renderItem={({ item }) => (
            <BookingRow booking={item} onPress={() => router.push(`/(modals)/booking/${item.id}`)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
