import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Rating, Badge } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import type { ProviderWithDetails } from '@/hooks/useProviders';

type ProviderCardProps = {
  provider: ProviderWithDetails;
  onPress: () => void;
};

export function ProviderCard({ provider, onPress }: ProviderCardProps) {
  const profile = provider.profiles;
  const allCategories = provider.provider_services.slice(0, 2);
  const priceFrom = provider.provider_services
    .map((s) => s.price_from)
    .filter((p): p is number => p !== null)
    .sort((a, b) => a - b)[0];

  // "Perfil completo" when they have: photo + bio + at least 1 service
  const isComplete =
    !!(provider.logo_url ?? profile.avatar_url) &&
    !!provider.bio &&
    provider.provider_services.length > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <Avatar
        uri={provider.logo_url ?? profile.avatar_url}
        name={provider.business_name ?? profile.full_name}
        size={56}
        verified={provider.verified}
      />

      <View style={{ flex: 1 }}>
        {/* Name + rating row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary }}
              numberOfLines={1}
            >
              {provider.business_name ?? profile.full_name}
            </Text>
            {provider.business_name && (
              <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }} numberOfLines={1}>
                {profile.full_name}
              </Text>
            )}
            {isComplete && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.accent} />
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 11, color: Colors.accent }}>
                  Perfil completo
                </Text>
              </View>
            )}
          </View>
          {provider.total_reviews > 0 && (
            <Rating value={provider.rating_avg} count={provider.total_reviews} />
          )}
        </View>

        {/* Category badges */}
        {allCategories.length > 0 && (
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {allCategories.map((s) => (
              <Badge key={s.id} variant="primary" size="sm">
                {s.service_categories.icon} {s.service_categories.name}
              </Badge>
            ))}
          </View>
        )}

        {/* Coverage + price */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
            📍 {provider.coverage_area}
          </Text>
          {priceFrom !== undefined && (
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: Colors.primary }}>
              Desde ${priceFrom.toLocaleString('es-MX')}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
