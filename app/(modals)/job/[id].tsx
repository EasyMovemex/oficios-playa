import {
  View, Text, ScrollView, TouchableOpacity, Image, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { JobStatusBadge } from '@/components/job/JobStatusBadge';
import { BidCard } from '@/components/job/BidCard';
import { SkeletonCard, EmptyState } from '@/components/ui';
import { useJobRequest } from '@/hooks/useJobRequests';
import { useBids } from '@/hooks/useBids';
import { useMyProviderProfile } from '@/hooks/useProviderProfile';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatBudget(min?: number | null, max?: number | null): string | null {
  if (!min && !max) return null;
  if (min && max) return `$${min.toLocaleString('es-MX')} – $${max.toLocaleString('es-MX')}`;
  if (min) return `Desde $${min.toLocaleString('es-MX')}`;
  return `Hasta $${max!.toLocaleString('es-MX')}`;
}

export default function JobDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useAuthStore();

  const { data: job, isLoading: jobLoading, refetch, isRefetching } = useJobRequest(id);
  const { data: bids = [], isLoading: bidsLoading, refetch: refetchBids } = useBids(id);
  const { data: myProviderProfile } = useMyProviderProfile();

  const isMyJob = job?.client_id === profile?.id;
  const myBid = bids.find((b) => b.provider_id === myProviderProfile?.id);
  const budget = formatBudget(job?.budget_min, job?.budget_max);
  const photos = job?.photos ?? [];

  // Realtime: subscribe to new bids on this job
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`job-bids-${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_bids', filter: `job_request_id=eq.${id}` },
        () => { refetchBids(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const handleAccept = async (bidId: string) => {
    Alert.alert(
      'Aceptar oferta',
      '¿Confirmás que querés aceptar esta oferta? Se creará una reserva con el prestador.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            const { error } = await supabase.functions.invoke('accept-bid', {
              body: { bid_id: bidId },
            });
            if (error) {
              Alert.alert('Error', 'No se pudo aceptar la oferta. Intentá de nuevo.');
            } else {
              refetch();
              refetchBids();
              Alert.alert('¡Oferta aceptada!', 'Se creó la reserva. Podés verla en Reservas.');
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => { refetch(); refetchBids(); };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', gap: 12,
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 17, color: Colors.textPrimary, flex: 1 }} numberOfLines={1}>
          Detalle de solicitud
        </Text>
      </View>

      {jobLoading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
          <SkeletonCard height={140} />
          <SkeletonCard height={200} />
        </View>
      ) : !job ? (
        <EmptyState icon="document-text-outline" title="Solicitud no encontrada" subtitle="" />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor={Colors.primary} />}
        >
          {/* Job card */}
          <View style={{
            margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 18,
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <JobStatusBadge status={job.status} />
              {job.service_categories && (
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
                  {job.service_categories.icon} {job.service_categories.name}
                </Text>
              )}
            </View>

            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.textPrimary, marginBottom: 10 }}>
              {job.title}
            </Text>
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 14 }}>
              {job.description}
            </Text>

            <View style={{ gap: 6 }}>
              {[
                { icon: 'location-outline' as const, text: job.location },
                { icon: 'calendar-outline' as const, text: formatDate(job.created_at) },
                ...(budget ? [{ icon: 'cash-outline' as const, text: budget }] : []),
              ].map(({ icon, text }) => (
                <View key={icon} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name={icon} size={14} color={Colors.textSecondary} />
                  <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary }}>{text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Photos */}
          {photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 10, marginBottom: 16 }}>
              {photos.map((url, i) => (
                <Image key={i} source={{ uri: url }} style={{ width: 140, height: 140, borderRadius: 12 }} resizeMode="cover" />
              ))}
            </ScrollView>
          )}

          {/* ── Provider view: offer button ── */}
          {!isMyJob && job.status === 'open' && (
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              {myBid ? (
                <View style={{
                  backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
                  borderWidth: 1.5, borderColor: Colors.primary, alignItems: 'center',
                }}>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.primary }}>
                    Tu oferta: ${myBid.price.toLocaleString('es-MX')}
                  </Text>
                  <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>
                    Estado: {myBid.status === 'pending' ? 'Pendiente de respuesta' : myBid.status === 'accepted' ? '✓ Aceptada' : 'Rechazada'}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => router.push(`/(modals)/new-bid?jobId=${id}&jobTitle=${encodeURIComponent(job.title)}`)}
                  style={{
                    backgroundColor: Colors.secondary, borderRadius: 12,
                    paddingVertical: 16, alignItems: 'center',
                    flexDirection: 'row', justifyContent: 'center', gap: 8,
                  }}
                >
                  <Ionicons name="send-outline" size={18} color="white" />
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: 'white' }}>
                    Enviar oferta
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ── Client view: bids list ── */}
          {isMyJob && (
            <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary, marginBottom: 12 }}>
                Ofertas recibidas ({bids.length})
              </Text>
              {bidsLoading ? (
                <SkeletonCard height={100} />
              ) : bids.length === 0 ? (
                <EmptyState
                  icon="chatbubble-outline"
                  title="Sin ofertas aún"
                  subtitle="Los prestadores verán tu solicitud y podrán enviarte una oferta"
                />
              ) : (
                bids.map((bid) => (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    isJobOpen={job.status === 'open'}
                    onAccept={() => handleAccept(bid.id)}
                  />
                ))
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
