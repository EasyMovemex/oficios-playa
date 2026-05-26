import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Badge, SkeletonCard } from '@/components/ui';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { useBooking, useCreateReview } from '@/hooks/useBookings';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';

const STATUS_CONFIG: Record<string, { label: string; variant: 'primary' | 'warning' | 'accent' | 'danger' | 'neutral' }> = {
  confirmed:   { label: 'Confirmada',  variant: 'primary'  },
  in_progress: { label: 'En progreso', variant: 'warning'  },
  completed:   { label: 'Completada',  variant: 'accent'   },
  disputed:    { label: 'En disputa',  variant: 'danger'   },
  cancelled:   { label: 'Cancelada',   variant: 'neutral'  },
};

function StarRating({ value, onSelect }: { value: number; onSelect: (v: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 12 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onSelect(star)}>
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={36}
            color={Colors.warning}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function BookingDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useAuthStore();

  const { data: booking, isLoading, refetch } = useBooking(id);
  const createReview = useCreateReview();

  const [completing, setCompleting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const isClient = booking?.client_id === profile?.id;
  const canComplete = isClient && booking && ['confirmed', 'in_progress'].includes(booking.status);
  const statusConfig = booking ? (STATUS_CONFIG[booking.status] ?? { label: booking.status, variant: 'neutral' as const }) : null;

  const handleComplete = async () => {
    Alert.alert(
      'Marcar como completado',
      '¿Confirmás que el trabajo fue realizado satisfactoriamente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setCompleting(true);
            const { error } = await supabase.functions.invoke('complete-booking', {
              body: { booking_id: id },
            });
            setCompleting(false);
            if (error) {
              Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo completar la reserva. Intentá de nuevo.' });
            } else {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              refetch();
              setShowReview(true);
            }
          },
        },
      ]
    );
  };

  const handleSubmitReview = async () => {
    if (rating === 0) { Alert.alert('Calificación requerida', 'Seleccioná una puntuación de 1 a 5.'); return; }
    if (!booking) return;

    const revieweeId = isClient
      ? booking.provider_profiles.user_id
      : booking.client_id;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await createReview.mutateAsync({
        booking_id: id,
        reviewee_id: revieweeId,
        rating,
        comment: comment.trim() || undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowReview(false);
      Toast.show({ type: 'success', text1: '¡Gracias!', text2: 'Tu reseña fue enviada exitosamente.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo enviar la reseña. Puede que ya hayas calificado este trabajo.' });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', gap: 12,
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 17, color: Colors.textPrimary, flex: 1 }}>
          Detalle de reserva
        </Text>
      </View>

      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          <SkeletonCard height={140} /><SkeletonCard height={120} />
        </View>
      ) : !booking ? null : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Status + job info */}
          <View style={{
            margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 18,
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              {statusConfig && <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>}
              {booking.job_requests.service_categories && (
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
                  {booking.job_requests.service_categories.icon} {booking.job_requests.service_categories.name}
                </Text>
              )}
            </View>

            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 17, color: Colors.textPrimary, marginBottom: 10 }}>
              {booking.job_requests.title}
            </Text>

            {[
              { icon: 'location-outline' as const, text: booking.job_requests.location },
              { icon: 'calendar-outline' as const, text: new Date(booking.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ...(booking.completed_at ? [{ icon: 'checkmark-circle-outline' as const, text: `Completado: ${new Date(booking.completed_at).toLocaleDateString('es-MX')}` }] : []),
            ].map(({ icon, text }) => (
              <View key={icon} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Ionicons name={icon} size={14} color={Colors.textSecondary} />
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary }}>{text}</Text>
              </View>
            ))}
          </View>

          {/* Contact card */}
          <View style={{
            marginHorizontal: 16, marginBottom: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
          }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: Colors.textPrimary, marginBottom: 12 }}>
              {isClient ? 'Tu prestador' : 'Cliente'}
            </Text>
            {isClient ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <Avatar uri={booking.provider_profiles.profiles.avatar_url} name={booking.provider_profiles.profiles.full_name} size={44} verified={booking.provider_profiles.verified} />
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary }}>
                    {booking.provider_profiles.profiles.full_name}
                  </Text>
                </View>
                {booking.provider_profiles.profiles.phone && (
                  <WhatsAppButton phone={booking.provider_profiles.profiles.phone} name={booking.provider_profiles.profiles.full_name} />
                )}
              </>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar uri={booking.profiles.avatar_url} name={booking.profiles.full_name} size={44} />
                <View>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary }}>
                    {booking.profiles.full_name}
                  </Text>
                  {booking.profiles.phone && (
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary }}>
                      {booking.profiles.phone}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Complete button */}
          {canComplete && (
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={handleComplete}
                disabled={completing}
                style={{
                  backgroundColor: Colors.accent, borderRadius: 12,
                  paddingVertical: 15, alignItems: 'center',
                  flexDirection: 'row', justifyContent: 'center', gap: 8,
                }}
              >
                {completing ? <ActivityIndicator color="white" /> : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: 'white' }}>
                      Marcar como completado
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Review form */}
          {showReview && (
            <View style={{
              marginHorizontal: 16, marginBottom: 32, backgroundColor: Colors.surface,
              borderRadius: 16, padding: 20, borderWidth: 1.5, borderColor: Colors.accent,
            }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: Colors.textPrimary, textAlign: 'center' }}>
                ¿Cómo fue el servicio?
              </Text>
              <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginTop: 4 }}>
                Tu opinión ayuda a otros usuarios
              </Text>

              <StarRating value={rating} onSelect={setRating} />

              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Dejá un comentario (opcional)..."
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: Colors.background, borderRadius: 10, borderWidth: 1,
                  borderColor: '#E2E8F0', padding: 12, fontFamily: 'Poppins_400Regular',
                  fontSize: 14, color: Colors.textPrimary, textAlignVertical: 'top', minHeight: 80, marginBottom: 14,
                }}
              />

              <TouchableOpacity
                onPress={handleSubmitReview}
                disabled={createReview.isPending || rating === 0}
                style={{
                  backgroundColor: rating === 0 ? Colors.textSecondary : Colors.primary,
                  borderRadius: 10, paddingVertical: 13, alignItems: 'center',
                }}
              >
                {createReview.isPending
                  ? <ActivityIndicator color="white" />
                  : <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: 'white' }}>Enviar reseña</Text>
                }
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
