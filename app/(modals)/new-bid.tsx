import {
  View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useCreateBid } from '@/hooks/useBids';
import { Colors } from '@/constants/Colors';

const F = {
  regular:  'Poppins_400Regular'  as const,
  medium:   'Poppins_500Medium'   as const,
  semiBold: 'Poppins_600SemiBold' as const,
  bold:     'Poppins_700Bold'     as const,
};

export default function NewBid() {
  const router = useRouter();
  const { jobId, jobTitle } = useLocalSearchParams<{ jobId: string; jobTitle: string }>();
  const createBid = useCreateBid();

  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      Toast.show({ type: 'error', text1: 'Precio requerido', text2: 'Ingresá un precio válido para tu oferta.' });
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await createBid.mutateAsync({
        job_request_id: jobId,
        price: priceNum,
        message: message.trim() || undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('duplicate') || msg.includes('unique')) {
        Toast.show({ type: 'info', text1: 'Ya enviaste una oferta', text2: 'Solo podés enviar una oferta por solicitud.' });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo enviar la oferta. Intentá de nuevo.' });
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        gap: 12,
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: F.bold, fontSize: 17, color: Colors.textPrimary }}>
            Enviar oferta
          </Text>
          {jobTitle && (
            <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary }} numberOfLines={1}>
              {decodeURIComponent(jobTitle)}
            </Text>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
        {/* Price */}
        <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 6 }}>
          Tu precio *
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.surface,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: Colors.primary,
          paddingHorizontal: 16,
          marginBottom: 20,
        }}>
          <Text style={{ fontFamily: F.bold, fontSize: 22, color: Colors.primary, marginRight: 4 }}>$</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="0"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="decimal-pad"
            style={{
              flex: 1,
              fontFamily: F.bold,
              fontSize: 28,
              color: Colors.textPrimary,
              paddingVertical: 16,
            }}
          />
        </View>

        {/* Message */}
        <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 6 }}>
          Mensaje al cliente (opcional)
        </Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Contá por qué sos la mejor opción para este trabajo..."
          placeholderTextColor={Colors.textSecondary}
          multiline
          numberOfLines={5}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            padding: 14,
            fontFamily: F.regular,
            fontSize: 14,
            color: Colors.textPrimary,
            textAlignVertical: 'top',
            minHeight: 110,
            marginBottom: 28,
          }}
        />

        {/* Info note */}
        <View style={{
          backgroundColor: '#EFF6FF',
          borderRadius: 10,
          padding: 12,
          flexDirection: 'row',
          gap: 10,
          alignItems: 'flex-start',
          marginBottom: 24,
        }}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
          <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.primary, flex: 1, lineHeight: 18 }}>
            Solo podés enviar una oferta por solicitud. Si el cliente la acepta, recibirás una notificación.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={createBid.isPending || !price}
          style={{
            backgroundColor: createBid.isPending || !price ? Colors.textSecondary : Colors.secondary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          {createBid.isPending
            ? <ActivityIndicator color="white" />
            : <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: 'white' }}>Enviar oferta</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
