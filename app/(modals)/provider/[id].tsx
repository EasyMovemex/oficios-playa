import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProviderHeader } from '@/components/provider/ProviderHeader';
import { ServicesList } from '@/components/provider/ServicesList';
import { ReviewsList } from '@/components/provider/ReviewsList';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { SkeletonCard } from '@/components/ui';
import { useProvider, useProviderReviews } from '@/hooks/useProviders';
import { Colors } from '@/constants/Colors';

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: Colors.textPrimary,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 4,
      }}
    >
      {title}
    </Text>
  );
}

export default function ProviderDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: provider, isLoading } = useProvider(id);
  const { data: reviews = [] } = useProviderReviews(provider?.user_id ?? '');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      {/* Close button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: 52,
          left: 16,
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.15)',
          borderRadius: 999,
          padding: 6,
        }}
      >
        <Ionicons name="close" size={20} color="white" />
      </TouchableOpacity>

      {isLoading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 80, gap: 12 }}>
          <SkeletonCard height={200} />
          <SkeletonCard height={120} />
          <SkeletonCard height={160} />
        </View>
      ) : !provider ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.textSecondary }}>
            Prestador no encontrado
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Gradient-like top bar */}
          <View style={{ height: 80, backgroundColor: Colors.primary }} />

          {/* Header card overlapping bar */}
          <View
            style={{
              marginHorizontal: 16,
              marginTop: -40,
              backgroundColor: Colors.surface,
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <ProviderHeader provider={provider} />
          </View>

          {/* WhatsApp button */}
          {provider.profiles.phone && (
            <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
              <WhatsAppButton
                phone={provider.profiles.phone}
                name={provider.profiles.full_name}
              />
            </View>
          )}

          {/* Services */}
          {provider.provider_services.length > 0 && (
            <>
              <SectionHeader title="Servicios" />
              <View
                style={{
                  marginHorizontal: 16,
                  backgroundColor: Colors.surface,
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <ServicesList services={provider.provider_services} />
              </View>
            </>
          )}

          {/* Portfolio */}
          {(provider.portfolio_urls ?? []).length > 0 && (
            <>
              <SectionHeader title="Portfolio" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
              >
                {(provider.portfolio_urls ?? []).map((url, i) => (
                  <Image
                    key={i}
                    source={{ uri: url }}
                    style={{ width: 140, height: 140, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* Reviews */}
          <SectionHeader title={`Reseñas (${reviews.length})`} />
          <View
            style={{
              marginHorizontal: 16,
              marginBottom: 32,
              backgroundColor: Colors.surface,
              borderRadius: 16,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <ReviewsList reviews={reviews} />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
